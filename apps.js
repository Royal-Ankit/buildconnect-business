/* NIRMAZA - links the two apps (customer + business), installs the app on phones.
   AFTER you create both websites on Vercel, paste their addresses below (see the guide). Leave them empty until then. */
window.BC_APPS = {
  me: 'business',                       // this website: 'customer' or 'business' (already set for you)
  customer: 'https://buildconnect-site.vercel.app',
  business: 'https://buildconnect-business.vercel.app'
};
(function () {
  'use strict';
  var A = window.BC_APPS, me = A.me;
  var PROVIDER = ['business.html', 'dashboard.html', 'interior-register.html', 'elevator-products.html'];   // pages that live in the Business app
  var BOTH = ['login.html', 'signup.html', 'index.html', ''];                                                  // pages that exist in both apps
  function clean(u) { return String(u || '').replace(/\/+$/, ''); }
  function owner(file) { return BOTH.indexOf(file) !== -1 ? me : (PROVIDER.indexOf(file) !== -1 ? 'business' : 'customer'); }
  function appUrl(app, path) { var base = clean(A[app]); return base ? base + '/' + path : path; }
  function fileOf(h) { return String(h || '').split('#')[0].split('?')[0].replace(/^\.\//, ''); }
  /* Where should a link to "file" go? */
  function target(h) {
    if (!h || /^(https?:|mailto:|tel:|#|javascript:|\/\/)/i.test(h)) return h;
    var f = fileOf(h), o = owner(f);
    if (o === me || !clean(A[o])) return h;
    return clean(A[o]) + '/' + h.replace(/^\.\//, '');
  }
  window.BC = {
    go: function (h) { location.href = target(h); },
    url: target,
    appUrl: appUrl,
    /* The right first page after login for this kind of account */
    home: function (role) {
      var want = (role === 'provider' || role === 'supplier') ? 'business' : 'customer';
      if (want === me) return want === 'business' ? 'dashboard.html' : 'index.html';
      return clean(A[want]) ? appUrl(want, want === 'business' ? 'dashboard.html' : 'index.html') : (want === 'business' ? 'dashboard.html' : 'index.html');
    }
  };
  function fix(a) { var h = a.getAttribute('href'); var t = target(h); if (t !== h) a.setAttribute('href', t); }
  function slots() {
    document.querySelectorAll('[data-app]').forEach(function (e) { var u = clean(A[e.getAttribute('data-app')]); if (u) { e.setAttribute('href', u + '/'); e.style.display = ''; } else if (e.getAttribute('data-app') !== me) { e.style.display = 'none'; } });
  }
  function run() { document.querySelectorAll('a[href]').forEach(fix); slots(); }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) fix(a); }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  try { new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('a[href]')) fix(n); if (n.querySelectorAll) n.querySelectorAll('a[href]').forEach(fix); } }); }); }).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { }

  /* ---- install on phone + offline shell ---- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) { window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); }); }
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  var seen = false; try { seen = localStorage.getItem('bc_install_hide') === '1'; } catch (e) { }
  function pill(text, onclick) {
    if (standalone || seen || document.getElementById('bcInstall')) return;
    var b = document.createElement('div'); b.id = 'bcInstall';
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;max-width:420px;margin:0 auto;background:#103B63;color:#fff;border-radius:14px;padding:12px 14px;display:flex;gap:10px;align-items:center;z-index:70;font:600 14px system-ui,sans-serif;box-shadow:0 6px 24px rgba(0,0,0,.25)';
    b.innerHTML = '<span style="flex:1">' + text + '</span>' + (onclick ? '<button style="background:#f59e0b;color:#222;border:0;border-radius:10px;padding:8px 14px;font-weight:700;cursor:pointer">Install</button>' : '') + '<button aria-label="Close" style="background:none;border:0;color:#fff;font-size:22px;cursor:pointer">&times;</button>';
    var btns = b.querySelectorAll('button');
    if (onclick) btns[0].onclick = function () { onclick(); b.remove(); };
    btns[btns.length - 1].onclick = function () { try { localStorage.setItem('bc_install_hide', '1'); } catch (e) { } b.remove(); };
    document.body.appendChild(b);
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); var ev = e; setTimeout(function () { pill('Install ' + (me === 'business' ? 'NIRMAZA Business' : 'NIRMAZA') + ' on your phone', function () { ev.prompt(); }); }, 4000); });
  if (/iphone|ipad|ipod/i.test(navigator.userAgent) && !standalone) setTimeout(function () { pill('To install: tap Share, then "Add to Home Screen".', null); }, 6000);
})();
