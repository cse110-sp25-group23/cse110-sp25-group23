/**
 * Custom element that displays and manages a recipe card
 */
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    set data(recipeData) {
        if (!recipeData) return;
        this._data = recipeData;

        this.shadowRoot.innerHTML = `
      <h2>${recipeData.name}</h2>
      <p>Author: ${recipeData.author}</p>
      <img src="${recipeData.image}" alt="${recipeData.name}" style="width:100px;height:auto;">
      <p>Tags:</p>
      <ul>${recipeData.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
      <p>Ingredients: ${recipeData.ingredients}</p>
      <p>Steps: ${recipeData.steps}</p>
      <button class='delete-btn'>Delete</button>
    `;

        delete_card(this.shadowRoot, this);
        update_card(this.shadowRoot, this, recipeData);
    }
}

customElements.define('recipe-card', RecipeCard);

/**
 * Enables editing a recipe card
 */
function update_card(shadowRoot, hostElement, recipeData) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    shadowRoot.appendChild(editButton);

    editButton.addEventListener('click', () => {
        const originalData = { ...recipeData };
        const predefinedTags = ["Easy", "Advanced", "Pro"];
        const predefinedSelectedTags = originalData.tags.filter(t => predefinedTags.includes(t));
        const customTags = originalData.tags.filter(t => !predefinedTags.includes(t));

        const tagInputs = predefinedTags.map(tag => `
      <label>
        <input type="checkbox" class="edit-tag-checkbox" value="${tag}" ${predefinedSelectedTags.includes(tag) ? 'checked' : ''}>${tag}
      </label><br>`).join('');

        shadowRoot.innerHTML = `
      <label>Name: <input type="text" value="${originalData.name}" class="edit-name"></label><br>
      <label>Author: <input type="text" value="${originalData.author}" class="edit-author"></label><br>
      <label>Image: <input type="text" value="${originalData.image}" class="edit-image"></label><br>
      <fieldset>
        <legend>Tags:</legend>
        ${tagInputs}
        <label>Custom Tags: <input type="text" class="edit-custom-tags" value="${customTags.join(', ')}"></label>
      </fieldset>
      <label>Ingredients: <textarea class="edit-ingredients">${originalData.ingredients}</textarea></label><br>
      <label>Recipe: <textarea class="edit-recipe">${originalData.recipe}</textarea></label><br>
      <button class="save-btn">Save</button>
    `;

        shadowRoot.querySelector('.save-btn').addEventListener('click', () => {
            const checkedTags = [...shadowRoot.querySelectorAll('.edit-tag-checkbox')]
                .filter(c => c.checked).map(c => c.value);
            const customTags = shadowRoot.querySelector('.edit-custom-tags').value
                .split(',').map(t => t.trim()).filter(Boolean);
            const updatedData = {
                name: shadowRoot.querySelector('.edit-name').value,
                author: shadowRoot.querySelector('.edit-author').value,
                image: shadowRoot.querySelector('.edit-image').value,
                tags: checkedTags.concat(customTags),
                ingredients: shadowRoot.querySelector('.edit-ingredients').value,
                recipe: shadowRoot.querySelector('.edit-recipe').value
            };

            const finalData = { ...originalData };
            let hasChanges = false;
            for (const key in updatedData) {
                if (updatedData[key] !== originalData[key]) {
                    finalData[key] = updatedData[key];
                    hasChanges = true;
                }
            }

            if (hasChanges) {
                hostElement.data = finalData;
                let all = JSON.parse(localStorage.getItem('recipes')) || [];
                const index = all.findIndex(r => JSON.stringify(r) === JSON.stringify(originalData));
                if (index !== -1) {
                    all[index] = finalData;
                    saveRecipesToStorage(all);
                }
            } else {
                hostElement.data = originalData;
            }
        });
    });
}

/**
 * Delete logic for recipe card
 */
function delete_card(shadowRoot, hostElement) {
    const deleteButton = shadowRoot.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const deleted = hostElement._data;
        recipes = recipes.filter(recipe =>
            !(recipe.name === deleted.name &&
                recipe.author === deleted.author &&
                recipe.ingredients === deleted.ingredients &&
                recipe.steps === deleted.steps)
        );
        localStorage.setItem('recipes', JSON.stringify(recipes));
        hostElement.remove();
    });
}

/**
 * Render all recipes to <main>
 */
function addRecipesToDocument(recipes) {
    const container = document.querySelector('main');
    container.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('recipe-card');
        card.data = recipe;
        container.appendChild(card);
    });
}

function saveRecipesToStorage(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Initial load: render everything
 */
window.addEventListener('DOMContentLoaded', () => {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    addRecipesToDocument(recipes);
    displayMeals();
});

/**
 * Show all recipes button
 */
document.addEventListener('DOMContentLoaded', () => {
    const showAllBtn = document.getElementById('show-all-btn');
    if (!showAllBtn) return;

    showAllBtn.addEventListener('click', () => {
        const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        addRecipesToDocument(allRecipes);
    });
});

/**
 * Start meal creation — make existing cards selectable
 */
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-meal-btn');
    const saveBtn = document.getElementById('save-meal-btn');
    const mealNameInput = document.getElementById('meal-name');
    const creatorDiv = document.getElementById('meal-creator');

    startBtn.addEventListener('click', () => {
        creatorDiv.style.display = 'block';

        const allCards = document.querySelectorAll('recipe-card');
        allCards.forEach((card, index) => {
            card.classList.add('selectable');

            // Only add checkbox if not already added
            if (!card.shadowRoot.querySelector('.meal-checkbox')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'card-checkbox-container';
                wrapper.style.textAlign = 'center';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'meal-checkbox';
                checkbox.dataset.name = card._data.name;

                wrapper.appendChild(checkbox);
                card.shadowRoot.prepend(wrapper);
            }
        });
    });

    saveBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        if (!mealName) return alert("Please enter a meal name.");

        const recipeCards = document.querySelectorAll('recipe-card');
        const selected = [];

        recipeCards.forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-checkbox');
            if (checkbox && checkbox.checked) {
                selected.push(checkbox.dataset.name);
            }
        });

        if (selected.length === 0) return alert("Please select at least one recipe.");

        const meals = JSON.parse(localStorage.getItem('meals')) || {};
        meals[mealName] = selected;
        localStorage.setItem('meals', JSON.stringify(meals));

        // Reset UI
        mealNameInput.value = '';
        creatorDiv.style.display = 'none';

        const allCards = document.querySelectorAll('recipe-card');
        allCards.forEach(card => {
            card.classList.remove('selectable');
            const checkboxContainer = card.shadowRoot.querySelector('.card-checkbox-container');
            if (checkboxContainer) checkboxContainer.remove();
        });

        displayMeals();
    });
});

/**
 * Render all meals and attach event listeners
 */
function displayMeals() {
    const container = document.getElementById('meal-list');
    const meals = JSON.parse(localStorage.getItem('meals')) || {};
    container.innerHTML = '';

    for (const name in meals) {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '5px';

        const viewBtn = document.createElement('button');
        viewBtn.textContent = name;
        viewBtn.addEventListener('click', () => {
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const filtered = recipes.filter(r => meals[name].includes(r.name));
            addRecipesToDocument(filtered);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.marginLeft = '6px';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete meal "${name}"?`)) {
                delete meals[name];
                localStorage.setItem('meals', JSON.stringify(meals));
                displayMeals();
            }
        });

        wrapper.appendChild(viewBtn);
        wrapper.appendChild(deleteBtn);
        container.appendChild(wrapper);
    }
}
