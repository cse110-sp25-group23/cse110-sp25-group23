import { expect, test, jest } from '@jest/globals';

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Mock DOM elements
document.body.innerHTML = `
    <div id="meal-list"></div>
    <div id="meal-cards-display"></div>
    <button id="create-meal-btn">Create Meal</button>
    <div id="meal-controls" style="display: none;">
        <input id="meal-name-input" type="text">
        <button id="save-meal-btn">Save Meal</button>
    </div>
    <div id="cardsContainer"></div>
`;

// Import the meal planner functions
import { saveMealsToStorage, getMealsFromStorage, displayMealCards, createMealUI } from '../source/recipeCard/mealPlanner.js';

describe('Meal Planner', () => {
    beforeEach(() => {
        // Clear all mocks and DOM elements
        jest.clearAllMocks();
        // Reset mocks for each test
        mockLocalStorage.getItem.mockClear();
        mockLocalStorage.setItem.mockClear();
        // Set initial return value for getItem
        mockLocalStorage.getItem.mockReturnValue('[]');
        document.getElementById('meal-list').innerHTML = '';
        document.getElementById('meal-cards-display').innerHTML = '';
        document.getElementById('meal-name-input').value = '';
        document.getElementById('meal-controls').style.display = 'none';
    });

    describe('Storage Functions', () => {
        it('should save meals to localStorage', () => {
            const meals = {
                'Breakfast': [{ name: 'Oatmeal', author: 'Test' }],
                'Lunch': [{ name: 'Sandwich', author: 'Test' }]
            };

            saveMealsToStorage(meals);

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'savedMeals',
                JSON.stringify(meals)
            );
        });

        it('should get meals from localStorage', () => {
            const meals = {
                'Breakfast': [{ name: 'Oatmeal', author: 'Test' }]
            };

            mockLocalStorage.getItem.mockReturnValue(JSON.stringify(meals));

            const result = getMealsFromStorage();

            expect(result).toEqual(meals);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('savedMeals');
        });

        it('should return empty object if no meals in storage', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const result = getMealsFromStorage();

            expect(result).toEqual({});
        });
    });

    describe('UI Functions', () => {
        it('should create meal UI elements', () => {
            const mealName = 'Breakfast';
            const recipes = [{ name: 'Oatmeal', author: 'Test' }];

            createMealUI(mealName, recipes);

            const mealList = document.getElementById('meal-list');
            const wrapper = mealList.querySelector('.meal-ui-wrapper');
            const mealButton = wrapper.querySelector('.meal-btn');
            const deleteBtn = wrapper.querySelector('.delete-meal-btn');

            expect(wrapper).toBeTruthy();
            expect(mealButton.textContent).toBe(mealName);
            expect(deleteBtn.textContent).toBe('Delete');
        });

        it('should display meal cards', () => {
            const recipes = [
                { name: 'Oatmeal', author: 'Test' },
                { name: 'Toast', author: 'Test' }
            ];

            // Mock recipe-card element
            class RecipeCard extends HTMLElement {
                set data(d) {
                    this._data = d;
                }
            }
            customElements.define('recipe-card', RecipeCard);

            displayMealCards(recipes);

            const container = document.getElementById('meal-cards-display');
            const cards = container.querySelectorAll('recipe-card');

            expect(cards.length).toBe(2);
            expect(cards[0]._data).toEqual(recipes[0]);
            expect(cards[1]._data).toEqual(recipes[1]);
        });

        it('should handle meal deletion', () => {
            const mealName = 'Breakfast';
            const recipes = [{ name: 'Oatmeal', author: 'Test' }];

            // Mock confirm to return true
            global.confirm = jest.fn(() => true);

            // Set initial state of localStorage for this specific test
            mockLocalStorage.getItem.mockReturnValue(JSON.stringify({ [mealName]: recipes }));

            createMealUI(mealName, recipes); // This creates the UI element

            const deleteBtn = document.querySelector('.delete-meal-btn');

            // Clear the mock *before* the action that triggers setItem
            mockLocalStorage.setItem.mockClear();

            deleteBtn.click(); // This will call saveMealsToStorage(savedMeals) internally

            // Now assert that setItem was called with the empty object
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'savedMeals',
                JSON.stringify({})
            );
            expect(document.querySelector('.meal-ui-wrapper')).toBeNull();
        });
    });
});