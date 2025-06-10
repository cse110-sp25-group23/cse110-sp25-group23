# ADR: Calendar Feature

Status: accepted  
Date: 2025-06-05  
Decision-makers: Anna Doan

## Context and Problem Statement

We needed an interactive and visual solution that allows users to schedule recipes in a daily, weekly, or monthly calendar format. This feature had to persist user data between sessions, support responsive design, and cleanly integrate with the broader website.

A custom-built calendar was chosen to provide full control over appearance, interactivity, and local data storage.

## Decision Drivers

- Clear visibility and user control over scheduled recipes
- Lightweight and dependency-free (no large external calendar libraries)
- Ability to store recipe events using `localStorage`
- Flexible and responsive view toggles: day, week, month
- Smooth integration with recipe dropdowns and form-based interactions

## Considered Options

- **Use FullCalendar.js**: Too large for scope; required heavy DOM injection and less control over layout
- **Pure Div/Grid-based calendar layout**: While very flexible, harder to manage for tabular data in month view.
- **Table-based layout for month view + div/grid for day/week**: ✅ Chosen. Combines clarity of `<table>` for month layout and flexibility of `<div>`-based blocks for detailed day/week views.

## Decision Outcome

We implemented a responsive, modular calendar interface using vanilla HTML, CSS, and JavaScript. This solution supports:
- Scheduling recipes via a form
- View toggling between day, week, and month
- Persistent storage using `localStorage`
- Event deletion via a clickable overlay

### Main Functionalities

- **Toggle Calendar Views**  
  Buttons for switching between `.month-view`, `.week-view`, and `.day-view` classes. The current view updates the grid and DOM structure accordingly.

- **Schedule Recipes via Form**  
  The user fills out date, time, recipe name (via dropdown), and author to add a new block to the calendar. Handled via `#assign-form` in `calendar.html` and JS listener.

- **Recipe Block Rendering**  
  Recipe blocks are inserted using `renderRecipeBlock()` with position/height determined by time (in day/week view). All blocks are styled with `.note-block`.

- **Persistent LocalStorage Integration**  
  Each scheduled recipe is saved using a `key = "YYYY-MM-DD HH:mm"` format. On calendar render, items from localStorage are parsed and inserted back into the DOM.

- **Recipe Deletion**  
  Each `.note-block` contains a delete button (`×`) that removes the corresponding key from `localStorage` and updates the UI without reloading the page.

- **Responsive Layout and Styles**  
  - Month view uses a flexible grid (`calendar-grid`) for 7-column layout
  - Week and day views stack recipe blocks with CSS Grid Row height based on 60px per hour
  - Mobile-friendly navigation and support for narrower screen widths
  - Footer is consistently styled and positioned across all views

## Positive Consequences

- Minimal dependencies and full control of visual structure
- Fast load time and works well across devices
- Clean architecture to expand into features like drag/drop or time validation

## Negative Consequences

- Requires more testing (especially E2E via Playwright) to ensure interactions work across all views
- Complex JS logic for recipe positioning and DOM manipulation in multiple views
- No database sync or backend support — limited to `localStorage` scope


## Testing Strategy

I used a hybrid testing approach:
- **Unit tests** via Jest (`calendarUtils.test.js`) to verify individual utility functions
- **End-to-end tests** via Playwright (`calendar.e2e.test.js`) for full user flows (scheduling, toggling views, deleting)

This ensures confidence in both internal logic and actual user interactions.


## Features Not Completed

Due to time constraints and project scope, the following planned features were **not implemented**:


- **Form Validation / Conflict Warnings:**  
  The current form accepts overlapping or duplicate time slots without warnings. Validation for time conflicts or empty inputs could improve robustness.

- **Recipe Editing:**  
  Once a recipe is created, it can only be deleted—not edited in place. An edit modal or inline editing was planned and later determined not needed.

- **Overlapping Recipe Display Management:**  
  If multiple recipes are scheduled at the same time slot, they currently stack visually, possibly causing layout issues. A layout strategy (e.g., side-by-side rendering) was being developed in the process but never finished implementation.

- **Dynamic Recipe Block Heights Based on Cooking Time:**  
  While the system displays recipes at scheduled start times, blocks do not yet vary in height according to their intended cooking durations. This was in development but never implemented.



These features are potential candidates for future development or additional stretch goals if the project is continued.


## Contributors

Anna Doan (calendar toggle logic, E2E testing setup, UI bugs),  
Fnu Anu (styling, user design consistency)

---

**Note:** Main files involved:
- `calendar.js` (core logic for rendering and interaction)
- `calendar.html` (form structure, view toggle buttons, grid containers)
- `calendar.css` (view styles, note block layouts, responsive classes)
- `calendarUtils.test.js` (calendar feature testing)
- `calendar.e2e.test.js` (End-to-end feature testing)
