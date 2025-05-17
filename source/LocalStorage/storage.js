window.addEventListener('DOMContentLoaded', init);      //runs the init function when dom content loads

function init() {
	let recipes = getRecipesFromStorage();
	addRecipesToDocument(recipes);
    // adds event listeners to form elements
	initFormHandler();               
}

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

/**
 * Adds event handlers to <form> and the clear storage
 * <button>.
 */
function initFormHandler() {
	const form = document.querySelector('form');
	const container = document.querySelector('main');    //card container

	// adds recipe card when form is submitted
	form.addEventListener('submit', (event) => {
		event.preventDefault(); // prevent page reload
		const formData = new FormData(form);
		const imgFile = formData.get("image");

		const reader = new FileReader();
		reader.onloadend = () => {
			let recipeObject = {
				//base64 string for image so it doesnt disappear on reload
				image: reader.result 
			};

			// Fill in the rest of the fields
			for (const [key, val] of formData.entries()) {
				if (key !== "image") {
					recipeObject[key] = val;
				}
			}

			const recipeCard = document.createElement('recipe-card');
			recipeCard.data = recipeObject;
			container.appendChild(recipeCard);

			let localRecipes = getRecipesFromStorage();
			localRecipes.push(recipeObject);
			saveRecipesToStorage(localRecipes);

			form.reset();
		};
		reader.readAsDataURL(imgFile);
	}); 
}
