/* Scroll-Reveals für Unterseiten (Hubs + Blog). Progressive Enhancement:
   ohne JS / bei reduced-motion bleibt alles normal sichtbar. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.feature, .post-card, .hub-testi, .faq-item, .hub-section > .wrap > h2, .hub-section > .wrap > .sub');
  if (!els.length) return;
  els.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
