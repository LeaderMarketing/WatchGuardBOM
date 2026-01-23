// Navigation configuration for top-level product categories
// Add new categories here as the product line expands

export const navigationConfig = [
  {
    id: 'firebox',
    label: 'Firebox Configurator',
    title: 'Firebox Configurator',
  },
  {
    id: 'mdr',
    label: 'MDR',
    title: 'Managed Detection and Response',
  },
  {
    id: 'ndr',
    label: 'NDR',
    title: 'Network Detection and Response',
  },
  {
    id: 'firecloud',
    label: 'FireCloud Renewals/Upgrades',
    title: 'FireCloud Renewals/Upgrades',
  },
];

// Helper function to get section config by ID
export const getSectionById = (id) => {
  return navigationConfig.find((section) => section.id === id) || navigationConfig[0];
};

// Default section when no hash is present
export const DEFAULT_SECTION = 'firebox';
