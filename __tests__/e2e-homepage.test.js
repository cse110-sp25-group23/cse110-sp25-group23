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

            // Simulate favorite recipes
            localStorage.setItem("recipes", JSON.stringify([
            { name: "Eggs", author: "Teddy", favorite: true },
            { name: "Pizza", author: "Dan", favorite: false }
            ]));

        });

        await page.reload();
    });

    async function setCartInLocalStorage(page, cartItems) {
        await page.evaluate((items) => {
          localStorage.setItem('recipeCart', JSON.stringify(items));
        }, cartItems);
    }

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

    //All of the tests for the Display of the cart summary
    test('Displays cart summary correctly with 0 items', async ({ page }) => {
        await setCartInLocalStorage(page, []);

        await expect(page.locator('#cart-items')).toContainText('Your cart is empty');
        await expect(page.locator('#cart-total')).toContainText('Total Items: 0');
    });
    
    test('Displays cart summary correctly with between 1 and 10 items', async ({ page }) => {
        const cart = [{ name: "Milk" }, { name: "Bread" }];

        await page.evaluate((items) => {
            localStorage.setItem('recipeCart', JSON.stringify(items));
        }, cart);
        
        await page.reload();

        await expect(page.locator('#cart-items')).toContainText('Milk');
        await expect(page.locator('#cart-items')).toContainText('Bread');
        await expect(page.locator('#cart-total')).toHaveText('Total Saved Items: 2');
    });

    test('Displays cart summary correctly with 10 or more items', async({page}) => {
        
        const cart = [{ name: "Milk" }, { name: "Bread" }, { name: "Cheetos" }, { name: "Octopus" }, { name: "Cheese" }, { name: "KitKat" }, { name: "Icecream" }, 
        { name: "Sugar" }, { name: "Ruffles" }, { name: "Smarties" }, { name: "Lays" }];

        await page.evaluate((items) => {
            localStorage.setItem('recipeCart', JSON.stringify(items));
        }, cart);
        
        await page.reload();
        

        //Cart summary should display first 10 items included.
        await expect(page.locator('#cart-items')).toContainText('Milk');
        await expect(page.locator('#cart-items')).toContainText('Bread');
        await expect(page.locator('#cart-items')).toContainText('Cheetos');
        await expect(page.locator('#cart-items')).toContainText('Octopus');
        await expect(page.locator('#cart-items')).toContainText('Cheese');
        await expect(page.locator('#cart-items')).toContainText('KitKat');
        await expect(page.locator('#cart-items')).toContainText('Icecream');
        await expect(page.locator('#cart-items')).toContainText('Sugar');
        await expect(page.locator('#cart-items')).toContainText('Ruffles');
        await expect(page.locator('#cart-items')).toContainText('Smarties');

        //Cart summary should not display items past 10
        await expect(page.locator('#cart-items')).not.toContainText('Lays');

        await expect(page.locator('#cart-total')).toHaveText('Total Saved Items: 11');

        // Should show "more items" message
        await expect(page.locator('#cart-items')).toContainText('More items in cart');

    });

});