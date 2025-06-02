//e2e testing
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