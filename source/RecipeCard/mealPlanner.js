// THANHHHH PROOOOOOO

// Saves all meals to localStorage as JSON
function saveMealsToStorage(meals) {
    localStorage.setItem('savedMeals', JSON.stringify(meals));
}

// Retrieves stored meals from localStorage (or returns an empty object if none)
function getMealsFromStorage() {
    const stored = localStorage.getItem('savedMeals');
    return stored ? JSON.parse(stored) : {};
}

// Displays recipe cards in the "Meal Preview" section
function displayMealCards(recipeDataArray) {
    const container = document.getElementById('meal-cards-display');
    container.innerHTML = ''; // Clear old cards

    recipeDataArray.forEach(data => {
        const card = document.createElement('recipe-card');
        card.data = data;
        container.appendChild(card);
    });
}

function createMealUI(mealName, recipes) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('meal-ui-wrapper');

    const mealButton = document.createElement('button');
    mealButton.textContent = mealName;
    mealButton.classList.add('meal-btn');
    mealButton.addEventListener('click', () => {
        displayMealCards(recipes);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-meal-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete the meal "${mealName}"?`)) {
            const savedMeals = getMealsFromStorage();
            delete savedMeals[mealName];
            saveMealsToStorage(savedMeals);
            wrapper.remove();
            document.getElementById('meal-cards-display').innerHTML = '';
        }
    });

    wrapper.appendChild(mealButton);
    wrapper.appendChild(deleteBtn);
    document.getElementById('meal-list').appendChild(wrapper);
}


// Used to track whether we're in "Create Meal" mode
let mealSelectionMode = false;

// Holds references to selected recipe-card elements when building a meal
const selectedCards = new Set();

// === Main App Logic (waits for DOM to be ready) ===
document.addEventListener('DOMContentLoaded', () => {
    // UI references
    const createMealBtn = document.getElementById('create-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const cardsContainer = document.getElementById('cardsContainer');
    const saveMealBtn = document.getElementById('save-meal-btn');
    const mealNameInput = document.getElementById('meal-name-input');
    const mealList = document.getElementById('meal-list');
    const mealCardsDisplay = document.getElementById('meal-cards-display');

    // Load existing meals from localStorage
    let savedMeals = getMealsFromStorage();

    // Re-render saved meal buttons
    Object.entries(savedMeals).forEach(([mealName, recipes]) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('meal-ui-wrapper');

        const mealButton = document.createElement('button');
        mealButton.textContent = mealName;
        mealButton.classList.add('meal-btn');
        mealButton.addEventListener('click', () => {
            displayMealCards(recipes);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-meal-btn');
        deleteBtn.addEventListener('click', () => {
            // 🔥 No confirmation – delete immediately
            delete savedMeals[mealName];
            saveMealsToStorage(savedMeals);
            wrapper.remove();

            // Clear the preview if it was this meal
            document.getElementById('meal-cards-display').innerHTML = '';
        });

        wrapper.appendChild(mealButton);
        wrapper.appendChild(deleteBtn);
        mealList.appendChild(wrapper);
    });


    // === Create Meal button logic ===
    createMealBtn.addEventListener('click', () => {
        mealSelectionMode = true;
        mealControls.style.display = 'block';

        // Find all recipe-card elements
        const recipeCards = cardsContainer.querySelectorAll('recipe-card');

        recipeCards.forEach((card, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('meal-wrapper');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('meal-select-checkbox');
            checkbox.dataset.cardIndex = index;

            // Track selected cards
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedCards.add(card);
                } else {
                    selectedCards.delete(card);
                }
            });

            // Avoid wrapping more than once
            if (!card.parentElement.classList.contains('meal-wrapper')) {
                card.replaceWith(wrapper);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(card);
            }
        });
    });


    // === Save Meal button logic ===
    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();

        // Validate meal name
        if (!mealName) {
            alert('Please enter a meal name.');
            return;
        }

        // Ensure at least one card is selected
        if (selectedCards.size === 0) {
            alert('Please select at least one recipe card.');
            return;
        }

        // Create deep copy of each selected card's data
        const mealRecipeData = Array.from(selectedCards).map(card =>
            structuredClone(card._data)
        );

        // Save to memory and localStorage
        savedMeals[mealName] = mealRecipeData;
        saveMealsToStorage(savedMeals);

        createMealUI(mealName, mealRecipeData);

        // Reset selection state
        selectedCards.clear();
        mealNameInput.value = '';
        mealControls.style.display = 'none';
        mealSelectionMode = false;

        // Remove checkboxes and unwrap cards
        const checkboxes = document.querySelectorAll('.meal-select-checkbox');
        checkboxes.forEach(cb => cb.parentElement.replaceWith(cb.nextSibling));
    });
});


// THANHHHH PROOOOOOO