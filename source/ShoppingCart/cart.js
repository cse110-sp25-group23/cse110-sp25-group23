// /source/shoppingCart/cart.js

export class Cart {
  static _key = 'recipeCart';

  // Read the cart array from localStorage (or empty array)
  static _read() {
    return JSON.parse(localStorage.getItem(this._key) || '[]');
  }

  // Write the cart array back to localStorage and emit an event
  static _write(cartArray) {
    localStorage.setItem(this._key, JSON.stringify(cartArray));
    document.dispatchEvent(new CustomEvent('cart:update', { detail: cartArray }));
  }

  /**
   * Add a “recipe” (list of ingredients) to the cart.
   * Each ingredient must have { name, qty, unit }.  We use `name` as the unique key.
   * If an ingredient with the same name is already in the cart, we skip it.
   */
  static addRecipe(recipe) {
    // recipe.ingredients is [ { name, qty, unit }, … ]
    const cart = this._read();
    recipe.ingredients.forEach(ing => {
      // only push if no existing item has the same name
      if (!cart.some(item => item.name === ing.name)) {
        cart.push({
          name: ing.name,
          qty: ing.qty,
          unit: ing.unit
        });
      }
    });
    this._write(cart);
  }

  /**
   * Remove a single ingredient from the cart by its name.
   */
  static removeByName(ingredientName) {
    const cart = this._read().filter(item => item.name !== ingredientName);
    this._write(cart);
  }

  /**
   * Completely clear the cart.
   */
  static clear() {
    localStorage.removeItem(this._key);
    document.dispatchEvent(new Event('cart:update'));
  }

  /**
   * List all items in the cart.
   * Returns an array of { name, qty, unit }.
   */
  static list() {
    return this._read();
  }
}