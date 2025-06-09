// __tests__/cart.test.js
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { Cart } from 'cart.js';

describe('Cart helper', () => {
    beforeEach(() => {
        // clear storage & reset any listeners
        localStorage.clear();
    });

    it('starts empty', () => {
        expect(Cart.list()).toEqual([]);
    });

    it('addRecipe pushes all new ingredients', () => {
        const recipe = {
            ingredients: [
                { name: 'Apple', qty: 2, unit: 'pcs' },
                { name: 'Banana', qty: 3, unit: 'pcs' },
            ]
        };

        // listen for the cart:update event
        const spy = jest.fn();
        document.addEventListener('cart:update', spy);

        Cart.addRecipe(recipe);

        // should have emitted once
        expect(spy).toHaveBeenCalledTimes(1);

        // and both items should be in the list
        const list = Cart.list();
        expect(list).toHaveLength(2);
        expect(list).toEqual(
            expect.arrayContaining([
                { name: 'Apple', qty: 2, unit: 'pcs' },
                { name: 'Banana', qty: 3, unit: 'pcs' },
            ])
        );
    });

    it('addRecipe dedupes by ingredient name', () => {
        const recipe = {
            ingredients: [
                { name: 'Apple', qty: 2, unit: 'pcs' },
                { name: 'Apple', qty: 2, unit: 'pcs' },
            ]
        };
        Cart.addRecipe(recipe);
        Cart.addRecipe(recipe);
        expect(Cart.list()).toHaveLength(1);
    });

    it('removeByName(name) removes only that ingredient', () => {
        Cart.addRecipe({ ingredients: [{ name: 'A', qty: 1, unit: '' }] });
        Cart.addRecipe({ ingredients: [{ name: 'B', qty: 2, unit: 'tsp' }] });
        expect(Cart.list()).toHaveLength(2);

        const spy = jest.fn();
        document.addEventListener('cart:update', spy);

        Cart.removeByName('A');

        // event fired
        expect(spy).toHaveBeenCalledTimes(1);

        // only B remains
        expect(Cart.list()).toEqual([
            { name: 'B', qty: 2, unit: 'tsp' }
        ]);
    });

    it('clear() wipes everything out', () => {
        Cart.addRecipe({ ingredients: [{ name: 'X', qty: 5, unit: 'oz' }] });
        expect(Cart.list()).toHaveLength(1);

        const spy = jest.fn();
        document.addEventListener('cart:update', spy);

        Cart.clear();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(Cart.list()).toEqual([]);
        // storage key removed
        expect(localStorage.getItem('recipeCart')).toBeNull();
    });

    it('list() persists across instances via localStorage', () => {
        Cart.addRecipe({ ingredients: [{ name: 'Item', qty: 10, unit: 'oz' }] });

        // read raw from storage
        const raw = JSON.parse(localStorage.getItem('recipeCart'));
        expect(raw).toEqual([{ name: 'Item', qty: 10, unit: 'oz' }]);

        // and Cart.list() should reflect the same
        expect(Cart.list()).toEqual(raw);
    });
});