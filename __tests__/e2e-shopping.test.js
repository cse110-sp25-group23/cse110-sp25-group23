import { test, expect } from '@playwright/test';

test.describe('Shopping page E2E', () => {
  const seedCart = [
    { name: 'Eggs', qty: 2, unit: '' },
    { name: 'Milk', qty: 1, unit: 'L' }
  ];

  test.beforeEach(async ({ page }) => {
    // 1) Set localStorage before navigating
    await page.addInitScript(cart => {
      localStorage.setItem('recipeCart', JSON.stringify(cart));
    }, seedCart);

    await page.goto('/source/ShoppingCart/shopping.html');
  });

  test('renders exactly two items from seeded localStorage', async ({ page }) => {
    const items = page.locator('#cart li');
    await expect(items).toHaveCount(2);
    await expect(items.first()).toContainText('2  Eggs');
  });

  test('removes a single item when you click Remove', async ({ page }) => {
    const removeButton = page.locator('#cart li .remove').first();
    await removeButton.click();
    await expect(page.locator('#cart li')).toHaveCount(1);
  });

  test('clears the entire cart when you click Clear cart', async ({ page }) => {
    await page.click('#clear');
    await expect(page.locator('#cart li')).toHaveCount(0);
  });

  test('navigates to Instacart when you click Buy now', async ({ page, context }) => {
    // Listen for new page/tab (external navigation)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('#cart li .buy-item').first().click()
    ]);

    await newPage.waitForLoadState();
    await expect(newPage).toHaveURL(/https:\/\/www\.instacart\.com\/store\/s\?k=Eggs/);
  });
});
