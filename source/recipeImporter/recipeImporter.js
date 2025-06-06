// Recipe importer module using Spoonacular API
const SPOONACULAR_API_KEY = '84180a4b77f2405597b0c117c850eb62';

/**
 * Validates a URL string.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
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
 * Formats a time estimate in minutes into a human-readable string.
 * @param {number} minutes - The total number of minutes.
 * @returns {string} A formatted string representing the time estimate (e.g., "45 minutes", "1 hour", "1 hour 30 minutes"). Returns "Unknown" if minutes is null, undefined, or 0.
 */
function formatTimeEstimate(minutes) {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} hours`;
    return `${hours} hours ${mins} minutes`;
}

/**
 * Imports a recipe from a given URL using the Spoonacular API.
 * Validates the URL, handles potential API errors (quota, not found, network), and transforms the API response into the application's recipe schema.
 * @param {string} url - The URL of the recipe to import.
 * @returns {Promise<Object>} A promise that resolves with the imported recipe data in the application's schema format.
 * @throws {Error} Throws an error if the URL is invalid, API errors occur, extraction fails, or a network issue prevents the fetch.
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
            name: data.title,
            author: data.sourceName || 'Imported Recipe',
            image: data.image,
            ingredients: data.extendedIngredients.map(ing => ({
                name: ing.name,
                unit: ing.unit ? `${ing.amount} ${ing.unit}` : ing.amount.toString()
            })),
            steps: data.analyzedInstructions[0]?.steps.map(step => step.step) || [],
            timeEstimate: formatTimeEstimate(data.readyInMinutes),
            favorite: false,
            createdAt: new Date().toISOString(),
            tags: []
        };
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Saves a recipe object to the browser's local storage under the 'recipes' key.
 * Checks for duplicate recipes based on name and author before saving.
 * @param {Object} recipe - The recipe object to save. Must conform to the application's recipe schema.
 * @returns {Object} The recipe object that was successfully saved.
 * @throws {Error} Throws an error if the recipe is a duplicate or if localStorage operations fail.
 */
export function saveImportedRecipe(recipe) {
    try {
        // Get existing recipes from localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
        
        // Check for duplicate recipes by name and author
        const isDuplicate = existingRecipes.some(r => 
            r.name === recipe.name && r.author === recipe.author
        );
        
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