// Creating the recipe card
class RecipeCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    
set data(recipeData) {
    if (!recipeData) return;
    //store the string recipeData so we can find it in localStorage when deleting
    this._data = recipeData;    
    // Create content inside the shadow DOM
    this.shadowRoot.innerHTML = `
      <h2>${recipeData.name}</h2>
      <p>Author: ${recipeData.author}</p>
      <img src="${recipeData.image}" alt="${recipeData.name}" style="width:100px;height:auto;">
      <p>Tags: ${recipeData.difficulty} ${recipeData.tags}</p>
      <p>Ingredients: ${recipeData.ingredients}</p>
      <p>Steps: ${recipeData.steps}</p>
      <button class='delete-btn'>Delete</button>
    `;
    //Tag format needs work (is it a list of tags or just 1?)
    delete_card(this.shadowRoot,this);
  }   
}

customElements.define('recipe-card', RecipeCard);

function delete_card(shadowRoot, hostElement) {
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
