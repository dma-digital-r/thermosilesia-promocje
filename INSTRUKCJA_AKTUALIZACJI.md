# Jak co miesiąc aktualizować promocje

Strona jest w pełni statyczna (HTML/CSS/JS) — nie wymaga żadnej instalacji
ani serwera. Wystarczy otworzyć plik `index.html` w przeglądarce (najlepiej
Chrome/Edge) i ustawić ją w trybie pełnoekranowym / kiosk na ekranie
dotykowym. Ceny, tabele i pozostała treść promocji działają bez internetu.
Internetu potrzebują dwa opcjonalne elementy: prognoza pogody w nagłówku
oraz zdjęcia produktów (jeśli zostaną podpięte — patrz niżej); jeśli
połączenia akurat nie ma, panel i tak działa normalnie — pokaże się tylko
komunikat „Prognoza pogody niedostępna" i/lub placeholderowa ikona zamiast
zdjęcia. Docelowy tablet (patrz niżej) ma stałe łącze, więc w praktyce oba
elementy zawsze się wczytują.

Panel jest dostosowany pod monitor dotykowy iiyama ProLite TW1623AS
(15,6", 1920×1080, Android 13) — jedna, stała rozdzielczość.

## Gdzie jest strona i jak publikować zmiany

Strona jest publikowana przez **GitHub Pages** z repozytorium
**https://github.com/dma-digital-r/thermosilesia-promocje**.
Monitor w CMS iiyamy wskazuje (jako treść typu „Web page") na adres:

**https://dma-digital-r.github.io/thermosilesia-promocje/**

To o tyle wygodne, że **każda zmiana w repozytorium publikuje się sama** —
nie trzeba już wgrywać nic przez FTP. Są dwa sposoby edycji:

1. **Edycja prosto w przeglądarce (najprościej, dla kolegi bez gita):**
   - Wejdź na https://github.com/dma-digital-r/thermosilesia-promocje
   - Otwórz plik do zmiany (np. `js/data.js`), kliknij ikonę ołówka
     (Edit this file) w prawym górnym rogu podglądu pliku.
   - Wprowadź zmiany, zjedź na dół strony i kliknij **Commit changes...**
     → **Commit directly to the main branch** → **Commit changes**.
   - Po ok. 30–60 sekundach zmiana jest widoczna pod adresem Pages
     (i na monitorze przy jego kolejnym odświeżeniu).

2. **Edycja lokalnie na kopii roboczej + wgranie na GitHub** (jeśli masz
   zainstalowanego gita lub GitHub Desktop): edytuj pliki w kopii roboczej
   (`G:\Dyski współdzielone\Marketing - Wymiana\Daniel\Strona promocje`),
   commit i push do repozytorium jak zwykle — Pages opublikuje zmianę
   automatycznie po push.

Stara „żywa" kopia na `https://professional.rotenso.com/promocje/`
(hosting WordPressa, wgrywana wcześniej przez FTP) **nie jest już
używana** — można ją zostawić bez aktualizacji albo usunąć z serwera,
monitor od teraz korzysta z adresu GitHub Pages powyżej.

## Co trzeba zrobić co miesiąc

Cała treść promocji (nazwy, ceny, symbole, warunki) znajduje się w jednym
pliku: **`js/data.js`**. To jedyny plik, który trzeba edytować co miesiąc.

1. Otwórz nową ulotkę PDF od Rotenso/Thermosilesia za dany miesiąc.
2. Otwórz `js/data.js` w dowolnym edytorze tekstu (np. Notatnik, VS Code).
3. Na samej górze pliku zaktualizuj:
   - `MONTH_LABEL` — np. `'Wrzesień 2026'`
   - `LEAFLET_REF` — numer referencyjny ulotki (widoczny na ostatniej stronie PDF)
4. Dla każdej promocji (każdy obiekt w `ROTENSO_CATEGORIES` / `LG_ROWS_RAW`)
   zaktualizuj pola takie jak `priceValue`, wiersze tabel (`rows`), daty
   ważności (`validity`) — zgodnie z nową ulotką. Pole `name` (nazwa
   wyświetlana jako duży tytuł) może być dowolnej długości — bardzo długie
   nazwy same zmniejszą czcionkę tytułu, żeby zawsze zmieściły się w hero.
5. Jeśli w danym miesiącu **pojawia się nowa linia produktowa** (np. nowy
   model klimatyzatora), skopiuj najbardziej podobny istniejący blok
   `{ id: ..., group: ..., ... }` w `ROTENSO_CATEGORIES` i zmień w nim dane.
   Pamiętaj, żeby `id` było unikalne (używane tylko wewnętrznie, np. `'revio'`).
6. Jeśli promocja **znika** w danym miesiącu — po prostu usuń cały jej blok
   (od `{` do odpowiadającego `},`) z tablicy.
7. Zapisz plik i odśwież stronę w przeglądarce (F5) — nie trzeba nic
   przebudowywać ani instalować.

## Zdjęcie produktu zamiast ikony

Domyślnie w dużej ramce obok tekstu (i w odpowiadającej jej miniaturze na
kafelku w karuzeli na dole) wyświetla się rysunkowa ikona produktu jako
placeholder. Żeby pokazać tam prawdziwe zdjęcie zamiast ikony — w obu
miejscach naraz — wystarczy dodać do danej kategorii w `js/data.js` pole
`image` z adresem URL zdjęcia, np.:

```js
{
  id: 'revio',
  ...
  image: 'https://adres-do-zdjecia.pl/rotenso-revio.jpg',
  ...
},
```

Wskazówki dot. samego zdjęcia:

- Zdjęcie musi być dostępne pod publicznym adresem URL (tablet ma stały
  dostęp do internetu, więc wystarczy link — nie trzeba niczego wgrywać na
  dysk).
- Najlepiej sprawdzają się zdjęcia produktowe **na białym tle** (takie jak
  na rotenso.com) — ramka wokół zdjęcia też jest biała, więc tło zlewa się
  bez widocznej krawędzi.
- Zdjęcia mogą mieć **dowolne proporcje** (poziome, pionowe, kwadratowe) —
  ramka sama dopasowuje swój kształt do zdjęcia, nic nie jest kadrowane ani
  rozciągane. Nie trzeba niczego przycinać przed wklejeniem linku.
- Jeśli link będzie błędny albo zdjęcie akurat nie będzie dostępne, panel
  automatycznie wróci do ikony zamiast pokazać pustą ramkę/miniaturę. Jeśli
  pole `image` zostanie usunięte albo zostawione puste — również wraca
  ikona.

## Marki i logotypy

- Główny branding strony to zawsze **Rotenso** (nagłówek, tło startowe).
- Przełącznik marek w prawym górnym rogu (`BRAND_ORDER` w `data.js`)
  pokazuje osobne zakładki dla innych producentów sprzedawanych w danym
  miesiącu (obecnie: Rotenso, LG). Żeby dodać nową markę (np. gdyby
  pojawiła się osobna wyprzedaż innego producenta), trzeba:
  1. Dodać nowy wpis do obiektu `BRANDS` w `data.js` (nazwa, kolor motywu,
     lista kategorii).
  2. Dodać identyfikator marki do tablicy `BRAND_ORDER`.
  3. Jeśli to zupełnie nowa marka, dodać jej logo do rejestru `LOGOS` w
     pliku `js/logos.js` (plik graficzny w `assets/logos/`, najlepiej PNG
     z przezroczystym tłem) oraz skopiować plik graficzny do
     `assets/logos/`.
  4. Opcjonalnie: przełącznik marek w nagłówku pokazuje logo w małej,
     okrągłej plakietce — jeśli pełne logo słabo się tam mieści (jak pełny
     napis „Rotenso”), można dodać do wpisu marki w `BRANDS` pole
     `pillLogo` wskazujące na osobny, uproszczony wpis w `LOGOS` (np. sam
     symbol/monogram marki bez nazwy) — tak jak `pillLogo: 'rotensoR'` dla
     Rotenso.
- Akcesoria/komponenty w **Pakietach Premium** (np. wspornik Ivensis,
  zbiorniki Thermos) automatycznie pokazują logo producenta danego
  elementu — to ustawia się w polu `brand:` przy każdym akcesorium
  (`ivensis`, `thermos`, `tivento`, `cleanairix`, `ferono`, `swedo`, albo
  `null`, jeśli producent nie jest podany na ulotce — wtedy pokazuje się
  neutralna plakietka „HVAC”).

## Prognoza pogody w nagłówku

W górnym pasku wyświetla się 7-dniowa prognoza (dane z darmowego serwisu
Open-Meteo, bez klucza API). Jest to celowo umieszczone obok logo, bo
warunki pogodowe (deszcz, upały) mają realny wpływ na pracę instalatora
klimatyzacji/pomp ciepła.

- Lokalizacja ustawiona jest w `js/data.js` w stałej `WEATHER_LOCATION`
  (domyślnie: Katowice — centralny punkt woj. śląskiego, obszaru działania
  Thermosilesia; w nagłówku widnieje jako etykieta „woj. śląskie”). Przy
  wystawieniu panelu w innym regionie wystarczy podmienić tam `lat`/`lon`
  i `name`.
- Dane odświeżają się automatycznie co godzinę i są buforowane lokalnie
  w przeglądarce, więc chwilowa awaria internetu nie psuje panelu — pokaże
  się wtedy ostatnia znana prognoza albo (jeśli nigdy się nie udało pobrać
  danych) komunikat „Prognoza pogody niedostępna".
- Prognoza i ewentualne zdjęcia produktów (patrz sekcja wyżej) to jedyne
  dwa elementy strony wymagające połączenia z internetem — cała reszta
  (ceny, tabele, karuzela) działa offline.

## Struktura projektu

```
Strona promocje/
├── index.html                 – szkielet strony (nie trzeba ruszać)
├── css/style.css               – wygląd, animacje (zmieniać tylko przy zmianie designu)
├── js/
│   ├── data.js                – TREŚĆ PROMOCJI — TU EDYTUJESZ CO MIESIĄC
│   ├── icons.js                – biblioteka ikon SVG (zmieniać tylko gdy potrzebna nowa ikona)
│   ├── logos.js                – rejestr logotypów marek
│   └── app.js                  – logika strony (karuzela, okno szczegółów, tryb prezentacji)
├── assets/logos/                – pliki graficzne logotypów
└── INSTRUKCJA_AKTUALIZACJI.md   – ten plik
```

## Wyświetlanie na ekranie dotykowym 15,6"

1. Otwórz `index.html` w przeglądarce Chrome lub Edge.
2. Przełącz przeglądarkę w tryb pełnoekranowy / kiosk, np. uruchamiając ją
   z parametrem: `--kiosk "ścieżka\do\index.html"`.
3. Panel sam przechodzi w „tryb prezentacji" (automatyczne przełączanie
   promocji) po ok. 28 sekundach bez dotyku ekranu — wraca do normalnego
   trybu przy pierwszym dotknięciu.

## Konto GitHub i dostęp do repozytorium

Repozytorium jest **publiczne**, więc każdy może je przeglądać, ale do
**edycji** (commit) potrzeba konta GitHub z uprawnieniami współautora do
`dma-digital-r/thermosilesia-promocje`. Jeśli kolega ma edytować
`data.js` co miesiąc, załóż mu konto GitHub (darmowe) i dodaj jako
współpracownika: repo → **Settings** → **Collaborators** → **Add people**.

## Podgląd na innym urządzeniu (do przeglądu/testów, przed opublikowaniem)

Strona i tak leży na hostingu GitHub Pages (patrz wyżej), więc własny
serwer nie jest potrzebny do docelowego działania. Jeśli jednak chcesz
przetestować zmianę **przed** commitem (np. lokalną edycję pliku), można
na chwilę uruchomić lokalny serwer z poziomu kopii roboczej, np. (Python
jest już zainstalowany w systemie):

```
python -m http.server 8000 --bind 0.0.0.0
```

Strona będzie wtedy dostępna pod `http://<adres-IP-tego-komputera>:8000`
dla każdego urządzenia w tej samej sieci Wi-Fi/LAN. Serwer można zatrzymać
w dowolnym momencie (Ctrl+C w terminalu, w którym działa) — nie zostawia
po sobie żadnych zmian w plikach.

## Szybki podgląd konkretnej promocji (opcjonalnie)

Można od razu otworzyć stronę z wybraną marką/kategorią/oknem szczegółów,
dopisując na końcu adresu w pasku przeglądarki np.:

```
index.html#brand=lg&cat=lg-clearance&modal=1
```

Przydatne do szybkiego pokazania konkretnej promocji bez klikania.
