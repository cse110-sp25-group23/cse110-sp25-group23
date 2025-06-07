import { getRecipesFromStorage, saveRecipesToStorage, addRecipesToDocument } from '../LocalStorage/storage.js';

window.addEventListener('DOMContentLoaded', () => {
    const createMealBtn = document.getElementById('create-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const mealNameInput = document.getElementById('meal-name-input');
    const saveMealBtn = document.getElementById('save-meal-btn');

    createMealBtn.addEventListener('click', () => {
        // Show meal form
        mealControls.style.display = 'block';
        mealNameInput.value = '';

        // ✅ Clear any previewed meal cards
        document.getElementById('meal-cards-display').innerHTML = '';

        // Remove any existing checkboxes first
        document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

        // Add checkboxes directly into live cards
        const cards = document.querySelectorAll('recipe-card');

        cards.forEach((card, index) => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('card-checkbox-wrapper');
            checkboxWrapper.style.position = 'absolute';
            checkboxWrapper.style.top = '5px';
            checkboxWrapper.style.left = '5px';
            checkboxWrapper.style.zIndex = '1000';
            checkboxWrapper.style.backgroundColor = 'white';
            checkboxWrapper.style.padding = '2px';
            checkboxWrapper.style.borderRadius = '4px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('meal-select-checkbox');
            checkbox.dataset.createdAt = card._data.createdAt;

            checkboxWrapper.appendChild(checkbox);
            const container = card.shadowRoot.querySelector('.card-container');
            container.style.position = 'relative';
            container.insertBefore(checkboxWrapper, container.firstChild);
        });
    });


    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        if (!mealName) {
            alert('Please enter a meal name');
            return;
        }

        const checkboxes = document.querySelectorAll('recipe-card');
        const selectedCreatedAts = [];
        checkboxes.forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');
            if (checkbox && checkbox.checked) {
                selectedCreatedAts.push(checkbox.dataset.createdAt);
            }
        });


        if (selectedCreatedAts.length === 0) {
            alert('Please select at least one recipe');
            return;
        }

        const allRecipes = getRecipesFromStorage();

        allRecipes.forEach(recipe => {
            if (selectedCreatedAts.includes(recipe.createdAt)) {
                const tags = recipe.tags || [];
                if (!tags.includes(mealName)) {
                    tags.push(mealName);
                }
                recipe.tags = tags;
            }
        });


        saveRecipesToStorage(allRecipes);
        renderMealList(); // Update the list of created meals
        // ✅ Update visible cards' data to show new tags
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(allRecipes);


        document.getElementById('meal-controls').style.display = 'none';

        // ✅ OPTIONAL: clear the selection grid if you're using it
        const selectionGrid = document.getElementById('meal-selection-cards');
        if (selectionGrid) selectionGrid.innerHTML = '';


        document.querySelectorAll('recipe-card').forEach(card => {
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (box) box.remove();
        });



    });

    // ✅ Load saved recipes and render meals on page load
    const recipes = getRecipesFromStorage();
    document.querySelector('main').innerHTML = ''; // ✅ Clear old cards
    addRecipesToDocument(recipes);  // Renders <recipe-card> elements
    renderMealList();               // Renders meal buttons
});

function renderMealList() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';

    const allRecipes = getRecipesFromStorage();
    const mealNames = new Set();

    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                mealNames.add(tag);
            }
        });
    });

    mealNames.forEach(meal => {
        const li = document.createElement('li');

        const viewBtn = document.createElement('button');
        viewBtn.textContent = meal;
        viewBtn.className = 'meal-view-btn';
        viewBtn.addEventListener('click', () => showMealPreview(meal));
        li.appendChild(viewBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'meal-edit-btn';
        editBtn.addEventListener('click', () => startEditMeal(meal, editBtn));
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'meal-delete-btn';
        deleteBtn.addEventListener('click', () => {
            // Remove meal tag from recipes
            const updated = getRecipesFromStorage().map(recipe => {
                const tags = (recipe.tags || []).filter(tag => tag !== meal);
                return { ...recipe, tags };
            });

            // Save and update
            saveRecipesToStorage(updated);
            renderMealList();

            // ✅ Re-render main recipe cards to reflect tag removal immediately
            document.querySelector('main').innerHTML = '';
            addRecipesToDocument(updated);

            // Clear meal preview if it was showing this meal
            document.getElementById('meal-cards-display').innerHTML = '';
        });

        li.appendChild(deleteBtn);

        mealList.appendChild(li);
    });
}


function showMealPreview(mealName) {
    const display = document.getElementById('meal-cards-display');
    display.innerHTML = '';

    const allRecipes = getRecipesFromStorage();
    const mealRecipes = allRecipes.filter(r => r.tags && r.tags.includes(mealName));

    mealRecipes.forEach(recipe => {
        const recipeCard = document.createElement('recipe-card');
        recipeCard.data = recipe;
        display.appendChild(recipeCard);
    });
}

function startEditMeal(mealName, editBtn) {
    const cards = document.querySelectorAll('recipe-card');
    document.getElementById('meal-controls').style.display = 'none';
    document.getElementById('meal-cards-display').innerHTML = '';
    document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

    // Only create one save button
    let saveChangesBtn = editBtn.nextElementSibling;
    if (!saveChangesBtn || !saveChangesBtn.classList.contains('save-edit-btn')) {
        saveChangesBtn = document.createElement('button');
        saveChangesBtn.textContent = 'Save changes';
        saveChangesBtn.className = 'save-edit-btn';
        editBtn.insertAdjacentElement('afterend', saveChangesBtn);
    }

    const allRecipes = getRecipesFromStorage();

    cards.forEach(card => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('card-checkbox-wrapper');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('meal-select-checkbox');
        checkbox.dataset.createdAt = card._data.createdAt;

        const recipe = allRecipes.find(r => r.createdAt === card._data.createdAt);
        if (recipe?.tags?.includes(mealName)) {
            checkbox.checked = true;
        }

        checkboxWrapper.appendChild(checkbox);

        const container = card.shadowRoot.querySelector('.card-container');
        container.style.position = 'relative';
        container.insertBefore(checkboxWrapper, container.firstChild);
    });


    saveChangesBtn.onclick = () => {
        const selected = [];

        document.querySelectorAll('recipe-card').forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');
            if (checkbox?.checked) {
                selected.push(checkbox.dataset.createdAt);
            }
        });

        const allRecipes = getRecipesFromStorage();
        const updated = allRecipes.map(recipe => {
            const tags = recipe.tags || [];
            const hasTag = tags.includes(mealName);
            const shouldHaveTag = selected.includes(recipe.createdAt);

            if (shouldHaveTag && !hasTag) {
                tags.push(mealName);
            } else if (!shouldHaveTag && hasTag) {
                const index = tags.indexOf(mealName);
                if (index !== -1) tags.splice(index, 1);
            }

            recipe.tags = tags;
            return recipe;
        });

        saveRecipesToStorage(updated);
        renderMealList();

        // ✅ Re-render all cards to reflect updated tags
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(updated);

        // ✅ Remove checkboxes from cards
        document.querySelectorAll('recipe-card').forEach(card => {
            const wrapper = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (wrapper) wrapper.remove();
        });

        saveChangesBtn.remove();
    };



}
