import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

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
 * Updates what cards from storage are displayed on the shelf 
 * @param {HTMLElement} container the element that contains all the displayed recipe cards 
 * @param {Array<Object>} recipes the array of recipes in localstorage 
 * @param {number} startIndex display cards that start from this index in the recipes array
 * @param {*} count the number of cards that we want to display on the shelf
 * @param {HTMLElement} leftBtn the button element for the left arrow (for horizontal scrolling)
 * @param {HTMLElement} rightBtn the button element for the right arrow (for horizontal scrolling)
 */
function updateShelfCards(container, recipes, startIndex, count, leftBtn, rightBtn) {
    container.innerHTML = "";   // clears cards only
    const chunk = recipes.slice(startIndex, startIndex + count);
    chunk.forEach(recipe => {
        let recipeCard = document.createElement('recipe-card');
        recipeCard.data = recipe;
        container.appendChild(recipeCard);
    });

    // disables left click + changes button style to give indication that no further cards are to the left
    if (startIndex == 0) {
        leftBtn.classList.add("disabled");
    } else {
        leftBtn.classList.remove("disabled");
    }

    // Right button: disable if at last page
    if (startIndex + count >= recipes.length) {
        rightBtn.classList.add("disabled");
    } else {
        rightBtn.classList.remove("disabled");
    }
}

/**
 * Displays shelves, each with their own category (ex: favorite)
 * Adds event handlers to "See All" <button>'s
 */
function displayShelves() {
  const recipes = getRecipesFromStorage();
  const container = document.getElementById("shelf-container");

    // retrieve all tags (includes predefined, custom, and meal tags)
    let uniqueTags = [];
    recipes.forEach(recipe => {
        recipe.tags.forEach(tag => {
            if (!uniqueTags.includes(tag)) {
                uniqueTags.push(tag);
            }
        });
    });

    // make each tag a "category" that will be added to a "categories" object
    const tagCategories = uniqueTags.map(tag => ({
        title: tag,
        filter: (r) => r.tags.includes(tag)
    }));

    // Step 3: Combine static + dynamic categories
    const categories = [
        { title: "All Recipes", filter: (r) => true },
        { title: "Recently Created", filter: (r) => true, sortRecent: (r) => new Date(r.createdAt) },
        { title: "Favorites", filter: (r) => r.favorite },
        ...tagCategories
    ];

  // loop through each category
  categories.forEach(category => {
    // filter for cards of this category
    const shelfRecipes = recipes.filter(category.filter);

    // this applies solely for the RECENTLY CREATED category
    if (category.sortRecent) {
      shelfRecipes.sort((a, b) => category.sortRecent(b) - category.sortRecent(a));
    }
    

    // limit how many recipes can be displayed on shelf to avoid overflow
    const recipesToShow = 2;
    const someRecipes = shelfRecipes.slice(0, recipesToShow);

    // the container for this individual shelf (will contain label, img, and cards)
    const shelfDiv = document.createElement("div");
    shelfDiv.className = "shelf-section";
    // needed for us to know where in the localstorage "recipes" array we are at currently 
    shelfDiv.dataset.currentIndex = "0";    

    // the shelf label
    const title = document.createElement("h2");
    title.textContent = category.title;
    shelfDiv.appendChild(title);

    // the image of the wooden shelf
    const shelfImage = document.createElement("img");
    shelfImage.className = "shelf";
    shelfDiv.appendChild(shelfImage);

    // contains all the recipe cards displayed above shelf img
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "shelf-cards";

    // add the left and right buttons to each shelf. click to look at the rest of the cards in storage
    const leftBtn = document.createElement("button");
    leftBtn.textContent = "<";
    leftBtn.className = "shelf-arrow left";     // adds 2 classes, shelf-arrow and left
    leftBtn.addEventListener("click", () => {
        let index = parseInt(shelfDiv.dataset.currentIndex);
        //prevent going out of bounds (below 0 index)
        index = Math.max(0, index - recipesToShow);  
        shelfDiv.dataset.currentIndex = index.toString();
        updateShelfCards(cardsContainer, shelfRecipes, index, recipesToShow, leftBtn, rightBtn);
    });

    const rightBtn = document.createElement("button");
    rightBtn.textContent = ">";
    rightBtn.className = "shelf-arrow right";
    rightBtn.addEventListener("click", () => {
        let index = parseInt(shelfDiv.dataset.currentIndex);
        if (index + recipesToShow < shelfRecipes.length) {
            index += recipesToShow;  
            shelfDiv.dataset.currentIndex = index.toString();
            updateShelfCards(cardsContainer, shelfRecipes, index, recipesToShow, leftBtn, rightBtn);
        }
    });

    // add buttons to shelf
    shelfDiv.appendChild(leftBtn);
    shelfDiv.appendChild(rightBtn);

    // display a set of recipeCards starting from index {shelfDiv.dataset.currentIndex} in localstorage
    // updateShelfCards will update the cardsContainer element to contain these cards
    let index = parseInt(shelfDiv.dataset.currentIndex);
    updateShelfCards(cardsContainer, shelfRecipes, index, recipesToShow, leftBtn, rightBtn);

    // add the finalized cardsContainer to the shelfDiv container, then add shelfDiv to the bigger container
    shelfDiv.appendChild(cardsContainer);

    container.appendChild(shelfDiv);
  });
}

/**
 * Searches for cards that have any properties related to the search input 
 */
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



