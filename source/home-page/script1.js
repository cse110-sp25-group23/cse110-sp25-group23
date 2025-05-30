const recipes = [
    {
      title: 'Pancakes',
      prep: 'Prep Time: 10 mins',
      cook: 'Cook Time: 15 mins',
      tags: 'Breakfast, Quick, Kids',
      rating: 3,
      image: 'https://dinnersdishesanddesserts.com/wp-content/uploads/2020/03/Strawberry-Shortcake-Pancakes-2-square.jpg'
    },
    {
      title: 'Banana Bread',
      prep: 'Prep Time: 15 mins',
      cook: 'Cook Time: 1 hr',
      tags: 'Easy, Sweet, Baking',
      rating: 2,
      image: 'https://i0.wp.com/cookwithnoorain.com/wp-content/uploads/2024/04/chocolate-chip-banana-bread-scaled.jpg'
    },
    {
      title: 'Avocado Toast',
      prep: 'Prep Time: 5 mins',
      cook: 'Cook Time: 0 mins',
      tags: 'Healthy, Vegan, Quick',
      rating: 4.5,
      image: 'https://alegumeaday.com/wp-content/uploads/2024/03/Bean-avocado-toast-3-800x530.jpg'
    },
    {
        title: 'Spaghetti Bolognese',
        prep: 'Prep Time: 20 mins',
        cook: 'Cook Time: 40 mins',
        tags: 'Dinner, Italian, Hearty',
        rating: 2,
        image: 'https://foodbyjonister.com/wp-content/uploads/2017/09/IMG_7504.jpg'
      },
      {
        title: 'Chicken Curry',
        prep: 'Prep Time: 20 mins',
        cook: 'Cook Time: 30 mins',
        tags: 'Dinner, Spicy, Comfort',
        rating: 2,
        image: 'https://www.whiskaffair.com/wp-content/uploads/2021/10/Andhra-Chicken-Curry-2-3-500x500.jpg'
      },
      {
        title: 'Greek Salad',
        prep: 'Prep Time: 15 mins',
        cook: 'Cook Time: 0 mins',
        tags: 'Vegetarian, Fresh, Side',
        rating: 1,
        image: 'https://images.themodernproper.com/production/posts/GreekSalad_9.jpg?w=1200&h=1200&q=60&fm=jpg&fit=crop&dm=1718650734&s=70119bf37604d243d0729db7f4cda445'
      },
      {
        title: 'French Toast',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 10 mins',
        tags: 'Breakfast, Sweet, Quick',
        rating: 4.5,
        image: 'https://d1ssu070pg2v9i.cloudfront.net/pex/simonhowie/2021/04/29162830/BH4A9352.jpg'
      },
      {
        title: 'Mac & Cheese',
        prep: 'Prep Time: 15 mins',
        cook: 'Cook Time: 20 mins',
        tags: 'Comfort, Kids, Creamy',
        rating: 4,
        image: 'https://allthehealthythings.com/wp-content/uploads/2024/02/broccoli-cheddar-mac-and-cheese-9.jpg'
      },
      {
        title: 'Grilled Cheese',
        prep: 'Prep Time: 5 mins',
        cook: 'Cook Time: 5 mins',
        tags: 'Snack, Cheese, Quick',
        rating: 3,
        image: 'https://erhardtseat.com/wp-content/uploads/2021/09/Bacon-Tomato-Grilled-Cheese-Sandwich-Recipe-Pics-10.jpg'
      },
      {
        title: 'Caesar Salad',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 0 mins',
        tags: 'Salad, Light, Classic',
        rating: 4,
        image: 'https://media.chefdehome.com/750/0/0/caesar/classic-caesar-salad.jpg'
      },
      {
        title: 'Beef Tacos',
        prep: 'Prep Time: 15 mins',
        cook: 'Cook Time: 10 mins',
        tags: 'Mexican, Dinner, Spicy',
        rating: 2,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8NRzaic4Cc_cOwP7JF27M43i956jmrZmkgg&s'
      },
      {
        title: 'Veggie Stir Fry',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 10 mins',
        tags: 'Vegan, Asian, Quick',
        rating: 1,
        image: 'https://natashaskitchen.com/wp-content/uploads/2020/08/Vegetable-Stir-Fry-SQ.jpg'
      },
      {
        title: 'Mango Smoothie',
        prep: 'Prep Time: 5 mins',
        cook: 'Cook Time: 0 mins',
        tags: 'Drink, Fruit, Healthy',
        rating: 4.5,
        image: 'https://media.bluediamond.com/uploads/2023/01/24175942/14_Dairy-Free_Mango_Lassi-2430x1620.jpg'
      },
      {
        title: 'Chocolate Cake',
        prep: 'Prep Time: 30 mins',
        cook: 'Cook Time: 35 mins',
        tags: 'Dessert, Baking, Rich',
        rating: 4.5,
        image: 'https://bluebowlrecipes.com/wp-content/uploads/2023/08/chocolate-truffle-cake-8844.jpg'
      },
      {
        title: 'Lentil Soup',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 40 mins',
        tags: 'Vegetarian, Soup, Healthy',
        rating: 4.5,
        image: 'https://hips.hearstapps.com/hmg-prod/images/lentil-soup-recipe-2-677c54158ad10.jpg?crop=0.6667718689179948xw:1xh;center,top&resize=1200:*'
      },
      {
        title: 'Fish Tacos',
        prep: 'Prep Time: 15 mins',
        cook: 'Cook Time: 10 mins',
        tags: 'Seafood, Fresh, Dinner',
        rating: 2,
        image: 'https://schoolnightvegan.com/wp-content/uploads/2019/08/vegan-fish-tacos-3.jpg'
      },
      {
        title: 'Omelette',
        prep: 'Prep Time: 5 mins',
        cook: 'Cook Time: 5 mins',
        tags: 'Breakfast, Protein, Quick',
        rating: 2,
        image: 'https://inmamamaggieskitchen.com/wp-content/uploads/2023/10/Mexican-Omelette-served-with-cilantro-on-top-and-avocado-slices-in-a-large-plate.png'
      },
      {
        title: 'Ramen Bowl',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 15 mins',
        tags: 'Japanese, Noodles, Cozy',
        rating: 4.5,
        image: 'https://lindseyeatsla.com/wp-content/uploads/2021/03/Gochujang_Miso_Ramen_Noodles-4.jpg'
      },
      {
        title: 'Caprese Salad',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 0 mins',
        tags: 'Italian, Light, Fresh',
        rating: 3,
        image: 'https://images.prismic.io/eataly-us/f161512d-57c9-4a70-b9bc-c3f951b9a456_insalata-caprese-main.jpg?auto=compress,format'
      },
      {
        title: 'Stuffed Peppers',
        prep: 'Prep Time: 20 mins',
        cook: 'Cook Time: 30 mins',
        tags: 'Dinner, Healthy, Baked',
        rating: 4.5,
        image: 'https://embed.widencdn.net/img/beef/t9bwp7fitq/exact/Stuffed%20Peppers%20-%20NCBA%20Beef%20Aug%20202431717.jpg?keep=c&u=7fueml'
      } ,
      {
        title: 'Tomato Basil Pasta',
        prep: 'Prep Time: 10 mins',
        cook: 'Cook Time: 20 mins',
        tags: 'Vegetarian, Pasta, Quick',
        rating: 4.5,
        image: 'https://www.lastingredient.com/wp-content/uploads/2023/08/tomato-basil-pasta6.jpg'
      } 
  ];

//   function renderRecipes() {
//     const container = document.getElementById('recipeGrid');
//     recipes.forEach(recipe => {
//       const card = document.createElement('div');
//       card.className = 'recipe-card';
//       card.innerHTML = `
//         <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img" />
//         <div class="recipe-content">
//           <h2 class="recipe-title">${recipe.title}</h2>
//           <p class="recipe-meta">${recipe.prep}</p>
//           <p class="recipe-meta">${recipe.cook}</p> 
//           <p class="recipe-tags">${recipe.tags}</p>

//         </div>
//       `;
//       container.appendChild(card);
//     });
//   }

//   renderRecipes();
const BATCH_SIZE = 10;
let displayed = 0;

function renderStars(rating) {
  const full = '★'.repeat(Math.round(rating));
  const empty = '☆'.repeat(5 - Math.round(rating));
  return full + empty;
}
function renderRecipes(batch = BATCH_SIZE) {
  const container = document.getElementById('recipeGrid');
  const end = Math.min(displayed + batch, recipes.length);

  for (let i = displayed; i < end; i++) {
    const recipe = recipes[i];
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img" />
      <div class="recipe-content">
        <h2 class="recipe-title">${recipe.title}</h2>
        <div class="recipe-rating">${renderStars(recipe.rating || 0)}</div>
        <p class="recipe-meta">${recipe.cook}</p> 
        <p class="recipe-tags">${recipe.tags}</p>
      </div>
    `;
    container.appendChild(card);
  }

  displayed = end;

  const btn = document.getElementById('seeMoreBtn');
  if (displayed < recipes.length) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
}

// Initial render
renderRecipes();

// Button click
document.getElementById('seeMoreBtn').addEventListener('click', () => {
  renderRecipes();
});

  function toggleAvatarPanel() {
    const panel = document.getElementById('avatar-panel');
    panel.style.display = (panel.style.display === 'none') ? 'grid' : 'none';
  }
  
  function setAvatar(src) {
    document.getElementById('profile-pic').src = src;
    localStorage.setItem('selectedAvatar', src);
    document.getElementById('avatar-panel').style.display = 'none';
  }
  
  // Load saved avatar
  window.onload = () => {
    const saved = localStorage.getItem('selectedAvatar');
    if (saved) {
      document.getElementById('profile-pic').src = saved;
    }
  };
  //<p class="recipe-meta">${recipe.prep}</p>