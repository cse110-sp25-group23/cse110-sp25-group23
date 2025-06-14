// Recipe importer module using Spoonacular API
const SPOONACULAR_API_KEY = '84180a4b77f2405597b0c117c850eb62';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000; // 10 seconds timeout
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
 * @returns {Promise<Object>} A promise that resolves with the imported recipe data in the application's schema format. The object includes:
 *   - name: string
 *   - author: string
 *   - image: string
 *   - ingredients: Array<{name: string, unit: string}>
 *   - steps: string[]
 *   - tags: string[]
 *   - timeEstimate: string
 *   - favorite: boolean
 *   - createdAt: string (ISO date)
 *   - sourceurl: string (original URL)
 * @throws {Error} Throws an error if the URL is invalid, API errors occur, extraction fails, or a network issue prevents the fetch.
 */
export async function importRecipeFromUrl(url) {
    // Validate URL
    if (!isValidUrl(url)) {
        throw new Error('Please enter a valid URL');
    }
    let retryCount = 0;
    
    while (retryCount <= MAX_RETRIES) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

            const response = await fetch(
                `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url)}&apiKey=${SPOONACULAR_API_KEY}`,
                { signal: controller.signal }
            );
            
            clearTimeout(timeoutId);
    
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
    
            if (document.body.textContent.includes("undefined") || document.title.includes("error")) {
                throw new Error("The recipe could not be found or the page has an error.");
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
                tags: [],
                timeEstimate: formatTimeEstimate(data.readyInMinutes),
                favorite: false,
                createdAt: new Date().toISOString(),
                sourceurl: url
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your internet connection and try again.');
            }
            
            if (error.message.includes('Failed to fetch')) {
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    // Wait for 1 second before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                }
                throw new Error('Network error. Please check your internet connection and try again.');
            }
            
            // If it's a known error (like quota exceeded), don't retry
            if (error.message.includes('API quota exceeded') || 
                error.message.includes('Recipe not found') ||
                error.message.includes('Too many requests')) {
                throw error;
            }
            
            // For other errors, retry if we haven't exceeded max retries
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            
            throw error;
        }
    }
}

/**
 * Saves a recipe object to the browser's local storage under the 'recipes' key.
 * Checks for duplicate recipes based on name and author before saving.
 * @param {Object} recipe - The recipe object to save. Must conform to the application's recipe schema, including:
 *   - name: string
 *   - author: string
 *   - image: string
 *   - ingredients: Array<{name: string, unit: string}>
 *   - steps: string[]
 *   - tags: string[]
 *   - timeEstimate: string
 *   - favorite: boolean
 *   - createdAt: string (ISO date)
 *   - sourceurl: string (original URL)
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
