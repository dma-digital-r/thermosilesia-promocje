#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_products.py
==================
Przetwarza feed produktowy B2B Thermosilesia (XML) na lekki plik JSON
(js/products.json) uzywany przez wyszukiwarke "Parametry produktowe" w
panelu promocji.

Uzycie:
    python tools/build_products.py <zrodlo> [plik_wyjsciowy]

<zrodlo> moze byc:
    - lokalna sciezka do pliku XML (np. pobranego feeda), albo
    - adres URL feeda (np. https://xml.thermosilesia.pl/b2b/products/thermosilesia-b2b.xml)
      -- w tym przypadku sprobuje pobrac plik (patrz sekcja AUTH ponizej).

Jesli nie podasz <plik_wyjsciowy>, wynik trafi do js/products.json
(wzgledem katalogu tego skryptu / ../js/products.json).

AUTORYZACJA FEEDA (gdy zrodlo to URL):
    Feed b2b wymaga zalogowania danymi konta B2B (thermosilesia.pl). Ustaw
    zmienne srodowiskowe przed uruchomieniem (PowerShell):
        $env:THERMO_FEED_USER = "twoj@email.pl"
        $env:THERMO_FEED_PASS = "..."
    Skrypt wysyla je jako POST (pola username/password) bezposrednio na
    adres feeda i w odpowiedzi na to samo zadanie dostaje juz gotowy plik
    XML (parametr ?check_auth=1 z instrukcji IT sluzy tylko do sprawdzenia
    poprawnosci danych logowania bez pobierania calego feeda, wiec nie jest
    tu potrzebny).

Co trafia do products.json (tylko potrzebne pola, nie caly feed):
    id, name, symbol, producer, category, price, netPrice, currency,
    stock, image (pierwsze zdjecie z galerii), gallery (do 4 zdjec),
    url (link do karty produktu na thermosilesia.pl), datasheet (link do
    PDF "karta katalogowa"/"product data sheet", jesli jest), specs
    (lista parametrow technicznych pogrupowana wg hierarchii w nazwie
    atrybutu, np. "Grzanie (A7/W35) \\ COP" -> group="Grzanie (A7/W35)",
    name="COP"), description (oczyszczony z HTML opis produktu -- niektore
    akcesoria maja parametry wpisane tylko tutaj, a nie w <attributes>).
"""

import sys
import os
import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from html.parser import HTMLParser


def text_of(el, default=""):
    if el is None:
        return default
    return (el.text or "").strip()


class _DescriptionTextExtractor(HTMLParser):
    """Zamienia HTML opisu produktu na czysty tekst, wstawiajac nowa linie
    przy elementach blokowych (akapity, wiersze tabel, listy itd.)."""

    BLOCK_TAGS = {"p", "br", "div", "li", "tr", "h1", "h2", "h3", "h4", "h5", "h6", "table", "ul", "ol"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        self.parts.append(data)


def html_to_text(raw_html):
    if not raw_html or not raw_html.strip():
        return ""
    parser = _DescriptionTextExtractor()
    try:
        parser.feed(raw_html)
    except Exception:
        return raw_html.strip()
    lines = [ln.strip() for ln in "".join(parser.parts).splitlines()]
    lines = [ln for ln in lines if ln]
    return "\n".join(lines).strip()


def parse_spec_name(raw_name):
    """Rozbija nazwe atrybutu na (group, name) na podstawie separatora ' \\ '.
    Przy 3+ poziomach laczy posrednie poziomy w jedna etykiete grupy."""
    parts = [p.strip() for p in raw_name.split("\\") if p.strip() != ""]
    if len(parts) <= 1:
        return None, raw_name.strip()
    group = " › ".join(parts[:-1])
    name = parts[-1]
    return group, name


def fetch_remote_xml(source):
    """Pobiera feed b2b, wysylajac dane logowania (username/password) jako
    POST bezposrednio na adres feeda -- odpowiedzia jest juz gotowy XML."""
    user = os.environ.get("THERMO_FEED_USER")
    pwd = os.environ.get("THERMO_FEED_PASS")
    if not user or not pwd:
        raise SystemExit(
            "Brak danych logowania. Ustaw $env:THERMO_FEED_USER i "
            "$env:THERMO_FEED_PASS przed uruchomieniem (patrz naglowek pliku)."
        )

    body = urllib.parse.urlencode({"username": user, "password": pwd}).encode("utf-8")
    req = urllib.request.Request(source, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    print(f"Pobieram feed z {source} ...")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def load_xml(source):
    if re.match(r"^https?://", source, re.IGNORECASE):
        data = fetch_remote_xml(source)
        return ET.fromstring(data)
    else:
        print(f"Wczytuje lokalny plik {source} ...")
        tree = ET.parse(source)
        return tree.getroot()


def build_products(root):
    products = []
    skipped = 0
    for p in root.findall("product"):
        try:
            pid = text_of(p.find("id"))
            name = text_of(p.find("name"))
            symbol = text_of(p.find("symbol"))
            producer = text_of(p.find("producer"))
            category = text_of(p.find("category"))
            price_raw = text_of(p.find("price"), "0")
            net_price_raw = text_of(p.find("net_price"), "0")
            currency = text_of(p.find("currency"), "PLN")
            stock_raw = text_of(p.find("stock"), "0")
            url = text_of(p.find("url"))

            try:
                price = round(float(price_raw), 2) if price_raw else None
            except ValueError:
                price = None
            try:
                net_price = round(float(net_price_raw), 2) if net_price_raw else None
            except ValueError:
                net_price = None
            try:
                stock = float(stock_raw) if stock_raw else 0
            except ValueError:
                stock = 0

            images = []
            gallery_el = p.find("gallery")
            if gallery_el is not None:
                for img in gallery_el.findall("image"):
                    val = text_of(img)
                    if val:
                        images.append(val)
            image = images[0] if images else None
            gallery = images[:4]

            datasheet = None
            attachments_el = p.find("attachments")
            if attachments_el is not None:
                for att in attachments_el.findall("attachment"):
                    desc = text_of(att.find("description")).lower()
                    att_url = text_of(att.find("url"))
                    if not att_url:
                        continue
                    if datasheet is None or "karta katalogowa" in desc or "data sheet" in desc:
                        datasheet = att_url
                        if "karta katalogowa" in desc or "data sheet" in desc:
                            break

            specs = []
            attributes_el = p.find("attributes")
            if attributes_el is not None:
                for group_el in attributes_el.findall("group"):
                    for attr_el in group_el.findall("attribute"):
                        raw_name = text_of(attr_el.find("name"))
                        value = text_of(attr_el.find("value"))
                        if not raw_name or not value:
                            continue
                        group, leaf_name = parse_spec_name(raw_name)
                        specs.append({"group": group, "name": leaf_name, "value": value})

            description = html_to_text(text_of(p.find("description")))

            if not pid or not name:
                skipped += 1
                continue

            products.append({
                "id": pid,
                "name": name,
                "symbol": symbol or None,
                "producer": producer or None,
                "category": category or None,
                "price": price,
                "netPrice": net_price,
                "currency": currency,
                "stock": stock,
                "image": image,
                "gallery": gallery,
                "url": url or None,
                "datasheet": datasheet,
                "specs": specs,
                "description": description or None,
            })
        except Exception as exc:  # nie przerywamy calego importu przez jeden zly rekord
            skipped += 1
            print(f"  ! pominieto produkt (blad: {exc})")

    return products, skipped


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    source = sys.argv[1]
    here = os.path.dirname(os.path.abspath(__file__))
    default_out = os.path.join(here, "..", "js", "products.json")
    out_path = sys.argv[2] if len(sys.argv) > 2 else default_out

    root = load_xml(source)
    products, skipped = build_products(root)

    with_specs = sum(1 for pr in products if pr["specs"])
    with_description = sum(1 for pr in products if pr["description"])

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = os.path.getsize(out_path) / 1024
    print("")
    print(f"Gotowe: {out_path}")
    print(f"  produktow zapisanych: {len(products)}")
    print(f"  produktow z parametrami: {with_specs}")
    print(f"  produktow z opisem: {with_description}")
    print(f"  pominietych (brak id/nazwy lub blad): {skipped}")
    print(f"  rozmiar pliku: {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
