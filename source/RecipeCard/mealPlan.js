import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

// Meal creation flow
window.addEventListener('DOMContentLoaded', () => {
    const createMealBtn = document.getElementById('create-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const mealNameInput = document.getElementById('meal-name-input');
    const saveMealBtn = document.getElementById('save-meal-btn');
    const mealSelectionArea = document.getElementById('meal-selection-cards');
    const cardsContainer = document.getElementById('cardsContainer');

    createMealBtn.addEventListener('click', () => {
        // Show meal form
        mealControls.style.display = 'block';
        mealNameInput.value = '';
        mealSelectionArea.innerHTML = '';

        // Show checkboxes for all recipe cards
        const cards = document.querySelectorAll('recipe-card');

        cards.forEach((card, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.index = index;

            const clonedCard = card.cloneNode(true); // make a copy for preview
            clonedCard.style.pointerEvents = 'none';
            clonedCard.style.opacity = '0.7';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(clonedCard);
            mealSelectionArea.appendChild(wrapper);
        });
    });

    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        if (!mealName) {
            alert('Please enter a meal name');
            return;
        }

        const checkboxes = mealSelectionArea.querySelectorAll('input[type="checkbox"]');
        const selectedIndexes = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.dataset.index));

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
        location.reload(); // reload to show updated tags
    });
});
