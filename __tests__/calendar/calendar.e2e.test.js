import { test, expect } from '@playwright/test';

test.describe('Calendar App', () => {
  const baseURL = 'http://127.0.0.1:5502/source/calendar/calendar.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test('renders calendar grid and toggle buttons', async ({ page }) => {
    await expect(page.locator('#calendar-grid')).toBeVisible();
    await expect(page.getByRole('button', { name: /month/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /week/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /day/i })).toBeVisible();
  });

  test('toggle buttons switch views correctly', async ({ page }) => {
    await page.getByRole('button', { name: /week/i }).click();
    await expect(page.locator('#calendar-grid.week-view')).toBeVisible();

    await page.getByRole('button', { name: /day/i }).click();
    await expect(page.locator('#calendar-grid.day-view')).toBeVisible();

    await page.getByRole('button', { name: /month/i }).click();
    await expect(page.locator('#calendar-grid.month-view')).toBeVisible();
    });


  test('form adds a recipe to localStorage and DOM', async ({ page }) => {
    // Inject a recipe into localStorage
    await page.evaluate(() => {
      localStorage.setItem('recipes', JSON.stringify([
        { name: 'Test Recipe', author: 'Test Chef', timeEstimate: '1 hr' }
      ]));
    });

    await page.reload(); // Ensure dropdown is refreshed

    await page.selectOption('#recipe-select', { value: 'Test Recipe' });
    await page.fill('#recipe-date', '2025-06-10');
    await page.fill('#recipe-time', '14:00');
    await page.click('#assign-form button[type="submit"]');

    // Check that note is added to DOM
    await expect(page.locator('.note-block')).toContainText('Test Recipe');
  });
});
