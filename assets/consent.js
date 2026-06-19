/* ============================================================
   Cookie-Consent (Usercentrics-Stil) + Meta-Pixel (consent-gesteuert)
   - 3 Optionen: Akzeptieren / Ablehnen / Einstellungen
   - Marketing standardmaessig AUS (Opt-in, DSGVO-konform)
   - Pixel feuert nur nach Einwilligung
   - Events: PageView (alle), ViewContent (Artikel + Hubs), Lead (Formular/Calendly)
   ============================================================ */
(function () {
  var PIXEL_ID = '1811111386492359';
  var KEY = 'mb_consent';
  var pixelLoaded = false;

  var css = ''
    + '.mb-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;'
    + 'background:#181c23;border:1px solid #262b34;border-radius:16px;padding:22px 24px;'
    + 'box-shadow:0 18px 50px rgba(0,0,0,.5);font-family:"Instrument Sans",system-ui,sans-serif;color:#f4f6f8}'
    + '.mb-cc h4{font-family:"Sora",sans-serif;font-size:1.05rem;margin:0 0 8px}'
    + '.mb-cc p{font-size:14px;line-height:1.55;color:#a8b0bd;margin:0 0 16px}'
    + '.mb-cc a{color:#5b8cff}'
    + '.mb-row{display:flex;gap:10px;flex-wrap:wrap}'
    + '.mb-row button{flex:1;min-width:108px;border:0;border-radius:100px;padding:11px 16px;font-weight:600;'
    + 'font-size:14px;cursor:pointer;font-family:"Sora",sans-serif}'
    + '.mb-accept,.mb-all{background:#5b8cff;color:#fff}'
    + '.mb-decline,.mb-settings,.mb-save{background:transparent;color:#a8b0bd;border:1px solid #262b34!important}'
    + '.mb-cat{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:13px 0;border-bottom:1px solid #262b34}'
    + '.mb-cat:last-of-type{border-bottom:0;margin-bottom:6px}'
    + '.mb-cat .t{font-weight:600;font-size:14px;color:#f4f6f8}'
    + '.mb-cat .d{font-size:13px;color:#6b7480;margin-top:2px}'
    + '.mb-sw{position:relative;width:42px;height:24px;flex:0 0 auto}'
    + '.mb-sw input{opacity:0;width:0;height:0;position:absolute}'
    + '.mb-sw label{position:absolute;inset:0;background:#262b34;border-radius:100px;cursor:pointer;transition:.2s}'
    + '.mb-sw label:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#6b7480;border-radius:50%;transition:.2s}'
    + '.mb-sw input:checked+label{background:rgba(91,140,255,.45)}'
    + '.mb-sw input:checked+label:before{transform:translateX(18px);background:#5b8cff}'
    + '.mb-sw input:disabled+label{opacity:.55;cursor:not-allowed}'
    + '.mb-manage{position:fixed;left:16px;bottom:16px;z-index:9998;width:44px;height:44px;border-radius:50%;'
    + 'border:1px solid #262b34;background:rgba(24,28,35,.92);color:#f4f6f8;font-size:18px;cursor:pointer;'
    + 'box-shadow:0 6px 18px rgba(0,0,0,.4)}'
    + '@media(max-width:760px){.mb-cc{bottom:84px}.mb-manage{bottom:84px}}';

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
    if (/^\/blog\/.+\.html$/.test(p) || /^\/(e-commerce|lokale-dienstleister|b2b)\/?$/.test(p)) fbq('track', 'ViewContent');
  }

  window.mbTrackLead = function () { if (pixelLoaded && window.fbq) fbq('track', 'Lead'); };
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.event === 'calendly.event_scheduled') window.mbTrackLead();
  });

  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  var root = null, manageBtn = null;
  function closeBox() { if (root) { root.remove(); root = null; } showManage(); }
  function grant() { save('granted'); loadPixel(); closeBox(); }
  function deny() { save('denied'); closeBox(); }

  var BANNER = '<h4>Cookie-Einstellungen</h4>'
    + '<p>Ich verwende Cookies, um dein Erlebnis zu verbessern und meine Inhalte optimal auszuspielen. '
    + 'Details in der <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>'
    + '<div class="mb-row"><button class="mb-accept" type="button">Akzeptieren</button>'
    + '<button class="mb-decline" type="button">Ablehnen</button>'
    + '<button class="mb-settings" type="button">Einstellungen</button></div>';

  var SETTINGS = '<h4>Einstellungen</h4>'
    + '<div class="mb-cat"><div><div class="t">Notwendig</div><div class="d">Für den Betrieb der Website erforderlich. Immer aktiv.</div></div>'
    + '<span class="mb-sw"><input type="checkbox" id="mb-nec" checked disabled><label for="mb-nec"></label></span></div>'
    + '<div class="mb-cat"><div><div class="t">Marketing</div><div class="d">Meta-Pixel – misst Aktionen und ermöglicht relevante Werbung.</div></div>'
    + '<span class="mb-sw"><input type="checkbox" id="mb-mkt"><label for="mb-mkt"></label></span></div>'
    + '<div class="mb-row"><button class="mb-save" type="button">Auswahl speichern</button>'
    + '<button class="mb-all" type="button">Alle akzeptieren</button></div>';

  function render(view) {
    if (!root) { root = document.createElement('div'); root.className = 'mb-cc'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Cookie-Hinweis'); document.body.appendChild(root); }
    root.innerHTML = view === 'settings' ? SETTINGS : BANNER;
    if (view === 'settings') {
      root.querySelector('.mb-save').onclick = function () { root.querySelector('#mb-mkt').checked ? grant() : deny(); };
      root.querySelector('.mb-all').onclick = grant;
    } else {
      root.querySelector('.mb-accept').onclick = grant;
      root.querySelector('.mb-decline').onclick = deny;
      root.querySelector('.mb-settings').onclick = function () { render('settings'); };
    }
  }

  function showManage() {
    if (manageBtn) return;
    manageBtn = document.createElement('button');
    manageBtn.className = 'mb-manage'; manageBtn.type = 'button';
    manageBtn.setAttribute('aria-label', 'Cookie-Einstellungen öffnen');
    manageBtn.textContent = '🍪';
    manageBtn.onclick = function () { manageBtn.remove(); manageBtn = null; render('banner'); };
    document.body.appendChild(manageBtn);
  }

  function init() {
    injectStyle();
    var c = get();
    if (c === 'granted') { loadPixel(); showManage(); }
    else if (c === 'denied') { showManage(); }
    else render('banner');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
