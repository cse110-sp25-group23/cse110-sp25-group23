/**
 * Custom element that displays and manages a recipe card
 * Allows for rendering, editing and the deletion of a recipe
 * stored locally.
 */
import { getRecipesFromStorage, saveRecipesToStorage } from '../LocalStorage/storage.js';

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
        if(!recipeData) return;
        this._data = recipeData;
        // Create content inside the shadow DOM
        this.shadowRoot.innerHTML = `
        <h2>${recipeData.name}</h2>
        <p>Author: ${recipeData.author}</p>
        <img src="${recipeData.image}" alt="${recipeData.name}" style="width:100px;height:auto;">
        <p>Tags: </p>
        <ul>
            ${recipeData.tags.map(tag => `<li>${tag}</li>`).join('')}
        </ul>
        <p>Ingredients: ${recipeData.ingredients}</p>
        <p>Steps: ${recipeData.steps}</p>
        <button class='delete-btn'>Delete</button>
        <p>Time Estimate: ${recipeData.timeEstimate}</p>
        `;

    // Initialize delete and update logic
        delete_card(this.shadowRoot,this);
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
export function update_card(shadowRoot, hostElement, recipeData){
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    shadowRoot.appendChild(editButton);

    editButton.addEventListener('click', () => {
        const originalData   = { ...recipeData };

        //Can add more tags as we implement card (remember to edit HTML to sync)
        const predefinedTags = ["Easy", "Advanced", "Pro"];
        const originalTags   = recipeData.tags;

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
        <label>Name: <input type="text" value="${originalData.name}" class="edit-name"></label><br>
        <label>Author: <input type= "text" value="${originalData.author}" class="edit-author"></label><br>
        <label>Image: <input type="text" value="${originalData.image}" class="edit-image"></label><br>
        <label>Time Estimate: <input type="text" value="${originalData.timeEstimate || ''}" class="edit-time"></label><br>
        <fieldset>
            <legend>Tags:</legend>
            ${editPredefinedTags}
            ${editCustomTags}
        </fieldset>
        <label>Ingredients: <textarea class ="edit-ingredients">${originalData.ingredients}</textarea></label><br>
        <label>Recipe: <textarea class="edit-recipe">${originalData.recipe}</textarea></label><br>
        <button class="save-btn">Save</button>
        `;
        
        const saveButton = shadowRoot.querySelector('.save-btn');
        saveButton.addEventListener('click', () => {
        //tag handling: 
            //predefined tags
            const checkedTags    = [];
            const checkBoxedTags = shadowRoot.querySelectorAll('.edit-tag-checkbox'); 
            
            checkBoxedTags.forEach(checkbox => {
                if(checkbox.checked) {
                    checkedTags.push(checkbox.value);
                }
            });

            //custom tags
            const editedCustomTags =shadowRoot.querySelector('.edit-custom-tags').value;
            const savedCustomTags = editedCustomTags.split(',').map(tag => tag.trim()).filter(Boolean);

            const allEditedTags = checkedTags.concat(savedCustomTags);
        

            const updatedData = {
                name: shadowRoot.querySelector('.edit-name').value,
                author: shadowRoot.querySelector('.edit-author').value,
                image: shadowRoot.querySelector('.edit-image').value,
                timeEstimate: shadowRoot.querySelector('.edit-time').value,
                tags: allEditedTags,
                ingredients: shadowRoot.querySelector('.edit-ingredients').value,
                recipe: shadowRoot.querySelector('.edit-recipe').value
            };

        //Updating logic --> compare new data with original to check for changes

            let hasChanges = false;
            const finalData = { ...originalData};

            for(const key in updatedData) {
                if (updatedData[key] !== originalData[key]) {
                    finalData[key] = updatedData[key];
                    hasChanges = true;
                }
            }

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
        });
    });
}

/**
 * Allows users to delete a recipe card 
 * @param {*} shadowRoot  - Shadow DOM of a recipe card
 * @param {*} hostElement - recipe-card custom element
 */
export function delete_card(shadowRoot, hostElement) {
    const deleteButton = shadowRoot.querySelector('.delete-btn');
    if(deleteButton) {
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
                    recipe.ingredients === deletedRecipe.ingredients &&
                    recipe.steps === deletedRecipe.steps
                )
            );

            localStorage.setItem('recipes', JSON.stringify(recipes));

            hostElement.remove();
        });
    }
}


/**
 * Takes as input an array of recipes and for each one creates a
 * new <recipe-card> element, adds the recipe data to the card
 * using element.data = {...}, and then appends the new recipe
 * to the container (<main>)
 * @param {Array<Object>} recipes An array of recipes
 */

function addRecipesToDocument(recipes) {
    //or document.getElementById('cardsContainer')
	const container = document.querySelector('main');    

	for (let i = 0; i < recipes.length; i++) {
		let recipeCard = document.createElement('recipe-card');
		recipeCard.data = recipes[i];
		container.appendChild(recipeCard);
	}
}
