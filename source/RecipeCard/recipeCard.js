/**
 * Custom element that displays and manages a recipe card
 * Allows for rendering, editing and the deletion of a recipe
 * stored locally.
 */
import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';
import { getRecipeCardTemplateCSS } from '../RecipeCard/recipeCardTemplateCSS.js';
// Import the existing Cart helper from your shoppingCart folderAdd commentMore actions
import { Cart } from '../ShoppingCart/cart.js';

export class RecipeCard extends HTMLElement {
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

        // Create and append <style> element to our current card component
        const style = document.createElement('style');
        style.textContent = getRecipeCardTemplateCSS();
        this.shadowRoot.appendChild(style);

        // Create outer container and add content inside its shadow DOM
        const container = document.createElement('div');
        container.classList.add('card-container');

        //div containers added for ingredients and tags to make future css styling easier
        container.innerHTML = `
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <button class="toggle">Fullscreen</button>
                    <button class="favorite-btn ${recipeData.favorite ? 'favorited' : ''}" aria-label="Favorite">♥</button>
                    <img src="${recipeData.image}" alt="${recipeData.name}" class="recipe-image">
                    <p class="recipe-name">${recipeData.name}</p>
                    <p class="recipe-author">Author: ${recipeData.author}</p>
                    <p>Ingredients:</p>
                    <div class="ingredients-scroll">
                        <ul>
                            ${recipeData.ingredients.map(ing => `<li>${ing.name}${ing.unit ? ' - ' + ing.unit : ''}</li>`).join('')}
                        </ul>
                    </div>
                    <!-- INSERTED “Buy ingredients” button -->        
                    <!-- —— NEW: “Add to cart” button (no redirect) —— -->
                    <button class="add-to-cart-btn">Add to cart</button>
                    <div class="tags-wrapper">
                        <div class="tags-class">
                            ${recipeData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="flip-card-back">
                    <p>Steps: </p>
                    <div class="steps-list">
                        <ol>
                            ${recipeData.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>                    
                    </div>
                    <p>Time Estimate: ${recipeData.timeEstimate}</p>
                </div>
            </div>
        </div>
        `;

        //add this div container to shadow root
        this.shadowRoot.appendChild(container);

        // —— NEW: “Add to cart” button logic (identical to buyBtn except no redirect) —— //
        const addCartBtn = container.querySelector('.add-to-cart-btn');
        addCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Build the same miniRecipe object
            const miniRecipe = {
                id: `cart-${recipeData.id}`,
                ingredients: recipeData.ingredients.map(ing => ({
                id: `${recipeData.id}-${ing.name}`,
                name: ing.name,
                qty: ing.qty,
                unit: ing.unit || ''
                }))
            };

            // Add to Cart
            Cart.addRecipe(miniRecipe);

            // Instant UI feedback on this button only (no redirect)
            addCartBtn.textContent = '✔ In Cart';
            addCartBtn.disabled = true;
            setTimeout(() => {
                addCartBtn.textContent = 'Add to cart';
                addCartBtn.disabled = false;
            }, 1500);
        });
        /* Structure of our recipe-card
        <recipe-card ....>
            <style>
                //imported
            </style>
            <div class="card-container">
                <div class="flip-card">
                    //all the inner stuff
                </div>
            </div>
        </recipe-card>
        */

        const wrapper = container.querySelector('.tags-wrapper');
        const tags = container.querySelector('.tags-class');

        // Use requestAnimationFrame to ensure layout is updated
        requestAnimationFrame(() => {
            if (tags.scrollWidth > wrapper.clientWidth) {
                // Duplicate content to allow looping feel
                tags.innerHTML += tags.innerHTML;
                tags.classList.add('scroll-animate');
            }
        });

        // add the JS script for toggling card flip here. Since .flip-card is in shadow DOM
        // we can't look for it or toggle it anywhere else but here
        const flipCard = container.querySelector('.flip-card');
        flipCard.addEventListener('click', () => {
            flipCard.classList.toggle('flipped');
        });

        // add event handling for clicking the favorite button
        const favButton = container.querySelector('.favorite-btn');
        favButton.addEventListener('click', (e) => {
            //prevents flipping
            e.stopPropagation();

            // Toggle favorite
            favButton.classList.toggle('favorited');
            this._data.favorite = !this._data.favorite;

            // Update localStorage
            let localRecipes = getRecipesFromStorage();
            //use createdAt date to determine which card has been updated
            let index = -1;
            for (let i = 0; i < localRecipes.length; i++) {
                if (localRecipes[i].createdAt === this._data.createdAt) {
                    index = i;
                    break;
                }
            }

            if (index !== -1) {
                localRecipes[index].favorite = this._data.favorite;
                saveRecipesToStorage(localRecipes);
            }

            // dispatch this custom event, will update my-recipes shelf to show this change
            window.dispatchEvent(new Event('recipesUpdated'));
        });

        //event handling for clicking fullscreen button
        const fullscreenBtn = container.querySelector(".toggle");
        fullscreenBtn.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevents the card click from flipping

            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                flipCard.requestFullscreen();
            }
        });


        // Initialize delete and update logic
        delete_card(this.shadowRoot, this);
        update_card(this.shadowRoot, this, recipeData);
    }
}

// Define the custom recipe card element
customElements.define('recipe-card', RecipeCard);

//removed createCard()
// Moved it to storage and is now initFormHandler

/**
 * Allows for users to edit/update recipe card through an edit 
 * and save button
 * @param {*} shadowRoot  - Shadow DOM of recipe card
 * @param {*} hostElement - recipe-card custom element
 * @param {*} recipeData  - Original data object 
 */
export function update_card(shadowRoot, hostElement, recipeData) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');
    shadowRoot.appendChild(editButton);

    editButton.addEventListener('click', () => {
        const originalData = { ...recipeData };

        //Can add more tags as we implement card (remember to edit HTML to sync)
        const predefinedTags = ["Easy", "Advanced", "Pro"];
        const originalTags = recipeData.tags;

        //separate tags originally selected
        const predefinedSelectedTags = originalTags.filter(tag => predefinedTags.includes(tag));
        const customTags = originalTags.filter(tag => !predefinedTags.includes(tag));

        //innerHTML for tagging done outside shadowRoot for sake of readability
        const editPredefinedTags = predefinedTags.map(tag => `
            <label>
                <input type="checkbox" class="edit-tag-checkbox" value="${tag}" ${predefinedSelectedTags.includes(tag) ? 'checked' : ''}>${tag}
            </label><br>
            `).join('');

        const editCustomTags = `
            <label>
            Custom Tags :<input type="text" class="edit-custom-tags" value="${customTags.join(', ')}" />  
            </label>
        `;

        shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                background: white;
                padding: 20px;
                border-radius: 12px;
            }
        </style>
        <label>Name: <input type="text" value="${originalData.name}" class="edit-name"></label><br>
        <label>Author: <input type= "text" value="${originalData.author}" class="edit-author"></label><br>
        <label>Image: <input type="text" value="${originalData.image}" class="edit-image"></label><br>
        <label>Time Estimate: <input type="text" value="${originalData.timeEstimate || ''}" class="edit-time"></label><br>
        <fieldset>
            <legend>Tags:</legend>
            ${editPredefinedTags}
            ${editCustomTags}
        </fieldset>
        <label>Ingredients: <textarea class ="edit-ingredients" cols="30" placeholder="Format: \nMilk - 2 cups">${originalData.ingredients.map(i => `${i.name} - ${i.unit || ''}`).join('\n')}</textarea></label><br>
        <label>Steps: <textarea class="edit-steps" placeholder="Step1 \nStep2">${originalData.steps ? originalData.steps.join('\n') : ''}</textarea></label><br>
        <button class="save-btn">Save</button>
        `;

        const saveButton = shadowRoot.querySelector('.save-btn');
        saveButton.addEventListener('click', () => {
            //tag handling: 
            //predefined tags
            const checkedTags = [];
            const checkBoxedTags = shadowRoot.querySelectorAll('.edit-tag-checkbox');

            checkBoxedTags.forEach(checkbox => {
                if (checkbox.checked) {
                    checkedTags.push(checkbox.value);
                }
            });

            //custom tags
            const editedCustomTags = shadowRoot.querySelector('.edit-custom-tags').value;
            const savedCustomTags = editedCustomTags.split(',').map(tag => tag.trim()).filter(Boolean);

            const allEditedTags = checkedTags.concat(savedCustomTags);

            //need to handle ingredients and steps since both are stringified arrays
            const editedIngredients = shadowRoot.querySelector('.edit-ingredients').value;
            const savedIngredients = editedIngredients.split('\n')
                .map(line => {
                    const [name, unit] = line.split('-').map(s => s.trim());
                    return name ? { name, unit: unit || '' } : null;
                })
                .filter(obj => obj);

            const editedSteps = shadowRoot.querySelector('.edit-steps').value;
            const savedSteps = editedSteps
                .split('\n')
                .map(step => step.trim())
                .filter(step => step.length > 0);

            const updatedData = {
                name: shadowRoot.querySelector('.edit-name').value,
                author: shadowRoot.querySelector('.edit-author').value,
                image: shadowRoot.querySelector('.edit-image').value,
                timeEstimate: shadowRoot.querySelector('.edit-time').value,
                tags: allEditedTags,
                ingredients: savedIngredients,
                steps: savedSteps
            };

            //Updating logic --> compare new data with original to check for changes

            let hasChanges = false;
            const finalData = { ...originalData };

            for (const key in updatedData) {
                if (updatedData[key] !== originalData[key]) {
                    finalData[key] = updatedData[key];
                    hasChanges = true;
                }
            }

            shadowRoot.innerHTML = '';
            if (hasChanges) {

                hostElement.data = finalData;
            } else {
                hostElement.data = originalData;
            }

            let localRecipes = getRecipesFromStorage();
            const index = localRecipes.findIndex(r => JSON.stringify(r) === JSON.stringify(originalData));
            if (index !== -1) {
                localRecipes[index] = finalData;
                saveRecipesToStorage(localRecipes);
            }

            // dispatch this custom event, will update my-recipes shelf to show this change
            window.dispatchEvent(new Event('recipesUpdated'));
        });
    });
}

/**
 * Allows users to delete a recipe card 
 * @param {*} shadowRoot  - Shadow DOM of a recipe card
 * @param {*} hostElement - recipe-card custom element
 */
function delete_card(shadowRoot, hostElement) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    shadowRoot.appendChild(deleteButton);


    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            //update local storage
            let recipeString = localStorage.getItem('recipes');
            //turn the recipesString into an array
            console.log(`${hostElement}`);
            console.log(`${recipeString}`);
            let recipes = [];
            if (recipeString != null) {
                recipes = JSON.parse(recipeString);
            }

            const deletedRecipe = hostElement._data;

            // filter the recipes array so it contains every recipe besides the one to delete
            recipes = recipes.filter(recipe =>
                !(recipe.name === deletedRecipe.name &&
                    recipe.author === deletedRecipe.author &&
                    JSON.stringify(recipe.ingredients) === JSON.stringify(deletedRecipe.ingredients) &&
                    JSON.stringify(recipe.steps) === JSON.stringify(deletedRecipe.steps)
                )
            );

            localStorage.setItem('recipes', JSON.stringify(recipes));

            hostElement.remove();

            // dispatch this custom event, will update my-recipes shelf to show this change
            window.dispatchEvent(new Event('recipesUpdated'));
        });
    }
}
