# Calendar Feature
Contributors: Anna (calendar), Fnu Anu (Navbar, footer, local storage, debugs)

**Note:** The main files here are `calender.html`, `calendar.css` and `calendar.js`.
**Additional Folders:** 
- Images folder contains icons for mobile navigation bar to facilitate smaller screen sizes and website logo. 
- `..\..\__tests__\calendar` folder contains unit testing and user E2E testing.

**Context:** We want users to be able to meal plan using a calendar view. 
This requires viewing meals planned for a day, week, or month.

---
**Main functionalities or points to consider:**
- **Toggle Between Views:**  
  Users can toggle between day, week, and month views using UI buttons. Each view is rendered dynamically with styles and layout appropriate for the selected range.

- **Recipe Scheduling Form:**  
  Users fill in a date, time, recipe name (from a dropdown), and author to schedule a meal. Submitting the form renders the meal on the calendar and saves it to `localStorage`.

- **Recipe Block Rendering:**  
  Recipes appear as styled blocks (`.note-block`) with their title and author. Placement is calculated based on time and view type, with click-to-delete functionality.

- **Persistent Storage with LocalStorage:**  
  All scheduled meals are stored under a `"YYYY-MM-DD HH:mm"` key in `localStorage`. This ensures they reappear on page reload.

- **Recipe Deletion:**  
  Each block includes a delete button (`×`) which removes the recipe from both the DOM and `localStorage`.

- **Responsiveness and UI Consistency:**  
  Layout adapts to screen size, and shared components (navbar, footer) preserve theme consistency throughout.


---

**Uniform Theme and navbar-footer used across the page as part of the whole website**