/**
 * 
 * @param {*} num1 - First number to add. 
 * @param {*} num2 - Second number to add. 
 * @param {*} add - Boolean value to tell the function what to do. 
 * @returns The sum of the two numbers if add is true, and false otherwise.
 */
function sumValues(num1, num2, add) {
    if (add) {
        //fixed: changed const to let so we can reassign it below
        let result = 0;
        result = num1 + num2;
        return result;
    } else {
        return !add;
    }
}

/**
 * 
 * @param {*} prices - An array of the original prices.
 * @param {*} discount - A number between 0–1 to represent the discount. 
 * @returns An array of each price's new price after the discount is applied, or false if the array is empty.
 */
function discountPrices(prices, discount) {
    // fixed: check for empty array and return false
    if (prices.length === 0) return false;

    const discounted = [];

    for (let i = 0; i < prices.length; i++) {
        // fixed: don't accumulate discount across items, compute fresh each time
        let discountedPrice = prices[i] * (1 - discount);
        discounted.push(discountedPrice);
    }

    return discounted;
}

module.exports = { sumValues, discountPrices };
