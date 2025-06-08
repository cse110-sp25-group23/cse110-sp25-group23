// calendar.js
// calculate dates and render basic calendar functions

// DOM element references
const calendarGrid = document.getElementById('calendar-grid');
const calendarDayLabel = document.getElementById('calendar-day-label');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

let currentDate = new Date();
let currentView = 'month';

// highlight the active toggle button
function highlightActiveToggle() {
  document.querySelectorAll('.calendar-toggle button').forEach(button => {
    if (button.dataset.view === currentView) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// renders calendar based on the current view
// fills in cells using data from localStorage 
function renderCalendar(date) {
  highlightActiveToggle();
  // Reset calendar content and update view-specific class names
  calendarGrid.innerHTML = '';
  calendarGrid.classList.remove('day-view', 'week-view', 'month-view');
  calendarGrid.classList.add(`${currentView}-view`);
  
  calendarDayLabel.textContent = '';
  calendarDayLabel.classList.remove('day-view', 'week-view', 'month-view');
  calendarDayLabel.classList.add(`${currentView}-view`);

  const calendarDays = document.querySelector('.calendar-days');
  calendarDays.classList.remove('day-view', 'week-view', 'month-view');
  calendarDays.classList.add(`${currentView}-view`);

  const year = date.getFullYear();
  const month = date.getMonth();

  // Update month/year heading
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];

  // Get the first day of the month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // MONTH VIEW:
  // shows a grid of days, one cell per date, includes overflow from previous month
  if (currentView === 'month') {
    calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)'; // styling for month
    monthYear.textContent = `${monthNames[month]} ${year}`; // header
    
    // fill leading blanks
    for (let i = 0; i < firstDay; i++) {
      calendarGrid.innerHTML += `<div></div>`;
    }

    // fill in actual day cells
    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      let recipes = [];
      // Check if any recipe in localStorage matches this date
      for (let k in localStorage) {
        if (/^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}$/.test(k) && k.startsWith(dateKey + ' ')) {
          const stored = localStorage.getItem(k).split(';');
          recipes.push(...stored);
        }
      }
      
      // renders first 2-3 recipes in the cell as blocks
      const recipeHtml = recipes.slice(0, 3).map(r => getRecipeBlockHtml(r)).join('');
      calendarGrid.innerHTML += `<div class="day" data-date="${dateKey}">
        <div class="day-number">${i}</div>
        <div class="notes-container">${recipeHtml}</div>
      </div>`;

    }

  // WEEK VIEW 
  // displays 7 days across and 24 hrs vertically per day 
  } else if (currentView === 'week') {
    calendarGrid.innerHTML = '';
    calendarGrid.style.gridTemplateColumns = '50px repeat(7, 1fr)';

    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    monthYear.textContent = `Week of ${monthNames[start.getMonth()]} ${start.getDate()} – ${monthNames[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;

    // render hr labels and slots for each day
    for (let h = 0; h < 24; h++) {
      // left-side hr label
      const label = document.createElement('div');
      label.className = 'time-label';
      label.textContent = `${h}:00`;
      calendarGrid.appendChild(label);
       
      // 7 columns, one for each day of the week
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + d);

        const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(h).padStart(2, '0')}:00`;

        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.dataset.datetime = key;

        // clear slot content
        slot.innerHTML = '';
        slot.style.position = 'relative'; // to position recipe blocks absolutely

        // find all recipes for this hour
        for (let k in localStorage) {
          if (k.startsWith(`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`)) {
            const [_, __, ___, time] = k.split(/[- :]/);
            const hourInKey = parseInt(time);
            const minuteInKey = parseInt(k.split(':')[1]);
            if (hourInKey === h) {
              const recipes = localStorage.getItem(k).split(';');
              recipes.forEach(r => {
                const note = document.createElement('div');
                note.className = 'note';
                note.innerHTML = `<span class="recipe-name">${r}</span><button class="delete-recipe" title="Delete">&times;</button>`;
                note.style.position = 'absolute';
                note.style.top = `${(minuteInKey / 60) * 100}%`; // position based on minute
                slot.appendChild(note);
              });
            }
          }
        }



        calendarGrid.appendChild(slot);
      }
    }
  
  // DAY VIEW
  // displays 24 vertical time slots for a single day
  } else if (currentView === 'day') {
    calendarGrid.innerHTML = '';
    calendarGrid.style.gridTemplateColumns = '50px 1fr'; // 1 label + 1 slot

    monthYear.textContent = `${monthNames[month]} ${date.getDate()}, ${year}`;
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    calendarDayLabel.textContent = weekdayNames[date.getDay()];

    const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    for (let h = 0; h < 24; h++) {
      const label = document.createElement('div');
      label.className = 'time-label';
      label.textContent = `${h}:00`;
      calendarGrid.appendChild(label);

      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.dataset.datetime = `${dayKey} ${String(h).padStart(2, '0')}:00`;

      const recipes = localStorage.getItem(slot.dataset.datetime);
      if (recipes) {
        const recipeList = recipes.split(';');
        slot.innerHTML = recipeList.map(r => getRecipeBlockHtml(r)).join('');
      }



      calendarGrid.appendChild(slot);
    }
  }
}

// inital render on page load
renderCalendar(currentDate);

// navigation button handlers
// adjusts currentDate based on view and re-render
prevBtn.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() - 1);
  } else if (currentView === 'week') {
    currentDate.setDate(currentDate.getDate() - 7);
  } else if (currentView === 'day') {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  renderCalendar(currentDate);
});

nextBtn.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() + 1);
  } else if (currentView === 'week') {
    currentDate.setDate(currentDate.getDate() + 7);
  } else if (currentView === 'day') {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  renderCalendar(currentDate);
});

// view toggle buttons to switch between day, week, and month 
document.querySelectorAll('.calendar-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentView = btn.dataset.view;
    renderCalendar(currentDate); // re-render based on selected view
  });
});

//add recipies by name to the dropdown in the form
function populateRecipeDropdown() {
  const dropdown = document.getElementById('recipe-select');
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

  for (const recipe of recipes) {
    const option = document.createElement('option');
    option.value = recipe.name;
    option.textContent = recipe.name;
    dropdown.appendChild(option);
  }
}

populateRecipeDropdown();

// form submit handler: saves the selected recipe to a specific date and time in localStorage
const assignForm = document.getElementById('assign-form');

assignForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const recipeName = document.getElementById('recipe-select').value;
  const date = document.getElementById('recipe-date').value;
  const time = document.getElementById('recipe-time').value;

  if (!recipeName || !date || !time) return;

  // Construct localStorage key: "YYYY-M-D HH:MM"
  const [y, m, d] = date.split("-");
  const key = `${y}-${m}-${d} ${time}`;
  
  // Save multiple recipes separated by ;
  const existing = localStorage.getItem(key);
  if (existing) {
    if (!existing.split(';').includes(recipeName)) {
      localStorage.setItem(key, existing + ';' + recipeName);
    }
  } else {
    localStorage.setItem(key, recipeName);
  }

  // Refresh the calendar view to reflect changes
  renderCalendar(currentDate);

  // Optionally reset form
  assignForm.reset();
});


// when clicked on day in month view, go to day view of that day
calendarGrid.addEventListener('click', (e) => {
  const dayEl = e.target.closest('.day');
  if (dayEl && currentView === 'month' && !e.target.classList.contains('delete-recipe')) {
    const dateStr = dayEl.dataset.date;
    if (dateStr) {
      const [y, m, d] = dateStr.split('-');
      currentDate = new Date(y, parseInt(m) - 1, d);
      currentView = 'day';
      renderCalendar(currentDate);
    }
  }
});


// search bar for recipes
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) {
    console.error('Search input element not found!');
    return;
  }

  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const notes = document.querySelectorAll('.note-block, .note');
    notes.forEach(note => {
      note.style.display = note.textContent.toLowerCase().includes(query) ? '' : 'none';
    });
  });
});

// 
function getRecipeBlockHtml(recipeName) {
  return `
    <div class="note-block">
      <span class="recipe-name">${recipeName}</span>
      <button class="delete-recipe" title="Delete">&times;</button> <!-- X icon -->
    </div>`;

    // if (note && !e.target.classList.contains('edit-recipe') && !e.target.classList.contains('delete-recipe')) {
}

// Delete recipe handler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-recipe')) {
    e.stopPropagation();
    const note = e.target.closest('.note-block, .note');
    const recipeName = note.querySelector('.recipe-name').textContent;
    const parentDayOrSlot = note.closest('.day') || note.closest('.time-slot');

    let key;
    if (parentDayOrSlot.classList.contains('day')) {
      const dateKey = parentDayOrSlot.dataset.date;
      // In month view, find the exact key by checking all localStorage keys with that date prefix
      for (let k in localStorage) {
        if (k.startsWith(dateKey) && localStorage.getItem(k).split(';').includes(recipeName)) {
          key = k;
          break; // found 
        }
      }
    } else if (parentDayOrSlot.classList.contains('time-slot')) {
      key = parentDayOrSlot.dataset.datetime;
    }

    // Remove only one occurrence of the recipe from storage
    const existing = localStorage.getItem(key);
    if (existing) {
      const updatedArray = existing.split(';');
      const indexToRemove = updatedArray.indexOf(recipeName);
      if (indexToRemove !== -1) {
        updatedArray.splice(indexToRemove, 1); // remove only one instance
      }

      if (updatedArray.length) {
        localStorage.setItem(key, updatedArray.join(';'));
      } else {
        localStorage.removeItem(key);
      }
    }

    renderCalendar(currentDate);
  }
});



// // Edit recipe
// document.addEventListener('click', (e) => {
//   if (e.target.classList.contains('edit-recipe')) {
//     e.stopPropagation();
//     const note = e.target.closest('.note-block');
//     const oldRecipeName = note.querySelector('.recipe-name').textContent;
//     const newRecipeName = prompt('Edit recipe name:', oldRecipeName);
//     if (!newRecipeName) return;

//     const parentDay = note.closest('.day');
//     const dateKey = parentDay.dataset.date;
//     const oldKey = `${dateKey} ${oldRecipeName}`;
//     const newKey = `${dateKey} ${newRecipeName}`;

//     const data = localStorage.getItem(oldKey);
//     localStorage.removeItem(oldKey);
//     localStorage.setItem(newKey, data);

//     renderCalendar(currentDate);
//   }
// });


// view recipe on card click
document.addEventListener('click', (e) => {
  const note = e.target.closest('.note-block');
  // if (note && !e.target.classList.contains('edit-recipe') && !e.target.classList.contains('delete-recipe')) {
  if (note && !e.target.classList.contains('delete-recipe')) {
    const recipeName = note.querySelector('.recipe-name').textContent;
    // TODO: render the recipe card view
  }
});