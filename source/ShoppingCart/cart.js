// source/ShoppingCart/cart.js

export class Cart {
  static _key = 'recipeCart';

  /**
   * Read the cart array from localStorage (or fallback to empty array).
   * @returns {Array<{name: string, qty: number, unit: string}>} Parsed cart array
   */
  static _read() {
    let raw = '[]';
    // Guard for environments without localStorage
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      raw = localStorage.getItem(this._key) || '[]';
    }
    return JSON.parse(raw);
  }

  /**
   * Write the cart array back to localStorage and emit a cart:update event.
   * @param {Array<{name: string, qty: number, unit: string}>} cartArray - Array to persist
   * @returns {void}
   */
  static _write(cartArray) {
    // Guard for environments without localStorage
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(this._key, JSON.stringify(cartArray));
    }
    document.dispatchEvent(
      new CustomEvent('cart:update', { detail: cartArray })
    );
  }

  /**
   * Add a "recipe" (list of ingredients) to the cart.
   * Each ingredient object must have { name, qty, unit }.
   * Uses 'name' as the unique key and skips duplicates.
   * @param {{ ingredients: Array<{name: string, qty: number, unit: string}> }} recipe - Recipe data
   * @returns {void}
   */
  static addRecipe(recipe) {
    const cart = this._read();
    recipe.ingredients.forEach(ing => {
      if (!cart.some(item => item.name === ing.name)) {
        cart.push({ name: ing.name, qty: ing.qty, unit: ing.unit });
      }
    });
    this._write(cart);
  }

  /**
   * Remove a single ingredient from the cart by its name.
   * @param {string} ingredientName - The name of the ingredient to remove
   * @returns {void}
   */
  static removeByName(ingredientName) {
    const filtered = this._read().filter(item => item.name !== ingredientName);
    this._write(filtered);
  }

  /**
   * Completely clear the cart from localStorage and emit an update event.
   * @returns {void}
   */
  static clear() {
    // Guard for environments without localStorage
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(this._key);
    }
    document.dispatchEvent(new Event('cart:update'));
  }

  /**
   * List all items in the cart.
   * @returns {Array<{name: string, qty: number, unit: string}>} Current cart contents
   */
  static list() {
    return this._read();
  }
}
