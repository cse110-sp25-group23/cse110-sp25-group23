/**
 * @jest-environment jsdom
 */

// Import js files for recipe card and local storage
import '../source/RecipeCard/recipeCard.js';
import { addRecipesToDocument, saveRecipesToStorage } from '../source/LocalStorage/storage.js';

describe('Recipe Card Creator and Deletion', () => {
    // Create Recipe Card
    const testRecipe = {
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
    };

    // Before each test, clear storage and displayed cards
    beforeEach(() => {
        document.body.innerHTML = '<main></main>';
        localStorage.clear();
    });

    test('Check all attributes are correct', () => {
        const card = document.createElement('recipe-card');
        document.querySelector('main').append(card);
        card.data = testRecipe;

        const sr = card.shadowRoot;

        // Updated selectors
        expect(sr.querySelector('.recipe-name').textContent).toBe(testRecipe.name);
        expect(sr.querySelector('.recipe-author').textContent).toContain(testRecipe.author);
        expect(sr.querySelector('img.recipe-image').getAttribute('src')).toBe(testRecipe.image);

        const tags = Array.from(sr.querySelectorAll('.tags-class span')).map(el => el.textContent);
        expect(tags).toEqual(testRecipe.tags);

        const ingredients = Array.from(sr.querySelectorAll('.ingredients-scroll li')).map(el => el.textContent);
        expect(ingredients).toEqual(["Flour - 1 cup","Eggs - 2", "Milk - 1/2 cup"]);

        const steps = Array.from(sr.querySelectorAll('.steps-list li')).map(el => el.textContent);
        expect(steps).toEqual(testRecipe.steps);

        expect(sr.textContent).toContain(testRecipe.timeEstimate);

        expect()
    });

    test('Delete Button Removes the Card From LocalStorage and from html', () => {
        saveRecipesToStorage([testRecipe]);

        const card = document.createElement('recipe-card');
        document.querySelector('main').append(card);
        card.data = testRecipe;

        const btn = card.shadowRoot.querySelector('.delete-btn');
        btn.click();

        expect(document.querySelector('recipe-card')).toBeNull();

        const stored = JSON.parse(localStorage.getItem('recipes'));
        expect(stored).toEqual([]);
    });

    test('Test addRecipesToDocument to ensure it only adds one card', () => {
        const recipes = [ {...testRecipe, name:'A'}, {...testRecipe, name:'B'} ];
        addRecipesToDocument(recipes);

        const cards = document.querySelectorAll('main > recipe-card');
        expect(cards).toHaveLength(2);

        const renderedNames = Array.from(cards).map(c => c.shadowRoot.querySelector('.recipe-name').textContent);
        expect(renderedNames).toEqual(['A','B']);
    });
});

describe('Editing Card', () => {
    const testRecipe = {
        name: 'waffles',
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
    };

    let card;

    beforeEach(() => {
        document.body.innerHTML = '<main></main>';
        card = document.createElement('recipe-card');
        document.querySelector('main').append(card);
        card.data = testRecipe;
    });

    test('Hitting edit changes display to edit form', () => {
        const editBtn = Array.from(card.shadowRoot.querySelectorAll('button')).find(b => b.textContent === 'Edit');
        editBtn.click();

        expect(card.shadowRoot.querySelector('.edit-name')).toBeInstanceOf(HTMLInputElement);
        expect(card.shadowRoot.querySelector('.save-btn')).toBeInstanceOf(HTMLButtonElement);
    });

    test('Changing things in card leads to a change in display and localStorage', () => {
        saveRecipesToStorage([testRecipe]);
        document.querySelector('main').append(card);
        card.data = testRecipe;

        const buttons = Array.from(card.shadowRoot.querySelectorAll('button'));
        const editBtn = buttons.find(btn => btn.textContent.trim() === 'Edit');
        expect(editBtn).toBeDefined();
        editBtn.click();

        const nameInput = card.shadowRoot.querySelector('.edit-name');
        nameInput.value = 'Belgian Waffle';

        const stepsInput = card.shadowRoot.querySelector('.edit-steps');
        stepsInput.value = 'Mix\nCook\nEat';

        const ingredientsInput = card.shadowRoot.querySelector('.edit-ingredients');
        ingredientsInput.value = 'Flour - 1 cup\nEggs - 2';

        const saveBtn = card.shadowRoot.querySelector('.save-btn');
        expect(saveBtn).toBeInstanceOf(HTMLButtonElement);
        saveBtn.click();

        expect(card.shadowRoot.querySelector('.recipe-name').textContent)
            .toBe('Belgian Waffle');

        const displayedIngredients = Array.from(card.shadowRoot.querySelectorAll('.ingredients-scroll li')).map(li => li.textContent);
        expect(displayedIngredients).toEqual(['Flour - 1 cup', 'Eggs - 2']);
                
        const displayedSteps = Array.from(card.shadowRoot.querySelectorAll('.steps-list li')).map(li => li.textContent);
        expect(displayedSteps).toEqual(['Mix', 'Cook', 'Eat']);

        const stored = JSON.parse(localStorage.getItem('recipes'));
        expect(stored[0].name).toBe('Belgian Waffle');

        expect(stored[0].ingredients).toEqual([
            { name: 'Flour', unit: '1 cup' },
            { name: 'Eggs', unit: '2' }
        ]);

        expect(stored[0].steps).toEqual(['Mix', 'Cook', 'Eat']);
    });
});
