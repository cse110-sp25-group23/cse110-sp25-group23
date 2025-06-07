import {test, expect} from '@playwright/test'

//all tests for recipe shelf page 
test.describe('Recipes Shelf Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/my-recipes-html');
    });

    test('Check if navbar navigates correctly to other pages', async ({page}) => {

        //Check if navbar logo correctly navigates to home page
        await page.click('a.logo');
        await expect(page).toHaveURL(/\/home\.html$/);

        //Check if navbar correctly navigates to calendar page
        await page.click('nav >> text=Calendar');
        await expect(page).toHaveURL(/\/calendar\.html$/);

        //Check if navbar correctly navigates to shelf page
        // await page.click('nav >> text=Shelf');
        // await page.goto('/\/shelf/(\.html)?$/'')

        //Check if navbar correctly navigates to recipe creation page
        await page.click('nav >> text=Create');
        await expect(page).toHaveURL(/\/recipeCard\.html$/);

        //Check if navbar correctly navigates to shopping page
        await page.click('nav >> a.cart');
        await expect(page).toHaveURL(/\shopping\.html$/);
        

    }); 

    test('Check if card renders on shelf after creating recipe card (file upload)', async ({page}) => {
        await page.goto('/recipeCard.html');

        await page.fill('#recipeName', "Oreo Pie");
        await page.fill('#authorName', "Alex Mochi");
       
        //upload image file
        const imgPath = path.resolve('source/RecipeCard/oreo-pie.jpg') ;
        await page.setInputFiles('#imageFile', imgPath);
        
        await page.selectOption('#tagsDropdown', 'Pro');
        await page.fill('#customTag', 'Dessert');
        await page.fill('#timeHours', 1);
        await page.fill('#timeMinutes', 30);

        await page.fill('#ingredientInput', 'Flour');
        await page.fill('#ingredientUnitInput', '2 cups');
        await page.click('#addIngredientBtn');

        await page.fill('#stepInput', 'Mix all ingredients.');
        await page.click('#addStepBtn');
        await page.fill('#stepInput', 'Bake pie');
        await page.click('#addStepBtn');

        await page.click('button[type="submit"]');

        const addedRecipe = page.locator('.recipe-card');
        await expect(addedRecipe).toHaveCount(1);

        //I don't know what the navigation will be like after you click create a recipe
        await page.click('nav >> text=My Recipes');
        await expect(page).toHaveURL('/my-recipes/');

        await expect(addedRecipe).toContainText('Oreo Pie');

    });

    test('Check if card renders on shelf after creating recipe card (url upload)', async ({page}) => {
        await page.goto('/recipeCard.html');

        await page.fill('#recipeName', "Oreo Pie");
        await page.fill('#authorName', "Alex Mochi");
       
        await page.check('#imageSourceURL');

        await page.fill('#imageURL', 'https://joyfoodsunshine.com/wp-content/uploads/2021/08/Oreo-pie-recipe-5-500x500.jpg');
        
        await page.selectOption('#tagsDropdown', 'Pro');
        await page.fill('#customTag', 'Dessert');
        await page.fill('#timeHours', 1);
        await page.fill('#timeMinutes', 30);

        await page.fill('#ingredientInput', 'Flour');
        await page.fill('#ingredientUnitInput', '2 cups');
        await page.click('#addIngredientBtn');

        await page.fill('#stepInput', 'Mix all ingredients.');
        await page.click('#addStepBtn');
        await page.fill('#stepInput', 'Bake pie');
        await page.click('#addStepBtn');

        await page.click('button[type="submit"]');

        const addedRecipe = page.locator('.recipe-card');
        await expect(addedRecipe).toHaveCount(1);

        //I don't know what the navigation will be like after you click create a recipe
        await page.click('nav >> text=My Recipes');
        await expect(page).toHaveURL('/my-recipes/');

        await expect(addedRecipe).toContainText('Oreo Pie');

    });
});
