import { jest } from '@jest/globals';
import { importRecipeFromUrl, saveImportedRecipe } from '../source/recipeImporter.js';

// Mock fetch and localStorage
global.fetch = jest.fn();
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

describe('Recipe Importer Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        fetch.mockClear();
        localStorage.getItem.mockClear();
        localStorage.setItem.mockClear();
    });

    test('importRecipeFromUrl successfully imports a recipe', async () => {
        // Mock successful API response
        const mockRecipeData = {
            title: 'Test Recipe',
            image: 'test-image.jpg',
            extendedIngredients: [
                { name: 'Ingredient 1', amount: 1, unit: 'cup' },
                { name: 'Ingredient 2', amount: 2, unit: 'tbsp' }
            ],
            analyzedInstructions: [{
                steps: [
                    { step: 'Step 1' },
                    { step: 'Step 2' }
                ]
            }],
            servings: 4,
            readyInMinutes: 30
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockRecipeData)
        });

        const result = await importRecipeFromUrl('https://example.com/recipe');

        expect(result).toEqual({
            id: expect.any(String),
            title: 'Test Recipe',
            image: 'test-image.jpg',
            ingredients: [
                { name: 'Ingredient 1', amount: 1, unit: 'cup' },
                { name: 'Ingredient 2', amount: 2, unit: 'tbsp' }
            ],
            instructions: ['Step 1', 'Step 2'],
            servings: 4,
            readyInMinutes: 30,
            sourceUrl: 'https://example.com/recipe',
            importedAt: expect.any(String)
        });
    });

    test('importRecipeFromUrl handles invalid URL', async () => {
        await expect(importRecipeFromUrl('invalid-url'))
            .rejects
            .toThrow('Please enter a valid URL');
    });

    test('importRecipeFromUrl handles API error', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found'
        });

        await expect(importRecipeFromUrl('https://example.com/recipe'))
            .rejects
            .toThrow('Recipe not found. Please check the URL and try again.');
    });

    test('saveImportedRecipe saves recipe to localStorage', () => {
        const mockRecipe = {
            title: 'Test Recipe',
            ingredients: []
        };

        localStorage.getItem.mockReturnValue('[]');
        
        saveImportedRecipe(mockRecipe);

        expect(localStorage.setItem).toHaveBeenCalledWith(
            'recipes',
            expect.stringContaining('Test Recipe')
        );
    });

    test('saveImportedRecipe prevents duplicate recipes', () => {
        const mockRecipe = {
            title: 'Test Recipe',
            sourceUrl: 'https://example.com/recipe',
            ingredients: []
        };

        localStorage.getItem.mockReturnValue(JSON.stringify([mockRecipe]));
        
        expect(() => saveImportedRecipe(mockRecipe))
            .toThrow('This recipe has already been imported');
    });
}); 