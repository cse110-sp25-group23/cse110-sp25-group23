
/**
 * @fileoverview Unit tests for calendar utility functions.
 * These tests validate date formatting and HTML generation logic.
 * 
 * Author: Anna Doan
 */

import { extractDateKey, getRecipeBlockHtml } from '../../__tests__/calendar/calendarUtils.js';

test('extractDateKey returns correct format', () => {
  const date = new Date(2025, 5, 4); // June 4, 2025
  expect(extractDateKey(date)).toBe('2025-06-04');
});

test('getRecipeBlockHtml returns valid HTML', () => {
  const html = getRecipeBlockHtml('Tacos', '12:00');
  expect(html).toMatch(/Tacos/);
  expect(html).toMatch(/12:00/);
});

