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

export const CITIES = [
  'North Port',
  'Port Charlotte',
  'Punta Gorda',
  'Venice',
  'Englewood',
  'Rotonda West',
  'Nokomis',
  'Sarasota',
  'Other / not listed',
];
