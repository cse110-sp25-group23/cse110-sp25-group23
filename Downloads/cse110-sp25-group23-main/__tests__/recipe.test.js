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