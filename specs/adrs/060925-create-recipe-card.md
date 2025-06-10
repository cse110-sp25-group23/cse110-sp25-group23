---
status: accepted
date: 2025-06-09
decision-maker:  [Kelvin Tetteh]
---
# Create Recipe Card


---

## Context & Goals

We need to support:

* Newly made cards appearing on the shelf
* Easy to understand and input information

---

## Considered Options

|   #   | Option                                                | Summary                                                                                                            |
| :---: | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
|   1   | **Add-on to "My Recipes"**                              |  Simple create page gets shown*         
|   2   | **Full Create Recipe Site**                           |  Creation Site with appealing UI, Meal Planner, and Search Recipe Functionality                   

---

## Decision Outcome

**Chosen option: 2 – Full Create Recipe Site **

This decision gave a lot of depth to how 

### Key Advantages

* ** More depth and features could be explored by making a new site
* **Meal Planner option allows users to make food schedules to go back to constantly

*Why not Option 1?*   
– It was a lot less creative and limited the features of our site
– "Too Simple" in Design

---

### Implementation Details
- Site would be broken up into 3 sections, "Create Recipe", "Meal Planner", and "Search Recipe";
- Create Recipe is the section were users input the information of the card they are making, as well as an image to go along with it. Once created, this recipe automatically shows up in the "My Recipes" site on one of the shelves, depending on the tag, when it was created, etc.
- Meal Planner works as an advanced tag, allowing users to group together meals into one category, which would also appear on the "My recipes" shelf. When a meal is clicked on the meal planner option, the search automatically shows whatever items are grouped into that specific category, removing unrelated recipes from the ones being shown.
- Search Recipe allows for a Recipe of a specific title to be shown at the top of the page, creating convenience for the user to locate what they are looking for.


## Consequences

* **Good** –  Other features such as Meal Planner and Searching Recipes took advantage of the full site
* **Good** – A lot more intuitive and in-depth for users to explore and create
* **Trade-off** – There is a bit of overlap between some Nav Bar features 
* **Bad** – Would take a lot more time to develop and debug

---

