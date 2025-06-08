import { getRecipesFromStorage, saveRecipesToStorage, addRecipesToDocument } from '../LocalStorage/storage.js';

window.addEventListener('DOMContentLoaded', () => {
    const createMealBtn = document.getElementById('create-meal-btn');
    const cancelMealBtn = document.getElementById('cancel-meal-btn');
    const mealControls = document.getElementById('meal-controls');
    const mealNameInput = document.getElementById('meal-name-input');
    const saveMealBtn = document.getElementById('save-meal-btn');

    createMealBtn.addEventListener('click', () => {

        const recipeCards = document.querySelectorAll('recipe-card');
        if (recipeCards.length === 0) {
            alert('Please create at least one recipe card before creating a meal.');
            return;
        }

        // Show the meal creation input and controls
        mealControls.style.display = 'block';
        mealNameInput.value = '';
        cancelMealBtn.style.display = 'inline-block';

        // Clear any existing meal preview
        document.getElementById('meal-cards-display').innerHTML = '';

        // Remove any previously inserted checkboxes from the cards
        document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

        // Insert a checkbox into each recipe-card to allow selection
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

    cancelMealBtn.addEventListener('click', () => {
        // Hide the meal creation form
        mealControls.style.display = 'none';
        mealNameInput.value = '';
        cancelMealBtn.style.display = 'none';

        // Remove all checkboxes from recipe cards
        document.querySelectorAll('recipe-card').forEach(card => {
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (box) box.remove();
        });
    });


    saveMealBtn.addEventListener('click', () => {
        const mealName = mealNameInput.value.trim();
        if (!mealName) {
            alert('Please enter a meal name');
            return;
        }

        // Collect createdAt values of selected recipe cards
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

        // Add the meal tag to selected recipes
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

        // Save updated recipes and refresh meal list and card tags
        saveRecipesToStorage(allRecipes);
        renderMealList();
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(allRecipes);

        // Hide meal creation UI
        document.getElementById('meal-controls').style.display = 'none';
        cancelMealBtn.style.display = 'none';

        // Remove all checkboxes
        document.querySelectorAll('recipe-card').forEach(card => {
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (box) box.remove();
        });

        // Clear the optional card selection area if it exists
        const selectionGrid = document.getElementById('meal-selection-cards');
        if (selectionGrid) selectionGrid.innerHTML = '';
    });

    const stopViewingBtn = document.getElementById('stop-viewing-btn');
    stopViewingBtn.addEventListener('click', () => {
        document.getElementById('meal-cards-display').innerHTML = '';
        stopViewingBtn.style.display = 'none';
        window.currentPreviewedMeal = null;
    });

    // Initial load: show stored recipes and available meals
    const recipes = getRecipesFromStorage();
    document.querySelector('main').innerHTML = '';
    addRecipesToDocument(recipes);
    renderMealList();
});

// window.addEventListener('recipesUpdated', () => {
//     document.getElementById('meal-cards-display').innerHTML = '';
//     if (currentPreviewedMeal) {
//         showMealPreview(currentPreviewedMeal);
//     }
//     renderMealList();

//     // If recipe cards are also shown on main, refresh them too:
//     document.querySelector('main').innerHTML = '';
//     addRecipesToDocument(getRecipesFromStorage());
// });

// window.addEventListener('recipesUpdated', () => {
//     const allRecipes = getRecipesFromStorage();

//     // Get all non-standard tags from remaining recipes
//     const stillUsedTags = new Set();
//     allRecipes.forEach(recipe => {
//         (recipe.tags || []).forEach(tag => {
//             if (!["Easy", "Advanced", "Pro"].includes(tag)) {
//                 stillUsedTags.add(tag);
//             }
//         });
//     });

//     // Remove unused tags from all recipes
//     const cleanedRecipes = allRecipes.map(recipe => {
//         recipe.tags = (recipe.tags || []).filter(tag =>
//             ["Easy", "Advanced", "Pro"].includes(tag) || stillUsedTags.has(tag)
//         );
//         return recipe;
//     });

//     // Save updated recipes with orphaned tags removed
//     saveRecipesToStorage(cleanedRecipes);

//     // Refresh UI
//     document.getElementById('meal-cards-display').innerHTML = '';

//     if (window.currentPreviewedMeal) {
//         const stillExists = cleanedRecipes.some(r =>
//             r.tags && r.tags.includes(window.currentPreviewedMeal)
//         );
//         if (stillExists) {
//             showMealPreview(window.currentPreviewedMeal);
//         } else {
//             window.currentPreviewedMeal = null;
//         }
//     }

//     renderMealList();
//     document.querySelector('main').innerHTML = '';
//     addRecipesToDocument(cleanedRecipes);
// });

window.addEventListener('recipesUpdated', () => {
    const allRecipes = getRecipesFromStorage();

    // Get all non-standard tags from remaining recipes
    const stillUsedTags = new Set();
    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                stillUsedTags.add(tag);
            }
        });
    });

    // Remove unused tags from all recipes
    const cleanedRecipes = allRecipes.map(recipe => {
        recipe.tags = (recipe.tags || []).filter(tag =>
            ["Easy", "Advanced", "Pro"].includes(tag) || stillUsedTags.has(tag)
        );
        return recipe;
    });

    // Save updated recipes with orphaned tags removed
    saveRecipesToStorage(cleanedRecipes);

    // Refresh UI
    document.getElementById('meal-cards-display').innerHTML = '';

    const stopViewingBtn = document.getElementById('stop-viewing-btn');

    if (window.currentPreviewedMeal) {
        const stillExists = cleanedRecipes.some(r =>
            r.tags && r.tags.includes(window.currentPreviewedMeal)
        );
        if (stillExists) {
            showMealPreview(window.currentPreviewedMeal);
        } else {
            window.currentPreviewedMeal = null;
            stopViewingBtn.style.display = 'none';
        }
    } else {
        stopViewingBtn.style.display = 'none';
    }

    renderMealList();
    document.querySelector('main').innerHTML = '';
    addRecipesToDocument(cleanedRecipes);
});


function renderMealList() {
    const mealList = document.getElementById('meal-list');
    mealList.innerHTML = '';

    // Extract all unique meal names from recipe tags
    const allRecipes = getRecipesFromStorage();
    const mealNames = new Set();

    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                mealNames.add(tag);
            }
        });
    });

    // For each meal, render a list item with view, edit, and delete buttons
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
            // Remove the tag from all recipes
            const updated = getRecipesFromStorage().map(recipe => {
                const tags = (recipe.tags || []).filter(tag => tag !== meal);
                return { ...recipe, tags };
            });

            // Save and re-render cards and meal list
            saveRecipesToStorage(updated);
            renderMealList();
            document.querySelector('main').innerHTML = '';
            addRecipesToDocument(updated);
            document.getElementById('meal-cards-display').innerHTML = '';
        });

        li.appendChild(deleteBtn);
        mealList.appendChild(li);
    });
}

function showMealPreview(mealName) {
    // Show only the cards associated with the selected meal
    const display = document.getElementById('meal-cards-display');
    display.innerHTML = '';

    const allRecipes = getRecipesFromStorage();
    const mealRecipes = allRecipes.filter(r => r.tags && r.tags.includes(mealName));

    mealRecipes.forEach(recipe => {
        const recipeCard = document.createElement('recipe-card');
        recipeCard.data = recipe;
        display.appendChild(recipeCard);
    });


    // ✅ Show the Stop Viewing button and set currentPreviewedMeal
    window.currentPreviewedMeal = mealName;
    const stopBtn = document.getElementById('stop-viewing-btn');
    stopBtn.style.display = 'inline-block';
}

function startEditMeal(mealName, editBtn) {
    const cards = document.querySelectorAll('recipe-card');
    document.getElementById('meal-controls').style.display = 'none';
    document.getElementById('meal-cards-display').innerHTML = '';
    document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

    // Add a "Save changes" button if one doesn't already exist
    let saveChangesBtn = editBtn.nextElementSibling;
    if (!saveChangesBtn || !saveChangesBtn.classList.contains('save-edit-btn')) {
        saveChangesBtn = document.createElement('button');
        saveChangesBtn.textContent = 'Save changes';
        saveChangesBtn.className = 'save-edit-btn';
        editBtn.insertAdjacentElement('afterend', saveChangesBtn);
    }

    const allRecipes = getRecipesFromStorage();

    // Insert checkboxes into each card and check if it’s already in the meal
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
        // Collect selected recipe identifiers
        const selected = [];
        document.querySelectorAll('recipe-card').forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');
            if (checkbox?.checked) {
                selected.push(checkbox.dataset.createdAt);
            }
        });

        // Apply tag updates based on checkbox state
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

        // Save changes and re-render UI
        saveRecipesToStorage(updated);
        renderMealList();
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(updated);

        // Remove any checkboxes still in the shadow DOM
        document.querySelectorAll('recipe-card').forEach(card => {
            const wrapper = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (wrapper) wrapper.remove();
        });

        saveChangesBtn.remove();
    };
}
