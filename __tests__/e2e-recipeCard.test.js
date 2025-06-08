import {test, expect} from '@playwright/test'

//all tests for recipe shelf page 
test.describe('Recipes Creation Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('source/RecipeCard/recipeCard.html');
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
        await expect(addedRecipe).toHaveCount(2);

        //I don't know what the navigation will be like after you click create a recipe
        await page.click('nav >> text=My Recipes');
        await expect(page).toHaveURL('/my-recipes/');

        await expect(addedRecipe).toContainText('Oreo Pie');
    });  
      
    test('Check if card renders on the page', async ({page}) => {
        //waits for the recipe card to render
        const recipeCardHandle = await page.waitForSelector('recipe-card');
        const shadowRoot = await recipeCardHandle.evaluateHandle(el => el.shadowRoot);

        const recipeCard = await shadowRoot.$('.flip-card');
        const recipeFront = await recipeCard.$('.flip-card-front');
        const recipeBack = await recipeCard.$('.flip-card-back');


        expect(recipeFront).toBeVisible();
        expect(recipeBack).toBeVisible();

    });

    test('Check if card flips forward and backward correctly', async ({page}) => {
        //waits for the recipe card to render
        const recipeCardHandle = await page.waitForSelector('recipe-card');
        const shadowRoot = await recipeCardHandle.evaluateHandle(el => el.shadowRoot);

        const recipeCardInner = await shadowRoot.$('.flip-card-inner');

        const initialFlip = await recipeCardInner.getProperty('className');
        const initialFlipValue = await initialFlip.jsonValue();
        expect(initialFlipValue).not.toContain('flipped');
        
        await recipeCardHandle.click();

        const flip = await recipeCardInner.getProperty('className');
        const flipValue = await flip.jsonValue();
        expect(flipValue).toContain('flipped');  
                
        await recipeCardHandle.click();

        const secondFlip = await recipeCardInner.getProperty('className');
        const secondFlipValue = await secondFlip.jsonValue();
        expect(secondFlipValue).not.toContain('flipped');
        
    });

});
