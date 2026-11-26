/* NIRMAZA themes: "fresh" (clean light, default) and "sand" (warm). The visitor chooses with the Theme button; the choice is remembered on this device. */
(function () {
  'use strict';
  var KEY = 'nz_theme', DEF = 'fresh', cur = DEF;
  try { var v = localStorage.getItem(KEY); if (v === 'sand' || v === 'fresh') cur = v; } catch (e) { }
  document.documentElement.setAttribute('data-theme', cur);

  var css = '' +
  /* ---------- D: warm sand ---------- */
  'html[data-theme="sand"]{--primary:#c2410c;--dark:#7c2d12;--light:#f6efe4;--accent:#d97706;--text:#3b2a1d;--muted:#7a6450;--line:#e9dcc7;--success:#15803d}' +
  'html[data-theme="sand"] header{background:#fbf6ec}' +
  'html[data-theme="sand"] .hero{background:linear-gradient(130deg,#7c2d12,#c2410c 70%,#d97706)!important;border-radius:26px 26px 26px 8px}' +
  'html[data-theme="sand"] .hero h1,html[data-theme="sand"] h1,html[data-theme="sand"] h2{font-family:Georgia,"Times New Roman",serif}' +
  'html[data-theme="sand"] .card,html[data-theme="sand"] .tile,html[data-theme="sand"] .biz,html[data-theme="sand"] .pcard,html[data-theme="sand"] .mtile,html[data-theme="sand"] .stat,html[data-theme="sand"] .req-item{border-color:#e9dcc7!important;border-radius:22px 22px 22px 8px}' +
  'html[data-theme="sand"] .btn:not(.ghost):not(.alt){background:#c2410c}' +
  'html[data-theme="sand"] .cat{background:#fff!important;color:#7c2d12!important;border:2px solid #e9dcc7;border-radius:26px 26px 26px 8px;box-shadow:0 6px 16px rgba(124,45,18,.08)}' +
  'html[data-theme="sand"] .cat::after{background:#fde7d3}' +
  'html[data-theme="sand"] .cat .ico{background:#fde7d3}html[data-theme="sand"] .cat .go{background:#c2410c;color:#fff}' +
  /* ---------- Fresh: clean light, navy and green ---------- */
  'html[data-theme="fresh"]{--primary:#16a34a;--dark:#0f1b3d;--light:#f3f5fa;--accent:#16a34a;--text:#0f1b3d;--muted:#6b7694;--line:#e6eaf3;--success:#16a34a}' +
  'html[data-theme="fresh"] header{background:#fff;border-bottom:0;box-shadow:0 4px 18px rgba(15,27,61,.06)}' +
  'html[data-theme="fresh"] .logo{color:#0f1b3d}html[data-theme="fresh"] .logo span{color:#16a34a}' +
  'html[data-theme="fresh"] .hero{background:linear-gradient(135deg,#0b1a3c,#1d3b8b)!important;border-radius:28px;box-shadow:0 14px 34px rgba(15,27,61,.25)}' +
  'html[data-theme="fresh"] .card,html[data-theme="fresh"] .tile,html[data-theme="fresh"] .biz,html[data-theme="fresh"] .pcard,html[data-theme="fresh"] .mtile,html[data-theme="fresh"] .stat,html[data-theme="fresh"] .req-item,html[data-theme="fresh"] .steps div{border:1px solid #edf0f7!important;border-radius:22px;box-shadow:0 8px 24px rgba(15,27,61,.07)}' +
  'html[data-theme="fresh"] .btn:not(.ghost):not(.alt){background:#16a34a;color:#fff;border-radius:14px}' +
  'html[data-theme="fresh"] .btn.ghost{background:#e8f8ee;color:#15803d}' +
  'html[data-theme="fresh"] .cat{background:#fff!important;color:#0f1b3d!important;border:1px solid #edf0f7;border-radius:24px;box-shadow:0 8px 24px rgba(15,27,61,.08)}' +
  'html[data-theme="fresh"] .cat::after{background:color-mix(in srgb,var(--c1) 14%,#fff)}' +
  'html[data-theme="fresh"] .cat .ico{background:color-mix(in srgb,var(--c1) 16%,#fff)}' +
  'html[data-theme="fresh"] .cat .go{background:#e8f8ee;color:#15803d}' +
  /* theme button */
  '#nzTheme{position:fixed;right:14px;bottom:76px;z-index:9999;font-family:inherit}' +
  '#nzTheme>button{border:0;border-radius:999px;padding:10px 14px;font-weight:800;font-size:14px;cursor:pointer;background:#1c1f26;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.3)}' +
  '#nzTheme .pop{display:none;position:absolute;right:0;bottom:50px;width:230px;background:#fff;border-radius:18px;padding:10px;box-shadow:0 12px 30px rgba(0,0,0,.3)}#nzTheme.open .pop{display:block}' +
  '#nzTheme .opt{display:flex;gap:10px;align-items:center;width:100%;border:2px solid #e5e7eb;background:#fff;border-radius:14px;padding:8px;margin:4px 0;cursor:pointer;font-weight:700;font-size:14px;color:#111;text-align:left}' +
  '#nzTheme .opt.on{border-color:#4f46e5}#nzTheme .sw{width:34px;height:34px;border-radius:10px;flex:none}';
  var st = document.createElement('style'); st.id = 'nzThemeCss'; st.textContent = css; document.head.appendChild(st);

  function set(t) { cur = t; document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem(KEY, t); } catch (e) { } paint(); }
  var box;
  function paint() { if (!box) return; Array.prototype.forEach.call(box.querySelectorAll('.opt'), function (o) { o.classList.toggle('on', o.getAttribute('data-t') === cur); }); }
  function build() {
    if (document.getElementById('nzTheme')) return;
    box = document.createElement('div'); box.id = 'nzTheme';
    box.innerHTML = '<div class="pop">' +
      '<button class="opt" data-t="fresh"><span class="sw" style="background:linear-gradient(135deg,#0f1b3d,#16a34a)"></span>Fresh Light</button>' +
      '<button class="opt" data-t="sand"><span class="sw" style="background:linear-gradient(135deg,#f6efe4,#c2410c)"></span>Warm Sand</button></div>' +
      '<button type="button" id="nzThemeBtn">🎨 Theme</button>';
    document.body.appendChild(box);
    box.querySelector('#nzThemeBtn').onclick = function () { box.classList.toggle('open'); };
    Array.prototype.forEach.call(box.querySelectorAll('.opt'), function (o) { o.onclick = function () { set(o.getAttribute('data-t')); box.classList.remove('open'); }; });
    paint();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
