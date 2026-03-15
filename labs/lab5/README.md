# Lab 5 — Recipe Recommender App

**Course:** CSCI 3172 — Web-Centric Computing  
**Student:** Stephanie Rowe  
**Netlify URL:** *(add your Netlify URL here after deployment)*

---

## Description

**RecipeFind** is a personalized recipe recommender web application. Users enter
the ingredients they have available, select dietary preferences (e.g. vegetarian,
vegan, gluten-free, ketogenic), and choose any food intolerances. The app then
queries the Spoonacular API through a Node.js serverless function and displays
a grid of matching recipe cards. Clicking a card opens a detail modal showing
the ingredient list, preparation time, servings, and a link to the full recipe.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Custom layout, animations, responsive design |
| Bootstrap 5.3 | Responsive grid, components, utility classes |
| Bootstrap Icons 1.11 | Icon set |
| Google Fonts (Playfair Display, Inter) | Typography |
| JavaScript (ES5/6) | Client-side interactivity and DOM manipulation |
| Node.js 18 | Serverless function runtime (Netlify Functions) |
| Netlify Functions | Serverless back-end proxy — keeps the API key server-side |
| Spoonacular API | Recipe data and dietary-filter support |
| Jest 29 | Unit-testing framework |

---

## APIs Used

### Spoonacular API
- **Endpoint:** `GET https://api.spoonacular.com/recipes/complexSearch`
- **Key parameters used:** `includeIngredients`, `diet`, `intolerances`,
  `number`, `addRecipeInformation`, `fillIngredients`
- **Documentation:** https://spoonacular.com/food-api/docs#Search-Recipes-Complex
- **API key security:** The key is stored as a Netlify environment variable
  (`SPOONACULAR_API_KEY`). It is accessed only inside the serverless function
  (`netlify/functions/recipes.js`) and is never sent to the client.

---

## Project Structure

```
lab5/
├── index.html                   Main application page
├── README.md                    This file
├── netlify.toml                 Netlify build & function configuration
├── package.json                 Node.js dependencies and test scripts
├── css/
│   └── styles.css               Custom CSS (colours, cards, layout)
├── js/
│   ├── utils.js                 Pure utility functions (shared with tests)
│   └── script.js                DOM interactions and fetch calls
├── netlify/
│   └── functions/
│       └── recipes.js           Serverless function — Spoonacular proxy
└── tests/
    ├── utils.test.js            Unit tests for client-side utilities
    └── server.test.js           Unit tests for the serverless function
```

---

## Setup & Running Locally

1. **Clone / download** the repository and navigate to `labs/lab5/`.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Obtain a free Spoonacular API key** at https://spoonacular.com/food-api

4. **Create a `.env` file** in `labs/lab5/` (this file is git-ignored):
   ```
   SPOONACULAR_API_KEY=your_key_here
   ```

5. **Install the Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

6. **Start the local dev server** (serves static files + functions on port 8888):
   ```bash
   netlify dev
   ```

7. Open **http://localhost:8888** in your browser.

---

## Deploying to Netlify

1. Push the repository to your personal GitHub account.
2. Sign in to [Netlify](https://app.netlify.com/) and click **Add new site → Import an existing project**.
3. Connect to GitHub and select the repository.
4. In **Build settings**, set **Base directory** to `labs/lab5` and leave **Publish directory** as `.`.
5. Go to **Site settings → Environment variables** and add:
   - Key: `SPOONACULAR_API_KEY`
   - Value: your Spoonacular API key
6. Click **Deploy site**. Your app will be live at `https://<site-name>.netlify.app`.

---

## Running the Tests

```bash
cd labs/lab5
npm install
npm test
```

Test reports (with coverage) are written to `coverage/` after each run.

---

## Testing Summary

### Client-side utilities (`tests/utils.test.js`)

The `RecipeUtils` object (`js/utils.js`) contains pure functions with no
DOM or network dependencies, so each can be tested in complete isolation.

| Function | What was tested |
|---|---|
| `parseIngredients` | Empty/null input, single ingredient, comma-separated list, whitespace trimming, lowercase conversion, deduplication, empty tokens |
| `buildQueryParams` | Default `number` (8), all parameter combinations, clamping `number` to [1, 100], non-numeric `number` fallback, omission of empty arrays |
| `formatTime` | Zero / null / negative → `"N/A"`, minutes-only, hours-only, hours + minutes |
| `sanitizeText` | Null/empty input, escaping `<`, `>`, `&`, `"`, `'`, XSS payload, safe plain text |
| `isValidImageUrl` | Valid `https`, valid `http`, null, empty string, non-URL string, `javascript:` URL (XSS vector), `data:` URL |
| `capitalize` | Lowercase word, already-capitalized word, null/empty input, single character |

All 37 assertions passed without needing code changes.

### Server-side function (`tests/server.test.js`)

`global.fetch` is replaced with `jest.fn()` before the handler module is
imported, so no real HTTP requests leave the test environment.

| Test group | What was tested |
|---|---|
| API key validation | HTTP 500 returned when `SPOONACULAR_API_KEY` is absent |
| HTTP method restriction | HTTP 405 for POST, DELETE, PUT |
| Successful response | HTTP 200 with forwarded JSON, `Content-Type` header, `X-Content-Type-Options` header |
| Spoonacular error handling | 401 (invalid key), 402 (quota exceeded), 503 (other), network-level `fetch` failure |
| Input sanitization | `number` clamped to 24 max / 1 min / default 8; `<script>` stripped from ingredient input; empty param not forwarded; diet + intolerances forwarded correctly; API key not leaked in response body |

All 20 assertions passed without needing code changes.

---

## Accessibility (WCAG 2.1 AA)

- Semantic HTML5 landmark elements (`<header>`, `<main>`, `<footer>`, `<nav>`,
  `<article>`, `<section>`) are used throughout.
- All form controls have associated `<label>` elements or `aria-label` attributes.
- ARIA live regions (`aria-live="polite"` / `aria-live="assertive"`) ensure
  that dynamic content changes (results, loading state, errors) are announced
  by screen readers.
- Keyboard navigation is fully supported: ingredient tags are removable with
  **Enter**/**Space**; recipe cards open the detail modal with **Enter**.
- The **Skip to main content** link lets keyboard users bypass the navbar.
- Colour contrast ratios satisfy WCAG AA (4.5:1 for normal text).
- All decorative icons carry `aria-hidden="true"`.
- Images have descriptive `alt` text; missing images use a styled placeholder.
- The `prefers-reduced-motion` media query disables all CSS transitions and
  animations for users who have requested reduced motion.
- Focus indicators are clearly visible (orange `outline`) on all interactive
  elements.

---

## Issues & Limitations

- **Free-tier quota:** Spoonacular's free plan allows 150 requests per day.
  When the quota is exceeded the app displays an informative error message.
  Result counts are capped at 24 per search to conserve quota.
- **Ingredient matching:** Spoonacular uses approximate matching; misspelled
  or uncommon ingredients may return zero results. Users are shown an
  empty-state message with a suggestion to broaden their search.
- **Multiple diets:** Spoonacular's `diet` parameter officially supports a
  single value. When multiple diets are selected they are sent as a
  comma-separated string; the API may honour only the first value.
- **Missing images:** Some older recipes have no image. A styled placeholder
  icon is shown in those cases.
- **`:has()` CSS selector:** Used for the "checked" filter-chip highlight.
  Supported in Chrome 105+, Firefox 121+, Safari 15.4+. A graceful visual
  fallback (no highlight, but fully functional) is in place for older browsers.
- **Cross-browser testing:** Tested in Chrome 123, Firefox 124, and Edge 123.
  All core functionality works across these browsers.

---

## Sources & Attribution

- Spoonacular API documentation: https://spoonacular.com/food-api/docs
- Bootstrap 5 documentation: https://getbootstrap.com/docs/5.3/
- Bootstrap Icons: https://icons.getbootstrap.com/
- Google Fonts (Playfair Display, Inter): https://fonts.google.com/
- Jest testing framework: https://jestjs.io/docs/getting-started
- MDN Web Docs (Fetch API, URLSearchParams, ARIA): https://developer.mozilla.org/
- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- Netlify Functions documentation: https://docs.netlify.com/functions/overview/
