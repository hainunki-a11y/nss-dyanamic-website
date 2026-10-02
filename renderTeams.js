/* ============================================================
   NSS TSEC — Teams page renderer (renderTeams.js)
   Builds the faculty grid, leadership row, council marquee track
   and core-committee table from data/team-members.json. Reuses the
   existing .team-card / .leader-card-large / .slide-card and table
   classes so CSS + the marquee clone logic in script.js keep working.
   Must load AFTER data.js. Signals NSS.renderComplete() when done.
   ============================================================ */
(function () {
  'use strict';

  if (window.NSS && window.NSS.markRendering) window.NSS.markRendering();

  function esc(s) {
    return (window.NSS && window.NSS.escapeHtml) ? window.NSS.escapeHtml(s) : String(s == null ? '' : s);
  }

  function teamCardHTML(member, extraClass, roleTag, hoverWord) {
    return '<div class="team-card' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<div class="team-card-inner">' +
        '<div class="team-img-container">' +
          '<img src="' + esc(member.photo) + '" alt="' + esc(member.name) + '" onerror="this.onerror=null; this.src=\'assets/nss_logo.png\';">' +
          '<div class="team-hover-overlay">' +
            '<span class="hover-word">' + esc(hoverWord) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="team-info">' +
        '<h4>' + esc(member.name) + '</h4>' +
        '<' + roleTag + '>' + esc(member.role || member.designation) + '</' + roleTag + '>' +
      '</div>' +
    '</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.NSS || !window.NSS.getData) return;
    window.NSS.getData().then(function (data) {
      var sections = (data && data.teamMembers && data.teamMembers.sections) || {};
      var faculty = sections.faculty || [];
      var leadership = sections.leadership || [];
      var council = sections.council || [];
      var committee = sections.committee || [];

      /* Faculty advisors (first 3) — first card role uses <h3> like the
         original markup, the rest use <p>. Quotes wrapped in curly quotes. */
      var facultyGrid = document.getElementById('faculty-grid');
      if (facultyGrid) {
        facultyGrid.innerHTML = faculty.slice(0, 3).map(function (m, i) {
          return teamCardHTML(m, '', i === 0 ? 'h3' : 'p', '\u201c' + (m.quote || m.name) + '\u201d');
        }).join('');
      }

      /* Five-frame grid (next 5) — hover word is the member name. */
      var fiveFrame = document.getElementById('five-frame-grid');
      if (fiveFrame) {
        fiveFrame.innerHTML = faculty.slice(3, 8).map(function (m) {
          return teamCardHTML(m, '', 'p', m.quote || m.name);
        }).join('');
      }

      /* Leadership row */
      var leaderRow = document.getElementById('leadership-row');
      if (leaderRow) {
        leaderRow.innerHTML = leadership.map(function (m) {
          return teamCardHTML(m, 'leader-card-large', 'p', m.quote || '');
        }).join('');
      }

      /* Council marquee track */
      var track = document.getElementById('council-marquee-track');
      if (track) {
        track.innerHTML = council.map(function (m) {
          return teamCardHTML(m, 'slide-card', 'p', 'NSS TSEC');
        }).join('');
      }

      /* Core committee table: first 5 = core members, divider, then council */
      var tbody = document.getElementById('core-committee-tbody');
      if (tbody && committee.length) {
        var html = committee.slice(0, 5).map(function (m) {
          return '<tr class="core-member"><td>' + esc(m.name) + '</td><td>' + esc(m.designation) + '</td></tr>';
        }).join('');
        html += '<tr class="table-divider"><td colspan="2">COUNCIL MEMBERS</td></tr>';
        html += committee.slice(5).map(function (m) {
          return '<tr><td>' + esc(m.name) + '</td><td>' + esc(m.designation) + '</td></tr>';
        }).join('');
        tbody.innerHTML = html;
      }

      if (window.NSS.renderFooter) window.NSS.renderFooter(data);
      if (window.NSS.renderComplete) window.NSS.renderComplete();
    });
  });
})();
