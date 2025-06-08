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

    // Get the "Stop Viewing" button that exits meal preview mode and restores full recipe list
    const stopViewingBtn = document.getElementById('stop-viewing-btn');

    /**
    * Triggered when the "Create Meal" button is clicked.
    * Displays the meal creation UI and injects checkboxes into all recipe cards for selection.
    */
    createMealBtn.addEventListener('click', () => {

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
        document.querySelectorAll('.card-checkbox-wrapper').forEach(wrapper => wrapper.remove());

        // Loop through each recipe card and inject a checkbox for meal selection
        const cards = document.querySelectorAll('recipe-card');

        cards.forEach((card, index) => {
            // Create a wrapper div to hold the checkbox and apply visual styling
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.classList.add('card-checkbox-wrapper');
            checkboxWrapper.style.position = 'absolute';            // position at top-left
            checkboxWrapper.style.top = '5px';
            checkboxWrapper.style.left = '5px';
            checkboxWrapper.style.zIndex = '1000';                  // make sure it's above the card
            checkboxWrapper.style.backgroundColor = 'white';        // contrast background
            checkboxWrapper.style.padding = '2px';                  // small padding around checkbox
            checkboxWrapper.style.borderRadius = '4px';             // slightly rounded corners

            // Create the actual checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';                             // make it a checkbox
            checkbox.classList.add('meal-select-checkbox');         // add a class for later querying
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


    /**
    * Triggered when the "Stop Viewing" button is clicked.
    * Exits meal preview mode and restores the full list of all recipe cards.
    */
    stopViewingBtn.addEventListener('click', () => {
        // Select the <main> element where recipe cards are shown
        const main = document.querySelector('main');

        // Clear out all currently displayed recipe cards
        main.innerHTML = '';

        // Re-render all recipes from localStorage (shows every card again)
        addRecipesToDocument(getRecipesFromStorage());

        // Hide the Stop Viewing button now that preview mode is over
        stopViewingBtn.style.display = 'none';

        // Clear the global state that tracks which meal was being previewed
        window.currentPreviewedMeal = null;
    });
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

/**
 * Event listener for when the recipe data is updated (e.g., after saving or deleting a recipe).
 * This ensures that orphaned meal tags are removed and the UI stays consistent.
 */
window.addEventListener('recipesUpdated', () => {
    // Get all current recipes from localStorage
    const allRecipes = getRecipesFromStorage();

    // Create a Set to track tags that are still used (excluding standard tags)
    const stillUsedTags = new Set();

    // Loop through all recipes and collect non-standard tags that are still in use
    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                stillUsedTags.add(tag);  // Only add custom meal names
            }
        });
    });

    // Remove unused custom tags from each recipe's tag list
    const cleanedRecipes = allRecipes.map(recipe => {
        recipe.tags = (recipe.tags || []).filter(tag =>
            ["Easy", "Advanced", "Pro"].includes(tag) || stillUsedTags.has(tag)
        );
        return recipe; // Return the updated recipe
    });

    // Save the cleaned-up recipes back into localStorage
    saveRecipesToStorage(cleanedRecipes);

    // Select the main card display area and clear it
    const main = document.querySelector('main');
    main.innerHTML = '';

    // Select the Stop Viewing button
    const stopViewingBtn = document.getElementById('stop-viewing-btn');

    // If the user was viewing a specific meal before the update...
    if (window.currentPreviewedMeal) {
        // Check if that meal still exists in the cleaned data
        const stillExists = cleanedRecipes.some(r =>
            r.tags && r.tags.includes(window.currentPreviewedMeal)
        );

        if (stillExists) {
            // If the meal still exists, re-show only those recipes
            showMealPreview(window.currentPreviewedMeal);
        } else {
            // If the meal was removed, reset the preview state
            window.currentPreviewedMeal = null;

            // Hide the Stop Viewing button
            stopViewingBtn.style.display = 'none';

            // Show all recipe cards instead
            addRecipesToDocument(cleanedRecipes);
        }
    } else {
        // If no meal was being previewed, just show all recipe cards
        stopViewingBtn.style.display = 'none';
        addRecipesToDocument(cleanedRecipes);
    }

    // Always refresh the meal list on the left to reflect tag cleanup
    renderMealList();
});

/**
 * Event listener for when a new recipe is created.
 * Updates the meal list on the sidebar to reflect any new tags/meals introduced by the new recipe.
 */
window.addEventListener('recipeCreated', () => {
    // Re-renders the meal list based on updated recipe data
    renderMealList();
});

/**
 * Renders the list of meals in the UI.
 * Each meal gets a list item with buttons to view, edit, or delete the associated recipe group.
 */
function renderMealList() {
    // Get the <ul> or <div> container that holds the meal buttons
    const mealList = document.getElementById('meal-list');

    // Clear the existing meal list so it can be re-rendered fresh
    mealList.innerHTML = '';

    // Get all saved recipes from localStorage
    const allRecipes = getRecipesFromStorage();

    // Create a Set to hold unique meal names (non-standard tags)
    const mealNames = new Set();

    // Loop through all recipes and collect custom tags as meal names
    allRecipes.forEach(recipe => {
        (recipe.tags || []).forEach(tag => {
            // Skip built-in tags like difficulty levels
            if (!["Easy", "Advanced", "Pro"].includes(tag)) {
                mealNames.add(tag); // Add meal name to the Set
            }
        });
    });

    // For each meal name found...
    mealNames.forEach(meal => {
        // Create a new <li> element to hold the buttons
        const li = document.createElement('li');

        // ===== VIEW BUTTON =====
        const viewBtn = document.createElement('button');
        viewBtn.textContent = meal; // Show the meal name as button text
        viewBtn.className = 'meal-view-btn'; // Style class
        // When clicked, preview only the recipes in this meal
        viewBtn.addEventListener('click', () => showMealPreview(meal));
        li.appendChild(viewBtn);

        // ===== EDIT BUTTON =====
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit'; // Label for the edit button
        editBtn.className = 'meal-edit-btn'; // Style class
        // When clicked, enter edit mode for this meal
        editBtn.addEventListener('click', () => startEditMeal(meal, editBtn));
        li.appendChild(editBtn);

        // ===== DELETE BUTTON =====
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete'; // Label for the delete button
        deleteBtn.className = 'meal-delete-btn'; // Style class
        // When clicked, remove this meal from all recipes
        deleteBtn.addEventListener('click', () => {
            // Stop any current meal preview and hide the stop button
            document.getElementById('stop-viewing-btn').style.display = 'none';
            window.currentPreviewedMeal = null;

            // Create an updated version of the recipe list without the deleted meal tag
            const updated = getRecipesFromStorage().map(recipe => {
                const tags = (recipe.tags || []).filter(tag => tag !== meal); // Remove the tag
                return { ...recipe, tags }; // Return updated recipe object
            });

            // Save the modified recipes to storage
            saveRecipesToStorage(updated);

            // Refresh the UI
            renderMealList(); // Re-render the meal list
            document.querySelector('main').innerHTML = ''; // Clear all cards
            addRecipesToDocument(updated); // Show all updated recipe cards
        });

        // Add the delete button to the list item
        li.appendChild(deleteBtn);

        // Add the fully built <li> to the meal list in the UI
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

    // Make the "Stop Viewing" button visible so the user can exit the preview
    document.getElementById('stop-viewing-btn').style.display = 'inline-block';
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
    document.getElementById('stop-viewing-btn').style.display = 'none';

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
