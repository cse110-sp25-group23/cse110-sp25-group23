import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

window.addEventListener('DOMContentLoaded', init);      //runs the init function when dom content loads

// if screen becomes too small, redisplay shelves so they only display 2 cards
window.addEventListener('resize', () => {
    // do not redisplay shelves if you're simply going fullscreen
    if (document.fullscreenElement) {
        return;
    }
    document.getElementById("shelf-container").innerHTML = "";
    displayShelves();
});

// custom event: if a card's edit, delete, or favorite button is pressed, update all shelf displays
window.addEventListener('recipesUpdated', () => {
    document.getElementById("shelf-container").innerHTML = "";
    displayShelves();
});

function init() {
    // displays shelves (each representing a category), adds event listeners to "See All" elements
	displayShelves();
    // adds event listener for the "Create New Recipe" button
	// initCreateRecipe();

	// filters cards and displays only the matching cards on the top sehlf as results
	const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
        displaySearchResultsShelf(searchQuery);
        localStorage.removeItem('searchQuery'); //not save it
    }
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
    

    // decides how many cards to show based on screen size
    let recipesToShow = 3;
    if (window.innerWidth < 1500) {
        recipesToShow = 2; 
    }
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
const searchInput = document.getElementById('search-field-small');
const searchButton = document.querySelector('[type="submit"]');

/**
 * @returns cards list that have any properties related to the search input 
 */
function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    localStorage.setItem('searchQuery', query);
    window.location.href = 'my-recipes.html';
  }
}

if (searchInput && searchButton) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter'){
        handleSearch();
    } 
  });

  searchButton.addEventListener('click', handleSearch);
}

function displaySearchResultsShelf(query) {
    const container = document.getElementById("shelf-container");
    const recipes = getRecipesFromStorage();
    const trimmedQuery = query.toLowerCase();
  
    // Filter matching recipes
    const matchingRecipes = recipes.filter(recipe => {
      const { name, author, difficulty, tags} = recipe;
      const haystack = [name, author, difficulty, tags]
        .filter(x => x)
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmedQuery);
    });
  
     // If no matches found, show a message instead of a shelf
  if (matchingRecipes.length === 0) {
    const noResultsDiv = document.createElement("div");
    noResultsDiv.className = "shelf-section";

    const message = document.createElement("h2");
    message.textContent = `No results found for "${query}"`;
    noResultsDiv.appendChild(message);

    container.prepend(noResultsDiv);
    return;
  }
  
    const shelfDiv = document.createElement("div");
    shelfDiv.className = "shelf-section";
    shelfDiv.dataset.currentIndex = "0";
  
    const title = document.createElement("h2");
    title.textContent = `Results for "${query}"`;
    shelfDiv.appendChild(title);
  
    const shelfImage = document.createElement("img");
    shelfImage.className = "shelf";
    shelfDiv.appendChild(shelfImage);
  
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "shelf-cards";
  
    const leftBtn = document.createElement("button");
    leftBtn.textContent = "<";
    leftBtn.className = "shelf-arrow left";
    leftBtn.addEventListener("click", () => {
      let index = parseInt(shelfDiv.dataset.currentIndex);
      index = Math.max(0, index - 3);
      shelfDiv.dataset.currentIndex = index.toString();
      updateShelfCards(cardsContainer, matchingRecipes, index, 3, leftBtn, rightBtn);
    });
  
    const rightBtn = document.createElement("button");
    rightBtn.textContent = ">";
    rightBtn.className = "shelf-arrow right";
    rightBtn.addEventListener("click", () => {
      let index = parseInt(shelfDiv.dataset.currentIndex);
      if (index + 3 < matchingRecipes.length) {
        index += 3;
        shelfDiv.dataset.currentIndex = index.toString();
        updateShelfCards(cardsContainer, matchingRecipes, index, 3, leftBtn, rightBtn);
      }
    });
  
    shelfDiv.appendChild(leftBtn);
    shelfDiv.appendChild(rightBtn);
  
    updateShelfCards(cardsContainer, matchingRecipes, 0, 3, leftBtn, rightBtn);
    shelfDiv.appendChild(cardsContainer);
    
    // Insert at the very top
    container.prepend(shelfDiv);
  }