/**
 * Read 'recipes' from localStorage, then return array of
 * all recipes found in parsed form. If nothing found in localStorage  
 * for 'recipes', return an empty array
 * @returns {Array<Object>} An array of recipes found in localStorage
 */
function getRecipesFromStorage() {
	const recipes = localStorage.getItem('recipes');
	if (recipes == null) {
		return [];
	}
	return JSON.parse(recipes);
}

/**
 * Takes as input an array of recipes and for each one creates a
 * new <recipe-card> element, adds the recipe data to the card
 * using element.data = {...}, and then appends the new recipe
 * to the container (<main>)
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
	//or document.getElementById('cardsContainer')
	const container = document.querySelector('main');

	for (let i = 0; i < recipes.length; i++) {
		let recipeCard = document.createElement('recipe-card');
		recipeCard.data = recipes[i];
		container.appendChild(recipeCard);
	}
}

/**
 * Takes in a recipe array, converts it to a JSON string, and then
 * saves it to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
	localStorage.setItem('recipes', JSON.stringify(recipes));
}

//export functions for tests
export {
	addRecipesToDocument,
	getRecipesFromStorage,
	saveRecipesToStorage
};