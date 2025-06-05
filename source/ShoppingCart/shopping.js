import { Cart } from './cart.js';

const ul = document.getElementById('cart');

/**
 * Renders all items in the cart.
 * If qty ≤ 1 or unit is missing, fall back to just the name.
 * Only quantities greater than 1 will show the number.
 */
function render() {
  ul.innerHTML = ''; // Clear existing list

  Cart.list().forEach((item) => {
    const { name, qty, unit } = item;

    const li = document.createElement('li');
    // Now we store the ingredient’s name in data-name only
    li.dataset.name = name;

    // Only show quantity if > 1
    const safeQty = (qty !== undefined && qty > 1) ? qty : '';
    const safeUnit = safeQty ? (unit || '') : '';
    const displayText = safeQty
      ? `${safeQty} ${safeUnit} ${name}`
      : (name || '(no name)');

    li.innerHTML = `
      <span class="item-name">${displayText}</span>
      <div class="item-buttons">
        <button class="buy-item">Buy now</button>
        <button class="remove">Remove</button>
      </div>
    `;
    ul.append(li);
  });
}

// Delegate clicks inside the UL
ul.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  // 1) Remove single item
  if (e.target.matches('.remove')) {
    const ingredientName = li.dataset.name;
    Cart.removeByName(ingredientName);
    return;
  }

  // 2) Buy this single item on Instacart
  if (e.target.matches('.buy-item')) {
    const rawName = li.dataset.name;
    const query = encodeURIComponent(rawName.trim());
    window.location.href = `https://www.instacart.com/store/s?k=${query}`;
  }
});

// Clear entire cart
document.getElementById('clear').addEventListener('click', () => {
  Cart.clear();
});


// Prevents reloading page if already on the said page
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(event) {
    const current = window.location.pathname;
    const target = new URL(this.href).pathname;

    if (current === target) {
      event.preventDefault();
      console.log('You are already on this tab.');
    }
  });
});

// Re-render whenever cart changes
document.addEventListener('cart:update', render);
render(); // initial paint
