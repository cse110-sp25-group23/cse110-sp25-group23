// === Utility Functions ===

// Save all meals to localStorage in JSON format
function saveMealsToStorage(meals) {
    localStorage.setItem('savedMeals', JSON.stringify(meals));
}

// Retrieve meals from localStorage (or return an empty object if none exist)
function getMealsFromStorage() {
    const stored = localStorage.getItem('savedMeals');
    return stored ? JSON.parse(stored) : {};
}

// Render recipe cards into the meal preview section
function displayMealCards(recipeDataArray) {
    const container = document.getElementById('meal-cards-display');
    container.innerHTML = ''; // Clear existing cards

    // Create and append a <recipe-card> element for each recipe
    recipeDataArray.forEach(data => {
        const card = document.createElement('recipe-card');
        card.data = data;
        container.appendChild(card);
    });

    // Hide edit/delete buttons inside meal preview cards
    container.querySelectorAll('recipe-card').forEach(card => {
        const shadowRoot = card.shadowRoot;
        if (!shadowRoot) return;

        // Attempt to find the delete and edit buttons
        const deleteBtn = shadowRoot.querySelector('.delete-btn');
        const editBtn = shadowRoot.querySelector('.edit-btn');

        // Hide them if they exist
        if (deleteBtn) deleteBtn.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
    });

}

// Create UI elements for a saved meal (button, delete, edit, save)
function createMealUI(mealName, recipes, savedMeals) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('meal-ui-wrapper');

    // Create the main meal button that displays the meal's name
    const mealButton = document.createElement('button');
    mealButton.textContent = mealName;
    mealButton.classList.add('meal-btn');
    let currentRecipes = recipes;

    // When clicked, show the meal's recipe cards in the preview
    mealButton.addEventListener('click', () => {
        displayMealCards(currentRecipes);
    });

    // Create delete button for the meal
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-meal-btn');

    // When clicked, confirm deletion, remove from storage and UI
    deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete the meal "${mealName}"?`)) {
            const savedMeals = getMealsFromStorage();
            delete savedMeals[mealName];
            saveMealsToStorage(savedMeals);
            wrapper.remove(); // Remove from the page
            document.getElementById('meal-cards-display').innerHTML = '';
        }
    });

    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-meal-btn');

    // Create save button for when editing is done
    const saveEditBtn = document.createElement('button');
    saveEditBtn.textContent = 'Save';
    saveEditBtn.classList.add('save-edit-btn');
    saveEditBtn.style.display = 'none'; // Initially hidden

    // When "Edit" is clicked
    editBtn.addEventListener('click', () => {
        mealSelectionMode = true;
        saveEditBtn.style.display = 'inline';

        // Hide the preview area during edit
        const mealPreviewSection = document.getElementById('meal-display-container');
        mealPreviewSection.style.display = 'none';

        // Get only the recipe cards from the main container (not preview)
        const recipeCards = document.querySelectorAll('#cardsContainer recipe-card');
        selectedCards.clear();

        // For each recipe card, wrap with a checkbox
        recipeCards.forEach((card, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('meal-wrapper');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('meal-select-checkbox');
            checkbox.dataset.cardIndex = index;

            // Pre-select the card if it exists in the current saved meal
            if (savedMeals[mealName].some(r => JSON.stringify(r) === JSON.stringify(card._data))) {
                checkbox.checked = true;
                selectedCards.add(card);
            }

            // Update selection state when checkbox changes
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedCards.add(card);
                } else {
                    selectedCards.delete(card);
                }
            });

            // Replace the card with the wrapper if not already wrapped
            if (!card.parentElement.classList.contains('meal-wrapper')) {
                card.replaceWith(wrapper);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(card);
            }
        });
    });

    // When "Save" is clicked after editing a meal
    saveEditBtn.addEventListener('click', () => {
        // Extract recipe data from selected cards
        const updatedRecipes = Array.from(selectedCards).map(card =>
            structuredClone(card._data)
        );

        // Prevent saving an empty meal
        if (updatedRecipes.length === 0) {
            alert('Please select at least one recipe.');
            return;
        }

        // Save updated recipe list to localStorage
        savedMeals[mealName] = updatedRecipes;
        saveMealsToStorage(savedMeals);

        // Reset editing state
        selectedCards.clear();
        mealSelectionMode = false;
        saveEditBtn.style.display = 'none';

        // Remove checkbox wrappers and unwrap recipe cards
        document.querySelectorAll('.meal-select-checkbox').forEach(cb => {
            const card = cb.nextSibling;
            cb.parentElement.replaceWith(card);
        });

        // Update local variable for meal button click
        currentRecipes = updatedRecipes;

        // Restore preview section but keep it empty
        const previewContainer = document.getElementById('meal-cards-display');
        const previewSection = document.getElementById('meal-display-container');
        previewContainer.innerHTML = '';
        previewSection.style.display = 'block';
    });

    // Add all buttons to the wrapper and add it to the UI
    wrapper.appendChild(mealButton);
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(saveEditBtn);

    document.getElementById('meal-list').appendChild(wrapper);
}

// === Global State ===

// Whether the user is currently selecting cards to make/edit a meal
let mealSelectionMode = false;

// A Set to store references to currently selected recipe cards
const selectedCards = new Set();

// === Main Initialization Code ===

document.addEventListener('DOMContentLoaded', () => {
    // UI element references
    const createMealBtn = document.getElementById('create-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const cardsContainer = document.getElementById('cardsContainer');
    const saveMealBtn = document.getElementById('save-meal-btn');
    const mealNameInput = document.getElementById('meal-name-input');
    const mealList = document.getElementById('meal-list');
    const mealCardsDisplay = document.getElementById('meal-cards-display');

    // Load meals from localStorage
    let savedMeals = getMealsFromStorage();

    // Create UI buttons for all existing meals
    Object.entries(savedMeals).forEach(([mealName, recipes]) => {
        createMealUI(mealName, recipes, savedMeals);
    });

    // When "Create Meal" is clicked, begin selection process
    createMealBtn.addEventListener('click', () => {
        mealSelectionMode = true;
        mealControls.style.display = 'block';

        // Get all recipe cards from the main container
        const recipeCards = cardsContainer.querySelectorAll('recipe-card');

        // For each card, wrap it with a checkbox for selection
        recipeCards.forEach((card, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('meal-wrapper');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('meal-select-checkbox');
            checkbox.dataset.cardIndex = index;

            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedCards.add(card);
                } else {
                    selectedCards.delete(card);
                }
            });

            if (!card.parentElement.classList.contains('meal-wrapper')) {
                card.replaceWith(wrapper);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(card);
            }
        });
    });

    // When "Save Meal" is clicked after creating a new meal
    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();

        // Validate that the name is not empty
        if (!mealName) {
            alert('Please enter a meal name.');
            return;
        }

        // Validate that at least one recipe card is selected
        if (selectedCards.size === 0) {
            alert('Please select at least one recipe card.');
            return;
        }

        // Build an array of recipe data from selected cards
        const mealRecipeData = Array.from(selectedCards).map(card =>
            structuredClone(card._data)
        );

        // Add the new meal to the UI and localStorage
        createMealUI(mealName, mealRecipeData, savedMeals);
        savedMeals[mealName] = mealRecipeData;
        saveMealsToStorage(savedMeals);

        // Reset UI state
        selectedCards.clear();
        mealNameInput.value = '';
        mealControls.style.display = 'none';
        mealSelectionMode = false;

        // Unwrap all recipe cards
        const checkboxes = document.querySelectorAll('.meal-select-checkbox');
        checkboxes.forEach(cb => cb.parentElement.replaceWith(cb.nextSibling));
    });
});