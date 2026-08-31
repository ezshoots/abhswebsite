// Single source of truth for the contact form's structured choices.
// Imported by the Astro component (to render the selects) and by the
// server handler (to validate what actually arrives). Keep them in sync
// by editing here only.

export const SERVICES = [
  'General Home Inspection',
  '4-Point Inspection',
  'Wind Mitigation Inspection',
  '4-Point + Wind Mitigation',
  'New Construction / Phase Inspection',
  '11-Month Warranty Inspection',
  'Lateral Sewer Scope Inspection',
  'Thermal Imaging Scope',
  'Water or Air Quality Testing',
  'Home Watch Service',
  'Not sure, need a recommendation',
];

export const PROPERTY_TYPES = [
  'Single-family home',
  'Condo or townhome',
  'Villa',
  'Manufactured or mobile home',
  'Multi-family (2 to 4 units)',
  'Commercial or other',
];

// City is a free-text field, so these are only autocomplete suggestions in the
// datalist. The handler accepts any reasonable city, not just these.
export const CITY_SUGGESTIONS = [
  'North Port',
  'Port Charlotte',
  'Punta Gorda',
  'Venice',
  'Englewood',
  'Rotonda West',
  'Nokomis',
  'Sarasota',
];
