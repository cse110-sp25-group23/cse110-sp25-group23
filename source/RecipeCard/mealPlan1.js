import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

window.addEventListener('DOMContentLoaded', () => {
    const createMealBtn = document.getElementById('create-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const mealNameInput = document.getElementById('meal-name-input');
    const saveMealBtn = document.getElementById('save-meal-btn');

    createMealBtn.addEventListener('click', () => {
        // Show meal form
        mealControls.style.display = 'block';
        mealNameInput.value = '';

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
            checkbox.dataset.index = index;

            checkboxWrapper.appendChild(checkbox);
            // Append checkbox wrapper to the recipe-card's shadow DOM container
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
        const selectedIndexes = [];

        checkboxes.forEach((card, index) => {
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');
            if (checkbox && checkbox.checked) {
                selectedIndexes.push(index);
            }
        });

        if (selectedIndexes.length === 0) {
            alert('Please select at least one recipe');
            return;
        }

        const allRecipes = getRecipesFromStorage();

        selectedIndexes.forEach(index => {
            const tags = allRecipes[index].tags || [];
            if (!tags.includes(mealName)) {
                tags.push(mealName);
            }
            allRecipes[index].tags = tags;
        });



        saveRecipesToStorage(allRecipes);
        renderMealList(); // Update the list of created meals
        document.getElementById('meal-controls').style.display = 'none';

        // ✅ OPTIONAL: clear the selection grid if you're using it
        const selectionGrid = document.getElementById('meal-selection-cards');
        if (selectionGrid) selectionGrid.innerHTML = '';


        document.querySelectorAll('recipe-card').forEach(card => {
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (box) box.remove();
        });

    });
});

function renderMealList() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = ''; // Clear existing list

    const allRecipes = getRecipesFromStorage();
    const mealNames = new Set();

    // Collect all meal names from tags
    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            // Filter out known predefined tags like difficulty
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                mealNames.add(tag);
            }
        });
    });

    // Create buttons for each meal
    mealNames.forEach(meal => {
        const li = document.createElement('li');

        const viewBtn = document.createElement('button');
        viewBtn.textContent = meal;
        viewBtn.className = 'meal-view-btn';

        viewBtn.addEventListener('click', () => {
            showMealPreview(meal);
        });

        li.appendChild(viewBtn);
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

