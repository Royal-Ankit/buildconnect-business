/* NIRMAZA shared UI helpers: vendor cards, profile strength, trust strip, footer, form polish. */
(function () {
  'use strict';
  var NZ = window.NZ = {};
  /* ---- Fill these in once; empty ones are simply not shown on the Contact page. ---- */
  NZ.CONTACT = { email: '', phone: '', whatsapp: '', address: 'Lucknow, Uttar Pradesh, India' };

  function has(v) { return Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== '' && v !== false; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  NZ.esc = esc;

  /* ---- Profile strength: 100 points, same rule for ranking and for the vendor dashboard ---- */
  var PARTS = [
    ['Business name', 10, function (p) { var n = p.business_name; return has(n) && String(n).indexOf('name not given') === -1; }, 'Add your business name.'],
    ['About your business', 15, function (p) { return has(p.description); }, 'Write a short description of your work.'],
    ['Years of experience', 10, function (p) { return p.experience_years != null; }, 'Add your years of experience.'],
    ['Projects completed', 10, function (p) { return p.projects_completed != null; }, 'Add how many projects you have completed.'],
    ['Services / specialisations', 15, function (p) { return has(p.specializations); }, 'Choose the services you offer.'],
    ['Service areas', 15, function (p) { return has(p.service_district_ids) || has(p.district_id); }, 'Add the districts you work in.'],
    ['Pricing', 15, function (p) { return p.price_min != null || p.min_order_value != null || p.price_max != null; }, 'Add your starting price so customers can compare.'],
    ['Year established', 5, function (p) { return has(p.year_established); }, 'Add the year you started.'],
    ['Warranty', 5, function (p) { return p.warranty_years != null; }, 'Add the warranty you give (if any).']
  ];
  NZ.score = function (p) { p = p || {}; var t = 0; PARTS.forEach(function (x) { if (x[2](p)) t += x[1]; }); return t; };
  NZ.missing = function (p) { p = p || {}; return PARTS.filter(function (x) { return !x[2](p); }).map(function (x) { return { label: x[0], pts: x[1], tip: x[3] }; }); };
  NZ.level = function (n) { return n >= 90 ? 'Excellent' : n >= 70 ? 'Strong' : n >= 40 ? 'Good start' : 'Just started'; };

  var GRADS = [['#16a34a', '#4ade80'], ['#2563eb', '#60a5fa'], ['#c2410c', '#fb923c'], ['#7c3aed', '#a78bfa'], ['#0891b2', '#22d3ee'], ['#be185d', '#f472b6'], ['#92400e', '#d97706']];
  NZ.decorate = function (el, p) {
    try {
      var name = String(p.business_name || '?'), s = NZ.score(p), g = GRADS[(name.charCodeAt(0) + name.length) % GRADS.length];
      var h = document.createElement('div'); h.className = 'nzh';
      h.innerHTML = '<div class="nzav" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')">' + esc(name.trim().charAt(0).toUpperCase()) + '</div>' +
        '<div class="nzt"><span class="nzok" title="Checked and approved by NIRMAZA">&#10003; Verified</span>' +
        '<span class="nzsc" title="How complete this business profile is"><i><u style="width:' + s + '%"></u></i>Profile ' + s + '%</span></div>';
      el.insertBefore(h, el.firstChild);
    } catch (e) { }
  };

  /* Dashboard card: strength %, level, next steps */
  NZ.renderStrength = function (box, biz, portfolioCount, interiorPct) {
    if (!box || !biz) return;
    var s = interiorPct != null ? interiorPct : NZ.score(biz), miss = interiorPct != null ? [] : NZ.missing(biz).sort(function (a, b) { return b.pts - a.pts; });
    var tips = miss.slice(0, 4).map(function (m) { return '<li><b>+' + m.pts + '%</b> ' + esc(m.tip) + '</li>'; }).join('');
    if (portfolioCount === 0) tips += '<li><b>Tip</b> Add photos of your best projects under Portfolio &amp; products.</li>';
    box.innerHTML = '<div class="nzs"><div class="nzsn"><b>' + s + '%</b><small>' + NZ.level(s) + '</small></div><div class="nzsb"><h3 style="margin:0 0 6px">Profile strength</h3>' +
      '<div class="nzbarL"><i style="width:' + s + '%"></i></div>' +
      '<p class="sub" style="margin:8px 0 0">Complete profiles appear higher in customer lists and win more requirements.</p></div></div>' +
      (tips ? '<ul class="nzsl">' + tips + '</ul><button type="button" class="btn ghost" id="nzGoEdit" style="margin-top:8px">Complete my profile</button>' : '<p class="sub" style="margin:10px 0 0">&#10003; Your profile is complete. Keep it up to date.</p>');
    var b = box.querySelector('#nzGoEdit');
    if (b) b.onclick = function () { var t = document.getElementById('tabInt') && document.getElementById('tabInt').style.display !== 'none' && interiorPct != null ? document.getElementById('tabInt') : document.querySelector('.tab[data-t="listing"]'); if (t) t.click(); };
  };

  /* Trust strip with live counters (counters appear only when there is something real to show) */
  var ICON = {
    shield: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/></svg>',
    tag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  };
  NZ.trust = function (box, kind, sb) {
    if (!box) return;
    var items = kind === 'business'
      ? [['tag', 'Free to list', 'No joining fee for businesses'], ['shield', 'Customers choose you', 'Requirements are sent to you directly'], ['lock', 'Contact stays private', 'Shared only after you accept'], ['pin', 'Your own prices', 'You decide what you charge']]
      : [['shield', 'Verified businesses', 'Every listing is checked before it goes live'], ['tag', 'Free to compare', 'Get quotes without any fee'], ['lock', 'Your number stays private', 'Shared only after the vendor accepts'], ['pin', 'Across Uttar Pradesh', 'Find professionals near your district']];
    box.className = 'nzt-strip';
    box.innerHTML = '<div class="nzt-row">' + items.map(function (i) { return '<div class="nzt-i"><span class="nzt-ic">' + ICON[i[0]] + '</span><div><b>' + i[1] + '</b><small>' + i[2] + '</small></div></div>'; }).join('') + '</div><div class="nzt-cnt" style="display:none"></div>';
    if (!sb) return;
    (async function () {
      try {
        var r = await sb.from('provider_profiles').select('district_id,service_district_ids,category_id').eq('status', 'approved');
        var rows = (r && r.data) || []; if (!rows.length) return;
        var d = {}, c = {}; rows.forEach(function (p) { if (p.district_id) d[p.district_id] = 1; (p.service_district_ids || []).forEach(function (x) { d[x] = 1; }); if (p.category_id) c[p.category_id] = 1; });
        var cnt = box.querySelector('.nzt-cnt');
        cnt.innerHTML = [[rows.length, 'Verified businesses'], [Object.keys(d).length, 'Districts covered'], [Object.keys(c).length, 'Service categories']].map(function (x) { return '<div><b>' + x[0] + '</b><small>' + x[1] + '</small></div>'; }).join('');
        cnt.style.display = '';
      } catch (e) { }
    })();
  };

  /* Footer on every page (except admin) */
  NZ.footer = function () {
    if (document.getElementById('nzFooter') || /admin\.html/.test(location.pathname)) return;
    var old = document.querySelector('body > footer, main + footer, footer'); if (old && !old.id) old.style.display = 'none';
    var f = document.createElement('footer'); f.id = 'nzFooter'; f.className = 'nzf';
    var biz = window.BC_APPS && window.BC_APPS.me === 'business';
    f.innerHTML = '<div class="nzf-in"><div class="nzf-brand"><b>NIR<span>MAZA</span></b><small>Building Better Living</small><p>Find architects, contractors, interior designers, carpenters and solar installers across Uttar Pradesh.</p></div>' +
      '<div><h5>Company</h5><a href="about.html">About us</a><a href="contact.html">Contact</a></div><div><h5>Legal</h5><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Use</a></div></div>' +
      '<div class="nzf-bot">&copy; ' + new Date().getFullYear() + ' NIRMAZA' + (biz ? ' Business' : '') + '. All rights reserved.</div>';
    document.body.appendChild(f);
    if (document.querySelector('.bottom-nav')) f.style.paddingBottom = '84px';
  };

  var css = '' +
  /* vendor cards */
  '.biz{transition:transform .18s,box-shadow .18s;position:relative}.biz:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(15,27,61,.12)}' +
  '.nzh{display:flex;align-items:center;gap:12px;margin-bottom:2px}.nzav{width:52px;height:52px;border-radius:16px;color:#fff;font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 6px 14px rgba(0,0,0,.18)}' +
  '.nzt{display:flex;flex-direction:column;gap:6px;min-width:0}.nzok{align-self:flex-start;background:#e8f8ee;color:#15803d;font-size:12px;font-weight:800;padding:3px 10px;border-radius:999px}' +
  '.nzsc{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#6b7694}.nzsc i{display:block;width:70px;height:6px;border-radius:99px;background:#e6eaf3;overflow:hidden}.nzsc u{display:block;height:100%;background:linear-gradient(90deg,#16a34a,#4ade80);text-decoration:none;border-radius:99px}' +
  /* dashboard strength */
  '.nzs{display:flex;gap:16px;align-items:center}.nzsn{text-align:center;min-width:86px}.nzsn b{display:block;font-size:34px;line-height:1;color:#16a34a}.nzsn small{font-weight:700;color:#6b7694}.nzsb{flex:1}' +
  '.nzbarL{height:10px;border-radius:99px;background:#e6eaf3;overflow:hidden}.nzbarL i{display:block;height:100%;background:linear-gradient(90deg,#16a34a,#4ade80);border-radius:99px;transition:width .6s}' +
  '.nzsl{margin:12px 0 0;padding-left:18px;font-size:14px;line-height:1.7}.nzsl b{color:#16a34a}' +
  /* trust strip */
  '.nzt-strip{margin:18px 0;background:#fff;border:1px solid #edf0f7;border-radius:22px;box-shadow:0 8px 24px rgba(15,27,61,.06);padding:16px 18px}' +
  '.nzt-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.nzt-i{display:flex;gap:10px;align-items:center}.nzt-ic{width:42px;height:42px;border-radius:14px;background:#e8f8ee;color:#16a34a;display:flex;align-items:center;justify-content:center;flex:none}' +
  '.nzt-i b{display:block;font-size:14px}.nzt-i small{display:block;color:#6b7694;font-size:12px;line-height:1.35}' +
  '.nzt-cnt{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;padding-top:14px;border-top:1px dashed #e3e8f2;text-align:center}.nzt-cnt b{display:block;font-size:26px;color:#0f1b3d}.nzt-cnt small{color:#6b7694;font-weight:600}' +
  '@media(max-width:820px){.nzt-row{grid-template-columns:1fr 1fr}.nzs{flex-direction:column;align-items:flex-start}}@media(max-width:480px){.nzt-row{grid-template-columns:1fr}}' +
  /* footer */
  '.nzf{text-align:left;background:#0f1b3d;color:#cbd5e1;margin-top:34px;padding:34px 20px 18px;font-size:14px}.nzf-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr;gap:26px}' +
  '.nzf b{color:#fff;font-size:20px;letter-spacing:.3px}.nzf b span{color:#4ade80}.nzf small{display:block;color:#94a3b8;margin:2px 0 8px}.nzf p{margin:0;max-width:340px;line-height:1.55;color:#94a3b8}' +
  '.nzf h5{margin:0 0 10px;color:#fff;font-size:14px}.nzf a{display:block;color:#cbd5e1;text-decoration:none;margin:6px 0;font-weight:500}.nzf a:hover{color:#4ade80}' +
  '.nzf-bot{max-width:1200px;margin:22px auto 0;padding-top:14px;border-top:1px solid #243258;color:#94a3b8;font-size:12.5px}@media(max-width:700px){.nzf-in{grid-template-columns:1fr}}' +
  /* forms polish */
  'input[type=text],input[type=email],input[type=tel],input[type=number],input[type=password],input[type=url],input:not([type]),select,textarea{border-radius:12px;transition:border-color .15s,box-shadow .15s}' +
  'input:focus,select:focus,textarea:focus{outline:none;border-color:var(--primary)!important;box-shadow:0 0 0 4px color-mix(in srgb,var(--primary) 18%,transparent)}' +
  '.btn{transition:transform .15s,box-shadow .15s,filter .15s}.btn:hover{transform:translateY(-1px);filter:brightness(1.04)}.btn:active{transform:none}' +
  '.chip{transition:background .15s,border-color .15s}.card h3{letter-spacing:-.01em}';
  var st = document.createElement('style'); st.id = 'nzUiCss'; st.textContent = css; document.head.appendChild(st);
  function ready() { NZ.footer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
})();
