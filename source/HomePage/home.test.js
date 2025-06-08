import {expect, test, jest} from '@jest/globals';


describe('Homepage Meal Planner Logic', () => {
  beforeEach(() => {
    // Mock basic DOM structure
    document.body.innerHTML = `
      <div id="breakfast"></div>
      <div id="lunch"></div>
      <div id="dinner"></div>
      <ul id="cart-items"></ul>
      <p id="cart-total"></p>
      <div id="favorites-list"></div>
      <input id="search-field-small" />
      <button type="submit"></button>
      <input id="search-field-mobile" />
      <button id="search-button-mobile"></button>
    `;

    // Clear localStorage
    localStorage.clear();
  });

  test('categorizes meals correctly into breakfast, lunch, dinner', () => {
    const today = new Date().toLocaleDateString("en-CA");
    localStorage.setItem(`${today} 06:30`, JSON.stringify([{name: "Eggs", author: "Jay"}]));
    localStorage.setItem(`${today} 13:00`, JSON.stringify([{name: "Salad", author: "Ann"}]));
    localStorage.setItem(`${today} 18:00`, JSON.stringify([{name: "Pasta", author: "Joe"}]));

    const keys = Object.keys(localStorage);
    const breakfast = [];
    const lunch = [];
    const dinner = [];

    for (const key of keys) {
      const timePart = key.split(" ")[1];
      const hour = parseInt(timePart.split(":"[0]));
      const meal = JSON.parse(localStorage.getItem(key));
      if (hour >= 5 && hour < 12) breakfast.push({meal, timePart});
      else if (hour >= 12 && hour < 16) lunch.push({meal, timePart});
      else if (hour >= 16 && hour <= 23) dinner.push({meal, timePart});
    }

    expect(breakfast.length).toBe(1);
    expect(lunch.length).toBe(1);
    expect(dinner.length).toBe(1);
  });

  test('search input saves query to localStorage and triggers redirect', () => {
    const input = document.getElementById('search-field-small');
    const button = document.querySelector('[type="submit"]');
    input.value = 'pasta';

    // Mock window.location
    delete window.location;
    window.location = { href: '' };

    button.click();

    expect(localStorage.getItem('searchQuery')).toBe('pasta');
    expect(window.location.href).toBe('../RecipeCard/my-recipes.html');
  });

  test('renders empty cart correctly', () => {
    localStorage.setItem("recipeCart", JSON.stringify([]));
    renderCartSummary();

    const list = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");

    expect(list.innerHTML).toContain("Your cart is empty.");
    expect(total.textContent).toBe("Total Items: 0");
  });
});
