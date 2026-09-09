// Single source of truth for entity facts used in structured data and bylines.
// Keep in sync with the LocalBusiness block in src/layouts/Layout.astro.

export const BUSINESS = {
  id: 'https://abovebeyondhomesolutions.com/#business',
  name: 'Above and Beyond Home Solutions, LLC',
  url: 'https://abovebeyondhomesolutions.com',
  phone: '+12394163505',
  phoneDisplay: '(239) 416-3505',
  license: 'HI16270',
};

// The owner performs every inspection. Fill in `yearsExperience` and
// `inspectionsCompleted` when confirmed; the bio omits them while null.
export const INSPECTOR = {
  name: 'Eugene',
  jobTitle: 'Owner and Licensed Home Inspector',
  url: 'https://abovebeyondhomesolutions.com/about/#inspector',
  license: 'HI16270',
  yearsExperience: null,
  inspectionsCompleted: null,
  photo: '/assets/about/about-image-01.webp',
  credentials: [
    'Florida Licensed Home Inspector, License HI16270',
    'InterNACHI Certified Professional Inspector',
    'IAC2 Certified for Mold and Indoor Air Quality',
    'CCPIA Certified Commercial Property Inspector',
    'FAA Certified Drone Pilot',
  ],
};
