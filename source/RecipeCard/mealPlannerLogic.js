// Import functions for accessing and updating recipe data in localStorage
import { getRecipesFromStorage, saveRecipesToStorage, addRecipesToDocument } from '../LocalStorage/storage.js';

/**
 * Runs once when the DOM has fully loaded.
 * Sets up UI elements and attaches all event listeners for meal creation, editing, and viewing.
 */
window.addEventListener('DOMContentLoaded', () => {
    // Get reference to the "Create Meal" button element
    const createMealBtn = document.getElementById('create-meal-btn');

    // Get reference to the "Cancel" button in the meal creation form
    const cancelMealBtn = document.getElementById('cancel-meal-btn');

    // Get the container element that holds meal input controls (name field, buttons)
    const mealControls = document.getElementById('meal-controls');

    // Get the input field for entering a new meal name
    const mealNameInput = document.getElementById('meal-name-input');

    // Get the "Save Meal" button which saves the selected recipes under a meal name
    const saveMealBtn = document.getElementById('save-meal-btn');


    /**
    * Triggered when the "Create Meal" button is clicked.
    * Displays the meal creation UI and injects checkboxes into all recipe cards for selection.
    */
    createMealBtn.addEventListener('click', () => {

        // Exit preview mode if user was viewing a specific meal
        window.currentPreviewedMeal = null;

        // Hide all action containers (edit/delete/stop viewing)
        document.querySelectorAll('.meal-action-container').forEach(container => {
            container.style.display = 'none';
        });

        // Show all recipes again
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(getRecipesFromStorage());

        // Get all recipe-card elements currently in the DOM
        const recipeCards = document.querySelectorAll('recipe-card');

        // If there are no recipe cards, alert the user and stop further execution
        if (recipeCards.length === 0) {
            alert('Please create at least one recipe card before creating a meal.');
            return;
        }

        // Show the meal input UI by making the controls container visible
        mealControls.style.display = 'block';

        // Clear any previous text from the meal name input field
        mealNameInput.value = '';

        // Show the "Cancel" button to allow user to exit meal creation
        cancelMealBtn.style.display = 'inline-block';

        // Remove any previously inserted checkbox wrappers from earlier interactions
        document.querySelectorAll('recipe-card').forEach(card => {
            const oldWrapper = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (oldWrapper) oldWrapper.remove();
        });


        // Loop through each recipe card and inject a checkbox for meal selection
        const cards = document.querySelectorAll('recipe-card');

        cards.forEach((card, index) => {
            // Create a wrapper div to hold the checkbox and apply visual styling
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('card-checkbox-wrapper');

            // Create the actual checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';                             // make it a checkbox
            checkbox.classList.add('meal-select-checkbox');
            checkbox.style.width = '60px';
            checkbox.style.height = '60px';
            checkbox.style.cursor = 'pointer';
            checkbox.style.accentColor = '#3f51b5';


            checkbox.dataset.createdAt = card._data.createdAt;      // store the card's unique ID

            // Add the checkbox to the wrapper
            checkboxWrapper.appendChild(checkbox);

            // Access the card's inner container from its Shadow DOM
            const container = card.shadowRoot.querySelector('.card-container');

            // Ensure the container is positioned relatively so the absolute checkbox aligns properly
            container.style.position = 'relative';

            // Insert the checkbox wrapper at the beginning of the container
            container.insertBefore(checkboxWrapper, container.firstChild);
        });
    });


    /**
    * Triggered when the "Cancel" button is clicked during meal creation.
    * Hides the meal creation UI and removes any selection checkboxes from recipe cards.
    */
    cancelMealBtn.addEventListener('click', () => {
        // Hide the meal input controls section
        mealControls.style.display = 'none';

        // Clear the meal name input field
        mealNameInput.value = '';

        // Hide the cancel button itself
        cancelMealBtn.style.display = 'none';

        // Loop through all recipe-card elements to remove any inserted checkboxes
        document.querySelectorAll('recipe-card').forEach(card => {
            // Try to find the checkbox wrapper inside the shadow DOM of each card
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');

            // If a wrapper is found, remove it from the DOM
            if (box) box.remove();
        });
    });



    /**
    * Triggered when the "Save Meal" button is clicked.
    * Validates input, gathers selected recipes, assigns the new meal tag,
    * saves to localStorage, and refreshes the recipe display.
    */
    saveMealBtn.addEventListener('click', () => {
        // Trim and retrieve the meal name entered by the user
        const mealName = mealNameInput.value.trim();

        // If the meal name is empty, alert the user and stop
        if (!mealName) {
            alert('Please enter a meal name');
            return;
        }

        // If the meal name is too long, alert the user to use less
        if (mealName.length > 30) {
            alert('Meal name is too long. Please use 30 characters or fewer.');
            return;
        }

        // Initialize an array to hold IDs (createdAt) of selected recipe cards
        const selectedCreatedAts = [];

        // Loop through all recipe cards to find checked checkboxes
        document.querySelectorAll('recipe-card').forEach(card => {
            // Look inside the card’s shadow DOM for the meal selection checkbox
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');

            // If the checkbox exists and is checked, add its createdAt ID to the array
            if (checkbox && checkbox.checked) {
                selectedCreatedAts.push(checkbox.dataset.createdAt);
            }
        });

        // If no recipes were selected, alert the user and stop
        if (selectedCreatedAts.length === 0) {
            alert('Please select at least one recipe');
            return;
        }

        // Load all saved recipes from localStorage
        const allRecipes = getRecipesFromStorage();

        // For each recipe, if its ID is in the selected list, add the new meal tag
        allRecipes.forEach(recipe => {
            if (selectedCreatedAts.includes(recipe.createdAt)) {
                // Get the existing tags or initialize to an empty array
                const tags = recipe.tags || [];

                // If the meal tag isn't already present, add it
                if (!tags.includes(mealName)) {
                    tags.push(mealName);
                }

                // Save the updated tag list back to the recipe
                recipe.tags = tags;
            }
        });

        // Save the updated recipes back into localStorage
        saveRecipesToStorage(allRecipes);

        // Refresh the visible meal list (left-side menu)
        renderMealList();

        // Clear the current recipe cards from the main area
        document.querySelector('main').innerHTML = '';

        // Re-render all recipe cards with their updated tag data
        addRecipesToDocument(allRecipes);

        // Hide the meal creation UI and reset its fields
        document.getElementById('meal-controls').style.display = 'none';
        cancelMealBtn.style.display = 'none';

        // Remove any lingering checkboxes from recipe cards
        document.querySelectorAll('recipe-card').forEach(card => {
            const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (box) box.remove();
        });

        // If the optional preview selection area exists, clear it too
        const selectionGrid = document.getElementById('meal-selection-cards');
        if (selectionGrid) selectionGrid.innerHTML = '';
    });

    // Handle "Import a Recipe Card" button
    const importBtn = document.getElementById('import-btn');

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            // Exit any current preview or edit state
            resetMealUI();

            // Redirect to recipe import or creation page
            window.location.href = 'recipeImporter/recipeImport.html'; // Change path if different
        });
    }


    /**
    * Triggered when the "Stop Viewing" button is clicked.
    * Exits meal preview mode and restores the full list of all recipe cards.
    */

    // Initial load: show stored recipes and available meals

    // Retrieve all recipe data from localStorage
    const recipes = getRecipesFromStorage();

    // Select the <main> element that holds the recipe cards and clear any existing content
    document.querySelector('main').innerHTML = '';

    // Render all recipe cards into the <main> element using the loaded recipes
    addRecipesToDocument(recipes);

    // Render the list of meals (meal names with View/Edit/Delete buttons)
    renderMealList();

});



function exitMealCreationMode() {
    const mealControls = document.getElementById('meal-controls');
    const cancelMealBtn = document.getElementById('cancel-meal-btn');
    const mealNameInput = document.getElementById('meal-name-input');

    if (mealControls) mealControls.style.display = 'none';
    if (cancelMealBtn) cancelMealBtn.style.display = 'none';
    if (mealNameInput) mealNameInput.value = '';

    document.querySelectorAll('recipe-card').forEach(card => {
        const box = card.shadowRoot.querySelector('.card-checkbox-wrapper');
        if (box) box.remove();
    });
}



function resetMealUI() {
    exitMealCreationMode();

    window.currentPreviewedMeal = null;

    document.querySelectorAll('.meal-action-container').forEach(container => {
        container.style.display = 'none';
    });

    document.querySelectorAll('.save-edit-btn').forEach(btn => btn.remove());

    const recipes = getRecipesFromStorage();
    document.querySelector('main').innerHTML = '';
    addRecipesToDocument(recipes);
}


/**
 * Event listener for when the recipe data is updated (e.g., after saving or deleting a recipe).
 * This ensures that orphaned meal tags are removed and the UI stays consistent.
 */
window.addEventListener('recipesUpdated', () => {
    const allRecipes = getRecipesFromStorage();

    // Exit meal creation mode if active
    exitMealCreationMode();

    // Exit meal preview mode if active
    window.currentPreviewedMeal = null;

    // Remove all meal preview buttons (Edit, Delete, Stop Viewing)
    document.querySelectorAll('.meal-action-container').forEach(container => {
        container.style.display = 'none';
    });

    // Remove all 'Save changes' buttons from previous edit mode
    document.querySelectorAll('.save-edit-btn').forEach(btn => btn.remove());

    // --- Clean up unused meal tags ---
    const stillUsedTags = new Set();

    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                stillUsedTags.add(tag);
            }
        });
    });

    const cleanedRecipes = allRecipes.map(recipe => {
        recipe.tags = (recipe.tags || []).filter(tag =>
            ["Easy", "Advanced", "Pro"].includes(tag) || stillUsedTags.has(tag)
        );
        return recipe;
    });

    saveRecipesToStorage(cleanedRecipes);

    // Re-render all cards
    const main = document.querySelector('main');
    main.innerHTML = '';
    addRecipesToDocument(cleanedRecipes);

    // Re-render meal list
    renderMealList();
});


/**
 * Event listener for when a new recipe is created.
 * Updates the meal list on the sidebar to reflect any new tags/meals introduced by the new recipe.
 */
window.addEventListener('recipeCreated', () => {
    resetMealUI();
    renderMealList();
});


/**
 * Renders the list of meals in the UI.
 * Each meal gets a list item with buttons to view, edit, or delete the associated recipe group.
 */
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
        li.className = 'meal-list-item';

        // Meal name button
        const viewBtn = document.createElement('button');
        viewBtn.textContent = meal;
        viewBtn.className = 'meal-name-btn';

        // Action container (Edit/Delete)
        const actionContainer = document.createElement('div');
        actionContainer.className = 'meal-action-container';
        actionContainer.style.display = 'none'; // Initially hidden

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'meal-edit-btn';
        editBtn.addEventListener('click', () => startEditMeal(meal, editBtn));
        actionContainer.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'meal-delete-btn';
        deleteBtn.addEventListener('click', () => {
            window.currentPreviewedMeal = null;

            const updated = getRecipesFromStorage().map(recipe => {
                const tags = (recipe.tags || []).filter(tag => tag !== meal);
                return { ...recipe, tags };
            });

            saveRecipesToStorage(updated);
            renderMealList();
            document.querySelector('main').innerHTML = '';
            addRecipesToDocument(updated);
        });
        actionContainer.appendChild(deleteBtn);


        // Stop Viewing button (clone)
        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop Viewing';
        stopBtn.className = 'meal-stop-btn';
        stopBtn.addEventListener('click', () => {
            window.currentPreviewedMeal = null;
            document.querySelector('main').innerHTML = '';
            addRecipesToDocument(getRecipesFromStorage());
            renderMealList(); // Re-hide all action containers
        });
        actionContainer.appendChild(stopBtn);

        // Button click: show meal preview & toggle current menu, hide all others
        viewBtn.addEventListener('click', () => {
            // If we're in Create Meal mode, cancel it
            const cancelMealBtn = document.getElementById('cancel-meal-btn');
            if (cancelMealBtn && cancelMealBtn.style.display !== 'none') {
                cancelMealBtn.click();
            }

            showMealPreview(meal);

            // Hide all other action containers
            document.querySelectorAll('.meal-action-container').forEach(container => {
                container.style.display = 'none';
            });

            // Show only the clicked one
            actionContainer.style.display = 'flex';
        });

        li.appendChild(viewBtn);
        li.appendChild(actionContainer);
        mealList.appendChild(li);
    });
}


/**
 * Displays only the recipe cards that belong to a specific meal.
 * Called when the user clicks the view button for a meal.
 * 
 * @param {string} mealName - The name of the meal to preview (used as a tag).
 */
function showMealPreview(mealName) {
    // Select the <main> container that displays recipe cards
    const main = document.querySelector('main');

    // Clear any currently displayed recipe cards
    main.innerHTML = '';

    // Load all saved recipes from localStorage
    const allRecipes = getRecipesFromStorage();

    // Filter out recipes that are tagged with the given meal name
    const mealRecipes = allRecipes.filter(r => r.tags && r.tags.includes(mealName));

    // For each recipe in the meal...
    mealRecipes.forEach(recipe => {
        // Create a new <recipe-card> element
        const card = document.createElement('recipe-card');

        // Assign the recipe data to the card (this triggers the card to render)
        card.data = recipe;

        // Add the card to the <main> container
        main.appendChild(card);
    });

    // Store the current previewed meal globally for tracking/view management
    window.currentPreviewedMeal = mealName;

}

/**
 * Begins edit mode for a specific meal.
 * Displays all recipe cards, preselects the ones currently in the meal,
 * and allows the user to add/remove recipes from that meal.
 *
 * @param {string} mealName - The name of the meal to edit.
 * @param {HTMLElement} editBtn - The Edit button element that was clicked (used to insert the Save button next to it).
 */
function startEditMeal(mealName, editBtn) {
    // Hide the Stop Viewing button in case it was visible

    // Clear any currently previewed meal
    window.currentPreviewedMeal = null;

    // Clear the main display area (where recipe cards are shown)
    document.querySelector('main').innerHTML = '';

    // Re-render all recipe cards into the main area
    addRecipesToDocument(getRecipesFromStorage());

    // Store reference to all recipe-card elements for checkbox insertion
    const cards = document.querySelectorAll('recipe-card');

    // Hide the meal creation UI (in case it was open)
    document.getElementById('meal-controls').style.display = 'none';

    // Remove any existing checkbox overlays from previous editing
    document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

    // Check if a Save button already exists next to the Edit button
    let saveChangesBtn = editBtn.nextElementSibling;

    // If it doesn't exist or has the wrong class, create it
    if (!saveChangesBtn || !saveChangesBtn.classList.contains('save-edit-btn')) {
        saveChangesBtn = document.createElement('button');
        saveChangesBtn.textContent = 'Save changes';
        saveChangesBtn.className = 'save-edit-btn';

        // Insert the button immediately after the Edit button
        editBtn.insertAdjacentElement('afterend', saveChangesBtn);
    }

    // Retrieve the current list of all recipes
    const allRecipes = getRecipesFromStorage();

    // Loop through each card and add a checkbox for selecting it
    cards.forEach(card => {
        // Create a wrapper for styling the checkbox
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('card-checkbox-wrapper');

        // Create the checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('meal-select-checkbox');
        checkbox.style.width = '60px';
        checkbox.style.height = '60px';
        checkbox.style.cursor = 'pointer';
        checkbox.style.accentColor = '#3f51b5';

        // Use createdAt as a unique ID to track the recipe
        checkbox.dataset.createdAt = card._data.createdAt;

        // Find the corresponding recipe data
        const recipe = allRecipes.find(r => r.createdAt === card._data.createdAt);

        // If the recipe is part of the meal, pre-check the box
        if (recipe?.tags?.includes(mealName)) {
            checkbox.checked = true;
        }

        // Add the checkbox to its wrapper
        checkboxWrapper.appendChild(checkbox);

        // Insert the checkbox into the shadow DOM of the recipe card
        const container = card.shadowRoot.querySelector('.card-container');
        container.style.position = 'relative';
        container.insertBefore(checkboxWrapper, container.firstChild);
    });

    // Define the behavior when the Save Changes button is clicked
    saveChangesBtn.onclick = () => {
        // Collect the IDs of all recipe cards with checked checkboxes
        const selected = [];
        document.querySelectorAll('recipe-card').forEach(card => {
            const checkbox = card.shadowRoot.querySelector('.meal-select-checkbox');
            if (checkbox?.checked) {
                selected.push(checkbox.dataset.createdAt);
            }
        });

        // Update the tags for each recipe based on selection
        const allRecipes = getRecipesFromStorage();
        const updated = allRecipes.map(recipe => {
            const tags = recipe.tags || [];

            // Check if the recipe currently has the meal tag
            const hasTag = tags.includes(mealName);

            // Determine whether it should have the tag based on selection
            const shouldHaveTag = selected.includes(recipe.createdAt);

            // If it should have the tag but doesn't, add it
            if (shouldHaveTag && !hasTag) {
                tags.push(mealName);
            }
            // If it shouldn't have the tag but does, remove it
            else if (!shouldHaveTag && hasTag) {
                const index = tags.indexOf(mealName);
                if (index !== -1) tags.splice(index, 1);
            }

            recipe.tags = tags;
            return recipe;
        });

        // Save updated recipes to localStorage
        saveRecipesToStorage(updated);

        // Refresh the meal list UI on the left
        renderMealList();

        // Clear and re-render all recipe cards
        document.querySelector('main').innerHTML = '';
        addRecipesToDocument(updated);

        // Remove all checkboxes from shadow DOM
        document.querySelectorAll('recipe-card').forEach(card => {
            const wrapper = card.shadowRoot.querySelector('.card-checkbox-wrapper');
            if (wrapper) wrapper.remove();
        });

        // Remove the Save Changes button from the DOM
        saveChangesBtn.remove();
    };
}

// 

window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-field-small');
    const searchButton = document.querySelector('[type="submit"]');

    function handleSearch() {
        const query = searchInput.value.trim();
        if (query !== '') {
            localStorage.setItem('searchQuery', query);
            // navigate to my-recipes
            window.location.href = '../RecipeCard/my-recipes.html';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
});

// Prevents reloading page if already on the said page
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (event) {
        const current = window.location.pathname;
        const target = new URL(this.href).pathname;
        if (current === target) {
            event.preventDefault();
            console.log('You are already on this tab.');
        }
    });
});