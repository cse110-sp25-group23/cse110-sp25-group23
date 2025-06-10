---
status: accepted
date: 2025-06-09
decision-maker: Fnu Anu
---

# Homepage Design – Recipe Card Website

---

## Context & Goals

We needed to support:

* Displaying a summary of **favorited recipe cards**
* Providing a **cart summary** (first 10 items only), with a **link to the full cart page** for more
* Displaying **scheduled meals from the calendar**, refreshed daily  
  – If no meals are scheduled, the page should **encourage users to plan something delicious**
* Unifying the homepage layout with the **overall navigation and visual style** of the site

---

## Considered Options

|   #   | Option                                                       | Summary                                                                                      |
| :---: | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
|   1   | **Initial TikTok-style scroll layout**                       | Horizontal scroll with arrow controls; one recipe card shown at a time; yellow placeholder theme |
|   2   | **Realistic professional site with veggie background & blogs** | Modern recipe layout with food blog aesthetics, branding tests (Ramsay’s Refreshing Recipes), and newsletter/footer links |
|   3   | **Final homepage with integrated sections and Cooklection brand** | Simple and informative layout with Today's Meal, Cart Summary, and Favorites sections; red-yellow theme and adopted nav/footer |

---

## Decision Outcome

**Chosen option: 3 – Final homepage with integrated sections and Cooklection branding.**

This version balanced visual appeal, project scope, and feature integration. It was informed by team feedback (from Sarah and Luis) to prioritize functionality and project cohesion over aspirational features, 
which largely led to the final design choices to simply provide a user summary of their favorites, their additions to cart and meals of the day that they may have scheduled on calendar page.

### Key Advantages

* **Integrated experience** – Sections summarize key areas (Meals, Cart, Favorites) without redundancy
* **Practical scope** – Removed out-of-scope blog and subscription features
* **Strong branding** – Red and yellow color scheme evokes food themes (inspired by brands like McDonald’s)
* **User-focused** – Encourages engagement with cart and calendar, especially when data is empty

### Technical Implementation Details

* **Cart Summary** – Pulled from `localStorage` key `recipeCart`, implemented through the Cart page. The homepage limits display to the first 10 items and links to the full cart for more details.
* **Favorites Section** – Filtered from recipes stored in `localStorage` using the `favorite` property:
  – If `favorite: true`, the recipe appears in the homepage section.  
  – Live updates reflect any favoriting or unfavoriting action taken from the shelf page or other views.
* **Today’s Meal Section** – Data is pulled from the calendar page, which stores recipes under date-time keys, including metadata like recipe name and author:
  – The homepage filters meals based on the current Pacific Time date.
  – Meals are grouped and displayed according to time of day:
    - **Breakfast**: Between 12:00 AM and 11:59 AM  
    - **Lunch**: Between 12:00 PM and 3:59 PM  
    - **Dinner**: Between 4:00 PM and 11:59 PM  
  – Each listed item in the homepage includes the scheduled time, recipe name, and author.

*Why not Options 1 or 2?*  
– Option 1 was too minimal and didn’t reflect the actual user needs or usage patterns.  
– Option 2 was aesthetically ambitious but unrealistic given the project scope and backend capabilities.

---

## Consequences

* **Good** – Homepage now acts as a **functional summary dashboard** for user activity  
* **Good** – Consistent branding (Cooklection) and layout adopted across pages  
* **Good** – Lightweight structure and better user onboarding through clear sections  
* **Trade-off** – Removed potential features like blog posts or newsletter for the sake of focus  
* **Bad** – Earlier work on blog elements and branding experiments (e.g., Ramsay’s Refreshing Recipes) were discarded but helped formulate the final design
