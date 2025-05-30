const recipes = [
  {
    title: 'Banana Bread',
    prep: 'Prep Time: 15 mins',
    cook: 'Cook Time: 1 hr',
    tags: 'Tags: Easy, Sweet, Baking',
    image: 'https://i0.wp.com/cookwithnoorain.com/wp-content/uploads/2024/04/chocolate-chip-banana-bread-scaled.jpg?resize=1080%2C1440&ssl=1'
  },
  {
    title: 'Chocolate Cake',
    prep: 'Prep Time: 20 mins',
    cook: 'Cook Time: 45 mins',
    tags: 'Tags: Dessert, Rich, Chocolate',
    image: 'https://bluebowlrecipes.com/wp-content/uploads/2023/08/chocolate-truffle-cake-8844.jpg'
  },
  {
    title: 'Pancakes',
    prep: 'Prep Time: 10 mins',
    cook: 'Cook Time: 15 mins',
    tags: 'Tags: Breakfast, Quick, Kids',
    image: 'https://dinnersdishesanddesserts.com/wp-content/uploads/2020/03/Strawberry-Shortcake-Pancakes-2-square.jpg'
  }
];

let index = 0;
let collections = JSON.parse(localStorage.getItem('collections')) || { Favorites: [] };
const popupContainer = document.getElementById('popupContainer');

const title = document.getElementById('recipeTitle');
const prep = document.getElementById('prepTime');
const cook = document.getElementById('cookTime');
const tags = document.getElementById('recipeTags');
const image = document.getElementById('recipeImage');

function updateRecipe() {
  const r = recipes[index];
  title.textContent = r.title;
  prep.textContent = r.prep;
  cook.textContent = r.cook;
  tags.textContent = r.tags;
  image.src = r.image;
  image.alt = r.title;
}

function renderCollections() {
  const container = document.getElementById('collectionList');
  const moreContainer = document.getElementById('moreCollections');
  const allCollections = Object.keys(collections);
  container.innerHTML = '';
  moreContainer.innerHTML = '';

  allCollections.forEach((name, i) => {
    const item = document.createElement('div');
    item.className = 'collection-item';
    item.textContent = name;
    item.onclick = () => showCollection(name);
    if (i < 3) {
      container.appendChild(item);
    } else {
      moreContainer.appendChild(item);
    }
  });

  const showMore = document.getElementById('showMoreBtn');
  showMore.innerHTML = allCollections.length > 3
    ? '<button onclick="toggleMoreCollections()">More</button>'
    : '';
}

function toggleMoreCollections() {
  const more = document.getElementById('moreCollections');
  more.style.display = more.style.display === 'none' ? 'flex' : 'none';
}

function showCollection(name) {
  const list = collections[name].map(r => `<div class='collection-item'>${r.title}</div>`).join('');
  document.getElementById('recipeSection').innerHTML = `
    <button class="back-button" onclick="location.reload()">Back to All Recipes</button>
    <h2 style="padding: 10px">${name}</h2>
    <div class="collections">${list}</div>
  `;
}

function saveRecipeToCollections(selected) {
  selected.forEach(name => {
    if (!collections[name]) collections[name] = [];
    if (!collections[name].some(r => r.title === recipes[index].title)) {
      collections[name].push(recipes[index]);
    }
  });
  localStorage.setItem('collections', JSON.stringify(collections));
  popupContainer.style.display = 'none';
  renderCollections();
}

document.getElementById('prevBtn').addEventListener('click', () => {
  index = (index - 1 + recipes.length) % recipes.length;
  updateRecipe();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  index = (index + 1) % recipes.length;
  updateRecipe();
});

document.getElementById('addToCollection').addEventListener('click', () => {
  let html = '<div class="popup"><strong>Select collections:</strong>';
  for (let name in collections) {
    html += `<label><input type='checkbox' value='${name}' /> ${name}</label>`;
  }
  html += `<label><input type='text' id='newCollectionInput' placeholder='New collection name' /></label>`;
  html += `<button onclick="
    const selected = [...document.querySelectorAll('input[type=checkbox]:checked')].map(cb => cb.value);
    const newCol = document.getElementById('newCollectionInput').value;
    if (newCol) selected.push(newCol);
    saveRecipeToCollections(selected);
  ">Save</button></div>`;
  popupContainer.innerHTML = html;
  popupContainer.style.display = 'block';
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  const matches = recipes.filter(r =>
    r.title.toLowerCase().includes(value) || r.tags.toLowerCase().includes(value)
  );
  if (matches.length > 0) {
    index = recipes.indexOf(matches[0]);
    updateRecipe();
  }
});

// Dark Mode Implementation
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const darkModePreference = localStorage.getItem('darkMode');

// Apply dark mode on page load if preference is set
if (darkModePreference === 'enabled') {
  body.classList.add('dark-mode');
}

// Toggle dark mode on button click
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  // Save preference to local storage
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

updateRecipe();
renderCollections();

