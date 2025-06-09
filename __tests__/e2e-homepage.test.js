import {test, expect} from '@playwright/test'

//all tests for the homepage

test.describe('Recipe Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://127.0.0.1:5504/source/HomePage/home.html');

        await page.evaluate(() => {
            const today = new Date().toLocaleDateString("en-CA");
            localStorage.setItem(`${today} 08:30`, JSON.stringify([{ name: "Eggs", author: "Teddy" }]));
            localStorage.setItem(`${today} 13:00`, JSON.stringify([{ name: "Sandwich", author: "Bob" }]));
            localStorage.setItem(`${today} 18:45`, JSON.stringify([{ name: "Pasta", author: "Carol" }]));

            // Simulate the cart (filled with Milk and Bread items)
            localStorage.setItem("recipeCart", JSON.stringify([{ name: "Milk" }, { name: "Bread" }]));

            // Simulate favorite recipes
            localStorage.setItem("recipes", JSON.stringify([
            { name: "Eggs", author: "Teddy", favorite: true },
            { name: "Pizza", author: "Dan", favorite: false }
            ]));

        });

        await page.reload();
    });

    test('Loads and displays breakfast, lunch, and dinner meals', async ({ page }) => {

        //Check that the homepage contains all relevant breakfast meal information
        await expect(page.locator('#breakfast')).toContainText('Eggs');
        await expect(page.locator('#breakfast')).toContainText('Teddy');
        await expect(page.locator('#breakfast')).toContainText('08:30');
        await expect(page.locator('#breakfast')).toContainText('AM');

        //Check that the homepage contains all relevant lunch meal information
        await expect(page.locator('#lunch')).toContainText('Sandwich');
        await expect(page.locator('#lunch')).toContainText('Bob');
        await expect(page.locator('#lunch')).toContainText('13:00');
        await expect(page.locator('#lunch')).toContainText('PM');

        //Check that the homepage contains all relevant dinner meal information
        await expect(page.locator('#dinner')).toContainText('Pasta');
        await expect(page.locator('#dinner')).toContainText('Carol');
        await expect(page.locator('#dinner')).toContainText('18:45');
        await expect(page.locator('#dinner')).toContainText('PM');
    });

});