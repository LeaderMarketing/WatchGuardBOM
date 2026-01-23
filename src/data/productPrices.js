/**
 * Product Pricing Data
 * 
 * This file contains dummy/placeholder prices for products.
 * Update these values with actual prices from your dealershop when available.
 * 
 * Structure:
 * - productPrices[productName][serviceType][term] = price (in AUD, ex GST)
 * - For appliance-only: productPrices[productName]['Appliance Only'] = price
 * 
 * Note: Set price to 0 or null if price is TBC (To Be Confirmed)
 */

// Tabletop Firebox prices (dummy data - update with real prices)
const tabletopPrices = {
  'Firebox T115-W': {
    'Appliance Only': 550,
    'Standard Support': {
      '1 Year': 750,
      '3 Year': 1850,
      '5 Year': 2950,
    },
    'Basic Security': {
      '1 Year': 950,
      '3 Year': 2450,
      '5 Year': 3950,
    },
    'Total Security': {
      '1 Year': 1250,
      '3 Year': 3250,
      '5 Year': 5250,
    },
  },
  'Firebox T125': {
    'Appliance Only': 750,
    'Standard Support': {
      '1 Year': 950,
      '3 Year': 2450,
      '5 Year': 3950,
    },
    'Basic Security': {
      '1 Year': 1250,
      '3 Year': 3250,
      '5 Year': 5250,
    },
    'Total Security': {
      '1 Year': 1650,
      '3 Year': 4350,
      '5 Year': 7050,
    },
  },
  'Firebox T125-W': {
    'Appliance Only': 850,
    'Standard Support': {
      '1 Year': 1050,
      '3 Year': 2750,
      '5 Year': 4450,
    },
    'Basic Security': {
      '1 Year': 1350,
      '3 Year': 3550,
      '5 Year': 5750,
    },
    'Total Security': {
      '1 Year': 1750,
      '3 Year': 4650,
      '5 Year': 7550,
    },
  },
  'Firebox T145': {
    'Appliance Only': 1250,
    'Standard Support': {
      '1 Year': 1550,
      '3 Year': 4050,
      '5 Year': 6550,
    },
    'Basic Security': {
      '1 Year': 1950,
      '3 Year': 5150,
      '5 Year': 8350,
    },
    'Total Security': {
      '1 Year': 2450,
      '3 Year': 6450,
      '5 Year': 10450,
    },
  },
  'Firebox T185': {
    'Appliance Only': 1850,
    'Standard Support': {
      '1 Year': 2250,
      '3 Year': 5950,
      '5 Year': 9650,
    },
    'Basic Security': {
      '1 Year': 2850,
      '3 Year': 7550,
      '5 Year': 12250,
    },
    'Total Security': {
      '1 Year': 3550,
      '3 Year': 9350,
      '5 Year': 15150,
    },
  },
  'Firebox T185 (High Availability)': {
    'Appliance Only': 1650,
    'Standard Support': {
      '1 Year': 1850,
      '3 Year': 4850,
      '5 Year': 7850,
    },
    'Basic Security': {
      '1 Year': 2250,
      '3 Year': 5950,
      '5 Year': 9650,
    },
    'Total Security': {
      '1 Year': 2750,
      '3 Year': 7250,
      '5 Year': 11750,
    },
  },
};

// M-Series Firebox prices (dummy data - update with real prices)
const mSeriesPrices = {
  'Firebox M295': {
    'Appliance Only': 2850,
    'Standard Support': {
      '1 Year': 3450,
      '3 Year': 9150,
      '5 Year': 14850,
    },
    'Basic Security': {
      '1 Year': 4250,
      '3 Year': 11250,
      '5 Year': 18250,
    },
    'Total Security': {
      '1 Year': 5250,
      '3 Year': 13950,
      '5 Year': 22650,
    },
  },
  'Firebox M395': {
    'Appliance Only': 4250,
    'Standard Support': {
      '1 Year': 5150,
      '3 Year': 13650,
      '5 Year': 22150,
    },
    'Basic Security': {
      '1 Year': 6350,
      '3 Year': 16850,
      '5 Year': 27350,
    },
    'Total Security': {
      '1 Year': 7850,
      '3 Year': 20850,
      '5 Year': 33850,
    },
  },
  'Firebox M495': {
    'Appliance Only': 6250,
    'Standard Support': {
      '1 Year': 7550,
      '3 Year': 20050,
      '5 Year': 32550,
    },
    'Basic Security': {
      '1 Year': 9350,
      '3 Year': 24850,
      '5 Year': 40350,
    },
    'Total Security': {
      '1 Year': 11550,
      '3 Year': 30650,
      '5 Year': 49750,
    },
  },
  'Firebox M595': {
    'Appliance Only': 9250,
    'Standard Support': {
      '1 Year': 11150,
      '3 Year': 29650,
      '5 Year': 48150,
    },
    'Basic Security': {
      '1 Year': 13850,
      '3 Year': 36750,
      '5 Year': 59650,
    },
    'Total Security': {
      '1 Year': 17150,
      '3 Year': 45550,
      '5 Year': 73950,
    },
  },
  'Firebox M695': {
    'Appliance Only': 14250,
    'Standard Support': {
      '1 Year': 17250,
      '3 Year': 45850,
      '5 Year': 74450,
    },
    'Basic Security': {
      '1 Year': 21350,
      '3 Year': 56750,
      '5 Year': 92150,
    },
    'Total Security': {
      '1 Year': 26450,
      '3 Year': 70250,
      '5 Year': 114050,
    },
  },
  'Firebox M4800': {
    'Appliance Only': 28500,
    'Standard Support': {
      '1 Year': 34500,
      '3 Year': 91650,
      '5 Year': 148800,
    },
    'Basic Security': {
      '1 Year': 42750,
      '3 Year': 113550,
      '5 Year': 184350,
    },
    'Total Security': {
      '1 Year': 52950,
      '3 Year': 140650,
      '5 Year': 228350,
    },
  },
  'Firebox M5800': {
    'Appliance Only': 45000,
    'Standard Support': {
      '1 Year': 54500,
      '3 Year': 144850,
      '5 Year': 235200,
    },
    'Basic Security': {
      '1 Year': 67500,
      '3 Year': 179350,
      '5 Year': 291150,
    },
    'Total Security': {
      '1 Year': 83650,
      '3 Year': 222250,
      '5 Year': 360850,
    },
  },
};

// Wi-Fi 6 Access Point prices (dummy data - update with real prices)
const wifiPrices = {
  // Indoor Access Points
  'AP130': {
    'Appliance Only': 450,
    'Standard Wi-Fi': {
      '1 Year': 550,
      '3 Year': 750,
      '5 Year': 950,
    },
    'USP Wi-Fi': {
      '1 Year': 650,
      '3 Year': 950,
      '5 Year': 1250,
    },
  },
  'AP230W': {
    'Appliance Only': 550,
    'Standard Wi-Fi': {
      '1 Year': 650,
      '3 Year': 950,
      '5 Year': 1250,
    },
    'USP Wi-Fi': {
      '1 Year': 750,
      '3 Year': 1150,
      '5 Year': 1550,
    },
  },
  'AP330': {
    'Appliance Only': 650,
    'Standard Wi-Fi': {
      '1 Year': 750,
      '3 Year': 1050,
      '5 Year': 1350,
    },
    'USP Wi-Fi': {
      '1 Year': 850,
      '3 Year': 1250,
      '5 Year': 1650,
    },
  },
  'AP432': {
    'Appliance Only': 850,
    'Standard Wi-Fi': {
      '1 Year': 950,
      '3 Year': 1350,
      '5 Year': 1750,
    },
    'USP Wi-Fi': {
      '1 Year': 1050,
      '3 Year': 1550,
      '5 Year': 2050,
    },
  },
  // Outdoor Access Points
  'AP332CR': {
    'Appliance Only': 750,
    'Standard Wi-Fi': {
      '1 Year': 850,
      '3 Year': 1250,
      '5 Year': 1650,
    },
    'USP Wi-Fi': {
      '1 Year': 950,
      '3 Year': 1450,
      '5 Year': 1950,
    },
  },
  'AP430CR': {
    'Appliance Only': 950,
    'Standard Wi-Fi': {
      '1 Year': 1050,
      '3 Year': 1550,
      '5 Year': 2050,
    },
    'USP Wi-Fi': {
      '1 Year': 1150,
      '3 Year': 1750,
      '5 Year': 2350,
    },
  },
};

// Combined prices object
export const productPrices = {
  ...tabletopPrices,
  ...mSeriesPrices,
  ...wifiPrices,
};

/**
 * Get price for a specific product configuration
 * @param {string} productName - The product name
 * @param {string} serviceType - The service/license type (e.g., 'Basic Security', 'Standard Wi-Fi')
 * @param {string|null} term - The license term (e.g., '1 Year', '3 Year', '5 Year')
 * @returns {number|null} - The price in AUD ex GST, or null if not found
 */
export function getProductPrice(productName, serviceType, term = null) {
  const productData = productPrices[productName];
  if (!productData) return null;

  // Appliance only - no term needed
  if (serviceType === 'Appliance Only') {
    return productData['Appliance Only'] || null;
  }

  // Service with term
  const serviceData = productData[serviceType];
  if (!serviceData || !term) return null;

  return serviceData[term] || null;
}

/**
 * Get appliance-only price for a product
 * @param {string} productName - The product name
 * @returns {number|null} - The appliance-only price in AUD ex GST, or null if not found
 */
export function getAppliancePrice(productName) {
  return productPrices[productName]?.['Appliance Only'] || null;
}

/**
 * Get subscription price (without appliance) for a product configuration
 * @param {string} productName - The product name
 * @param {string} serviceType - The service/license type
 * @param {string} term - The license term
 * @returns {number|null} - The subscription price, or null if not found
 */
export function getSubscriptionPrice(productName, serviceType, term) {
  const fullPrice = getProductPrice(productName, serviceType, term);
  const appliancePrice = getAppliancePrice(productName);
  
  if (fullPrice === null) return null;
  if (appliancePrice === null) return fullPrice;
  
  // Return the difference (subscription portion only)
  return Math.max(0, fullPrice - appliancePrice);
}

/**
 * Format price for display
 * @param {number|null} price - The price to format
 * @returns {string} - Formatted price string (e.g., "$1,250" or "TBC")
 */
export function formatPrice(price) {
  if (price === null || price === undefined || price === 0) {
    return 'TBC';
  }
  return `$${price.toLocaleString('en-AU')}`;
}

/**
 * Get the base/starting price for a product (lowest subscription tier, 1 year)
 * Useful for comparison table display
 * @param {string} productName - The product name
 * @param {boolean} isWifi - Whether this is a Wi-Fi product
 * @returns {number|null} - The starting price, or null if not found
 */
export function getStartingPrice(productName, isWifi = false) {
  const productData = productPrices[productName];
  if (!productData) return null;

  // For display, show the most basic subscription price at 1 year
  const basicTier = isWifi ? 'Standard Wi-Fi' : 'Standard Support';
  return productData[basicTier]?.['1 Year'] || productData['Appliance Only'] || null;
}

export default productPrices;
