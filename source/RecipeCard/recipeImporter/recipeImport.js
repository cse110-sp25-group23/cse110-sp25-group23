import { importRecipeFromUrl, saveImportedRecipe } from './recipeImporter.js';

const importButton = document.getElementById('importButton');
const urlInput = document.getElementById('recipeUrl');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const importedRecipeDisplay = document.getElementById('importedRecipeDisplay');
const recipeTitle = document.getElementById('recipeTitle');
const recipeImage = document.getElementById('recipeImage');
const recipeIngredients = document.getElementById('recipeIngredients');
const recipeInstructions = document.getElementById('recipeInstructions');


// Prevents reloading page if already on the said page
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (event) {
        const current = window.location.pathname;
        const target = new URL(this.href).pathname;

        if (current === target) {
            event.preventDefault();
            console.log('You are already on this tab.');
        }
    });
});

// SEARCH BAR FUNCTIONALITY – redirects to my-recipes.html with query
const searchInput = document.getElementById('search-field-small');
const searchButton = document.querySelector('[type="submit"]');

function handleSearch() {
const query = searchInput.value.trim();
if (query !== '') {
    localStorage.setItem('searchQuery', query);
    window.location.href = '../my-recipes.html';
}
}

if (searchInput) {
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
    handleSearch();
    }
});
}

if (searchButton) {
searchButton.addEventListener('click', handleSearch);
}

const mobileSearchInput = document.getElementById('search-field-mobile');
const mobileSearchButton = document.getElementById('search-button-mobile');

function handleMobileSearch() {
const query = mobileSearchInput.value.trim();
if (query !== '') {
    localStorage.setItem('searchQuery', query);
    window.location.href = '../my-recipes.html';
}
}

if (mobileSearchInput) {
mobileSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
    handleMobileSearch();
    }
});
}

if (mobileSearchButton) {
mobileSearchButton.addEventListener('click', handleMobileSearch);
}

importButton.addEventListener('click', async () => {
    /** Properties Stored:
        * const recipe = {
           name,
           author,
           ingredients,
           steps,
           tags,
           timeEstimate,
           favorite,
           createdAt
       };
        */
    try {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        importedRecipeDisplay.style.display = 'none';

        document.getElementById('loadingSpinner').style.display = 'block';

        const recipe = await importRecipeFromUrl(urlInput.value);

        recipeTitle.textContent = recipe.title;
        recipeImage.src = recipe.image || '';
        recipeImage.alt = recipe.title || 'Recipe Dish Image';

        recipeIngredients.innerHTML = '';
        (recipe.ingredients || []).forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`.trim();
            recipeIngredients.appendChild(li);
        });

        recipeInstructions.innerHTML = '';
        (recipe.instructions || []).forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            recipeInstructions.appendChild(li);
        });

        // hide the spinner after success
        document.getElementById('loadingSpinner').style.display = 'none';

        importedRecipeDisplay.style.display = 'block';

        saveImportedRecipe(recipe);

        successMessage.textContent = `Successfully imported "${recipe.name}"!`;
        successMessage.style.display = 'block';
        urlInput.value = '';
    } catch (error) {

        // hide the spinner on error too
        document.getElementById('loadingSpinner').style.display = 'none';

        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        importedRecipeDisplay.style.display = 'none';
    }
});