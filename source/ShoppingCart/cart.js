// source/ShoppingCart/cart.js

export class Cart {
  static _key = 'recipeCart';

  /**
   * Read the cart array from localStorage (or fallback to empty array)
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
   * Write the cart array back to localStorage and emit a cart:update event
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
   * Each ingredient must have { name, qty, unit }.
   * We use 'name' as the unique key. Skips duplicates.
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
   */
  static removeByName(ingredientName) {
    const filtered = this._read().filter(item => item.name !== ingredientName);
    this._write(filtered);
  }

  /**
   * Completely clear the cart.
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
   * Returns an array of { name, qty, unit }.
   */
  static list() {
    return this._read();
  }
}
