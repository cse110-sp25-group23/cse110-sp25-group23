import { test, expect } from '@playwright/test';

/* 

npx playwright test __tests__/calendar/calendar.e2e.test.js

*/

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
    
    test('prev/next buttons update calendar header', async ({ page }) => {
        const label = page.locator('#month-year');
        const currentMonth = await label.textContent();

        await page.click('#next-month');
        const nextMonth = await label.textContent();
        expect(nextMonth).not.toBe(currentMonth);

        await page.click('#prev-month');
        const backToCurrent = await label.textContent();
        expect(backToCurrent).toBe(currentMonth);
    });

  test('schedules multiple recipes at same time and persists after reload', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('recipes', JSON.stringify([
        { name: 'Pasta', author: 'Alice' },
        { name: 'Salad', author: 'Bob' }
      ]));
    });

    await page.reload();

    await page.selectOption('#recipe-select', { value: 'Pasta' });
    await page.fill('#recipe-date', '2025-06-12');
    await page.fill('#recipe-time', '12:00');
    await page.click('#assign-form button[type="submit"]');

    await page.selectOption('#recipe-select', { value: 'Salad' });
    await page.fill('#recipe-date', '2025-06-12');
    await page.fill('#recipe-time', '12:00');
    await page.click('#assign-form button[type="submit"]');

    await expect(page.locator('.note-block')).toHaveCount(2);
    
    await page.reload();
    await expect(page.locator('.note-block')).toHaveCount(2);
    const texts = await page.locator('.note-block').allTextContents();
    expect(texts.some(t => t.includes('Pasta'))).toBeTruthy();
    expect(texts.some(t => t.includes('Salad'))).toBeTruthy();
  });


  test('deletes recipe from DOM and localStorage', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('recipes', JSON.stringify([
        { name: 'DeleteMe', author: 'Temp' }
      ]));
      const key = '2025-06-15 13:00';
      localStorage.setItem(key, JSON.stringify([{ name: 'DeleteMe', author: 'Temp' }]));
    });

    await page.reload();

    const recipeBlock = page.locator('.note-block');
    await expect(recipeBlock).toContainText('DeleteMe');

    await recipeBlock.hover();
    await recipeBlock.locator('.delete-recipe').click();

    // Confirm it's removed from DOM
    await expect(recipeBlock).toHaveCount(0);

    // Confirm it's removed from localStorage
    const deleted = await page.evaluate(() => {
      return localStorage.getItem('2025-06-15 13:00');
    });
    expect(deleted).toBeNull();
  });

  

});
