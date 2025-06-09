// calendar.js
// calculate dates and render basic calendar functions

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
// If in Jest test environment, mock localStorage

// DOM element references
const calendarGrid = document.getElementById('calendar-grid');
const calendarDayLabel = document.getElementById('calendar-day-label');
const monthYear = document.getElementById('month-year');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');



// Prevents reloading page if already on the said page
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function (event) {
    const current = window.location.pathname;
    const target = new URL(this.href).pathname;

    if (current === target) {
      event.preventDefault();
      console.log('You are already on this tab.');
    }
  });
});

let currentDate = new Date();
let currentView = 'month';

/* === FUNCTIONS === */

/**
 * Updates the appearance of calendar view toggle buttons.
 * Highlights the button corresponding to the current view ("day", "week", or "month")
 * by adding the 'active' CSS class and removing it from the others.
 */
function highlightActiveToggle() {
  document.querySelectorAll('.calendar-toggle button').forEach(button => {
    if (button.dataset.view === currentView) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

/**
 * Creates a positioned note element representing a scheduled recipe.
 * 
 * @param {Object} recipe - The recipe details.
 * @param {string} recipe.name - Name of the recipe.
 * @param {string} [recipe.author=''] - Author of the recipe.
 * @param {number} [topPx=0] - Top position in pixels.
 * @param {number} [heightPx=60] - Height in pixels.
 * @param {string} [key=''] - The associated localStorage key.
 * @returns {HTMLElement} A positioned note DOM element.
 */
function renderRecipeBlock({ name, author = '' }, topPx = 0, heightPx = 60, key = '') {
  const html = getRecipeBlockHtml(name, author);
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const note = temp.firstElementChild;

  note.classList.add('note');
  note.style.position = 'absolute';
  note.style.top = `${topPx}px`;
  note.style.height = `${heightPx}px`;
  note.style.left = '2px';
  note.style.right = '2px';

  if (key) {
    note.dataset.key = key;
  }

  return note;
}

/**
 * Renders the calendar UI based on the current view ("day", "week", or "month") 
 * and the provided date. It dynamically generates the calendar grid and populates
 * it with recipe blocks based on data stored in localStorage.
 * 
 * @param {Date} date - The reference date to render the calendar from.
 */
function renderCalendar(date) {
  highlightActiveToggle();
  // Reset calendar content and update view-specific class names
  calendarGrid.innerHTML = '';
  calendarGrid.classList.remove('day-view', 'week-view', 'month-view');
  calendarGrid.classList.add(`${currentView}-view`);
  calendarGrid.style.gridTemplateRows = ''; // clear any row structure (day/week)
  calendarGrid.style.gridTemplateColumns = ''; // also safe to clear before redefining
  calendarGrid.style.height = '';
  calendarGrid.style.position = '';
  calendarGrid.style.display = '';


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
    calendarGrid.style.gridTemplateRows = '';
    monthYear.textContent = `${monthNames[month]} ${year}`; // header

    // fill leading blanks
    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      calendarGrid.appendChild(blank);
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
        .map(({ name, author, time }) => getRecipeBlockHtml(name, author, time))
        .join('');



      const dayDiv = document.createElement('div');
      dayDiv.className = 'day';
      dayDiv.dataset.date = dateKey;

      const dayNumberDiv = document.createElement('div');
      dayNumberDiv.className = 'day-number';
      dayNumberDiv.textContent = i;

      const notesContainer = document.createElement('div');
      notesContainer.className = 'notes-container';
      notesContainer.innerHTML = recipeHtml;

      dayDiv.appendChild(dayNumberDiv);
      dayDiv.appendChild(notesContainer);
      calendarGrid.appendChild(dayDiv);
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

          const datePrefix = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
          const hourPrefix = `${String(hour).padStart(2, '0')}:`;
          const hourHeight = 60; // px per hour
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith(datePrefix) && key.includes(hourPrefix)) {
              const [_, time] = key.split(' ');
              const [h, m] = time.split(':').map(Number);
              const offsetTop = (m / 60) * hourHeight; // px from top of cell
              const stored = getStoredRecipeData(key);
              stored.forEach(({ name, author, durationMinutes = 60 }) => {
                const heightPx = (durationMinutes / 60) * hourHeight; // 1 min = 1px
                const note = renderRecipeBlock({ name, author }, offsetTop, heightPx, key);
                cell.appendChild(note);
              });
            }
          });

        }

        calendarGrid.appendChild(cell);
      }
    }


    // DAY VIEW
    // displays 24 vertical time slots for a single da

  } else if (currentView === 'day') {
    calendarGrid.innerHTML = '';
    calendarGrid.style.gridTemplateColumns = '50px 1fr';
    // calendarGrid.style.gridTemplateRows = 'repeat(24, 60px)';
    calendarGrid.style.position = 'relative';

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
      slot.style.position = 'relative'; // so children can be positioned absolute
      slot.dataset.datetime = `${dayKey} ${String(h).padStart(2, '0')}:00`;
      calendarGrid.appendChild(slot);
    }

    // Compute total overlay height based on actual slot height
    const lastSlot = document.querySelectorAll('.time-slot')[23];
    const gridTop = calendarGrid.getBoundingClientRect().top;
    const slotBottom = lastSlot.getBoundingClientRect().bottom;
    const height = slotBottom - gridTop;

    // Add floating overlay container
    requestAnimationFrame(() => {
      const lastSlot = document.querySelectorAll('.time-slot')[23];
      const gridTop = calendarGrid.getBoundingClientRect().top;
      const slotBottom = lastSlot.getBoundingClientRect().bottom;
      const height = slotBottom - gridTop;

      const hourHeight = lastSlot.offsetHeight;

      const overlay = document.createElement('div');
      overlay.className = 'day-overlay';
      overlay.style.position = 'absolute';
      overlay.style.left = '50px';
      overlay.style.top = '0';
      overlay.style.width = 'calc(100% - 50px)';
      overlay.style.height = `${height}px`;
      overlay.style.zIndex = '2';
      overlay.style.pointerEvents = 'none';

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(dayKey)) {
          const [_, time] = key.split(' ');
          const [hour, minute] = time.split(':').map(Number);
          const startMin = hour * 60 + minute;
          const topPx = (startMin / 60) * hourHeight;

          const recipes = getStoredRecipeData(key);
          recipes.forEach(({ name, author, durationMinutes = 60 }) => {
            const heightPx = (durationMinutes / 60) * hourHeight;
            const slotIndex = hour;
            const slot = document.querySelectorAll('.time-slot')[slotIndex];
            if (slot) {
              const offsetTop = (minute / 60) * hourHeight;
              const note = renderRecipeBlock({ name, author }, offsetTop, heightPx, key);
              slot.appendChild(note);
            }

          });
        }
      });

      calendarGrid.appendChild(overlay);
    });

  }

}

// inital render on page load
// renderCalendar(currentDate); // comment this out for Jest testing


/**
 * Stores a selected recipe to localStorage under a datetime key.
 * 
 * @param {string} key - LocalStorage key in "YYYY-MM-DD HH:MM" format.
 * @param {string} recipeName - Name of the recipe to store.
 * @param {Array<Object>} recipesList - List of available recipes.
 */
function storeRecipeToCalendar(key, recipeName, recipesList) {
  const selected = recipesList.find(r => r.name === recipeName);
  const toStore = selected ? { name: selected.name, author: selected.author } : recipeName;
  localStorage.setItem(key, JSON.stringify(toStore));
}

/**
 * Retrieves stored recipe data from localStorage for a given key.
 * 
 * @param {string} key - LocalStorage key (e.g., "2025-06-07 18:00").
 * @returns {Array<Object>} An array of recipe objects.
 */
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

/**
 * Populates the recipe dropdown form with options from localStorage.
 */
function populateRecipeDropdown() {
  const dropdown = document.getElementById('recipe-select');
  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

  for (const recipe of recipes) {
    const option = document.createElement('option');
    option.value = recipe.name;
    option.textContent = recipe.name;
    option.dataset.author = recipe.author;
    dropdown.appendChild(option);
  }
}

populateRecipeDropdown();

/**
 * Generates the inner HTML string for a recipe note block.
 * 
 * @param {string} name - Recipe name.
 * @param {string} [author=''] - Author of the recipe.
 * @param {string} [time=''] - Time string (e.g., "18:00").
 * @returns {string} HTML string for rendering.
 */
function getRecipeBlockHtml(name, author = '', time = '') {
  return `
    <div class="note-block" data-name="${name}" data-author="${author}">
      <span class="recipe-name">
        ${time ? `${time} – ` : ''}${name}${author ? ` by ${author}` : ''}
      </span>
      <button class="delete-recipe" title="Delete">&times;</button>
    </div>`;
}


/**
 * Pads a number with leading zeros to ensure two-digit format.
 * 
 * @param {number|string} n - The number to pad.
 * @returns {string} The padded string (e.g., "07").
 */
function pad(n) {
  return n.toString().padStart(2, '0');
}

/**
 * Normalizes a datetime key to the format "YYYY-MM-DD HH:MM".
 * 
 * @param {string} rawKey - Unformatted datetime key.
 * @returns {string} Normalized key.
 */
function normalizeDatetimeKey(rawKey) {
  const [date, time] = rawKey.split(' ');
  const [y, m, d] = date.split('-').map(s => pad(parseInt(s)));
  return `${y}-${pad(m)}-${pad(d)} ${time}`;
}


/* === EVENT LISTENERS === */
if (!isTestEnv) {
  // Initial render on page load
  renderCalendar(currentDate);

  // PATCHED form submission
  const assignForm = document.getElementById('assign-form');
  if (assignForm) {
    assignForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const recipeName = document.getElementById('recipe-select').value;
      const date = document.getElementById('recipe-date').value;
      const time = document.getElementById('recipe-time').value;
      if (!recipeName || !date || !time) return;
      const [y, m, d] = date.split("-");
      const key = `${y}-${m}-${d} ${time}`;
      const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      const authorText = document.getElementById('recipe-select').selectedOptions[0].dataset.author;
      const selected = allRecipes.find(r => r.name === recipeName && r.author === authorText);

      if (!selected) return;
      function parseTimeEstimate(str) {
        const match = str.match(/(?:(\d+)\s*hr)?\s*(?:(\d+)\s*min)?/i);
        if (!match) return 60;
        const hrs = parseInt(match[1]) || 0;
        const mins = parseInt(match[2]) || 0;
        return hrs * 60 + mins;
      }

      const entry = {
        name: selected.name,
        author: selected.author,
        durationMinutes: selected.timeEstimate
          ? parseTimeEstimate(selected.timeEstimate)
          : (selected.durationMinutes || 60)
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
  }


  // navigation button handlers
  // adjusts currentDate based on view and re-render
  if (prevBtn) {
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
  }

  if (nextBtn) {
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
  }

  // view toggle buttons to switch between day, week, and month 
  document.querySelectorAll('.calendar-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      renderCalendar(currentDate); // re-render based on selected view
    });
  });


  if (calendarGrid) {
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
  }


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


  // Delete recipe handler
  calendarGrid.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-recipe');
    if (!deleteBtn) return;

    e.stopPropagation();

    const note = deleteBtn.closest('.note-block, .note');
    const recipeName = note.dataset.name;
    const author = note.dataset.author;

    let key = '';

    if (currentView === 'month') {
      const parentDay = note.closest('.day');
      const recipeText = note.querySelector('.recipe-name')?.textContent.trim();
      const match = recipeText.match(/^(\d{2}:\d{2})\s+–/);
      if (!match || !parentDay) return;
      const date = parentDay.dataset.date;
      const time = match[1];
      key = `${date} ${time}`;
    } else if (currentView === 'day' || currentView === 'week') {
      const slot = note.closest('.time-slot');
      key = note.dataset.key;

      Object.keys(localStorage).forEach(k => console.log("-", k));
    }

    if (!key) {
      console.warn("Could not determine localStorage key");
      return;
    }

    try {
      const current = JSON.parse(localStorage.getItem(key)) || [];

      const updated = current.filter(r => {
        const nameMatch = r.name?.trim() === recipeName?.trim();
        const authorMatch = (r.author || '').trim() === (author || '').trim();
        return !(nameMatch && authorMatch);
      });

      if (updated.length > 0) {
        localStorage.setItem(key, JSON.stringify(updated));
      } else {
        localStorage.removeItem(key);
      }

      renderCalendar(currentDate);
    } catch (err) {
      console.error('Error during deletion:', err);
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

  // SEARCH BAR FUNCTIONALITY – redirects to my-recipes.html with query
  const searchInput = document.getElementById('search-field-small');
  const searchButton = document.querySelector('[type="submit"]');

  /**
   * Handles search requests from calendar page by redirecting to shelf
   */
  function handleSearch() {
    const query = searchInput.value.trim();
    if (query !== '') {
      localStorage.setItem('searchQuery', query);
      window.location.href = '../RecipeCard/my-recipes.html';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }

  if (searchButton) {
    searchButton.addEventListener('click', handleSearch);
  }

  const mobileSearchInput = document.getElementById('search-field-mobile');
  const mobileSearchButton = document.getElementById('search-button-mobile');

  /**
   * Handles search requests from calendar page by redirecting to shelf form mobile navigation
   */
  function handleMobileSearch() {
    const query = mobileSearchInput.value.trim();
    if (query !== '') {
      localStorage.setItem('searchQuery', query);
      window.location.href = '../RecipeCard/my-recipes.html';
    }
  }

  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleMobileSearch();
      }
    });
  }

  if (mobileSearchButton) {
    mobileSearchButton.addEventListener('click', handleMobileSearch);
  }

} // end of if !isTestEnv


// === FOR JEST TESTING ===
export {
  renderRecipeBlock,
  getRecipeBlockHtml,
  getStoredRecipeData,
  normalizeDatetimeKey,
  pad,
  highlightActiveToggle,
  renderCalendar,
  storeRecipeToCalendar,
  populateRecipeDropdown
};