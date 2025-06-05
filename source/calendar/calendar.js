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

// render a recipe block with name, author, and time
function renderRecipeBlock({ name, author = '', durationMinutes = 60 }, topPx = 0) {
  const html = getRecipeBlockHtml(name, author);
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const note = temp.firstElementChild;
  note.style.position = 'absolute';
  note.style.top = `${topPx}px`;  // e.g. 720 for 12:00
  note.style.height = `${durationMinutes}px`;  // e.g. 90
  note.style.left = '2px';
  note.style.right = '2px';
  return note;
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
      // Collect keys for this date and sort them by time
      const matchingKeys = Object.keys(localStorage)
        .filter(k => /^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}$/.test(k) && k.startsWith(dateKey + ' '))
        .sort((a, b) => {
          const timeA = a.split(' ')[1];
          const timeB = b.split(' ')[1];
          return timeA.localeCompare(timeB); // sort by HH:MM
        });

        let recipeObjects = [];
        for (const key of matchingKeys) {
          const time = key.split(' ')[1]; // "HH:MM"
          try {
            const stored = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(stored)) {
              stored.forEach(obj => {
                recipeObjects.push({ name: obj.name, author: obj.author, time });
              });
            } else if (typeof stored === 'object') {
              recipeObjects.push({ name: stored.name, author: stored.author, time });
            } else if (typeof stored === 'string') {
              recipeObjects.push({ name: stored, time });
            }
          } catch (e) {
            console.warn(`Error parsing key ${key}:`, e);
          }

        }
        const recipeHtml = recipeObjects
          .map(({ name, time }) => getRecipeBlockHtml(name, time))
          .join('');

      
      calendarGrid.innerHTML += `
      <div class="day" data-date="${dateKey}">
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

    // Loop through 24 hours and 7 days
    for (let hour = 0; hour < 24; hour++) {
      for (let dayOffset = -1; dayOffset < 7; dayOffset++) {
        const cell = document.createElement('div');

        if (dayOffset === -1) {
          // leftmost column: time label
          cell.className = 'time-label';
          cell.textContent = `${hour}:00`;
        } else {
          const day = new Date(start);
          day.setDate(start.getDate() + dayOffset);
          const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`;

          cell.className = 'time-slot';
          cell.dataset.datetime = key;
          cell.style.position = 'relative';

          const stored = getStoredRecipeData(key);
          stored.forEach(({ name, author, durationMinutes = 60 }) => {
            const note = renderRecipeBlock({ name, author, durationMinutes }, 0);
            cell.appendChild(note);
          });
        }

        calendarGrid.appendChild(cell);
      }
    }


  // DAY VIEW
  // displays 24 vertical time slots for a single day
  } else if (currentView === 'day') {
    calendarGrid.innerHTML = '';
    calendarGrid.classList.add('day-view');

    calendarGrid.style.gridTemplateColumns = '50px 1fr'; // 1 label + 1 slot
    calendarGrid.style.display = 'grid';
    calendarGrid.style.gridTemplateRows = 'repeat(24, var(--hour-height))';

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const dateKeyPrefix = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${day}, ${year}`;
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    calendarDayLabel.textContent = weekdayNames[date.getDay()];
    calendarDayLabel.classList.add('day-view');

    // Create 24 hour rows
    for (let h = 0; h < 24; h++) {
      const label = document.createElement('div');
      label.className = 'time-label';
      label.textContent = `${h}:00`;
      calendarGrid.appendChild(label);

      const cell = document.createElement('div');
      cell.className = 'time-slot';
      calendarGrid.appendChild(cell);
    }

    // Render recipe blocks in a floating day column
    const overlay = document.createElement('div');
    overlay.className = 'day-column';

    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(dateKeyPrefix)) {
        const parts = k.split(' ');
        const [yyyy, mm, dd] = parts[0].split('-');
        const [hh, min] = parts[1].split(':');
        const totalMinutes = parseInt(hh) * 60 + parseInt(min);

        const stored = getStoredRecipeData(k);
        stored.forEach(({ name, author, durationMinutes = 60 }) => {
          console.log(`Rendering "${name}" at ${totalMinutes}px for ${durationMinutes}min`);
          const note = renderRecipeBlock({ name, author, durationMinutes }, totalMinutes);
          overlay.appendChild(note);
        });
      }
    });

    calendarGrid.appendChild(overlay);

    // monthYear.textContent = `${monthNames[month]} ${date.getDate()}, ${year}`;
    // const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // calendarDayLabel.textContent = weekdayNames[date.getDay()];

    // const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    // for (let h = 0; h < 24; h++) {
    //   const label = document.createElement('div');
    //   label.className = 'time-label';
    //   label.textContent = `${h}:00`;
    //   calendarGrid.appendChild(label);

    //   const slot = document.createElement('div');
    //   slot.className = 'time-slot';
    //   slot.dataset.datetime = `${dayKey} ${String(h).padStart(2, '0')}:00`;

    //   const storedRecipes = getStoredRecipeData(slot.dataset.datetime);
    //   storedRecipes.forEach(({ name, author, durationMinutes = 60 }) => {
    //     const note = renderRecipeBlock({ name, author, durationMinutes }, 0);
    //     slot.appendChild(note);
    //   });

    //   calendarGrid.appendChild(slot);
    // }

  }
}

// inital render on page load
renderCalendar(currentDate);

// PATCHED form submission
const assignForm = document.getElementById('assign-form');
assignForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const recipeName = document.getElementById('recipe-select').value;
  const date = document.getElementById('recipe-date').value;
  const time = document.getElementById('recipe-time').value;
  if (!recipeName || !date || !time) return;
  const [y, m, d] = date.split("-");
  const key = `${y}-${m}-${d} ${time}`;
  const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
  const selected = allRecipes.find(r => r.name === recipeName);
  if (!selected) return;
  const entry = {
    name: selected.name,
    author: selected.author,
    durationMinutes: selected.durationMinutes || 60
  };
  let current = [];
  try {
    current = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    current = [];
  }
  const duplicate = current.find(r => r.name === entry.name && r.author === entry.author);
  if (!duplicate) {
    current.push(entry);
    localStorage.setItem(key, JSON.stringify(current));
  }
  renderCalendar(currentDate);
  assignForm.reset();
});



// Store recipe to localStorage under a specific key
// key is a string like "YYYY-MM-DD HH:MM"
// recipeName is the name of the recipe to store
// recipesList is an array of recipe objects with name and author properties
function storeRecipeToCalendar(key, recipeName, recipesList) {
  const selected = recipesList.find(r => r.name === recipeName);
  const toStore = selected ? { name: selected.name, author: selected.author } : recipeName;
  localStorage.setItem(key, JSON.stringify(toStore));
}


function getStoredRecipeData(key) {
  const raw = localStorage.getItem(key);

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (typeof parsed === 'object' && parsed !== null) {
      return [parsed];
    }
  } catch (e) {
    // fallback: treat raw string as recipe name
    if (typeof raw === 'string') {
      return [{ name: raw, author: '' }];
    }
  }

  return [];
}



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

// Helper function to generate HTML for a recipe block
function getRecipeBlockHtml(name, author = '', time = '') {
  return `
    <div class="note-block" data-name="${name}" data-author="${author}">
      <span class="recipe-name">
        ${time ? `${time} – ` : ''}${name}${author ? ` by ${author}` : ''}
      </span>
      <button class="delete-recipe" title="Delete">&times;</button>
    </div>`;
}




// Delete recipe handler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-recipe')) {
    e.stopPropagation();
    const note = e.target.closest('.note-block, .note');
    const recipeText = note.querySelector('.recipe-name').textContent;
    const recipeStr = recipeText.replace(/\d{2}:\d{2} – /, '').trim();  // strip time prefix if exists
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
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || [];
      const updated = existing.filter(r => !(r.name === recipeName || `${r.name} by ${r.author}` === recipeStr));
      if (updated.length) {
        localStorage.setItem(key, JSON.stringify(updated));
       } else {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`Error updating deletion for ${key}:`, e);
    }

  renderCalendar(currentDate);

  }
  
});


// Re-render calendar when screen is resized to apply new recipe limits
window.addEventListener('resize', () => {
  renderCalendar(currentDate);
});



// view recipe on card click
document.addEventListener('click', (e) => {
  const note = e.target.closest('.note-block');
  // if (note && !e.target.classList.contains('edit-recipe') && !e.target.classList.contains('delete-recipe')) {
  if (note && !e.target.classList.contains('delete-recipe')) {
    const recipeName = note.querySelector('.recipe-name').textContent;
    // TODO: render the recipe card view
  }
});