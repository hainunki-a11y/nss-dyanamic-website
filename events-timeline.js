/*
  NSS TSEC Mumbai — Events Timeline Interactions
  Horizontal Calendar Strip · Click-to-reveal cards · Lightbox
*/

/* ─── Category → Emoji map ───
   (Session 5) Now read from data/category-icons.json so CMS edits to the
   icon map actually take effect. A small built-in default covers the known
   tags in case the data is empty or unavailable. */
const DEFAULT_CATEGORY_ICON = {
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

let CATEGORY_ICON = DEFAULT_CATEGORY_ICON;

function getCategoryIcon(tag) {
  return (CATEGORY_ICON && CATEGORY_ICON[String(tag || '').toLowerCase()]) || '📌';
}

/* ─── XSS-safe text escaping (Session 5) ───
   Every text value rendered into the DOM from data must pass through
   escapeHtml so a malicious value in the CMS can never inject markup. */
function esc(s) {
  return (window.NSS && window.NSS.escapeHtml) ? window.NSS.escapeHtml(s) : String(s == null ? '' : s);
}

/* ─── Events data is fetched from /data/events/<year> (Session 3) ───
   `eventsByYear` holds the sorted (newest-first) arrays. The original
   hardcoded arrays were ordered newest month first, newest day first, so a
   stable descending-by-date sort reproduces the exact same layout. */
const eventsByYear = {};

function sortEventsNewestFirst(events) {
  return [...(events || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function loadEventsData() {
  const years = ['2025-26', '2026-27'];
  return Promise.all(
    years.map(year =>
      window.NSS.getEvents(year).then(list => {
        eventsByYear[year] = sortEventsNewestFirst(list);
      })
    ).concat([
      window.NSS.getData().then(function (data) {
        if (window.NSS.renderFooter) window.NSS.renderFooter(data);
        var icons = (data && data.categoryIcons && data.categoryIcons.icons) || null;
        if (icons && Object.keys(icons).length) CATEGORY_ICON = icons;
      })
    ])
  );
}

/* ─── Group events by "Month YYYY" ─── */
function groupByMonth(events) {
  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];
  const map = new Map();
  events.forEach(ev => {
    const parts = ev.date.split(' '); // ["21", "Feb", "2026"]
    const mon = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
    const key = `${monthNames[mon.getMonth()]} ${mon.getFullYear()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(ev);
  });
  return map;
}

/* ─── Build card inner HTML ─── */
function buildCardHTML(ev) {
  const icon = getCategoryIcon(ev.tag);
  const venueHTML = ev.venue ? `<p class="card-venue" style="font-size: 0.75rem; color: #555; margin-top: 4px;">📍 ${esc(ev.venue)}</p>` : '';
  return `
    <div class="card-icon">${icon}</div>
    <div class="card-body">
      <span class="card-date-badge">${esc(ev.date)}</span>
      <h4 class="card-title">${esc(ev.title)}</h4>
      <p class="card-tag">${esc(ev.tag)}</p>
      ${venueHTML}
    </div>
    <button
      class="card-view-btn"
      aria-label="View photo for ${esc(ev.title)}"
      title="View Photo"
      data-img="${esc(ev.photo ? ev.photo : 'https://placehold.co/800x600')}"
    >&#128247;</button>`;
}

/* ─── Build HTML for one month block ─── */
function buildMonthBlock(monthLabel, events, monthIndex) {
  const [monthName, year] = monthLabel.split(' ');

  const nodes = events.map((ev, i) => {
    // Strip year from date label: "21 Feb 2026" → "21 Feb"
    const dateParts = ev.date.split(' ');
    const dateShort = `${dateParts[0]} ${dateParts[1]}`;
    const isFirst = i === 0;
    return `<button
        class="strip-node${isFirst ? ' is-active' : ''}"
        data-month="${monthIndex}"
        data-event="${i}"
        aria-label="View event: ${esc(ev.title)} on ${esc(ev.date)}"
        aria-pressed="${isFirst ? 'true' : 'false'}"
        id="node-m${monthIndex}-e${i}"
      ><div class="node-dot"></div><div class="node-tick"></div><div class="node-date">${esc(dateShort)}</div><div class="node-title">${esc(ev.title)}</div></button>`;
  }).join('\n');

  const firstCardHTML = buildCardHTML(events[0]);

  return `<div class="month-block" data-month="${monthIndex}">
      <div class="month-meta">
        <h3 class="month-heading">${esc(monthName)} <span>${esc(year)}</span></h3>
        <span class="event-count-badge">${events.length} event${events.length > 1 ? 's' : ''}</span>
      </div>
      <div class="strip-scroll-wrapper" role="region" aria-label="${esc(monthLabel)} events timeline">
        <div class="strip-track">${nodes}</div>
      </div>
      <div class="month-event-display" id="display-m${monthIndex}" aria-live="polite">
        <div class="cal-event-card is-visible" id="card-m${monthIndex}">${firstCardHTML}</div>
      </div>
    </div>`;
}

/* Global variable to hold current dataset for event delegation */
let CURRENT_GROUPED = new Map();

/* ─── Main Rendering Function ─── */
function renderAcademicYear(eventsArray) {
  CURRENT_GROUPED = groupByMonth(eventsArray);
  
  /* ── 1. Inject month blocks into the timeline section ── */
  const container = document.querySelector('#timeline .container');
  if (container) {
    let html = '';
    let monthIndex = 0;
    CURRENT_GROUPED.forEach((events, monthLabel) => {
      html += buildMonthBlock(monthLabel, events, monthIndex);
      monthIndex++;
    });
    container.innerHTML = html;
  }

  /* ── 2. Build filter chips from unique tags ── */
  const chipsContainer = document.getElementById('filter-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = '<button class="filter-chip is-active" data-tag="all" id="chip-all">All</button>';
    const uniqueTags = [...new Set(eventsArray.map(ev => ev.tag))].sort();
    uniqueTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-chip';
      btn.dataset.tag = tag.toLowerCase();
      btn.textContent = tag;
      chipsContainer.appendChild(btn);
    });
  }

  /* Reset search */
  const searchInput = document.getElementById('event-search');
  if (searchInput) searchInput.value = '';
  
  /* ── 3. Apply Filters immediately ── */
  applyFilters();

  /* ── 4. All Events Table Summary Section ── */
  const tableBody = document.getElementById('events-table-body');
  const toggleBtn = document.getElementById('toggle-events-btn');
  
  if (tableBody) {
    tableBody.innerHTML = ''; // clear table
    const sortedEvents = [...eventsArray].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEvents.forEach((ev, index) => {
      const tr = document.createElement('tr');
      // Hide rows after index 4 (show only latest 5 initially)
      if (index >= 5) {
        tr.style.display = 'none';
        tr.classList.add('collapsible-row');
      }
      
      const srNo = index + 1;
      const isClickable = ev.photo ? 'has-photo' : '';
      const photoAttr = ev.photo ? `data-img="${esc(ev.photo)}"` : '';
      const iconMarkup = ev.photo ? '<span class="photo-indicator" aria-hidden="true">📷</span>' : '';
      const venueMarkup = ev.venue ? `<br><small style="color: #666; font-size: 0.8em;">📍 ${esc(ev.venue)}</small>` : '';
      
      tr.innerHTML = `
        <td>${srNo}</td>
        <td>
          <button class="table-event-link ${isClickable}" ${photoAttr} aria-label="${esc(ev.title)}">
            ${esc(ev.title)} ${iconMarkup}
          </button>
          ${venueMarkup}
        </td>
        <td>${esc(ev.date)}</td>
        <td><span class="table-cat-badge">${esc(ev.tag)}</span></td>
      `;
      tableBody.appendChild(tr);
    });
    
    // reset toggle button state
    if (toggleBtn) {
      toggleBtn.textContent = 'VIEW COMPLETE LIST';
      // Remove any existing click handlers by cloning
      const newToggleBtn = toggleBtn.cloneNode(true);
      toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
      
      let tableExpanded = false;
      newToggleBtn.addEventListener('click', () => {
        const collapsibleRows = tableBody.querySelectorAll('.collapsible-row');
        tableExpanded = !tableExpanded;
        
        if (tableExpanded) {
          collapsibleRows.forEach(row => {
            row.style.display = '';
            row.style.opacity = '0';
            row.style.transition = 'opacity 0.3s ease';
            requestAnimationFrame(() => {
              row.style.opacity = '1';
            });
          });
          newToggleBtn.textContent = 'SHOW LESS';
        } else {
          collapsibleRows.forEach(row => {
            row.style.display = 'none';
          });
          newToggleBtn.textContent = 'VIEW COMPLETE LIST';
          const targetSection = document.getElementById('all-events-section');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  }
}

/* ─── Global Filter Function ─── */
function applyFilters() {
  const chipsContainer = document.getElementById('filter-chips');
  const searchInput    = document.getElementById('event-search');
  const clearBtn       = document.getElementById('filter-clear');
  const noResults      = document.getElementById('filter-no-results');

  const activeChip = chipsContainer
    ? chipsContainer.querySelector('.filter-chip.is-active')
    : null;
  const activeTag  = activeChip ? activeChip.dataset.tag : 'all';
  const query      = searchInput ? searchInput.value.trim().toLowerCase() : '';

  if (clearBtn) clearBtn.hidden = query.length === 0;

  let totalVisible = 0;

  CURRENT_GROUPED.forEach((events, monthLabel) => {
    const monthIndex = Array.from(CURRENT_GROUPED.keys()).indexOf(monthLabel);
    const blockEl    = document.querySelector(`.month-block[data-month="${monthIndex}"]`);
    if (!blockEl) return;

    const matchingEvents = events.filter(ev => {
      const tagMatch   = activeTag === 'all' || ev.tag.toLowerCase() === activeTag;
      const queryMatch = !query ||
        ev.title.toLowerCase().includes(query) ||
        ev.tag.toLowerCase().includes(query)   ||
        ev.date.toLowerCase().includes(query);
      return tagMatch && queryMatch;
    });

    if (matchingEvents.length === 0) {
      blockEl.hidden = true;
    } else {
      blockEl.hidden = false;
      totalVisible += matchingEvents.length;

      const nodes = blockEl.querySelectorAll('.strip-node');
      nodes.forEach((node, i) => {
        const ev = events[i];
        if (!ev) return;
        const tagMatch   = activeTag === 'all' || ev.tag.toLowerCase() === activeTag;
        const queryMatch = !query ||
          ev.title.toLowerCase().includes(query) ||
          ev.tag.toLowerCase().includes(query)   ||
          ev.date.toLowerCase().includes(query);
        node.style.opacity = (tagMatch && queryMatch) ? '1' : '0.2';
        node.style.pointerEvents = (tagMatch && queryMatch) ? '' : 'none';
      });
    }
  });

  if (noResults) noResults.hidden = totalVisible > 0;
}

/* ─── Main DOMContentLoaded ─── */
if (window.NSS && window.NSS.markRendering) window.NSS.markRendering();

document.addEventListener('DOMContentLoaded', () => {

  /* ── 0. Load event data asynchronously, then render + wire up ── */
  if (!window.NSS || !window.NSS.getEvents) return;
  loadEventsData().then(() => {

    const NSS_EVENTS = eventsByYear['2025-26'] || [];
    const NSS_EVENTS_2026_27 = eventsByYear['2026-27'] || [];

    /* ── 0. Initial Render ── */
    renderAcademicYear(NSS_EVENTS);

    /* ── 1. Academic Year Tab Switching ── */
    const yearTabs = document.querySelectorAll('.year-tab');

    yearTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Avoid re-rendering if already active
        if(tab.classList.contains('is-active')) return;

        yearTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const year = tab.dataset.year;
        if (year === '2025-26') {
          renderAcademicYear(NSS_EVENTS);
        } else if (year === '2026-27') {
          renderAcademicYear(NSS_EVENTS_2026_27);
        }
      });
    });

  /* ── 2. Filter Event Listeners ── */
  const chipsContainer = document.getElementById('filter-chips');
  const searchInput    = document.getElementById('event-search');
  const clearBtn       = document.getElementById('filter-clear');

  if (chipsContainer) {
    chipsContainer.addEventListener('click', e => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      chipsContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      applyFilters();
    });
  }

  /* ── 3. Node click handler (event delegation) ── */
  document.addEventListener('click', (e) => {
    const node = e.target.closest('.strip-node');
    if (!node) return;

    const monthIndex = parseInt(node.dataset.month, 10);
    const eventIndex = parseInt(node.dataset.event, 10);
    const monthBlock = document.querySelector(`.month-block[data-month="${monthIndex}"]`);
    if (!monthBlock) return;

    monthBlock.querySelectorAll('.strip-node').forEach(n => {
      n.classList.remove('is-active');
      n.setAttribute('aria-pressed', 'false');
    });

    node.classList.add('is-active');
    node.setAttribute('aria-pressed', 'true');

    const monthKeys = Array.from(CURRENT_GROUPED.keys());
    const monthLabel = monthKeys[monthIndex];
    const events = CURRENT_GROUPED.get(monthLabel);
    if (!events) return;
    const ev = events[eventIndex];
    if (!ev) return;

    const cardEl = document.getElementById(`card-m${monthIndex}`);
    if (cardEl) {
      cardEl.classList.remove('is-visible');
      setTimeout(() => {
        cardEl.innerHTML = buildCardHTML(ev);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          cardEl.classList.add('is-visible');
        }));
      }, 220);
    }
  });

  /* ── 4. Lightbox ── */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.onerror = () => { lightboxImg.src = 'assets/nss_logo.png'; };
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 400);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) closeLightbox();
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-view-btn');
    if (!btn) return;
    e.stopPropagation();
    openLightbox(btn.dataset.img || 'https://placehold.co/800x600');
  });

  /* ── 5. Hero text entrance animation ── */
  const heroTitle = document.querySelector('.timeline-hero-title');
  const heroSub   = document.querySelector('.timeline-hero-subtitle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    if (heroTitle) { heroTitle.style.opacity = '1'; heroTitle.style.transform = 'none'; }
    if (heroSub)   { heroSub.style.opacity   = '1'; heroSub.style.transform   = 'none'; }
  } else {
    setTimeout(() => {
      if (heroTitle) {
        heroTitle.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        heroTitle.style.opacity    = '1';
        heroTitle.style.transform  = 'translateY(0)';
      }
      setTimeout(() => {
        if (heroSub) {
          heroSub.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          heroSub.style.opacity    = '1';
          heroSub.style.transform  = 'translateY(0)';
        }
      }, 400);
    }, 300);
  }
  
  /* Delegate table name triggers to open the media lightbox */
  const tableBody = document.getElementById('events-table-body');
  if(tableBody) {
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.table-event-link.has-photo');
      if (!btn) return;
      e.stopPropagation();
      openLightbox(btn.dataset.img);
    });
  }

    /* ── 6. Signal that rendering is complete so GSAP can run ── */
    if (window.NSS && window.NSS.renderComplete) window.NSS.renderComplete();

  });
});
