// Tabletop Firebox SKU → Internal Product ID mapping
// NOTE: Product IDs are required for the Add to Cart API (PopUpContainer.Add)
// These IDs must be collected from the website as they are internal database IDs.

export const tabletopSkuProductIds = {
  // ============================================
  // FIREBOX T115-W
  // ============================================
  'NWG-WGT116000': '106057', // T115-W Appliance Only
  'NWG-WGT1160061': '', // T115-W Standard Support 1-yr
  'NWG-WGT1160063': '', // T115-W Standard Support 3-yr
  'NWG-WGT1160065': '', // T115-W Standard Support 5-yr
  'NWG-WGT1160071': '106046', // T115-W Basic Security 1-yr
  'NWG-WGT1160073': '', // T115-W Basic Security 3-yr
  'NWG-WGT1160075': '', // T115-W Basic Security 5-yr
  'NWG-WGT1160081': '', // T115-W Total Security 1-yr
  'NWG-WGT1160083': '', // T115-W Total Security 3-yr
  'NWG-WGT1160085': '', // T115-W Total Security 5-yr

  // ============================================
  // FIREBOX T125
  // ============================================
  'NWG-WGT125000': '', // T125 Appliance Only
  'NWG-WGT1250061': '', // T125 Standard Support 1-yr
  'NWG-WGT1250063': '', // T125 Standard Support 3-yr
  'NWG-WGT1250065': '', // T125 Standard Support 5-yr
  'NWG-WGT1250071': '', // T125 Basic Security 1-yr
  'NWG-WGT1250073': '', // T125 Basic Security 3-yr
  'NWG-WGT1250075': '', // T125 Basic Security 5-yr
  'NWG-WGT1250081': '', // T125 Total Security 1-yr
  'NWG-WGT1250083': '', // T125 Total Security 3-yr
  'NWG-WGT1250085': '', // T125 Total Security 5-yr

  // ============================================
  // FIREBOX T125-W
  // ============================================
  'NWG-WGT126000': '', // T125-W Appliance Only
  'NWG-WGT1260061': '', // T125-W Standard Support 1-yr
  'NWG-WGT1260063': '', // T125-W Standard Support 3-yr
  'NWG-WGT1260065': '', // T125-W Standard Support 5-yr
  'NWG-WGT1260071': '', // T125-W Basic Security 1-yr
  'NWG-WGT1260073': '', // T125-W Basic Security 3-yr
  'NWG-WGT1260075': '', // T125-W Basic Security 5-yr
  'NWG-WGT1260081': '', // T125-W Total Security 1-yr
  'NWG-WGT1260083': '', // T125-W Total Security 3-yr
  'NWG-WGT1260085': '', // T125-W Total Security 5-yr

  // ============================================
  // FIREBOX T145
  // ============================================
  'NWG-WGT145000': '', // T145 Appliance Only
  'NWG-WGT1450061': '', // T145 Standard Support 1-yr
  'NWG-WGT1450063': '', // T145 Standard Support 3-yr
  'NWG-WGT1450065': '', // T145 Standard Support 5-yr
  'NWG-WGT1450071': '', // T145 Basic Security 1-yr
  'NWG-WGT1450073': '', // T145 Basic Security 3-yr
  'NWG-WGT1450075': '', // T145 Basic Security 5-yr
  'NWG-WGT1450081': '', // T145 Total Security 1-yr
  'NWG-WGT1450083': '', // T145 Total Security 3-yr
  'NWG-WGT1450085': '', // T145 Total Security 5-yr

  // ============================================
  // FIREBOX T185
  // ============================================
  'NWG-WGT185000': '', // T185 Appliance Only
  'NWG-WGT1850061': '', // T185 Standard Support 1-yr
  'NWG-WGT1850063': '', // T185 Standard Support 3-yr
  'NWG-WGT1850065': '', // T185 Standard Support 5-yr
  'NWG-WGT1850071': '', // T185 Basic Security 1-yr
  'NWG-WGT1850073': '', // T185 Basic Security 3-yr
  'NWG-WGT1850075': '', // T185 Basic Security 5-yr
  'NWG-WGT1850081': '', // T185 Total Security 1-yr
  'NWG-WGT1850083': '', // T185 Total Security 3-yr
  'NWG-WGT1850085': '', // T185 Total Security 5-yr

  // ============================================
  // FIREBOX T185 (HIGH AVAILABILITY)
  // ============================================
  // Note: T185 HA only has Standard Support options and NO appliance-only option.
  // When adding to cart, these include the HA device pair + subscription together.
  'NWG-WGT18501601': '', // T185 HA Standard Support 1-yr
  'NWG-WGT18501603': '', // T185 HA Standard Support 3-yr
  'NWG-WGT18501605': '', // T185 HA Standard Support 5-yr
};
