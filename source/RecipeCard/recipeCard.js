// /source/RecipeCard/recipeCard.js

/**
 * Custom element that displays and manages a recipe card
 * Allows for rendering, editing and the deletion of a recipe
 * stored locally.
 */
import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';
import { getRecipeCardTemplateCSS } from './recipeCardTemplateCSS.js';

// Import the existing Cart helper from your shoppingCart folder
import { Cart } from '../shoppingCart/cart.js';

export class RecipeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Sets and renders the content for the recipe card
   * @param {Object} recipeData - Data for recipe
   *    Expected shape:
   *    {
   *      id: string,
   *      name: string,
   *      author: string,
   *      image: string,
   *      ingredients: [ { name: string, unit: string }, ... ],
   *      tags: [ string, ... ],
   *      steps: [ string, ... ],
   *      timeEstimate: string
   *    }
   */
  set data(recipeData) {
    if (!recipeData) return;
    this._data = recipeData;

    const style = document.createElement('style');
    style.textContent = getRecipeCardTemplateCSS();
    this.shadowRoot.appendChild(style);

    const container = document.createElement('div');
    container.classList.add('card-container');

    const ingredientListItems = recipeData.ingredients
      .map(
        ing =>
          `<li>${ing.name}${ing.unit ? ' – ' + ing.unit : ''}</li>`
      )
      .join('');

    container.innerHTML = `
      <div class="flip-card">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${recipeData.image}" alt="${recipeData.name}"
                 style="width:200px;height:200px;" class="recipe-image" />
            <h3>${recipeData.name}</h3>
            <p>Author: ${recipeData.author}</p>
            <div class="ingredients-class">
              <p>Ingredients:</p>
              <ul>
                ${ingredientListItems}
              </ul>
            </div>

            <!-- INSERTED “Buy ingredients” button -->
            <button class="buy-ingredients-btn">Buy ingredients</button>

            <!-- —— NEW: “Add to cart” button (no redirect) —— -->
            <button class="add-to-cart-btn">Add to cart</button>

            <div class="tags-class">
              <p>Tags:</p>
              ${recipeData.tags
                .map(tag => `<span class="tag">${tag}</span>`)
                .join('')}
            </div>
          </div>

          <div class="flip-card-back">
            <div class="steps-class">
              <p>Steps:</p>
              <ol>
                ${recipeData.steps
                  .map(step => `<li>${step}</li>`)
                  .join('')}
              </ol>
            </div>
            <p>Time Estimate: ${recipeData.timeEstimate}</p>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.appendChild(container);

    // —— EXISTING “Buy ingredients” button logic —— //
    const buyBtn = container.querySelector('.buy-ingredients-btn');
    buyBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Build a “mini‐recipe” object exactly how Cart.addRecipe expects:
      const miniRecipe = {
        id: `cart-${recipeData.id}`,
        ingredients: recipeData.ingredients.map(ing => ({
          id: `${recipeData.id}-${ing.name}`, // unique ingredient ID
          name: ing.name,
          qty: ing.qty,
          unit: ing.unit || ''
        }))
      };

      // Push those ingredients into localStorage via your Cart helper
      Cart.addRecipe(miniRecipe);

      // Provide instant UI feedback on the button:
      buyBtn.textContent = '✔ Added';
      buyBtn.disabled = true;
      setTimeout(() => {
        buyBtn.textContent = 'Buy ingredients';
        buyBtn.disabled = false;
      }, 1500);

      // Redirect the user to the shopping cart page
      window.location.href = '../shoppingCart/shopping.html';
    });

    // —— NEW: “Add to cart” button logic (identical to buyBtn except no redirect) —— //
    const addCartBtn = container.querySelector('.add-to-cart-btn');
    addCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Build the same miniRecipe object
      const miniRecipe = {
        id: `cart-${recipeData.id}`,
        ingredients: recipeData.ingredients.map(ing => ({
          id: `${recipeData.id}-${ing.name}`,
          name: ing.name,
          qty: ing.qty,
          unit: ing.unit || ''
        }))
      };

      // Add to Cart
      Cart.addRecipe(miniRecipe);

      // Instant UI feedback on this button only (no redirect)
      addCartBtn.textContent = '✔ In Cart';
      addCartBtn.disabled = true;
      setTimeout(() => {
        addCartBtn.textContent = 'Add to cart';
        addCartBtn.disabled = false;
      }, 1500);
    });

    // 4) Set up the flip‐card toggle (unchanged)
    const flipCard = container.querySelector('.flip-card');
    flipCard.addEventListener('click', () => {
      flipCard.classList.toggle('flipped');
    });

    // 5) Initialize delete and update logic (exactly as before)
    delete_card(this.shadowRoot, this);
    update_card(this.shadowRoot, this, recipeData);
  }
}

// Define the custom recipe card element
customElements.define('recipe-card', RecipeCard);

/**
 * Allows users to delete a recipe card
 * @param {*} shadowRoot  - Shadow DOM of a recipe card
 * @param {*} hostElement - <recipe-card> custom element
 */
function delete_card(shadowRoot, hostElement) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');
  shadowRoot.appendChild(deleteButton);

  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      let recipes = [];
      const recipeString = localStorage.getItem('recipes');
      if (recipeString) {
        recipes = JSON.parse(recipeString);
      }
      const deletedRecipe = hostElement._data;

      recipes = recipes.filter(recipe =>
        !(
          recipe.name === deletedRecipe.name &&
          recipe.author === deletedRecipe.author &&
          JSON.stringify(recipe.ingredients) === JSON.stringify(deletedRecipe.ingredients) &&
          JSON.stringify(recipe.steps) === JSON.stringify(deletedRecipe.steps)
        )
      );

      localStorage.setItem('recipes', JSON.stringify(recipes));
      hostElement.remove();
    });
  }
}

/**
 * Allows users to edit/update a recipe card through an Edit–and–Save button
 * @param {*} shadowRoot  - Shadow DOM of the recipe card
 * @param {*} hostElement - <recipe-card> custom element
 * @param {*} recipeData  - Original data object
 */
function update_card(shadowRoot, hostElement, recipeData) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-btn');
  shadowRoot.appendChild(editButton);

  editButton.addEventListener('click', () => {
    const originalData = { ...recipeData };

    // Predefined tags for convenience
    const predefinedTags = ['Easy', 'Advanced', 'Pro'];
    const originalTags = recipeData.tags;

    // Separate which predefined tags were originally selected
    const predefinedSelectedTags = originalTags.filter(tag => predefinedTags.includes(tag));
    const customTags = originalTags.filter(tag => !predefinedTags.includes(tag));

    // Build HTML for editing predefined tags
    const editPredefinedTags = predefinedTags
      .map(tag => `
        <label>
          <input type="checkbox" class="edit-tag-checkbox" value="${tag}"
            ${predefinedSelectedTags.includes(tag) ? 'checked' : ''}>
          ${tag}
        </label><br>
      `)
      .join('');

    // Build HTML for editing custom tags
    const editCustomTags = `
      <label>
        Custom Tags: 
        <input type="text" class="edit-custom-tags" value="${customTags.join(', ')}" />
      </label>
    `;

    // Replace the card’s shadow DOM with an edit form
    shadowRoot.innerHTML = `
      <label>
        Name: <input type="text" value="${originalData.name}" class="edit-name"></label><br>
      <label>
        Author: <input type="text" value="${originalData.author}" class="edit-author"></label><br>
      <label>
        Image URL: <input type="text" value="${originalData.image}" class="edit-image"></label><br>
      <label>
        Time Estimate: <input type="text" value="${originalData.timeEstimate || ''}" class="edit-time"></label><br>

      <fieldset>
        <legend>Tags:</legend>
        ${editPredefinedTags}
        ${editCustomTags}
      </fieldset>

      <label>
        Ingredients:
        <textarea class ="edit-ingredients" cols="30" placeholder="Format: &#10;Milk – 2 cups">${originalData.ingredients
          .map(i => `${i.name}${i.unit ? ' – ' + i.unit : ''}`)
          .join('\n')}</textarea>
      </label><br>

      <label>
        Steps:
        <textarea class="edit-steps" placeholder="One step per line">${(originalData.steps || []).join('\n')}</textarea>
      </label><br>

      <button class="save-btn">Save</button>
    `;

    const saveButton = shadowRoot.querySelector('.save-btn');
    saveButton.addEventListener('click', () => {
      // 1) Gather updated tag values
      const checkedTags = [];
      shadowRoot.querySelectorAll('.edit-tag-checkbox').forEach(checkbox => {
        if (checkbox.checked) {
          checkedTags.push(checkbox.value);
        }
      });

      // 2) Gather updated custom tags
      const editedCustomTags = shadowRoot.querySelector('.edit-custom-tags').value;
      const savedCustomTags = editedCustomTags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

      const allEditedTags = checkedTags.concat(savedCustomTags);

      // 3) Gather updated ingredients (one per line: “Name – Unit”)
      const editedIngredients = shadowRoot.querySelector('.edit-ingredients').value;
      const savedIngredients = editedIngredients
        .split('\n')
        .map(line => {
          const [name, unit] = line.split('–').map(s => s.trim());
          return name ? { name, unit: unit || '' } : null;
        })
        .filter(obj => obj);

      // 4) Gather updated steps (one per line)
      const editedSteps = shadowRoot.querySelector('.edit-steps').value;
      const savedSteps = editedSteps
        .split('\n')
        .map(step => step.trim())
        .filter(step => step.length > 0);

      // 5) Build updated data object
      const updatedData = {
        name: shadowRoot.querySelector('.edit-name').value,
        author: shadowRoot.querySelector('.edit-author').value,
        image: shadowRoot.querySelector('.edit-image').value,
        timeEstimate: shadowRoot.querySelector('.edit-time').value,
        tags: allEditedTags,
        ingredients: savedIngredients,
        steps: savedSteps
      };

      // 6) Detect if anything actually changed
      let hasChanges = false;
      const finalData = { ...originalData };
      for (const key in updatedData) {
        if (
          Array.isArray(updatedData[key])
            ? JSON.stringify(updatedData[key]) !== JSON.stringify(originalData[key])
            : updatedData[key] !== originalData[key]
        ) {
          finalData[key] = updatedData[key];
          hasChanges = true;
        }
      }

      // 7) Re‐render back into normal mode
      shadowRoot.innerHTML = '';
      if (hasChanges) {
        hostElement.data = finalData;
      } else {
        hostElement.data = originalData;
      }

      // 8) Persist to localStorage if changed
      if (hasChanges) {
        let localRecipes = getRecipesFromStorage();
        const index = localRecipes.findIndex(r => r.id === originalData.id);
        if (index !== -1) {
          localRecipes[index] = finalData;
          saveRecipesToStorage(localRecipes);
        }
      }
    });
  });
}
