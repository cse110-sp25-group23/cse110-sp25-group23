/**
 * @jest-environment jsdom
 */

import { displayShelves, updateShelfCards } from '../source/RecipeCard/my-recipes.js';
import { getRecipesFromStorage, saveRecipesToStorage } from '../source/LocalStorage/storage.js';
import '../source/RecipeCard/my-recipes.js';


describe('Test My-Recipes Shelves', () => {
    let testRecipes;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="shelf-container"></div>
        `;
        localStorage.clear();

        testRecipes = [
            {
                name: 'Waffles',
                author: 'Luis',
                image: '/waffles.png',
                tags: ['Easy','Breakfast'],
                ingredients: [
                    { name: 'Flour', unit: '1 cup' },
                    { name: 'Eggs', unit: '2' },
                    { name: 'Milk', unit: '1/2 cup' }
                ],
                steps: ['Mix', 'Cook'],
                timeEstimate: '15 min',
                favorite: false,
                createdAt: new Date().toISOString(),
                sourceurl: ''
            },
            {
                name: 'Belgian Waffle',
                author: 'Luis',
                image: '/waffles.png',
                tags: ['Easy','Breakfast'],
                ingredients: [
                    { name: 'Flour', unit: '1 cup' },
                    { name: 'Eggs', unit: '2' },
                    { name: 'Milk', unit: '1/2 cup' }
                ],
                steps: ['Mix', 'Cook', 'Eat'],
                timeEstimate: '20 min',
                favorite: true,
                createdAt: new Date().toISOString(),
                sourceurl: ''
            }
        ];

        saveRecipesToStorage(testRecipes);
    });

    test('check that displayShelves creates shelves in DOM', () => {
            displayShelves();

            const shelves = document.querySelectorAll('.shelf-section');
            expect(shelves.length).toBeGreaterThan(0);

            const shelfTitles = [...shelves].map(shelf => shelf.querySelector('h2').textContent);

            expect(shelfTitles).toContain('All Recipes');
            expect(shelfTitles).toContain('Favorites');
            expect(shelfTitles).toContain('Easy');
            expect(shelfTitles).toContain('Recently Created');
            expect(shelfTitles).toContain('Breakfast');
       
    });

    test('check that recipesUpdated custom event causes shelf to render again', () => {
        const shelfContainer = document.getElementById('shelf-container');
        expect(shelfContainer.children.length).toBe(0);

        window.dispatchEvent(new Event('recipesUpdated'));

        expect(shelfContainer.children.length).toBeGreaterThan(0);
    });
});
