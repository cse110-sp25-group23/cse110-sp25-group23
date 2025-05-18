// Recipe importer module using Spoonacular API
const SPOONACULAR_API_KEY = '84180a4b77f2405597b0c117c850eb62';

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} Whether the URL is valid
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Imports a recipe from a URL using Spoonacular's API
 * @param {string} url - The URL of the recipe to import
 * @returns {Promise<Object>} The imported recipe data
 */
export async function importRecipeFromUrl(url) {
    // Validate URL
    if (!isValidUrl(url)) {
        throw new Error('Please enter a valid URL');
    }

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url)}&apiKey=${SPOONACULAR_API_KEY}`);
        
        if (response.status === 402) {
            throw new Error('API quota exceeded. Please try again later.');
        }
        
        if (response.status === 404) {
            throw new Error('Recipe not found. Please check the URL and try again.');
        }
        
        if (!response.ok) {
            throw new Error(`Failed to import recipe: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.title || !data.extendedIngredients) {
            throw new Error('Could not extract recipe data from the provided URL');
        }
        
        // Transform the Spoonacular response into our recipe card format
        return {
            id: Date.now().toString(), // Add unique ID
            title: data.title,
            image: data.image,
            ingredients: data.extendedIngredients.map(ing => ({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit
            })),
            instructions: data.analyzedInstructions[0]?.steps.map(step => step.step) || [],
            servings: data.servings,
            readyInMinutes: data.readyInMinutes,
            sourceUrl: url,
            importedAt: new Date().toISOString()
        };
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Saves an imported recipe to localStorage
 * @param {Object} recipe - The recipe to save
 */
export function saveImportedRecipe(recipe) {
    try {
        // Get existing recipes from localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        
        // Check for duplicate recipes
        const isDuplicate = existingRecipes.some(r => r.sourceUrl === recipe.sourceUrl);
        if (isDuplicate) {
            throw new Error('This recipe has already been imported');
        }
        
        // Add the new recipe
        existingRecipes.push(recipe);
        
        // Save back to localStorage
        localStorage.setItem('recipes', JSON.stringify(existingRecipes));
        
        return recipe;
    } catch (error) {
        console.error('Error saving recipe:', error);
        throw error;
    }
} 