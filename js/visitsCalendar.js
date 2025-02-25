/* js/visitsCalendar.js */
document.addEventListener("DOMContentLoaded", function() {
  const calendarBody = document.getElementById("calendar-body");
  const monthYearEl = document.getElementById("monthYear");
  const eventsListEl = document.getElementById("events-list");
  const selectedDateHeader = document.getElementById("selectedDateHeader");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");
  
  // For this demo, we use mock data for 10 days in the next month.
  // Keys are in YYYY-MM-DD format.
  const mockVisits = {
    "2023-04-05": ["Routine Checkup", "Blood Test"],
    "2023-04-07": ["Consultation with Dr. Lee"],
    "2023-04-10": ["Vaccination Appointment"],
    "2023-04-12": ["Follow-up Visit"],
    "2023-04-15": ["Lab Test", "X-Ray"],
    "2023-04-18": ["Consultation with Dr. Smith"],
    "2023-04-20": ["Physiotherapy Session"],
    "2023-04-22": ["Dental Checkup"],
    "2023-04-25": ["Eye Examination"],
    "2023-04-28": ["Nutrition Consultation"]
  };
  
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // 0-indexed month
  
  // We'll display the next month by default.
  currentMonth = (currentMonth + 1) % 12;
  if (currentMonth === 0) currentYear++;
  
  function updateMonthYearDisplay() {
    const date = new Date(currentYear, currentMonth);
    const options = { month: "long", year: "numeric" };
    monthYearEl.textContent = date.toLocaleDateString(AppSettings.language, options);
  }
  
  function generateCalendar(year, month) {
    calendarBody.innerHTML = "";
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let date = 1;
    for (let i = 0; i < 6; i++) {
      let row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        let cell = document.createElement("td");
        cell.style.cursor = "pointer";
        if (i === 0 && j < firstDay) {
          cell.textContent = "";
        } else if (date > daysInMonth) {
          cell.textContent = "";
        } else {
          cell.textContent = date;
          cell.onclick = () => displayEvents(year, month, date);
          date++;
        }
        row.appendChild(cell);
      }
      calendarBody.appendChild(row);
    }
  }
  
  function displayEvents(year, month, day) {
    const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Get the day name (e.g., Monday)
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const fullDate = new Date(year, month, day).toLocaleDateString(AppSettings.language, options);
    selectedDateHeader.textContent = fullDate;
    const events = mockVisits[selectedDate] || ["No visits on this day."];
    eventsListEl.innerHTML = "";
    events.forEach(event => {
      let li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = event;
      eventsListEl.appendChild(li);
    });
  }
  
  prevBtn.addEventListener("click", function() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    updateMonthYearDisplay();
    generateCalendar(currentYear, currentMonth);
    eventsListEl.innerHTML = "";
    selectedDateHeader.textContent = "Select a day to view events";
  });
  
  nextBtn.addEventListener("click", function() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateMonthYearDisplay();
    generateCalendar(currentYear, currentMonth);
    eventsListEl.innerHTML = "";
    selectedDateHeader.textContent = "Select a day to view events";
  });
  
  updateMonthYearDisplay();
  generateCalendar(currentYear, currentMonth);
});