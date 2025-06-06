---
# These are optional metadata elements. Feel free to remove any of them.
status: accepted
date: 2025-06-04
decision-makers: Rain, Felicia
---

# Use Playwright for E2E testing 

## Context and Problem Statement

How do we effectively test user interactions given our project scope?

## Considered Frameworks Options

* Playwright
* Cypress
* Selenium

## Decision Outcome

Chosen framework: Playwright was selected because it best aligns with our project contraints. It contains very straightforward setup with fast execution and cross-browser support. All of these features make this framework very ideal for swiftly building and maintaining E2E tests given our project timeline and constraints

<!-- This is an optional element. Feel free to remove. -->
### Consequences

* Learning curve - unfamiliarity with Playwright might cause for team members to spend more time learning about the API 
* Risk of automated tests with inconsistent results - poor selector usage / async timing could lead to flaky testing results (this is a problem with any sort of E2E testing though)
  
### Setup
- Please use your terminal to type the following two commands in order to install the following dependencies/packages required for playwright testing

```bash
npm install -D @playwright/test
npx playwright install
```
- To run specific E2E tests please run 
```bash 
npx playwright test __tests__/<your test file name.test.js>

npx playwright tests # run all tests

#to view test reports 
npx playwright show-report
```
## Common Testing patterns/commands 

References: 
- [interacting with pages](https://playwright.dev/docs/api/class-page)
- [locating specific elements on your page](https://playwright.dev/docs/api/class-locator)
- [test assertions](https://playwright.dev/docs/test-assertions)

### Visibility checking:
```javascript
//check if an element is visible on your page 
await expect(page.locator('#insert-element-id')).toBeVisible();

//by role + name 
await expect(page.getByRole('button', {name: 'Save'})).toBeVisible();

```

### Button clicking:
```javascript
//click button with specific id
await page.click('#save-btn');
```

### Example of test code 
```javascript 
import { test, expect } from '@playwright/test';

test.describe('Recipe Card Component', () => {

/**
 * test component rendering on a live web page
 */
  test('card renders', async ({page}) => {
    //imitate navigating to the recipes page
    await page.goto('/');
    
    //check if card renders on the screen by selecting DOM element
    const recipeCard = await page.locator('recipe-card');
    const shadowRoot = recipeCard.locator('shadow-root');
    // await expect(shadowRoot.locator('img')).toBeVisible();
    // await expect(shadowRoot.locator('button.delete-btn')).toBeVisible();
  });

});
```