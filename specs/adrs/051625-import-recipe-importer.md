---
status: proposed
date: 2025-05-16
decision-maker: [Mehdi Aziz]
---

# ADR: Recipe Import with Spoonacular API

## Context and Problem Statement
Typing in recipes takes too long. Most users already have a link to a recipe online. We want to let them paste that link and have the app fill in the card for them automatically.

## Decision Drivers
* Make the user experience smooth and fast
* Keep development simple (no back-end work in MVP)
* Follow copyright rules (only use public data)
* Stay within free or low-cost tools

## Considered Options
1. **Use Spoonacular API** — lets us pull recipe info from a link using a single request.

## Decision Outcome
Chosen option: **Use Spoonacular API**, because it meets all of our goals with minimal work.

## Implementation Plan
1. Get a Spoonacular API key  
2. Write `importRecipe(url)` function to fetch and format the response  
3. Add a URL text box and "Import" button in the UI  
4. Write tests that cover success and failure cases  
5. Add "Powered by Spoonacular" in the app as required
