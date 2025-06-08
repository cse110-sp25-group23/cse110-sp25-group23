/**
 * @jest-environment jsdom
 */

// Mock DOM elements before importing calendar.js
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


import {
  renderRecipeBlock,
  getRecipeBlockHtml,
  getStoredRecipeData,
  normalizeDatetimeKey,
  pad
} from '../../source/calendar/calendar.js';

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
  `;
});


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

  test('getStoredRecipeData returns empty array for invalid key', () => {
    localStorage.setItem('invalid', 'not json');
    expect(getStoredRecipeData('invalid')).toEqual([]);
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

});
