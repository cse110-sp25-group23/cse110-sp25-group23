import { importRecipeFromUrl, saveImportedRecipe } from './recipeImporter.js';

async function testImport() {
    try {
        console.log('Starting recipe import...');
        const recipe = await importRecipeFromUrl('https://www.seriouseats.com/whole-grilled-fish-recipe-11744350');
        console.log('Successfully imported recipe:', recipe);
        
        // Save to localStorage
        saveImportedRecipe(recipe);
        console.log('Recipe saved to localStorage');
        
        // Verify it was saved
        const savedRecipes = JSON.parse(localStorage.getItem('recipes'));
        console.log('All saved recipes:', savedRecipes);
    } catch (error) {
        console.error('Error importing recipe:', error.message);
    }
}

testImport(); 