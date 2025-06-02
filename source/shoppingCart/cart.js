// /source/shoppingCart/cart.js
// This helper fully manages the cart data in localStorage and emits "cart:update" events.

export class Cart {
  static _key = 'recipeCart';

  // Read & parse the JSON array from localStorage (or [] if none)
  static _read() {
    return JSON.parse(localStorage.getItem(this._key) || '[]');
  }

  // Write the updated array & emit update event
  static _write(cart) {
    localStorage.setItem(this._key, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('cart:update', { detail: cart }));
  }

  /** Adds all ingredients from a recipe to the cart, deduping by `id` */
  static addRecipe(recipe) {
    const cart = this._read();
    recipe.ingredients.forEach(({ id, name, qty, unit }) => {
      // Only push if not already present
      if (!cart.some((item) => item.id === id)) {
        // Store exactly { id, name, qty, unit }
        cart.push({ id, name, qty, unit });
      }
    });
    this._write(cart);
  }

  /** Remove a single ingredient (by its id) */
  static remove(id) {
    this._write(this._read().filter((item) => item.id !== id));
  }

  /** Clear the entire cart */
  static clear() {
    localStorage.removeItem(this._key);
    document.dispatchEvent(new Event('cart:update'));
  }

  /** Return the current array of items in the cart */
  static list() {
    return this._read();
  }
}
