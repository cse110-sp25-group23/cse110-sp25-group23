/**
 * Custom element that displays and manages a recipe card
 * Allows for rendering, editing and the deletion of a recipe
 * stored locally.
 */
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    /**
     * Sets and renders the content for the recipe card
     * @param {Object} recipeData - Data for recipe
     */
    set data(recipeData) {
        if (!recipeData) return;
        this._data = recipeData;

        // Create content inside the shadow DOM
        this.shadowRoot.innerHTML = `
            <h2>${recipeData.name}</h2>
            <p>Author: ${recipeData.author}</p>
            <img src="${recipeData.image}" alt="${recipeData.name}" style="width:100px;height:auto;">
            <p>Tags: </p>
            <ul>
                ${recipeData.tags.map(tag => `<li>${tag}</li>`).join('')}
            </ul>
            <p>Ingredients: ${recipeData.ingredients}</p>
            <p>Steps: ${recipeData.steps}</p>
            <button class='delete-btn'>Delete</button>
        `;

        // Initialize delete and update logic
        delete_card(this.shadowRoot, this);
        update_card(this.shadowRoot, this, recipeData);
    }
}

// Define the custom recipe card element
customElements.define('recipe-card', RecipeCard);

/**
 * Allows for users to edit/update recipe card through an edit 
 * and save button
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

        // Build UI for editing predefined and custom tags
        const tagInputs = predefinedTags.map(tag => `
            <label>
                <input type="checkbox" class="edit-tag-checkbox" value="${tag}" ${predefinedSelectedTags.includes(tag) ? 'checked' : ''}>${tag}
            </label><br>
        `).join('');

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
 * Allows users to delete a recipe card 
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
 * Takes an array of recipes and renders <recipe-card> elements to <main>
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

/**
 * Saves recipes array to localStorage
 */
function saveRecipesToStorage(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// === 🍽️ Meal Builder by Tag ===

/**
 * On load: show all recipes + meals
 */
window.addEventListener('DOMContentLoaded', () => {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    addRecipesToDocument(recipes);
    displayMeals();
});

/**
 * Tag-based meal creation: saves tag reference only
 */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('create-meal-from-tag-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const tag = document.getElementById('tag-input').value.trim().toLowerCase();
        const mealName = document.getElementById('meal-name').value.trim();
        if (!tag || !mealName) return alert("Please enter both a tag and a meal name.");

        const meals = JSON.parse(localStorage.getItem('meals')) || {};
        meals[mealName] = tag;  // Save the tag only
        localStorage.setItem('meals', JSON.stringify(meals));
        displayMeals();
    });
});

/**
 * Displays all meal buttons; clicking filters recipes by associated tag
 */
function displayMeals() {
    const container = document.getElementById('meal-list');
    const meals = JSON.parse(localStorage.getItem('meals')) || {};
    container.innerHTML = '';

    for (const name in meals) {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '5px';

        // Meal View Button
        const viewBtn = document.createElement('button');
        viewBtn.textContent = name;
        viewBtn.addEventListener('click', () => {
            const tag = meals[name].toLowerCase();
            const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const filtered = recipes.filter(r =>
                r.tags.some(t => t.toLowerCase() === tag)
            );
            addRecipesToDocument(filtered);
        });

        // 🗑️ Delete Button
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
document.addEventListener('DOMContentLoaded', () => {
    const showAllBtn = document.getElementById('show-all-btn');
    if (!showAllBtn) return;

    showAllBtn.addEventListener('click', () => {
        const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        addRecipesToDocument(allRecipes);
    });
});

