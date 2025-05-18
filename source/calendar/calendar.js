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

// renders calendar based on the current view
// fills in cells using data from localStorage 
function renderCalendar(date) {
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
      let recipe = '';
      // Check if any recipe in localStorage matches this date
      for (let k in localStorage) {
        if (/^\d{4}-\d{1,2}-\d{1,2} \d{2}:\d{2}$/.test(k) && k.startsWith(dateKey + ' ')) {
          recipe = localStorage.getItem(k);
          break;
        }
      }

      calendarGrid.innerHTML += `<div class="day" data-date="${dateKey}">
        ${i}${recipe ? `<div class="note">${recipe}</div>` : ''}
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

        const recipe = localStorage.getItem(key);
        if (recipe) slot.innerHTML = `<div class="note">${recipe}</div>`;

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

      const recipe = localStorage.getItem(slot.dataset.datetime);
      if (recipe) slot.innerHTML = `<div class="note">${recipe}</div>`;

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

// View Toggle Buttons to switch between day, week, and month 
document.querySelectorAll('.calendar-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    currentView = btn.dataset.view;

    // update button styling
    document.querySelectorAll('.calendar-toggle button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

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
  
  // Save recipe name to that date-time key
  localStorage.setItem(key, recipeName);

  // Refresh the calendar view to reflect changes
  renderCalendar(currentDate);

  // Optionally reset form
  assignForm.reset();
});
