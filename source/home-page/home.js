/* Local storage for calendarly daily meals (coordinate for the day) 
like various local storages but also can be an array of recipes array of 365 days? */
const meals = JSON.parse(localStorage.getItem("todaysMeals")) || {
    breakfast: "Avocado Toast with Eggs",
    lunch: "",
    dinner: "Spaghetti Bolognese"
};

//
const cart = JSON.parse(localStorage.getItem("userCart")) || [
    { name: "Eggs", price: 3.50 },
    { name: "Avocados", price: 2.00 },
    { name: "Pasta", price: 1.25 },
    { name: "Ground Beef", price: 5.00 }
];

//
const favorites = JSON.parse(localStorage.getItem("favoritedRecipes")) || [
    {
      name: "Pesto Pasta",
      image: "https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2022/06/broccoli-pesto-pasta-800x1200.jpg",
      tags: ["vegetarian", "quick"]
    },
    {
      name: "Grilled Salmon",
      image: "https://www.thecookierookie.com/wp-content/uploads/2023/05/featured-grilled-salmon-recipe.jpg",
      tags: ["healthy"]
    },
    {
      name: "Fruit Smoothie",
      image: "https://lilluna.com/wp-content/uploads/2022/10/fruit-smoothie-resize-14.jpg",
      tags: ["breakfast", "refreshing"]
    },
    {
      name: "Veggie Tacos",
      image: "https://www.wellplated.com/wp-content/uploads/2021/04/Tasty-Vegetarian-Tacos.jpg",
      tags: ["spicy", "vegan"]
    },
    {
      name: "Chocolate Cake",
      image: "https://stylesweet.com/wp-content/uploads/2022/06/ChocolateCakeForTwo_Featured.jpg",
      tags: ["dessert"]
    }
];

/**
 * 
 * @param {*} id 
 * @param {*} mealName 
 * @param {*} item 
 */
function updateMealCard(id, mealName, item) {
    const section = document.getElementById(id);
    section.innerHTML = `
        <h2>${mealName}</h2>
        <p>${item
            ? `You have scheduled: <br>${item}`
            : `No ${mealName.toLowerCase()} scheduled.<br>Plan something delicious!`}</p>
        `;
}

/**
 * 
 * @returns 
 */
function renderFavorites() {
    const container = document.getElementById("favorites-list");
    if (favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    container.innerHTML = favorites.map(recipe => `
        <div class="favorite-card">
        <img src="${recipe.image}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <div class="tags">${recipe.tags.join(', ')}</div>
        </div>
        `).join('');
}

/**
* 
* @returns 
*/
function renderCartSummary() {
    const list = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("cart-total");

    if (cart.length === 0) {
        list.innerHTML = "<li>Your cart is empty.</li>";
        totalDisplay.textContent = "";
        return;
    }

    let total = 0;
    list.innerHTML = "";
    cart.forEach(item => {
        total += item.price;
        list.innerHTML += `<li><span>${item.name}</span><span>$${item.price.toFixed(2)}</span></li>`;
    });

    totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

  
updateMealCard("breakfast", "Breakfast", meals.breakfast);
updateMealCard("lunch", "Lunch", meals.lunch);
updateMealCard("dinner", "Dinner", meals.dinner);
renderCartSummary();
renderFavorites();