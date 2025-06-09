// Recipe importer module using Spoonacular API
const SPOONACULAR_API_KEY = '84180a4b77f2405597b0c117c850eb62';
const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000; // 10 seconds timeout

//import { finalizeRecipe } from '../../LocalStorage/storage.js';
function finalizeRecipe(recipe) {
    const container = document.querySelector('main');
    
    //Create Recipe
    const recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    container.appendChild(recipeCard);

    //Add Recipe to Storage
    const localRecipes = getRecipesFromStorage();
    localRecipes.push(recipe);
    saveRecipesToStorage(localRecipes);

    window.dispatchEvent(new Event('recipeCreated'));

    //Clear Inputs
    form.reset();
    //Reset image input and radio buttons
    document.getElementById('imageSourceFile').checked = true;
    toggleInputs();

    //reset ingredients list
    ingredientsArray.length = 0;
    ingredientsList.innerHTML = '';

    //reset steps list
    stepsArray.length = 0;
    stepsList.innerHTML = '';
}

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
 * Formats a total number of minutes into a human-readable time estimate string.
 * @param {number} totalMinutes - The total number of minutes.
 * @returns {string} The formatted time estimate (e.g., "1 hr 30 min").
 */
function formatMinutesToTimeEstimate(totalMinutes) {
    if (totalMinutes === 0) {
        return '';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    let timeEstimate = '';
    if (hours > 0) {
        timeEstimate += `${hours} hr`;
    }
    if (hours > 0 && minutes > 0) {
        timeEstimate += ' ';
    }
    if (minutes > 0) {
        timeEstimate += `${minutes} min`;
    }
    return timeEstimate.trim();
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
                throw new Error('API quota exceeded. Please try again later or contact support.');
            }
            
            if (response.status === 404) {
                throw new Error('Recipe not found. Please check the URL and try again.');
            }
            
            if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            
            if (response.status === 500 || response.status === 503) {
                throw new Error('Spoonacular service is temporarily unavailable. Please try again in a few minutes.');
            }
            
            if (!response.ok) {
                throw new Error(`Failed to import recipe: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.title || !data.extendedIngredients) {
                throw new Error('Could not extract recipe data from the provided URL. The recipe format may not be supported.');
            }
            
            // Transform the Spoonacular response into our recipe card format
            return {
                name: data.title,
                author: 'Imported',
                ingredients: data.extendedIngredients.map(ing => ({
                    name: ing.name,
                    amount: ing.amount,
                    unit: ing.unit
                })),
                steps: data.analyzedInstructions[0]?.steps.map(step => step.step) || [],
                tags: [],
                timeEstimate: formatMinutesToTimeEstimate(data.readyInMinutes || 0),
                favorite: false,
                createdAt: new Date().toISOString(),
                image: data.image || '',
                sourceUrl: url // Store the source URL for duplicate detection
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
        
        // Create and display the recipe card
        finalizeRecipe(recipe);
        
        return recipe;
    } catch (error) {
        console.error('Error saving recipe:', error);
        throw error;
    }
} 
