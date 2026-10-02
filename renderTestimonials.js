/* ============================================================
   NSS TSEC — Testimonials page renderer (renderTestimonials.js)
   Builds the testimonial cards from data/testimonials.json. Reuses the
   existing .testimonial-card / .read-more-btn class structure so the
   modal logic in testimonials.js (which reads values from the rendered
   cards) keeps working.
   Must load AFTER data.js. Signals NSS.renderComplete() when done.
   ============================================================ */
(function () {
  'use strict';

  if (window.NSS && window.NSS.markRendering) window.NSS.markRendering();

  function esc(s) {
    return (window.NSS && window.NSS.escapeHtml) ? window.NSS.escapeHtml(s) : String(s == null ? '' : s);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.NSS || !window.NSS.getData) return;
    window.NSS.getData().then(function (data) {
      var items = (data && data.testimonials && data.testimonials.items) || [];
      var grid = document.querySelector('.testimonials-grid');
      if (grid) {
        grid.innerHTML = items.map(function (t, i) {
          return '<div class="testimonial-card">' +
            '<div class="card-image">' +
              '<img src="' + esc(t.avatar) + '" alt="' + esc(t.name) + '" style="object-fit: cover; object-position: center;" onerror="this.onerror=null; this.src=\'assets/nss_logo.png\';">' +
              '<div class="card-overlay">' +
                '<span class="volunteer-role">' + esc(t.role) + '</span>' +
                '<span class="volunteer-year">' + esc(t.year) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="card-info">' +
              '<h3 class="volunteer-name">' + esc(t.name) + '</h3>' +
              '<p class="volunteer-thought">' + esc(t.thought) + '</p>' +
              '<button class="read-more-btn" data-id="' + (i + 1) + '">Read More</button>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      if (window.NSS.renderFooter) window.NSS.renderFooter(data);
      if (window.NSS.renderComplete) window.NSS.renderComplete();
    });
  });
})();
