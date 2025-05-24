window.addEventListener('DOMContentLoaded', init);      //runs the init function when dom content loads

function init() {
	let recipes = getRecipesFromStorage();
	addRecipesToDocument(recipes);
    // adds event listeners to form elements
	initFormHandler();    
	
	//adds search
	initSearch();

	//Declare buttons for image input type
	const fileRadio = document.getElementById('imageSourceFile');
	const urlRadio = document.getElementById('imageSourceURL');

	//change which is displayed when button changes
	fileRadio.addEventListener('change', toggleInputs);
	urlRadio.addEventListener('change', toggleInputs);
	toggleInputs();
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

	form.addEventListener('submit', (event) => {
		//prevent page from reloading
		event.preventDefault();

		const formData = new FormData(form);
		
		//Get inputs from Recipce Card form
		const name = formData.get("name");
		const author = formData.get("author");
		const ingredients = formData.get("ingredients");
		const steps = formData.get("steps");
		
		//Tags are a combination of the predefined options and Custom tags, add them to one string
		const predefinedTag = formData.get("difficulty");
		const customTag = formData.get("tags");

		const tags = [];
		if (predefinedTag) tags.push(predefinedTag);
		if (customTag) {
		tags.push(...customTag
			.split(',')
			.map(t => t.trim())
			.filter(Boolean)
			.map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()));
		}

		//Check if the user will be using image URL
		const urlInput = document.getElementById('imageSourceURL').checked ;

		//Recipe is an Object with these atributes
		const recipe = {
			name,
			author,
			ingredients,
			steps,
			tags
		}

		//If User is Using URL, get image url 
		if(urlInput){
			const url = document.getElementById("imageURL").value.trim();
			
			//do not let them create without an image url
			if (!url) {
				alert("Please enter a valid image URL.");
				return;
			}
			recipe.image = url;
			finalizeRecipe(recipe); 
		} else{
			//get image and do not let user create card without image
			const imgFile = document.getElementById("imageFile").files[0];
			if (!imgFile) {
				alert("Please select an image file.");
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				recipe.image = reader.result;
				finalizeRecipe(recipe);
			};
			reader.readAsDataURL(imgFile);
		}
		function finalizeRecipe(recipe) {
			//Create Recipe
			const recipeCard = document.createElement('recipe-card');
			recipeCard.data = recipe;
			container.appendChild(recipeCard);

			//Add Recipe to Storage
			const localRecipes = getRecipesFromStorage();
			localRecipes.push(recipe);
			saveRecipesToStorage(localRecipes);

			//Clear Inputs
			form.reset();
			//Reset image input and radio buttons
			document.getElementById('imageSourceFile').checked = true;
			toggleInputs();
		}
	}); 
}

//search function
function initSearch(){
	//get input from search-bar
	const searchInput = document.querySelector('search input[type="search"]');

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

//Change input type based on button
function toggleInputs() {
	const fileInputLabel = document.getElementById('fileInputLabel');
	const urlInputLabel = document.getElementById('urlInputLabel');
	const fileRadio = document.getElementById('imageSourceFile');
	const urlRadio = document.getElementById('imageSourceURL');

	//if using file, display file input, else display search bar
	if (fileRadio.checked) {
		fileInputLabel.style.display = 'block';
		urlInputLabel.style.display = 'none';
	} else {
		fileInputLabel.style.display = 'none';
		urlInputLabel.style.display = 'block';
	}
}


