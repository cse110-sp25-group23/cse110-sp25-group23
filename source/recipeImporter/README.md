# Recipe Importer

A module that allows users to import recipes from external websites using the Spoonacular API. The importer extracts recipe data and converts it into the application's recipe card format.

## Features

- Import recipes from any supported website URL
- Automatic extraction of recipe name, ingredients, steps, and cooking time
- Conversion of imported data to match the application's recipe card schema
- Duplicate detection to prevent importing the same recipe multiple times
- Error handling for invalid URLs, network issues, and API limitations

## Setup

1. Get a Spoonacular API key from [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Replace the `SPOONACULAR_API_KEY` constant in `recipeImporter.js` with your API key
3. Import the module in your HTML file:
   ```html
   <script type="module">
     import { importRecipeFromUrl, saveImportedRecipe } from './recipeImporter.js';
   </script>
   ```

## Usage

```javascript
// Import a recipe from a URL
try {
  const recipe = await importRecipeFromUrl('https://example.com/recipe');
  const savedRecipe = saveImportedRecipe(recipe);
  console.log('Recipe imported successfully:', savedRecipe);
} catch (error) {
  console.error('Import failed:', error.message);
}
```

## Manual Testing

1. Open `recipeImporter/myrecipes.html` in your browser
2. Enter a recipe URL in the input field
3. Click "Import Recipe"
4. Verify that:
   - The recipe card appears with correct data
   - The recipe is saved to localStorage
   - The recipe can be found in the recipe list
   - The recipe can be added to meal plans

## Screenshots

Screenshots of the importer in action can be found in the `docs/screenshots/recipe-importer` directory.

## Error Cases

The importer handles the following error cases:
- Invalid URLs
- Network connectivity issues
- API quota exceeded
- Recipe not found
- Duplicate recipes
- Malformed recipe data

## Dependencies

- Spoonacular API (requires API key)
- Modern browser with fetch API support
- LocalStorage API

## **Main functionalities or points to consider:**
- `importRecipeFromUrl(url)`: Fetches recipe data from a given URL using the Spoonacular API, validates the URL, handles API errors, and transforms the response into the application's recipe schema.
- `saveImportedRecipe(recipe)`: Saves the transformed recipe object to the browser's local storage, preventing duplicates. 