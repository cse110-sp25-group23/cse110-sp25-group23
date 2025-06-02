import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

// list of categories (Favorite and Recently-Created are properties that need to be added to storage.js)
const categories = [
  { title: "All Recipes", filter: (r) => true },
  { title: "Recently Created", filter: (r) => true, sortRecent: (r) => new Date(r.createdAt)},
  { title: "Favorites", filter: (r) => r.favorite },  
  { title: "Easy", filter: (r) => r.tags.includes("Easy") },
  { title: "Advanced", filter: (r) => r.tags.includes("Advanced") },
];

window.addEventListener('DOMContentLoaded', init);      //runs the init function when dom content loads

function init() {
    // displays shelves (each representing a category), adds event listeners to "See All" elements
	displayShelves();
    // adds event listener for the "Create New Recipe" button
	// initCreateRecipe();
	// filters cards and displays only the matching cards on the shelves
	initSearch();
}

/**
 * Displays all cards in the specified category
 * NOTE: possibly remove if we allow horizontal scrolling through cards
 * @param title the category name
 * @param {Array<Object>} recipes An array of recipes
 */
function showAll(title, recipes) {
  // Clear main container
  const container = document.getElementById("shelf-container");
  container.innerHTML = "";

  /*
  const titleElem = document.createElement("h2");
  titleElem.textContent = `All ${title}`;
  container.appendChild(titleElem);
  */

  // generate as many shelves as needed (5 per shelf, for now)
  const shelfSize = 5;
  for (let i = 0; i < recipes.length; i += shelfSize) {
    // the container for this individual shelf
    const shelfDiv = document.createElement("div");
    shelfDiv.className = "shelf-section";

    const shelfImage = document.createElement("img");
    shelfImage.className = "shelf";
    shelfDiv.appendChild(shelfImage);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards-on-shelf";

    // display only the cards in the current 5-block chunk of recipes (based on i, loop counter)
    const chunk = recipes.slice(i, i + shelfSize);
    chunk.forEach(recipe => {
      	let recipeCard = document.createElement('recipe-card');
		recipeCard.data = recipe;
		cardsContainer.appendChild(recipeCard);
    });

    shelfDiv.appendChild(cardsContainer);
    container.appendChild(shelfDiv);
  }
}

/**
 * Displays shelves, each with their own category (ex: favorite)
 * Adds event handlers to "See All" <button>'s
 */
function displayShelves() {
  const recipes = getRecipesFromStorage();
  const container = document.getElementById("shelf-container");

  // loop through each category
  categories.forEach(category => {
    // filter for cards of this category
    const shelfRecipes = recipes.filter(category.filter);

    // this applies solely for the RECENTLY CREATED category
    if (category.sortRecent) {
      shelfRecipes.sort((a, b) => category.sortRecent(b) - category.sortRecent(a));
    }
    

    // limit how many recipes can be displayed on shelf to avoid overflow
    const recipesToShow = 3;
    const someRecipes = shelfRecipes.slice(0, recipesToShow);

    // the container for this individual shelf (will contain label, img, and cards)
    const shelfDiv = document.createElement("div");
    shelfDiv.className = "shelf-section";

    const title = document.createElement("h2");
    title.textContent = category.title;
    shelfDiv.appendChild(title);

    const shelfImage = document.createElement("img");
    shelfImage.className = "shelf";
    shelfDiv.appendChild(shelfImage);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "shelf-cards";

    // create each recipe-card
    someRecipes.forEach(recipe => {
      	let recipeCard = document.createElement('recipe-card');
		recipeCard.data = recipe;
		cardsContainer.appendChild(recipeCard);
    });

    shelfDiv.appendChild(cardsContainer);

    // "See All" button event handling
    if (shelfRecipes.length >= recipesToShow) {
        const seeAllBtn = document.createElement("button");
        seeAllBtn.textContent = "See All";
        seeAllBtn.className = "see-all-btn"; 
        seeAllBtn.addEventListener("click", () => showAll(category.title, shelfRecipes));
        shelfDiv.appendChild(seeAllBtn);
    }

    container.appendChild(shelfDiv);
  });
}

//search function (MODIFY)
function initSearch(){
	//get input from search-bar
	const searchInput = document.getElementById('searchInput')

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



