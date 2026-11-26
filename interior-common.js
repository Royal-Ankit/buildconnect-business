/* NIRMAZA - Interior Designer shared lists and helpers (used by the registration page, the dashboard, the list page and the public profile). */
(function () {
  'use strict';
  var INT = {};
  INT.SLUG = 'interior-designer';
  INT.PUBLIC_BASE = function (cfg) { return ((cfg && cfg.SUPABASE_URL) || '') + '/storage/v1/object/public/portfolio/'; };

  INT.BUSINESS_KINDS = ['Individual Interior Designer', 'Interior Design Studio', 'Interior Design Company', 'Architect + Interior Designer', 'Interior Design Contractor'];
  INT.SERVICE_GROUPS = [
    ['A. Residential interior design', ['Complete Home Interior Design', 'Living Room Interior Design', 'Bedroom Interior Design', 'Modular Kitchen Design', 'Dining Room Design', 'Bathroom Interior Design', "Kids' Room Design", 'Pooja Room Design', 'Balcony Interior Design', 'Guest Room Design']],
    ['B. Commercial interior design', ['Office Interior Design', 'Retail Shop / Showroom Design', 'Restaurant / Cafe Interior Design', 'Hotel Interior Design', 'Salon / Spa Interior Design', 'Hospital / Clinic Interior Design', 'Educational Institution Interior Design', 'Corporate Workspace Design']],
    ['C. Modular furniture and interior work', ['Modular Kitchen', 'Wardrobe Design', 'Sliding Wardrobes', 'Walk-in Wardrobes', 'TV Units', 'Customized Furniture', 'Storage Units', 'Crockery Units', 'Office Furniture', 'Wall-Mounted Cabinets']],
    ['D. Renovation and remodelling', ['Complete Home Renovation', 'Kitchen Renovation', 'Bathroom Renovation', 'Living Room Makeover', 'Bedroom Renovation', 'Flooring Replacement', 'Wall Redesign', 'False Ceiling Renovation', 'Commercial Space Renovation']],
    ['E. Design and visualization', ['2D Floor Plans', '3D Interior Design', '3D Rendering', '3D Walkthrough', 'Space Planning', 'Furniture Layout', 'Lighting Layout', 'Colour Consultation', 'Material Selection']],
    ['F. Additional specializations', ['False Ceiling Design', 'Wall Panelling', 'Wallpaper Design', 'Decorative Wall Finishes', 'Flooring Design', 'Lighting Design', 'Staircase Interior', 'Custom Furniture Design', 'Interior Styling', 'Space Optimization']]
  ];
  INT.ALL_SERVICES = []; INT.SERVICE_GROUPS.forEach(function (g) { g[1].forEach(function (s) { INT.ALL_SERVICES.push(s); }); });
  INT.STYLES = ['Modern', 'Contemporary', 'Minimalist', 'Luxury', 'Traditional Indian', 'Scandinavian', 'Industrial', 'Classic', 'Rustic', 'Bohemian', 'Modern Traditional', 'Mid-Century Modern', 'Other'];
  INT.SOFTWARE = ['AutoCAD', 'SketchUp', '3ds Max', 'V-Ray', 'Revit', 'Lumion', 'Photoshop', 'Enscape', 'Other Software'];
  INT.SERVICE_TYPES = ['Design Only', 'Design + Material Selection', 'Design + Execution', 'Complete Turnkey Interior Solutions', 'Labour Only', 'Labour + Material', 'Interior Consultation Only', 'Site Supervision', 'Project Management'];
  INT.PROJECT_TYPES = ['Residential Projects', 'Commercial Projects', 'Office Projects', 'Retail Projects', 'Hospitality Projects', 'Renovation Projects', 'New Construction Interior Projects'];
  INT.CAPABILITIES = ['On-Site Project Management', 'Material Procurement', 'Furniture Manufacturing Coordination', 'Contractor Coordination', 'Electrical Work Coordination', 'Plumbing Work Coordination', 'Civil Work Coordination', 'Installation & Finishing', 'Quality Inspection'];
  INT.PRICING_METHODS = ['Per Square Foot', 'Per Room', 'Per BHK', 'Per Project', 'Per Consultation', 'Fixed Package', 'Custom Quotation'];
  INT.PRICE_PREFS = ['Fixed Pricing', 'Negotiable Pricing', 'Custom Quotation Based on Requirements'];
  INT.LANGUAGES = ['Hindi', 'English', 'Urdu', 'Punjabi', 'Bhojpuri', 'Awadhi', 'Other'];
  INT.DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  INT.FACILITIES = ['Free estimate', '3D design included', 'Material sourcing help', 'Own carpentry workshop', 'Post-handover support', 'Vastu guidance', 'Home loan / finance help', 'Photo and video progress updates', 'Written agreement and GST invoice'];
  INT.PORT_CATEGORIES = ['Living Room Interior', 'Bedroom Interior', 'Modular Kitchen', 'Wardrobe Design', 'Bathroom Interior', 'Complete Home Interior', 'Office Interior', 'Commercial Interior', 'Restaurant / Cafe Interior', 'Hotel Interior', 'False Ceiling', 'Wall Design', 'Furniture Design', 'Renovation Projects', 'Other Interior Projects'];
  INT.PROPERTY_TYPES = ['Apartment / Flat', 'Independent House', 'Villa', 'Office', 'Shop / Showroom', 'Restaurant / Cafe', 'Hotel / Resort', 'Clinic / Hospital', 'School / Institute', 'Other'];
  INT.PROJECT_SERVICES = ['Design', '2D layout', '3D render', 'Material selection', 'Execution', 'Furniture', 'Lighting', 'False ceiling', 'Painting', 'Site supervision'];
  INT.CERT_KINDS = ['Educational qualification certificate', 'Professional certification', 'Business registration document', 'Other document'];

  function has(v) { return Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== '' && v !== false; }
  function anyOf(o, keys) { o = o || {}; return keys.some(function (k) { return has(o[k]); }); }

  /* Profile completion: seven parts, one for each step of the form. */
  INT.completion = function (biz, portfolio) {
    biz = biz || {}; var x = biz.interior_extra || {}, pr = x.prices || {};
    var named = biz.business_name && String(biz.business_name).indexOf('name not given') === -1;
    var projects = (portfolio || []).filter(function (r) { return !(r.details && r.details.kind); });
    var docs = x.documents || {};
    var parts = [
      { key: 'business', label: 'Business information', done: !!(named && (biz.district_id || biz.pincode || (biz.service_district_ids || []).length || biz.experience_years != null)), tip: 'Add your studio name, city and experience to build trust.' },
      { key: 'services', label: 'Services', done: has(biz.specializations), tip: 'Complete your service details to improve your business profile.' },
      { key: 'expertise', label: 'Design expertise', done: anyOf(x, ['styles', 'software', 'software_more']), tip: 'Choose your design styles and software skills.' },
      { key: 'capacity', label: 'Project capacity', done: has(x.service_types) || has(biz.work_segments) || biz.projects_completed != null || x.max_parallel != null || x.budget_max != null, tip: 'Tell customers what kind of projects you take and your capacity.' },
      { key: 'pricing', label: 'Pricing', done: has(x.pricing_methods) || Object.keys(pr).length > 0 || x.hide_prices === true, tip: 'Add your pricing, or choose to share quotations on request.' },
      { key: 'portfolio', label: 'Portfolio', done: projects.length > 0, tip: 'Add your previous projects to attract more customers.' },
      { key: 'extra', label: 'Additional information', done: anyOf(x, ['free_site_visit', 'online_consult', 'onsite_supervision', 'warranty', 'payment_terms', 'days', 'facilities', 'more']) || has(biz.languages) || has(biz.working_hours) || has(biz.description), tip: 'Add your warranty, payment terms and working hours.' }
    ];
    var n = parts.filter(function (p) { return p.done; }).length;
    return { pct: Math.round(n * 100 / parts.length), parts: parts, done: n };
  };

  INT.fmtINR = function (n) { return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 }); };
  /* Pricing lines for the public side. Empty when the designer chose to hide prices. */
  INT.PRICE_LABELS = [['start_design_fee', 'Starting design fee'], ['design_per_sqft', 'Design charges per sq.ft'], ['exec_per_sqft', 'Execution from, per sq.ft'], ['consultation', 'Consultation'], ['site_visit', 'Site visit'], ['design_2d', '2D design'], ['design_3d', '3D design'], ['turnkey_start', 'Turnkey projects from']];
  INT.publicPrices = function (biz) {
    var x = (biz && biz.interior_extra) || {};
    if (x.hide_prices === true) return [];
    var out = [], pr = x.prices || {};
    INT.PRICE_LABELS.forEach(function (p) { if (pr[p[0]] != null && pr[p[0]] !== '') out.push([p[1], INT.fmtINR(pr[p[0]])]); });
    if (x.budget_min != null) out.push(['Minimum project budget', INT.fmtINR(x.budget_min)]);
    if (x.budget_max != null) out.push(['Maximum project budget', INT.fmtINR(x.budget_max)]);
    return out;
  };
  window.INT = INT;
})();
