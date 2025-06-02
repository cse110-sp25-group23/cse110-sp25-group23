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
      <label>Image: <input type="file" accept="image/*" class="edit-image"></label><br>
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

/** state for editing the meal cards */
let editingMealName = null;
let originalSelectedRecipes = [];

const saveMealBtn = document.getElementById('save-meal-btn')
const mealNameInput = document.getElementById('meal-name');
const creatorDiv = document.getElementById('meal-creator');
const saveEditsBtn = document.getElementById('save-edits-btn');
const sizeDropdown = document.getElementById('serving-size-dropdown');
const customSizeInput = document.getElementById('custom-serving-size');

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-meal-btn');
    const saveBtn = document.getElementById('save-meal-btn');

    startBtn.addEventListener('click', () => {

        //block new creation starting when editing
        if(editingMealName !== null) {
            alert("Please finish editing the current meal before creating another one.");
            return;
        }

        creatorDiv.style.display = 'block';
        saveMealBtn.style.display = 'inline-block'
        saveEditsBtn.style.display = 'none'

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
        const sizeDropdown = document.getElementById('serving-size-dropdown');
        const customSizeInput = document.getElementById('custom-serving-size');
        sizeDropdown.addEventListener('change', () => {
            if (sizeDropdown.value === 'custom') {
                customSizeInput.style.display = 'inline-block';
            } else {
                customSizeInput.style.display = 'none';
                customSizeInput.value = '';
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

        let servingSize = sizeDropdown.value;
        if (servingSize === 'custom') {
            servingSize = customSizeInput.value.trim() || 'N/A'
        }
        const meals = JSON.parse(localStorage.getItem('meals')) || {};
        meals[mealName] = {
            recipes: selected,
            serves: servingSize
        }
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

    /**
     * Save edits 
     * Validates and updates newly inputted selections
     */
    saveEditsBtn.addEventListener('click', () => {
        const currentMealName = mealNameInput.value.trim();


        if(!currentMealName) {
            return alert("Please enter a meal name.");
        }

        const recipeCards = document.querySelectorAll('recipe-card');
        const selected = [];

        recipeCards.forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-checkbox');
            if (checkbox && checkbox.checked) {
                selected.push(checkbox.dataset.name);
            }
        });

        if (selected.length === 0){
            return alert("Please select at least one recipe.");
        }


        let servingSize = sizeDropdown.value;
        if (servingSize === 'custom') {
            servingSize = customSizeInput.value.trim();
        }
        if(currentMealName !== editingMealName) {
            mealNameInput.value = currentMealName;
        }

        const originalSet = new Set(originalSelectedRecipes);
        const selectedSet = new Set(selected);

        let selectionUpdated = false;
        
        const isSameSize = originalSet.size === selectedSet.size;
        const hasSameItems = [...selectedSet].every(item => originalSet.has(item))

        selectionUpdated = !(isSameSize && hasSameItems);
        const meals = JSON.parse(localStorage.getItem('meals')) || {};

        if (editingMealName !== currentMealName) {
            delete meals[editingMealName];
        }

        meals[currentMealName] = {
            recipes: selected,
            serves: servingSize
        }
        localStorage.setItem('meals', JSON.stringify(meals));

        // Reset UI
        mealNameInput.value = '';
        creatorDiv.style.display = 'none';
        saveEditsBtn.style.display ='none';
        saveMealBtn.style.display = 'none';
        editingMealName = null;
        originalSelectedRecipes = [];

        const allCards = document.querySelectorAll('recipe-card');
        allCards.forEach(card=> {
            card.classList.remove('selectable');
            const checkboxContainer = card.shadowRoot.querySelector('.card-checkbox-container');
            if (checkboxContainer) {
                checkboxContainer.remove();
            }
            const checkbox = card.shadowRoot.querySelector('.meal-checkbox');
            if(checkbox) {
                checkbox.checked = false;
            }
        });
        
        //refresh UI
        displayMeals();
    }); 

    displayMeals();
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
            const filtered = recipes.filter(r => meals[name].recipes.includes(r.name));
            addRecipesToDocument(filtered);
        });
    
    /**
     * Editing portion for recipe cards
     * loads recipes with checkboxes --> preselects current recipes already in the meal
     */
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.marginLeft = '6px';
        editBtn.addEventListener('click', () => {
            mealNameInput.value = name;
            editingMealName = name;

            const sizeDropdown = document.getElementById('serving-size-dropdown');
            const customSizeInput = document.getElementById('custom-serving-size');

            const updatedMeals = JSON.parse(localStorage.getItem('meals') || {});
            const serves = updatedMeals[name].serves ?? '';
            const dropdownOption = Array.from(sizeDropdown.options).find(opt => opt.value === serves);

            if (dropdownOption) {
                sizeDropdown.value = serves;
                customSizeInput.style.display = 'none';
                customSizeInput.value = '';
            } else {
                sizeDropdown.value = 'custom';
                customSizeInput.style.display = 'inline-block';
                customSizeInput.value = serves;
            }

            const allRecipes = JSON.parse(localStorage.getItem('recipes') || []);
            addRecipesToDocument(allRecipes);

            originalSelectedRecipes = [...updatedMeals[name].recipes];

            const allCards = document.querySelectorAll('recipe-card');
            allCards.forEach(card => {
                card.classList.add('selectable');
                
                const existingWrapper = card.shadowRoot.querySelector('.card-checkbox-container');
                if(existingWrapper) {
                    existingWrapper.remove();
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'card-checkbox-container';
                wrapper.style.textAlign = 'center';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'meal-checkbox';
                checkbox.dataset.name = card._data.name;
                
                checkbox.checked = originalSelectedRecipes.includes(checkbox.dataset.name);

                wrapper.appendChild(checkbox);
                card.shadowRoot.prepend(wrapper);
            
        
            });

            //UI 
            creatorDiv.style.display = 'block';
            saveEditsBtn.style.display = 'inline-block';
            saveMealBtn.style.display = 'none'
            
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
        wrapper.appendChild(editBtn);
        wrapper.appendChild(deleteBtn);
        container.appendChild(wrapper);
        }
}
  

const form = document.getElementById('new-recipe');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('recipeName').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const imageInput = document.getElementById('image');
    const image = imageInput.files[0]
        ? URL.createObjectURL(imageInput.files[0])
        : '';
    const tag = document.getElementById('tagsDropdown').value;
    const customTag = document.getElementById('customTag').value.trim();
    const ingredients = document.getElementById('ingredients').value.trim();
    const steps = document.getElementById('steps').value.trim();

    if (!name || !author || !image || !ingredients || !steps) {
        alert("Please fill out all required fields.");
        return;
    }

    const tags = [];
    if (tag) tags.push(tag);
    if (customTag) tags.push(customTag);

    const newRecipe = {
        name,
        author,
        image,
        tags,
        ingredients,
        steps
    };

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(newRecipe);
    saveRecipesToStorage(recipes);
    addRecipesToDocument(recipes);

    form.reset();
});
