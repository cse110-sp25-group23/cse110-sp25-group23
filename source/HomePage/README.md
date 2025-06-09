# HomePage Feature
Contributors: Fnu Anu

**Note:** The main file here is home.html, home.css and home.js. 
Additional Folders: Images folder contains icons for mobile navigation bar to 
facilitate smaller screen sizes and website logo. 

**Context:** The purpose of this page to give users an overview summary of their planned
meals, favorites as well as the cart items that they have saved from recipe's ingredients.

We also made the decision to have our times set to Pacific (California) time for calendar and homepage summaries.

---
**Main functionalities or points to consider:**
2 local storages were coordinated to be uniformed in order for this page's functionality:
1.  Example key: "2025-06-04 00:00" local storage is the structure of local storage key for any scheduled 
    recipes on calendar and the homepage uses that to render a list of breakfast, lunch and dinner items and their time scheduled for summary on the home page.
2.  "recipeCart" local storage for all the items that user has stored in their shopping cart
   - Displays first 10 items in order to redirect users to go to cart page if they would like
    a more closer view on the items they have in their cart and total items in the Cart on homepage
    for a general overview.

Change: Favorites will be filtered through true/false property from all recipes to the ones that were favorited as true value on shelf page and change respectively on the home page's summary of favorite recipes.
---

Note: Navigation Bar and footer will be uniform after being developed and integrated by me on all pages across this project website!

**Uniform Theme and navbar-footer used across the page as part of the whole website**