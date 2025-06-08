/**
 * @jest-environment jsdom
 * 
*/

// USE `NODE_ENV=test npm run test:calendar` OR `NPM RUN TEST:CALENDAR` TO RUN TESTS

beforeAll(() => {
  // Set up basic mock HTML structure for DOM references in calendar.js
  document.body.innerHTML = `
    <div id="calendar-grid"></div>
    <div id="calendar-day-label"></div>
    <div id="month-year"></div>
    <button id="prev-month"></button>
    <button id="next-month"></button>
    <div class="calendar-toggle">
      <button data-view="month"></button>
      <button data-view="week"></button>
      <button data-view="day"></button>
    </div>
    <form id="assign-form">
      <select id="recipe-select"><option value="Test Recipe"></option></select>
      <input id="recipe-date" />
      <input id="recipe-time" />
      <input id="recipe-author" />
      <button type="submit">Submit</button>
    </form>
  `;
});


import {
  renderRecipeBlock,
  getRecipeBlockHtml,
  getStoredRecipeData,
  normalizeDatetimeKey,
  pad, 
  highlightActiveToggle,
  renderCalendar, 
  storeRecipeToCalendar, 
  populateRecipeDropdown
} from '../../source/calendar/calendar.js';

global.currentView = 'month';  // Or 'week' or 'day' as needed
global.currentDate = new Date(); // For renderCalendar


describe('Calendar Utility Functions', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  test('pad pads single digits with 0', () => {
    expect(pad(3)).toBe('03');
    expect(pad(10)).toBe('10');
  });

  test('normalizeDatetimeKey standardizes format', () => {
    expect(normalizeDatetimeKey('2025-6-7 08:30')).toBe('2025-06-07 08:30');
  });

  test('getRecipeBlockHtml returns formatted HTML', () => {
    const html = getRecipeBlockHtml('Cookies', 'Julie', '14:00');
    expect(html).toContain('14:00 – Cookies by Julie');
    expect(html).toContain('class="note-block"');
  });

  test('renderRecipeBlock creates a DOM element with styles and key', () => {
    const block = renderRecipeBlock({ name: 'Soup', author: 'Anna' }, 20, 40, '2025-06-07 08:30');
    expect(block).toBeInstanceOf(HTMLElement);
    expect(block.style.top).toBe('20px');
    expect(block.dataset.key).toBe('2025-06-07 08:30');
    expect(block.textContent).toContain('Soup');
  });

  test('getStoredRecipeData wraps raw string in array with empty author (fallback)', () => {
    localStorage.setItem('invalid', 'not json');
    expect(getStoredRecipeData('invalid')).toEqual([{ name: 'not json', author: '' }]);
  });


  test('getStoredRecipeData returns parsed array if valid JSON array', () => {
    const key = '2025-06-07 10:00';
    const value = [{ name: 'Tacos', author: 'Max' }];
    localStorage.setItem(key, JSON.stringify(value));
    expect(getStoredRecipeData(key)).toEqual(value);
  });

  test('getStoredRecipeData wraps object in array if single recipe object', () => {
    const key = '2025-06-07 11:00';
    const value = { name: 'Pizza', author: 'Leo' };
    localStorage.setItem(key, JSON.stringify(value));
    expect(getStoredRecipeData(key)).toEqual([value]);
  });

  test('getStoredRecipeData wraps raw string in array with empty author', () => {
    const key = '2025-06-07 12:00';
    const value = 'Burger';
    localStorage.setItem(key, value);
    expect(getStoredRecipeData(key)).toEqual([{ name: 'Burger', author: '' }]);
  });

  test('highlightActiveToggle sets the correct button as active', () => {
    document.body.innerHTML = `
      <div class="calendar-toggle">
        <button data-view="month">Month</button>
        <button data-view="week">Week</button>
        <button data-view="day">Day</button>
      </div>
    `;

    currentView = 'month';
    highlightActiveToggle();

    const buttons = document.querySelectorAll('.calendar-toggle button');
    expect(buttons[0].classList.contains('active')).toBe(true);
    expect(buttons[1].classList.contains('active')).toBe(false);
    expect(buttons[2].classList.contains('active')).toBe(false);
  });



  test('storeRecipeToCalendar adds a recipe to localStorage', () => {
    const recipes = [{ name: 'Cake', author: 'Baker' }];
    storeRecipeToCalendar('2025-06-07 10:00', 'Cake', recipes);
    const stored = JSON.parse(localStorage.getItem('2025-06-07 10:00'));
    expect(stored).toEqual({ name: 'Cake', author: 'Baker' });
  });

  test('populateRecipeDropdown fills #recipe-select with options', () => {
    document.body.innerHTML = `
      <select id="recipe-select">
        <option value="">Select a recipe</option>
      </select>
    `;

    const recipes = [
      { name: 'Spaghetti', author: 'John' },
      { name: 'Brownies', author: 'Jane' }
    ];

    localStorage.setItem('recipes', JSON.stringify(recipes)); // <-- Fix

    populateRecipeDropdown();

    const options = document.querySelectorAll('#recipe-select option');
    expect(options.length).toBe(3); // 1 placeholder + 2 recipes
    expect(options[1].value).toBe('Spaghetti');
    expect(options[2].textContent).toContain('Brownies');
  });


  // mock test for renderCalendar
  test.skip('renderCalendar resets grid and applies correct view class', () => {
    global.currentView = 'month';
    global.currentDate = new Date();

    renderCalendar(global.currentDate);

    const grid = document.getElementById('calendar-grid');
    expect(grid.classList.contains('month-view')).toBe(true);
  });

});
