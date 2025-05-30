//Import js files for recipe card and local storage
import { addRecipesToDocument, saveRecipesToStorage } from '../source/LocalStorage/storage.js';

describe('Recipe Card Creator and Deletion', () => {
    //Create Recipe Card
    const testRecipe = {
    name: 'Waffles',
    author: 'Luis',
    image: '/waffles.png',
    tags: ['Easy','Breakfast'],
    ingredients: 'Flour, Eggs, Milk',
    steps: 'Mix & cook',
    timeEstimate: '15 min'
  };

  //Before each test in the describe(), clear the local storage and any cards displayed
  beforeEach(() => {
    // clean DOM & storage
    document.body.innerHTML = '<main></main>';
    localStorage.clear();
  });

  test('Check all attributes are correct', () => {
    //create a card and add it to the container in main in html file
    const card = document.createElement('recipe-card');
    document.querySelector('main').append(card);
    card.data = testRecipe;

    //check each attribute
    const sr = card.shadowRoot;
    expect(sr.querySelector('h2').textContent).toBe('waffles');
    expect(sr.querySelector('p').textContent).toContain('Luis');
    expect(sr.querySelector('img').getAttribute('src')).toBe('/waffles.png');
    const tags = Array.from(sr.querySelectorAll('li')).map(el => el.textContent);
    expect(tags).toEqual(['Easy','Breakfast']);
    expect(sr.textContent).toContain('Flour, Eggs, Milk');
    expect(sr.textContent).toContain('Mix & cook');
    expect(sr.textContent).toContain('15 min');
    expect(sr.querySelector('.delete-btn')).toBeInstanceOf(HTMLButtonElement);
  });

  test('Delete Button Removes the Card From LocalStorage and from html', () => {
    // Add the testRecipe to the local storage
    saveRecipesToStorage([testRecipe]);

    // Render the test recipe card
    const card = document.createElement('recipe-card');
    document.querySelector('main').append(card);
    card.data = testRecipe;

    //Delete the Card
    const btn = card.shadowRoot.querySelector('.delete-btn');
    btn.click();

    //Deleting a Card means it is no longer displayed and no longer in local storage

    //Expect the card to not be on the document anymore (removed from html)
    expect(document.querySelector('recipe-card')).toBeNull();

    //Expect the card to not be in Local Storage anymore (removed from LocalStorage)
    const stored = JSON.parse(localStorage.getItem('recipes'));
    expect(stored).toEqual([]);
  });

  test('Test addRecipesToDocument to ensure it only adds one card', () => {
    //Declare two recipes
    const recipes = [ {...testRecipe, name:'A'}, {...testRecipe, name:'B'} ];
    //add both recipes to document
    addRecipesToDocument(recipes);
    
    //cards should have 2 elements (two cards just created)
    const cards = document.querySelectorAll('main > recipe-card');
    expect(cards).toHaveLength(2);

    //Each card should have its own data, check to make sure the names of each card is rendered correctly
    const renderedNames = Array.from(cards).map(c => c.shadowRoot.querySelector('h2').textContent);
    expect(renderedNames).toEqual(['A','B']);
  });
});

describe('Editing Card', () => {
    //Same Test Recipe
    const testRecipe = {
    name: 'waffles',
    author: 'Luis',
    image: '/waffles.png',
    tags: ['Easy','Breakfast'],
    ingredients: 'Flour, Eggs, Milk',
    steps: 'Mix & cook',
    timeEstimate: '15 min'
  };

  let card;
  
  //before each test, add testRecipe to DOM and render card
  beforeEach(() => {
    document.body.innerHTML = '<main></main>';
    card = document.createElement('recipe-card');
    document.querySelector('main').append(card);
    card.data = testRecipe;
  });

  test('Hitting edit changes display to edit form', () => {
    //Hit edit button
    const editBtn = Array.from(card.shadowRoot.querySelectorAll('button')).find(b => b.textContent === 'Edit');
    editBtn.click();

    //Expect there to be an edit and save option
    expect(card.shadowRoot.querySelector('.edit-name')).toBeInstanceOf(HTMLInputElement);
    expect(card.shadowRoot.querySelector('.save-btn')).toBeInstanceOf(HTMLButtonElement);
  });

  test('Changing something in the card leads to a change in how the card is displayed and stored in LocalStorage', () => {
    //Add test recipe to local storage and html
    saveRecipesToStorage([testRecipe]);
    document.querySelector('main').append(card);
    card.data = testRecipe;

    // find edit button and click
    const buttons = Array.from(card.shadowRoot.querySelectorAll('button'));
    const editBtn = buttons.find(btn => btn.textContent.trim() === 'Edit');
    //There should be an edit button
    expect(editBtn).toBeDefined();
    editBtn.click();

    //Change Recipe Name
    const nameInput = card.shadowRoot.querySelector('.edit-name');
    nameInput.value = 'Belgain Waffle';

    //Save Recipe
    const saveBtn = card.shadowRoot.querySelector('.save-btn');
    expect(saveBtn).toBeInstanceOf(HTMLButtonElement);
    saveBtn.click();

    // After hitting save, the displayed name should change
    expect(card.shadowRoot.querySelector('h2').textContent)
        .toBe('Belgain Waffle');

    // Name for the test recipe should also be changed in local storage
    const stored = JSON.parse(localStorage.getItem('recipes'));
    expect(stored[0].name).toBe('Belgain Waffle');
    });
});
