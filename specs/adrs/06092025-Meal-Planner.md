---
status: accepted
date: 2025-06-09
decision-maker: [Thanh Hoang]
---

# Meal Planner

---

## Context & Goals

We need to support:

* Creating named **Meals** by selecting existing recipe cards
* Persisting meals across reloads (via `localStorage`)
* Ensuring editing or deleting a recipe in one context (meal or main list) doesn’t break or alter the other
* Displaying meals via the existing **shelf view**, which relies on recipe card tags
* Supporting future editing/removal/renaming of meals efficiently

---

## Considered Options

|   #   | Option                                                | Summary                                                                                                            |
| :---: | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
|   1   | **Dedicated meals object in `localStorage`**          | Each meal name becomes a key, and its value is a list of recipe card objects, basically duplicates of the recipes. |
|   2   | **Tag-based association using `tag` on recipe cards** | Instead of duplicating recipe data, append the meal name as a tag on each selected recipe card.                    |

---

## Decision Outcome

**Chosen option: 2 – Tag-based association using `tag` on recipe cards.**

This decision aligns directly with how the shelf view (by Niroop and Kelvin) displays meals using recipe tags, enabling smoother integration. It also avoids data duplication and eliminates bugs caused by conflicting recipe state between “in meal” vs. “outside meal” views.

### Key Advantages

* **No data duplication** – No need to store full recipe objects per meal.
* **Real-time updates** – Tag changes are immediately reflected in the shelf display. Deleting and editing recipe cards within a meal prewview is reflected to the recipe card immediately.
* **Simpler logic** – Recipes are always edited in one place, meal tags just categorize them.

*Why not Option 1?*  
It led to major issues:  
– Editing a recipe inside a meal didn’t reflect outside, and vice versa.  
– Deleting a recipe inside a meal could removed it globally but not in the meal it self(bug).  
– It consumed more memory and made integration with shelf harder.

---

## Consequences

* **Good** – Seamless shelf integration using `tag`  
* **Good** – Lightweight in terms of memory
* **Good** – Centralized edits
* **Trade-off** – If a tag is removed, the meal loses that recipe  
* **Bad** – If the user created a recipe card with a custom tag, it becomes a meal with that tag as the meal name, although the user did not intend it to become a meal. It also may unintentionally appear as part of a meal with that tag name.

---

