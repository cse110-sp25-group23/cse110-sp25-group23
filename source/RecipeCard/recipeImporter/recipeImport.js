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
    link.addEventListener('click', function(event) {
      const current = window.location.pathname;
      const target = new URL(this.href).pathname;
  
      if (current === target) {
        event.preventDefault();
        console.log('You are already on this tab.');
      }
    });
  });
  
importButton.addEventListener('click', async () => {
    try {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        importedRecipeDisplay.style.display = 'none';
        
        const recipe = await importRecipeFromUrl(urlInput.value);
        
        recipeTitle.textContent = recipe.title;
        recipeImage.src = recipe.image || '';
        recipeImage.alt = recipe.title || 'Recipe Image';
        
        recipeIngredients.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`.trim();
            recipeIngredients.appendChild(li);
        });
        
        recipeInstructions.innerHTML = '';
        recipe.instructions.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            recipeInstructions.appendChild(li);
        });
        
        importedRecipeDisplay.style.display = 'block';

        saveImportedRecipe(recipe);
        
        successMessage.textContent = `Successfully imported "${recipe.title}"!`;
        successMessage.style.display = 'block';
        urlInput.value = '';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
        importedRecipeDisplay.style.display = 'none';
    }
});