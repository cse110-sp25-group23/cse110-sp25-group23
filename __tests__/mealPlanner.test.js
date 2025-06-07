// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

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
const {
    saveMealsToStorage,
    getMealsFromStorage,
    displayMealCards,
    createMealUI
} = require('../source/recipeCard/mealPlanner.js');

describe('Meal Planner', () => {
    beforeEach(() => {
        // Clear all mocks and DOM elements
        jest.clearAllMocks();
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

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'savedMeals',
                JSON.stringify(meals)
            );
        });

        it('should get meals from localStorage', () => {
            const meals = {
                'Breakfast': [{ name: 'Oatmeal', author: 'Test' }]
            };

            localStorage.getItem.mockReturnValue(JSON.stringify(meals));

            const result = getMealsFromStorage();

            expect(result).toEqual(meals);
            expect(localStorage.getItem).toHaveBeenCalledWith('savedMeals');
        });

        it('should return empty object if no meals in storage', () => {
            localStorage.getItem.mockReturnValue(null);

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

            createMealUI(mealName, recipes);

            const deleteBtn = document.querySelector('.delete-meal-btn');
            deleteBtn.click();

            expect(localStorage.setItem).toHaveBeenCalledWith(
                'savedMeals',
                JSON.stringify({})
            );
            expect(document.querySelector('.meal-ui-wrapper')).toBeNull();
        });
    });
}); 