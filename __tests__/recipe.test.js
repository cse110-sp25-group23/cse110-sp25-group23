import { sortByAlphabetical } from "../source/sortingFunction";

test('Test sorting function is correct', () => {
    expect(sortByAlphabetical([
        'Chicken Alfredo',
        'Vanilla Icecream',
        'Pastalingini'
    ])).toEqual([
        'Chicken Alfredo',
        'Pastalingini',
        'Vanilla Icecream'
    ]);
});

test('Should be wrong', () => {
    expect(1 + 2).toBe(4);
});