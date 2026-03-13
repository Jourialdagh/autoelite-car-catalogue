# AutoElite — Premium Car Catalogue

A fully responsive car catalogue website built as a frontend web development project. Browse 20+ premium vehicles, get instant price quotes, compare cars side-by-side, and find dealership locations on an interactive map.

**Live Demo:** [View on GitHub Pages](https://Jourialdagh.github.io/autoelite-car-catalogue/)

---

## Preview

| Homepage | Catalogue | Quote Calculator |
|----------|-----------|-----------------|
| Featured vehicles, weather widget, stats bar | Filter by brand, type & price range | Live price breakdown with financing |

---

## Features

-  **20+ Vehicle Listings** — Sedans, SUVs, EVs, sports cars, trucks, and more
-  **3 Switchable Themes** — Gold (default), Green, and Red — persisted via localStorage
-  **Quote Calculator** — Configure engine, color, warranty, trade-in, and financing to get a live price breakdown
-  **Vehicle Comparison** — Compare up to 3 cars side-by-side on specs, price, and options
-  **Interactive Map** — 5 dealership locations rendered with Leaflet + OpenStreetMap
-  **Weather Widget** — Real-time weather via OpenWeatherMap API for test drive planning
-  **Countries API** — International inquiry form powered by REST Countries API
-  **Fully Responsive** — Mobile-friendly with hamburger navigation
-  **Help Wiki** — 5-page help centre explaining every feature
-  **JSON-Driven Data** — All vehicle data in `cars.json`, easy to update without touching HTML

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (44 pages) |
| Styling | CSS3 with CSS custom properties (variables) |
| Themes | 3 separate theme files (`theme1/2/3.css`) |
| Logic | Vanilla JavaScript (ES6+) |
| Data | JSON (`cars.json`) |
| Maps | [Leaflet.js](https://leafletjs.com/) + OpenStreetMap |
| Weather | [OpenWeatherMap API](https://openweathermap.org/api) |
| Countries | [REST Countries API](https://restcountries.com/) |
| Fonts | Google Fonts — Playfair Display + Raleway |

---

##  Project Structure

```
car-catalogue/
├── index.html              # Homepage
├── catalogue.html          # Full vehicle listing with filters
├── quote.html              # Quote calculator (Form #1)
├── contact.html            # Contact form (Form #2)
├── compare.html            # Side-by-side vehicle comparison
├── dealerships.html        # Interactive map + country selector
├── about.html              # About page / business description
├── media.html              # Videos and audio content
├── financing.html          # Financing options & loan calculator
├── wishlist.html           # Saved vehicles
├── electric.html           # Electric vehicles category
├── luxury.html             # Luxury cars category
├── sports.html             # Sports cars category
├── trucks.html             # Trucks category
├── new-arrivals.html       # New arrivals
├── product-car-001.html    # Individual product pages (×20)
│   └── ...
├── wiki/
│   ├── index.html          # Help Wiki home
│   ├── browsing.html       # How to browse & filter
│   ├── quote.html          # Quote calculator guide
│   ├── compare.html        # Comparison guide
│   └── updating.html       # How to update content
├── css/
│   ├── styles.css          # All layout & component styles
│   ├── theme1.css          # Gold theme variables
│   ├── theme2.css          # Green theme variables
│   └── theme3.css          # Red theme variables
├── js/
│   └── main.js             # All JavaScript functionality
├── json/
│   └── cars.json           # All 20 vehicle listings
├── images/
│   ├── car-001.svg         # Vehicle artwork (×20)
│   ├── banner.svg
│   └── logo.svg
└── video/
    ├── autoelite-intro.html
    ├── ev-showcase.html
    └── test-drive-guide.html
```

---

## Getting Started

### Option 1 — Open directly in browser
Just unzip and open `index.html` in any modern browser. No server or build step needed.

### Option 2 — Run a local dev server
```bash
# Using Python (built-in)
cd car-catalogue
python3 -m http.server 3000

# Using Node.js
npx serve .
```
Then open `http://localhost:3000`

### Option 3 — Deploy to GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your site will be live at `https://your-username.github.io/autoelite-car-catalogue/`

---

## API Setup

### Weather Widget
The weather widget on the homepage uses OpenWeatherMap. To enable live data:

1. Get a free API key at [openweathermap.org](https://openweathermap.org/api)
2. Open `js/main.js`
3. Find this line and replace with your key:
```js
const API_KEY = 'demo_key_replace_with_real';
```

Without a key, the widget displays demo data automatically.

---

## How to Update Vehicle Data

All 20 vehicles live in `json/cars.json`. To add a new car, copy an existing entry and update the fields:

```json
{
  "id": "car-021",
  "brand": "Ferrari",
  "model": "Roma",
  "year": 2024,
  "type": "Sports",
  "basePrice": 230000,
  "emoji": "🏎️",
  "description": "...",
  "options": {
    "engine": ["3.9L V8 Twin-Turbo"],
    "color": ["Rosso Corsa", "Nero Daytona", "Bianco Avus"],
    "trim": ["Standard", "Spider"]
  },
  "specs": { "horsepower": "620 hp", "acceleration": "3.4s 0–100" },
  "features": ["F1-Trac", "E-Diff3", "Side Slip Control"],
  "tags": ["Supercar", "Italian", "V8"],
  "isNew": true,
  "isSale": false
}
```

Then create a corresponding `product-car-021.html` (copy any existing product page as a template).

---

## Assignment Rubric Coverage

| Requirement | Implementation | Points |
|-------------|----------------|--------|
| Business case description | `about.html` — full paragraph | 1 pt |
| 20 products with 2+ options | `cars.json` — 20 cars, 4–6 option types each | 4 pts |
| 3 CSS themes (switchable) | `theme1/2/3.css` + switcher in every header | 3+2 pts |
| HTML Forms on 2+ pages | `quote.html` + `contact.html` | 4 pts |
| JSON data files | `json/cars.json` powers all listings | 2 pts |
| 2 API integrations | OpenWeatherMap + REST Countries + Leaflet map | 4 pts |
| Commented code | All HTML, CSS, JS fully commented | 5 pts |
| 5 Help Wiki pages | `wiki/index/browsing/quote/compare/updating.html` | 5 pts |
| Responsive menu | Hamburger nav + theme switcher on all pages | 4 pts |
| 20+ HTML, 1 CSS, 1 JS, 20+ images, 3 video/audio | 44 HTML, 1 JS, 22 SVG images, 3 video files | 10 pts |
| Live URL | Deploy via GitHub Pages | 1 pt |
| CSS complexity (fonts, transitions, etc.) | Google Fonts, hover animations, gradients, CSS vars | 2 pts |
| SEO meta tags | `description`, `keywords`, `og:title`, favicon on every page | 4 pts |
| **Total** | | **~50 pts** |

---

## License

This project was built as an academic web development assignment. Feel free to use it as a learning reference.

---

*Built with ❤️ using HTML, CSS, and vanilla JavaScript — no frameworks required.*
