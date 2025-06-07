import { expect, test, jest } from '@jest/globals';
import { importRecipeFromUrl, saveImportedRecipe } from '../source/recipeImporter/recipeImporter.js';

// Mock fetch and localStorage
global.fetch = jest.fn();
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

describe('Recipe Importer', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue('[]');
    });

    describe('importRecipeFromUrl', () => {
        it('should reject invalid URLs', async () => {
            await expect(importRecipeFromUrl('not-a-url')).rejects.toThrow('Please enter a valid URL');
        });

        it('should handle API quota exceeded', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 402
            });

            await expect(importRecipeFromUrl('https://example.com/recipe'))
                .rejects.toThrow('API quota exceeded');
        });

        it('should handle recipe not found', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404
            });

            await expect(importRecipeFromUrl('https://example.com/recipe'))
                .rejects.toThrow('Recipe not found');
        });

        it('should successfully import a valid recipe', async () => {
            const mockRecipeData = {
                title: 'Test Recipe',
                sourceName: 'Test Author',
                image: 'test.jpg',
                extendedIngredients: [
                    { name: 'Ingredient 1', amount: 1, unit: 'cup' }
                ],
                analyzedInstructions: [{
                    steps: [{ step: 'Step 1' }]
                }],
                readyInMinutes: 30
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockRecipeData)
            });

            const recipe = await importRecipeFromUrl('https://example.com/recipe');
            expect(recipe).toEqual({
                name: 'Test Recipe',
                author: 'Test Author',
                image: 'test.jpg',
                ingredients: [{ name: 'Ingredient 1', unit: '1 cup' }],
                steps: ['Step 1'],
                tags: [],
                timeEstimate: '30 minutes',
                favorite: false,
                createdAt: expect.any(String),
                sourceurl: 'https://example.com/recipe'
            });
        });
    });

    describe('saveImportedRecipe', () => {
        it('should save a new recipe to localStorage', () => {
            const recipe = {
                name: 'Test Recipe',
                author: 'Test Author',
                ingredients: [],
                steps: [],
                tags: [],
                timeEstimate: '30 min',
                favorite: false,
                createdAt: new Date().toISOString(),
                sourceurl: 'https://example.com/recipe'
            };

            const result = saveImportedRecipe(recipe);

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'recipes',
                JSON.stringify([recipe])
            );
            expect(result).toEqual(recipe);
        });

        it('should prevent duplicate recipes', () => {
            const existingRecipe = {
                name: 'Test Recipe',
                author: 'Test Author',
                ingredients: [],
                steps: [],
                tags: [],
                timeEstimate: '30 min',
                favorite: false,
                createdAt: new Date().toISOString(),
                sourceurl: 'https://example.com/recipe'
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify([existingRecipe]));

            expect(() => saveImportedRecipe(existingRecipe))
                .toThrow('This recipe has already been imported');
        });

        it('should handle localStorage errors', () => {
            mockLocalStorage.setItem.mockImplementationOnce(() => {
                throw new Error('Storage error');
            });

            expect(() => saveImportedRecipe({ 
                name: 'Test', 
                author: 'Test',
                ingredients: [],
                steps: [],
                tags: [],
                timeEstimate: '30 min',
                favorite: false,
                createdAt: new Date().toISOString(),
                sourceurl: 'https://example.com/recipe'
            }))
                .toThrow('Storage error');
        });
    });
}); 