/**
 *
 * Sorts an array of numbers in ascending order.
 *
 * @param {number[]} numbers - The array of numbers to sort.
 * @returns {number[]} A new array sorted in ascending order.
 */
export function sortAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

