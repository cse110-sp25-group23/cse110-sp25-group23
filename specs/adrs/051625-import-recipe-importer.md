# ADR: Importing External Recipes into Recipe Card App

**Status:** Accepted  
**Date:** 2025-05-16  
**Decision-Maker:** Mehdi Aziz

## Context

Users find it tedious to recreate recipes by hand. Many already have a URL to a recipe hosted on a blog or cooking site. We need an MVP solution that:

- Lets users paste a recipe URL and auto-populate a recipe card in-browser  
- Stays entirely client-side (no new backend)  
- Uses only publicly exposed data (legal/ethical)  
- Minimizes cost and maintenance overhead  

## Options Considered

| Option                             | Description                                                                                         | Pros                                                                                     | Cons                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| **A: Direct In-Browser Scraping**  | Fetch the URL in the browser, parse HTML for `<script type="application/ld+json">` or selectors.   | – Zero third-party cost<br>– Full control over parsing logic                             | – Fragile (site markup varies/breaks)<br>– Heavy client-side JS logic<br>– Legal risk       |
| **B: Schema.org JSON-LD Parsing**  | Fetch page HTML, extract and parse embedded JSON-LD Recipe data.                                    | – Standardized data format when present<br>– No external API fees                        | – Not all sites include JSON-LD<br>– Raw HTML fetch & parsing<br>– CORS restrictions       |
| **C: Spoonacular API Integration** | <mark>Send URL to Spoonacular’s extract endpoint; receive structured recipe JSON.</mark> | <mark>– Works across thousands of sites<br>– Simple client-side fetch<br>– Minimal parsing code</mark> | <mark>– Free tier limited to 150 requests/day<br>– Requires API key and attribution</mark> |
| **D: Self-Hosted Scraper**         | Deploy our own server that scrapes and normalizes recipe pages.                                     | – Full control, no external dependency<br>– Unlimited usage                              | – Requires backend infra and maintenance<br>– Higher dev and ops cost                      |

## Decision

We will integrate the **Spoonacular Extract Recipe API** (Option C).

**Rationale:**

- **Reliability:** Covers a wide range of sites without brittle in-browser parsing.  
- **Speed to MVP:** Only a single client-side fetch and JSON map—no heavy parsing code or server build-out.  
- **Legal/Ethical:** API is designed for this use and comes with clear TOS and attribution requirements.  
- **Cost:** Free tier (150 requests/day) suffices for initial testing/users; we can revisit if usage grows.  

## Implementation Plan

1. Obtain Spoonacular API key  
2. Implement `importRecipe(url)` in JavaScript:

   ```js
   async function importRecipe(url) {
     const res = await fetch(
       `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url)}&apiKey=${API_KEY}`
     );
     return res.json(); // map fields into our RecipeCard model
   }

## Implementation Plan

- Add URL input + “Import” button in the “Add Recipe” modal  
- Display “Powered by Spoonacular” attribution per TOS  
- Write Jest tests for:  
  - Valid URL parsing  
  - Error and invalid-URL handling  
  - Saving to localStorage  
  - Duplicate detection

## Trade-Offs & Future Considerations

- **Request Limits:** If users outgrow 150 requests/day, evaluate a paid plan or fallback scraping (Option B) for overflow.  
- **Backend Scraper:** In the future, migrate to a server-side scraper for unlimited capacity (Option D), at the cost of additional ops overhead.  

