/* NIRMAZA - shared lists and helpers for the Elevator pages. */
window.EL = (function () {
  var E = {};
  E.CATS = [
    { k: 'Passenger Elevator', ico: '🚶', d: 'Apartments, offices, malls' }, { k: 'Home Elevator', ico: '🏠', d: 'Houses and villas' },
    { k: 'Hospital Elevator', ico: '🏥', d: 'Stretcher / bed lifts' }, { k: 'Goods Elevator', ico: '📦', d: 'Factories, warehouses' },
    { k: 'Glass / Panoramic Elevator', ico: '🪟', d: 'Glass cabin, sea-view style' }, { k: 'Dumbwaiter / Service Lift', ico: '🍽️', d: 'Small service lifts' },
    { k: 'Car Elevator', ico: '🚗', d: 'Parking and car lifts' }, { k: 'Platform / Accessibility Lift', ico: '♿', d: 'Wheelchair platforms' }
  ];
  E.CAT_NAMES = E.CATS.map(function (c) { return c.k; });
  E.INSTALL = ['MRL (Machine Room Less)', 'MR (Machine Room Required)', 'Hydraulic Elevator', 'Traction Elevator', 'Gearless Traction', 'Geared Traction', 'Pitless / Low-Pit Solution', 'Custom Installation'];
  var I = { MRL: E.INSTALL[0], MR: E.INSTALL[1], HYD: E.INSTALL[2], TRA: E.INSTALL[3], GL: E.INSTALL[4], GR: E.INSTALL[5], PIT: E.INSTALL[6], CUS: E.INSTALL[7] };
  // Which installation types make technical sense for each product category ...
  var BY_CAT = {
    'Passenger Elevator': [I.MRL, I.MR, I.TRA, I.GL, I.GR, I.HYD, I.CUS], 'Home Elevator': [I.MRL, I.HYD, I.PIT, I.TRA, I.CUS],
    'Hospital Elevator': [I.MRL, I.MR, I.TRA, I.GL, I.HYD, I.CUS], 'Goods Elevator': [I.MR, I.HYD, I.TRA, I.GR, I.CUS],
    'Glass / Panoramic Elevator': [I.MRL, I.MR, I.TRA, I.GL, I.HYD, I.CUS], 'Dumbwaiter / Service Lift': [I.MRL, I.MR, I.TRA, I.CUS],
    'Car Elevator': [I.MR, I.HYD, I.GR, I.TRA, I.CUS], 'Platform / Accessibility Lift': [I.HYD, I.PIT, I.CUS]
  };
  // ... and for each drive type
  var BY_DRIVE = { 'Gearless': [I.MRL, I.MR, I.TRA, I.GL, I.CUS], 'Geared': [I.MR, I.TRA, I.GR, I.CUS], 'Hydraulic': [I.MR, I.HYD, I.PIT, I.CUS] };
  E.compatibleInstall = function (category, drive) {
    var a = BY_CAT[category] || E.INSTALL;
    if (drive && BY_DRIVE[drive]) a = a.filter(function (x) { return BY_DRIVE[drive].indexOf(x) !== -1; });
    return E.INSTALL.filter(function (x) { return a.indexOf(x) !== -1; });
  };
  E.DRIVES = ['Gearless', 'Geared', 'Hydraulic'];
  E.TYPES = ['Passenger', 'Home', 'Goods', 'Hospital', 'Glass / Panoramic', 'Service / Dumbwaiter', 'Car', 'Platform / Accessibility', 'Other'];
  E.BUILDINGS = ['Independent House', 'Duplex / Villa', 'Residential Apartment', 'Commercial Building', 'Shopping Mall', 'Hospital', 'Hotel', 'Office Building', 'Industrial Building', 'Warehouse', 'Parking Building'];
  E.COMMISSION = ['Site Inspection', 'Shaft Measurement', 'Technical Consultation', 'Civil Work Coordination', 'Lift Installation', 'Electrical Work Coordination', 'Testing & Commissioning', 'Safety Inspection Coordination'];
  E.AMC_SERVICES = ['Annual Maintenance Contract (AMC)', 'Comprehensive Maintenance Contract (CMC)', 'Preventive Maintenance', 'Breakdown Repair', 'Emergency Rescue Support', '24/7 Service Support', 'Spare Parts Availability', 'Lift Modernization', 'Cabin Renovation', 'Control Panel Replacement'];
  E.SAFETY = ['Emergency Alarm', 'Automatic Rescue Device', 'Door Safety Sensor', 'Overload Protection', 'Overspeed Governor', 'Emergency Communication System', 'Fire Recall / Fire Safety Features'];
  E.CLAIMS = ['BIS / IS Standards', 'Lift Licence / Approval', 'Product Test Certificates', 'Manufacturer Authorization'];
  E.CABIN = { finishes: ['Stainless Steel (SS) - Hairline', 'Stainless Steel (SS) - Mirror', 'Glass', 'Wooden / Laminate', 'Powder-coated Steel', 'Custom'], flooring: ['Vinyl', 'Granite / Marble', 'Tile', 'Anti-skid rubber', 'Custom'],
    ceiling: ['Flat SS ceiling', 'False ceiling with LED', 'Glass ceiling', 'Custom'], lighting: ['LED downlights', 'Cove lighting', 'Emergency light'], handrails: ['SS handrail', 'Glass-mounted handrail', 'Wooden handrail'], panels: ['Push-button panel', 'Touch panel', 'Digital display', 'Voice announcement'] };
  E.BUDGETS = [{ k: 'u5', n: 'Under ₹5 Lakh', lo: 0, hi: 500000 }, { k: '5_8', n: '₹5–8 Lakh', lo: 500000, hi: 800000 }, { k: '8_12', n: '₹8–12 Lakh', lo: 800000, hi: 1200000 },
    { k: '12_20', n: '₹12–20 Lakh', lo: 1200000, hi: 2000000 }, { k: '20_30', n: '₹20–30 Lakh', lo: 2000000, hi: 3000000 }, { k: '30p', n: '₹30 Lakh+', lo: 3000000, hi: 1e12 }];
  E.EXTRAS = ['Automatic Rescue Device', 'Automatic Doors', 'CCTV Provision', 'Emergency Alarm', 'Voice Announcement', 'Power Backup', 'Stainless Steel Cabin', 'Glass Cabin', 'Digital Display'];

  E.esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };
  E.inr = function (n) { n = Number(n); return '₹' + (isNaN(n) ? '0' : n.toLocaleString('en-IN', { maximumFractionDigits: 0 })); };
  E.num = function (v) { if (v == null || String(v).trim() === '') return null; var n = Number(String(v).replace(/,/g, '')); return isNaN(n) ? null : n; };
  E.client = null;
  E.getClient = function () {
    if (E.client) return E.client;
    var cfg = window.BUILDCONNECT_CONFIG || {};
    var ok = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && String(cfg.SUPABASE_ANON_KEY).indexOf('PASTE') !== 0;
    if (!ok || !window.supabase) return null;
    E.client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY); return E.client;
  };
  E.imgUrl = function (path) { var cfg = window.BUILDCONNECT_CONFIG || {}; return path ? cfg.SUPABASE_URL + '/storage/v1/object/public/portfolio/' + encodeURI(path) : ''; };
  E.priceText = function (p) {
    if (p.hide_price || (p.pricing && p.pricing.type === 'Custom Quote')) return 'Custom quotation';
    if (p.price_min != null && p.price_max != null && p.price_max > p.price_min && p.pricing && p.pricing.type === 'Fixed') return E.inr(p.price_min) + ' – ' + E.inr(p.price_max);
    if (p.price_min != null) return E.inr(p.price_min) + (p.pricing && p.pricing.type === 'Fixed' ? '' : ' onwards');
    return 'Ask for price';
  };
  E.chipsHtml = function (arr) { return (arr || []).map(function (x) { return '<span class="pill">' + E.esc(x) + '</span>'; }).join(''); };
  // Indicative estimate: lift price + extras that are not included. Always approximate.
  E.estimate = function (p) {
    var pr = p.pricing || {}, rows = [], lo = 0, hi = 0, any = false;
    if (!p.hide_price && p.price_min != null && pr.type !== 'Custom Quote') {
      any = true; lo += p.price_min; hi += (p.price_max != null ? p.price_max : p.price_min); rows.push(['Lift (product)', p.price_min, p.price_max != null ? p.price_max : p.price_min]);
    }
    [['Installation', pr.install_mode, pr.install_amt], ['Civil work', pr.civil_mode === 'Excluded' ? 'Extra' : 'Included', pr.civil_amt], ['Transportation', pr.transport_mode, pr.transport_amt], ['Customisation', 'Extra', pr.custom_amt]].forEach(function (r) {
      var a = E.num(r[2]); if (r[1] === 'Extra' && a != null && a > 0) { lo += a; hi += a; rows.push([r[0], a, a]); } else if (r[1] === 'Included') rows.push([r[0] + ' (included)', 0, 0]);
    });
    var gst = null; if (pr.gst_mode === 'Extra' && any) { gst = [Math.round(lo * 0.18), Math.round(hi * 0.18)]; rows.push(['GST @ 18% (for illustration)', gst[0], gst[1]]); lo += gst[0]; hi += gst[1]; }
    return { rows: rows, lo: lo, hi: hi, any: any };
  };
  return E;
})();
