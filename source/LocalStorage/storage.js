window.addEventListener('DOMContentLoaded', init);      //runs the init function when dom content loads

function init() {
	let recipes = getRecipesFromStorage();
	addRecipesToDocument(recipes);
    // adds event listeners to form elements
	initFormHandler();    
	
	//adds search
	initSearch();
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
			recipeObject.name = formData.get("name");
			recipeObject.author = formData.get("author");
			recipeObject.ingredients = formData.get("ingredients");
			recipeObject.steps = formData.get("steps");
			
			// Combine tags from dropdown and custom input
			const predefinedTag = formData.get("difficulty");
			recipeObject.difficulty = predefinedTag;
			const customTagInput = formData.get("tags");
			
			const tags = [];
			if (predefinedTag) tags.push(predefinedTag);
			if (customTagInput) {
			tags.push(...customTagInput
			    .split(',')
			    .map(t => t.trim())
			    .filter(Boolean)
			    .map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()));
			}
			recipeObject.tags = tags;
			
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

//search function
function initSearch(){
	//get input from search-bar
	const searchInput = document.querySelector('search-bar input[type="search"]');

	//If there is no input return
	if(!searchInput){
		return;
	}

	
	searchInput.addEventListener('input', (query) => {
		//remove spaces and convert all text to lowercase
		const trimmedQuery = query.target.value.trim().toLowerCase();
		const cards = document.querySelectorAll('recipe-card');
		
		//loop over each card
		cards.forEach(card =>  {
			//get all data from each card
			const { name, author, difficulty, tags, ingredients, steps } = card._data;
			
			/**
			* Creates one string with all the text from all data
			* .filter(x => x) Remvoves any null values, empty strings, and undefined values
			* 
			* .join(' ') creates one large string with a space between every field 
			* Ex. the strings "name" and "author" becomes one string "name, author"
			*/
			const haystack = [ name, author, difficulty, tags, ingredients, steps ].filter(x => x)
				.join(' ')		//Combines all data into one string
				.toLowerCase(); //Lowecase for all data

			//display card if the text is in the input
			if (haystack.includes(trimmedQuery)) {
				card.style.display = '';
			} else {
				card.style.display = 'none';
			}
		});
	});
}
