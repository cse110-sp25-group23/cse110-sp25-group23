console.log("JS file loaded");

window.addEventListener('DOMContentLoaded', function () {
  console.log("Script running after DOM ready");

  // e.g. "2025-06-04" and Pacific time
  const todayStr = new Date().toLocaleDateString("en-CA");

  console.log("✅ Running meal loader. Today = ", todayStr);
  const breakfastMeals = [];
  const lunchMeals = [];
  const dinnerMeals = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    // Match keys that start with today’s date and filter meals from there
    if (key.startsWith(todayStr)) {
      const timePart = key.split(" ")[1];
      console.log("time", timePart);
      const hour = parseInt(timePart.split(":")[0]);
      console.log("hour", hour);
      const meal = JSON.parse(localStorage.getItem(key));

      // Time standards of how we defined certain certain recipes scheduled to be considered a breakfast, lunch or dinner meal
      if (hour >= 0 && hour < 12) {
        breakfastMeals.push({ meal, timePart });
      } else if (hour >= 12 && hour < 16) {
        lunchMeals.push({ meal, timePart });
      } else if (hour >= 16 && hour <= 24) {
        dinnerMeals.push({ meal, timePart });
      }
    }
  }

  // Render to homepage
  document.getElementById("breakfast").innerHTML = renderMealCards(breakfastMeals, "Breakfast");
  document.getElementById("lunch").innerHTML = renderMealCards(lunchMeals, "Lunch");
  document.getElementById("dinner").innerHTML = renderMealCards(dinnerMeals, "Dinner");

  /**
   * 
   * @param {*} meals  - it is type of meals - breakfast, lunch or dinner 
   * array that is previously ordered in these 3 arrays based on time scheduled
   * @param {*} label  - label goes along with type of array of meals being
   * passed for it to be inputted as header label alongside the meals name
   * that are being pulled details of from the storage.
   * @returns html code that showcases label and meals in their respective
   * containers of breakfast, lunch and dinner.
   */
  function renderMealCards(meals, label) {
    if (!meals || meals.length === 0) {
      lower = label.toLowerCase();
      return `<h2>${label}</h2>` + `<p>No ${lower} scheduled.<br>Plan something delicious now!</p>`;
    }
    return `<h2>${label}</h2>` + meals.map(item => {
      const [hourStr, minuteStr] = item.timePart.split(":");
      const hour = parseInt(hourStr);
      const ampm = hour < 12 ? "AM" : "PM";
      const timeLabel = `<span class="time-label">${item.timePart} ${ampm}</span>`;

      // Build a list of all recipe names + authors
      const mealDetails = Array.isArray(item.meal)
        ? item.meal.map(r => `<p class="meal-name"><i>${r.name}</i> by ${r.author}</p>`).join('')
        : `<p>Unnamed Meal</p>`;

      return `
        <div class="meal-card">
          <p><b>${timeLabel}</b></p>
          ${mealDetails}
        </div>
      `;
    }).join('\n');
  }

  // Extracting recipeCart saved Items
  const cart = JSON.parse(localStorage.getItem("recipeCart"));

  // favoritedRecipes (need to be connected with niroops favorite features in recipeCard)
  const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const favoriteRecipes = allRecipes.filter(recipe => recipe.favorite === true);
  // const favorites = JSON.parse(localStorage.getItem("favoritedRecipes"));

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

  /**
   * @param recipes - from local storage, general recipes are then filtered for 
   * favorite property that is true/false.
   * @returns nothing, but updates DOM to be showcased on UI after.
   */
  function renderFavoriteCards(recipes) {
    const container = document.getElementById("favorites-list");
    container.innerHTML = ""; // Clear previous content

    if (!recipes || recipes.length === 0) {
      container.innerHTML = `<p class="no-favorites">No favorites yet.<br><br><em>Browse to Store, Organize, and Share the Joy!</em></p>`;
      return;
    }

    recipes.forEach(recipe => {
      const card = document.createElement("recipe-card");
      card.setAttribute("readonly", "true"); // new line to mark as readonly

      card.data = recipe;
      container.appendChild(card);
    });
  }

  /**
   * 
   * @returns a cart summary of the number of items they have in the cart
   */
  function renderCartSummary() {
    const list = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("cart-total");

    if (!cart || cart.length === 0) {
      list.innerHTML = "<li>Your cart is empty.</li>";
      totalDisplay.textContent = `Total Items: 0`;
      return;
    }

    let total = cart.length;
    list.innerHTML = "";

    // Shows only first 10 items
    const previewItems = cart.slice(0, 10);
    previewItems.forEach(item => {
      list.innerHTML += `<li><span>${item.name}</span></li>`;
    });

    //If more than 10, show "click cart" message
    if (cart.length > 10) {
      list.innerHTML += `<li><em>More items in cart. Click <a href="../shoppingCart/shopping.html">cart</a> to view all.</em></li>`;
    }

    totalDisplay.textContent = `Total Saved Items: ${total}`;
  }

  window.addEventListener('recipesUpdated', () => {
    console.log('Updating favorites on homepage');


    // Get updated recipes and filter favorites
    const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const updatedFavorites = allRecipes.filter(r => r.favorite);

    renderFavoriteCards(updatedFavorites);
  });


  //search bar functionality – redirects to my-recipes.html with query
  const searchInput = document.getElementById('search-field-small');
  const searchButton = document.querySelector('[type="submit"]');

  /**
   * HandleSearch handles search requests to self page from desktop
   */
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query !== '') {
      localStorage.setItem('searchQuery', query);
      window.location.href = '../RecipeCard/my-recipes.html';
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

  /**
   * handleMobileSearch handles search requests to self page from mobile screen
   */
  function handleMobileSearch() {
    const query = mobileSearchInput.value.trim();
    if (query !== '') {
      localStorage.setItem('searchQuery', query);
      window.location.href = '../RecipeCard/my-recipes.html';
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

  //calling other functions like cart summary and favorite sections to be called
  renderCartSummary();
  renderFavoriteCards(favoriteRecipes);
});
