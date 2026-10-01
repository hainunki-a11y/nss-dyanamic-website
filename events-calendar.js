/* ═══════════════════════════════════════════════
   NSS TSEC — Home Page Events Section Calendar Logic
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* --- Category Icon Map --- */
  const CATEGORY_ICON = {
    'hackathon':       '💻',
    'health drive':    '❤️',
    'cultural event':  '🎭',
    'awareness':       '📢',
    'seminar':         '🎓',
    'event series':    '🗓️',
    'patriotic event': '🇮🇳',
    'sports':          '🏅',
    'environment':     '🌱',
    'rally':           '📣',
    'ceremony':        '🏆',
    'celebration':     '🎉',
    'orientation':     '🎯',
  };

  function getIcon(tag) {
    return CATEGORY_ICON[tag.toLowerCase()] || '📌';
  }

  /* --- 2025-26 Archived Events Data --- */
  const EVENTS_2025_26 = [
    { date: '21 Feb 2026', title: "Day 2 Hackspark's 2.0", tag: 'Hackathon', photo: 'https://placehold.co/600x800' },
    { date: '20 Feb 2026', title: "Day 1 Hackspark's 2.0", tag: 'Hackathon', photo: 'https://placehold.co/600x800' },
    { date: '06 Feb 2026', title: 'Blood Donation Camp', tag: 'Health Drive', photo: 'https://placehold.co/800x600' },
    { date: '31 Jan 2026', title: 'AAROHAN', tag: 'Cultural Event', photo: 'https://placehold.co/800x600' },
    { date: '30 Jan 2026', title: 'AAROHAN', tag: 'Cultural Event', photo: 'https://placehold.co/800x600' },
    { date: '30 Jan 2026', title: 'Medical Checkup Camp', tag: 'Health Drive', photo: 'assets/Events/health-checkup.jpg' },
    { date: '29 Jan 2026', title: 'FE SSC Awareness Program', tag: 'Awareness', photo: 'https://placehold.co/800x600' },
    { date: '29 Jan 2026', title: 'AAROHAN', tag: 'Cultural Event', photo: 'https://placehold.co/800x600' },
    { date: '28 Jan 2026', title: 'TPC Guide on Future Seminar', tag: 'Seminar', photo: 'https://placehold.co/800x600' },
    { date: '17 Jan 2026', title: 'Aventura', tag: 'Event Series', photo: 'https://placehold.co/800x600' },
    { date: '15 Jan 2026', title: 'Aventura', tag: 'Event Series', photo: 'https://placehold.co/800x600' },
    { date: '14 Jan 2026', title: 'Aventura', tag: 'Event Series', photo: 'https://placehold.co/800x600' },
    { date: '13 Jan 2026', title: 'Aventura', tag: 'Event Series', photo: 'https://placehold.co/800x600' },
    { date: '12 Jan 2026', title: 'Aventura', tag: 'Event Series', photo: 'https://placehold.co/800x600' },
    { date: '07 Jan 2026', title: 'Women Health Awareness', tag: 'Awareness', photo: 'https://placehold.co/800x600' },
    { date: '05 Jan 2026', title: 'Voting Awareness', tag: 'Awareness', photo: 'https://placehold.co/800x600' },
    { date: '22 Dec 2025', title: 'Youth Mental Health & Suicide Prevention', tag: 'Awareness', photo: 'https://placehold.co/800x600' },
    { date: '19 Dec 2025', title: 'Awareness On Street Dogs', tag: 'Awareness', photo: 'https://placehold.co/800x600' },
    { date: '19 Nov 2025', title: 'Reforming the Justice System', tag: 'Seminar', photo: 'https://placehold.co/800x600' },
    { date: '07 Nov 2025', title: '150 Years Grand Vande Mataram Singing', tag: 'Patriotic Event', photo: 'assets/Events/150 years grand vande mataram.jpeg' },
    { date: '30 Oct 2025', title: 'Pledge on National Unity Day', tag: 'Patriotic Event', photo: 'assets/Events/Unity Day.jpeg' },
    { date: '17 Oct 2025', title: 'Prarambh Sports Day', tag: 'Sports', photo: 'https://placehold.co/800x600' },
    { date: '03 Oct 2025', title: 'Tree Plantation Drive', tag: 'Environment', photo: 'assets/Events/tree plantation.jpg' },
    { date: '26 Sep 2025', title: 'Smart India Hackathon', tag: 'Hackathon', photo: 'https://placehold.co/600x800' },
    { date: '25 Sep 2025', title: 'Oath Ceremony', tag: 'Ceremony', photo: 'https://placehold.co/800x600' },
    { date: '24 Sep 2025', title: 'NSS Day', tag: 'Celebration', photo: 'assets/Events/NSS Day.jpeg' },
    { date: '20 Sep 2025', title: 'Beach Cleaning Drive', tag: 'Environment', photo: 'assets/Events/BEach cleaning drive.jpeg' },
    { date: '16 Sep 2025', title: 'FE Orientation', tag: 'Orientation', photo: 'assets/Events/nss-orientation.jpg' },
    { date: '05 Sep 2025', title: 'Teachers Day', tag: 'Celebration', photo: 'https://placehold.co/800x600' },
    { date: '02 Sep 2025', title: 'Ganpati Visarjan 7 Day', tag: 'Cultural Event', photo: 'assets/Events/Ganpati Visarjan day 7.jpeg' },
    { date: '31 Aug 2025', title: 'Ganpati Visarjan 5 Day', tag: 'Cultural Event', photo: 'assets/Events/Ganapati day 5.jpeg' },
    { date: '25 Aug 2025', title: 'Seminar on Communication Skills', tag: 'Seminar', photo: 'https://placehold.co/800x600' },
    { date: '15 Aug 2025', title: 'Flag Hoisting', tag: 'Patriotic Event', photo: 'assets/Events/Independence day.jpeg' },
    { date: '29 Jul 2025', title: 'Seminar on Industry Expectations', tag: 'Seminar', photo: 'https://placehold.co/800x600' },
    { date: '21 Jul 2025', title: 'Seminar on NPTEL', tag: 'Seminar', photo: 'https://placehold.co/800x600' },
    { date: '11 Jul 2025', title: 'CPR Training', tag: 'Health Drive', photo: 'https://placehold.co/800x600' },
    { date: '11 Jul 2025', title: 'Health Checkup Camp', tag: 'Health Drive', photo: 'assets/Events/health-checkup.jpg' },
  ];

  /* --- Calendar Range Bounds --- */
  const START_DATE = new Date('2025-07-01');
  const END_DATE = new Date('2026-02-28');

  /* --- State Variables --- */
  let currentYear = 2026;
  let currentMonthIndex = 1; // February (0-indexed represents January, so 1 = Feb)

  /* --- Month Names Map --- */
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /* --- Initialize Events and Listeners --- */
  document.addEventListener('DOMContentLoaded', () => {
    initTabSystem();
    initCalendarWidget();
  });

  /* ─── 1. Tab System Logic ─── */
  function initTabSystem() {
    const tabButtons = document.querySelectorAll('.events-tab-btn');
    const tabPanes = document.querySelectorAll('.events-tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        // Update active classes on buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active classes on panes
        tabPanes.forEach(pane => {
          if (pane.id === targetTab) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        // Trigger ScrollTrigger refresh in case GSAP is watching this area
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  /* ─── 2. Calendar Widget Logic ─── */
  function initCalendarWidget() {
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');

    if (!prevBtn || !nextBtn) return;

    // Load initial calendar grid
    renderCalendarGrid();

    // Bind navigations
    prevBtn.addEventListener('click', () => {
      changeMonth(-1);
    });

    nextBtn.addEventListener('click', () => {
      changeMonth(1);
    });
  }

  /* Helper to check if year/month are within July 2025 - February 2026 */
  function isOutOfRange(year, month) {
    const testDate = new Date(year, month, 1);
    return testDate < new Date(START_DATE.getFullYear(), START_DATE.getMonth(), 1) ||
           testDate > new Date(END_DATE.getFullYear(), END_DATE.getMonth(), 1);
  }

  function changeMonth(delta) {
    let targetMonth = currentMonthIndex + delta;
    let targetYear = currentYear;

    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear--;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear++;
    }

    if (!isOutOfRange(targetYear, targetMonth)) {
      currentMonthIndex = targetMonth;
      currentYear = targetYear;
      renderCalendarGrid();
    }
  }

  /* ─── 3. Render Calendar Grid ─── */
  function renderCalendarGrid() {
    const monthLabel = document.getElementById('cal-month-label');
    const daysContainer = document.getElementById('cal-days-grid');
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');

    if (!daysContainer || !monthLabel) return;

    // Update Nav buttons state
    let testPrevMonth = currentMonthIndex - 1;
    let testPrevYear = currentYear;
    if (testPrevMonth < 0) { testPrevMonth = 11; testPrevYear--; }
    prevBtn.disabled = isOutOfRange(testPrevYear, testPrevMonth);

    let testNextMonth = currentMonthIndex + 1;
    let testNextYear = currentYear;
    if (testNextMonth > 11) { testNextMonth = 0; testNextYear++; }
    nextBtn.disabled = isOutOfRange(testNextYear, testNextMonth);

    // Update Label
    monthLabel.innerHTML = `${MONTH_NAMES[currentMonthIndex]} <span>${currentYear}</span>`;

    // Clear previous cells
    daysContainer.innerHTML = '';

    // Calculate dates
    const firstDayIndex = new Date(currentYear, currentMonthIndex, 1).getDay(); // Day of week (0-6)
    const totalDays = new Date(currentYear, currentMonthIndex + 1, 0).getDate(); // Days in month

    // 1. Render Empty padding cells for week offset
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-cell empty';
      daysContainer.appendChild(emptyCell);
    }

    // Index events in this month by day number
    const eventsByDay = {};
    EVENTS_2025_26.forEach(ev => {
      const parsed = parseEventDate(ev.date);
      if (parsed.year === currentYear && parsed.monthIndex === currentMonthIndex) {
        if (!eventsByDay[parsed.day]) {
          eventsByDay[parsed.day] = [];
        }
        eventsByDay[parsed.day].push(ev);
      }
    });

    // 2. Render actual day cells
    let firstEventDay = null;

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell active-day';
      cell.textContent = day;

      const dayEvents = eventsByDay[day];
      if (dayEvents && dayEvents.length > 0) {
        cell.classList.add('has-event');
        if (!firstEventDay) {
          firstEventDay = day; // Track the first day with an event to auto-select it
        }

        // Attach click listener
        cell.addEventListener('click', () => {
          selectDayCell(cell, day, dayEvents);
        });
      }

      daysContainer.appendChild(cell);
    }

    // Auto-select the first day containing events, or show empty state if none
    if (firstEventDay) {
      const targetCell = Array.from(daysContainer.children).find(
        c => c.classList.contains('active-day') && parseInt(c.textContent) === firstEventDay
      );
      if (targetCell) {
        selectDayCell(targetCell, firstEventDay, eventsByDay[firstEventDay]);
      }
    } else {
      showEmptyDetailState();
    }
  }

  /* Helper to select a day cell and load details */
  function selectDayCell(cellElement, day, events) {
    // Clear previous selected styling
    const cells = document.querySelectorAll('.calendar-day-cell');
    cells.forEach(c => c.classList.remove('selected-day'));

    // Highlight clicked cell
    cellElement.classList.add('selected-day');

    // Update detail pane on the right
    renderEventDetails(events, day);
  }

  /* ─── 4. Render Event Details (Right Column) ─── */
  function renderEventDetails(events, day) {
    const detailSide = document.getElementById('cal-detail-side');
    if (!detailSide) return;

    // Build markup for all events on this day
    let eventsMarkup = '';

    events.forEach((ev, idx) => {
      const icon = getIcon(ev.tag);
      const isMultiple = events.length > 1;
      const borderTop = idx > 0 ? 'border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; margin-top: 16px;' : '';

      eventsMarkup += `
        <div style="${borderTop}">
          ${isMultiple ? `<span style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 4px;">Event ${idx + 1} of ${events.length}</span>` : ''}
          <div class="cal-detail-category">${icon} ${ev.tag}</div>
          <h4 class="cal-detail-title">${ev.title}</h4>
          <button class="cal-detail-btn zoom-btn" data-img="${ev.photo}">View Full Photo</button>
        </div>
      `;
    });

    // We display the image of the first event (or switchable if we wanted, but first is great)
    const primaryImg = events[0].photo || 'https://placehold.co/800x600';
    const dateStr = `${day} ${MONTH_NAMES[currentMonthIndex]} ${currentYear}`;

    detailSide.innerHTML = `
      <div class="calendar-event-detail-card active">
        <div class="cal-detail-img-wrap">
          <img src="${primaryImg}" class="cal-detail-img" alt="Event preview image">
        </div>
        <div class="cal-detail-content">
          <span class="cal-detail-date-badge">${dateStr}</span>
          ${eventsMarkup}
        </div>
      </div>
    `;

    // Hook zoom button logic to home lightbox (we will add a lightbox check or bind)
    const zoomButtons = detailSide.querySelectorAll('.zoom-btn');
    zoomButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        openHomeLightbox(btn.dataset.img);
      });
    });
  }

  function showEmptyDetailState() {
    const detailSide = document.getElementById('cal-detail-side');
    if (!detailSide) return;

    detailSide.innerHTML = `
      <div class="cal-detail-empty-state">
        <div class="cal-detail-empty-icon">📅</div>
        <p class="cal-detail-empty-text">No events conducted on this month.</p>
      </div>
    `;
  }

  /* ─── 5. Lightbox for Home page ─── */
  function openHomeLightbox(src) {
    let lightbox = document.getElementById('home-lightbox');
    if (!lightbox) {
      // Build lightbox dynamically if it doesn't exist
      lightbox = document.createElement('div');
      lightbox.id = 'home-lightbox';
      lightbox.className = 'lightbox-overlay';
      lightbox.innerHTML = `
        <button class="lightbox-close" id="home-lightbox-close" aria-label="Close image">&times;</button>
        <div class="lightbox-content">
          <img src="" alt="Event photo" id="home-lightbox-img" />
        </div>
      `;
      document.body.appendChild(lightbox);

      // Event listeners
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.id === 'home-lightbox-close') {
          closeHomeLightbox();
        }
      });
    }

    const img = document.getElementById('home-lightbox-img');
    if (img) img.src = src;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Escape key
    document.onkeydown = (e) => {
      if (e.key === 'Escape') closeHomeLightbox();
    };
  }

  function closeHomeLightbox() {
    const lightbox = document.getElementById('home-lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ─── 6. Parsing Date Utility ─── */
  // Date format is "DD Mon YYYY" (e.g. "15 Aug 2025")
  function parseEventDate(dateString) {
    const parts = dateString.split(' '); // ["15", "Aug", "2025"]
    const day = parseInt(parts[0], 10);
    const monStr = parts[1];
    const year = parseInt(parts[2], 10);

    const monthShorts = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = monthShorts.indexOf(monStr);

    return { day, monthIndex, year };
  }

})();
