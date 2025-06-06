import { importRecipeFromUrl, saveImportedRecipe } from '../source/recipeImporter/recipeImporter.js';

// Mock fetch and localStorage
global.fetch = jest.fn();
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

describe('Recipe Importer', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        localStorage.getItem.mockReturnValue('[]');
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
            const mockRecipe = {
                title: 'Test Recipe',
                sourceName: 'Test Source',
                image: 'test.jpg',
                extendedIngredients: [
                    { name: 'Ingredient 1', amount: 2, unit: 'cups' },
                    { name: 'Ingredient 2', amount: 1, unit: 'tbsp' }
                ],
                analyzedInstructions: [{
                    steps: [
                        { step: 'Step 1' },
                        { step: 'Step 2' }
                    ]
                }],
                readyInMinutes: 45
            };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockRecipe)
            });

            const result = await importRecipeFromUrl('https://example.com/recipe');

            expect(result).toEqual({
                name: 'Test Recipe',
                author: 'Test Source',
                image: 'test.jpg',
                ingredients: [
                    { name: 'Ingredient 1', unit: '2 cups' },
                    { name: 'Ingredient 2', unit: '1 tbsp' }
                ],
                steps: ['Step 1', 'Step 2'],
                timeEstimate: '45 minutes',
                favorite: false,
                createdAt: expect.any(String),
                tags: []
            });
        });
    });

    describe('saveImportedRecipe', () => {
        it('should save a new recipe to localStorage', () => {
            const recipe = {
                name: 'Test Recipe',
                author: 'Test Author'
            };

            const result = saveImportedRecipe(recipe);

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'recipes',
                JSON.stringify([recipe])
            );
            expect(result).toEqual(recipe);
        });

        it('should prevent duplicate recipes', () => {
            const existingRecipe = {
                name: 'Test Recipe',
                author: 'Test Author'
            };

            localStorage.getItem.mockReturnValue(JSON.stringify([existingRecipe]));

            expect(() => saveImportedRecipe(existingRecipe))
                .toThrow('This recipe has already been imported');
        });

        it('should handle localStorage errors', () => {
            localStorage.setItem.mockImplementationOnce(() => {
                throw new Error('Storage error');
            });

            expect(() => saveImportedRecipe({ name: 'Test', author: 'Test' }))
                .toThrow('Storage error');
        });
    });
}); 