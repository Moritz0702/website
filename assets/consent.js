/* ============================================================
   Cookie-Consent + Meta-Pixel (consent-gesteuert)
   - Pixel feuert NUR nach Einwilligung ("Akzeptieren")
   - Events: PageView (alle), ViewContent (Artikel + Hubs), Lead (Formular/Calendly)
   ============================================================ */
(function () {
  var PIXEL_ID = '1811111386492359';
  var KEY = 'mb_consent';
  var pixelLoaded = false;

  var css = ''
    + '.mb-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:520px;margin:0 auto;'
    + 'background:#181c23;border:1px solid #262b34;border-radius:16px;padding:20px 22px;'
    + 'box-shadow:0 18px 50px rgba(0,0,0,.5);font-family:"Instrument Sans",system-ui,sans-serif;color:#f4f6f8}'
    + '.mb-consent p{font-size:14px;line-height:1.55;color:#a8b0bd;margin:0 0 14px}'
    + '.mb-consent a{color:#5b8cff}'
    + '.mb-consent .row{display:flex;gap:10px;flex-wrap:wrap}'
    + '.mb-consent button{flex:1;min-width:120px;border:0;border-radius:100px;padding:11px 16px;font-weight:600;'
    + 'font-size:14px;cursor:pointer;font-family:"Sora",sans-serif}'
    + '.mb-accept{background:#5b8cff;color:#fff}'
    + '.mb-decline{background:transparent;color:#a8b0bd;border:1px solid #262b34!important}';

  function injectStyle() { var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }

  function loadPixel() {
    if (pixelLoaded) return; pixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    var p = location.pathname;
    var isArticle = /^\/blog\/.+\.html$/.test(p);
    var isHub = /^\/(e-commerce|lokale-dienstleister|b2b)\/?$/.test(p);
    if (isArticle || isHub) fbq('track', 'ViewContent');
  }

  // Lead-Event global (nur wenn Consent + Pixel aktiv)
  window.mbTrackLead = function () { if (pixelLoaded && window.fbq) fbq('track', 'Lead'); };

  // Calendly-Buchung -> Lead
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.event === 'calendly.event_scheduled') window.mbTrackLead();
  });

  var bannerEl = null;
  function hide() { if (bannerEl) { bannerEl.remove(); bannerEl = null; } }
  function grant() { try { localStorage.setItem(KEY, 'granted'); } catch (e) {} loadPixel(); hide(); }
  function deny() { try { localStorage.setItem(KEY, 'denied'); } catch (e) {} hide(); }

  function showBanner() {
    injectStyle();
    bannerEl = document.createElement('div');
    bannerEl.className = 'mb-consent';
    bannerEl.setAttribute('role', 'dialog');
    bannerEl.setAttribute('aria-label', 'Cookie-Hinweis');
    bannerEl.innerHTML =
      '<p>Ich verwende Cookies fürs Marketing (Meta-Pixel), um meine Inhalte zu verbessern und gezielt auszuspielen. '
      + 'Details in der <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>'
      + '<div class="row"><button class="mb-accept" type="button">Akzeptieren</button>'
      + '<button class="mb-decline" type="button">Ablehnen</button></div>';
    document.body.appendChild(bannerEl);
    bannerEl.querySelector('.mb-accept').addEventListener('click', grant);
    bannerEl.querySelector('.mb-decline').addEventListener('click', deny);
  }

  function init() {
    var c = null; try { c = localStorage.getItem(KEY); } catch (e) {}
    if (c === 'granted') loadPixel();
    else if (c === 'denied') { /* nichts laden */ }
    else showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
