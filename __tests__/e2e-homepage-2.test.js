import {test, expect} from '@playwright/test'

//all unit tests for the homepage

test.describe('Recipe Homepage', () => {

    test('localStorage is empty on initial load', async ({ page }) => {
        // Clear localStorage before visiting the page
        await page.goto('/source/HomePage/home.html');
        
        await page.reload();
      
        //LocalStorage should still be empty after load
        const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
        expect(localStorageKeys).toEqual([]);
    });

    test('Parses array correctly from localStorage', async ({ page }) => {
        const testArray = [
          { name: 'Eggs', author: 'Teddy', favorite: true },
          { name: 'Pizza', author: 'Dan', favorite: false }
        ];
      
        await page.goto('/source/HomePage/home.html');
      
        // Put the test array into localStorage
        await page.evaluate((arr) => {
          localStorage.setItem('recipes', JSON.stringify(arr));
        }, testArray);
      
        // Parse array from localStorage inside the page to test parsing
        const parsedArray = await page.evaluate(() => {
          return JSON.parse(localStorage.getItem('recipes') || '[]');
        });
      
        // Parsed array should match the original array
        expect(parsedArray).toEqual(testArray);

        expect(parsedArray.length).toBe(2);
        expect(parsedArray[0].name).toBe('Eggs');
        expect(parsedArray[1].name).toBe('Pizza');

      });

});
