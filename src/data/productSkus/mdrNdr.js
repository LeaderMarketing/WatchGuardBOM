// MDR & NDR product configuration → SKU mapping
// Per-seat subscriptions with license tier pricing

export const mdrNdrProductSkus = {
  // ─── MDR Products ───────────────────────────────────────
  'Core MDR': {
    '1-50':      { '1 Year': 'NWG-WGMDR30101', '3 Year': 'NWG-WGMDR30103' },
    '51-100':    { '1 Year': 'NWG-WGMDR30201', '3 Year': 'NWG-WGMDR30203' },
    '101-250':   { '1 Year': 'NWG-WGMDR30301', '3 Year': 'NWG-WGMDR30303' },
    '251-500':   { '1 Year': 'NWG-WGMDR30401', '3 Year': 'NWG-WGMDR30403' },
    '501-1000':  { '1 Year': 'NWG-WGMDR30501', '3 Year': 'NWG-WGMDR30503' },
    '1001-5000': { '1 Year': 'NWG-WGMDR30601', '3 Year': 'NWG-WGMDR30603' },
    '5001+':     { '1 Year': 'NWG-WGMDR30701', '3 Year': 'NWG-WGMDR30703' },
  },

  'Core MDR for Microsoft': {
    '1-50':      { '1 Year': 'NWG-WGMDRM30101', '3 Year': 'NWG-WGMDRM30103' },
    '51-100':    { '1 Year': 'NWG-WGMDRM30201', '3 Year': 'NWG-WGMDRM30203' },
    '101-250':   { '1 Year': 'NWG-WGMDRM30301', '3 Year': 'NWG-WGMDRM30303' },
    '251-500':   { '1 Year': 'NWG-WGMDRM30401', '3 Year': 'NWG-WGMDRM30403' },
    '501-1000':  { '1 Year': 'NWG-WGMDRM30501', '3 Year': 'NWG-WGMDRM30503' },
    '1001-5000': { '1 Year': 'NWG-WGMDRM30601', '3 Year': 'NWG-WGMDRM30603' },
    '5001+':     { '1 Year': 'NWG-WGMDRM30701', '3 Year': 'NWG-WGMDRM30703' },
  },

  'Total MDR': {
    '1-50':      { '1 Year': 'NWG-WGMDRT30101', '3 Year': 'NWG-WGMDRT30103' },
    '51-100':    { '1 Year': 'NWG-WGMDRT30201', '3 Year': 'NWG-WGMDRT30203' },
    '101-250':   { '1 Year': 'NWG-WGMDRT30301', '3 Year': 'NWG-WGMDRT30303' },
    '251-500':   { '1 Year': 'NWG-WGMDRT30401', '3 Year': 'NWG-WGMDRT30403' },
    '501-1000':  { '1 Year': 'NWG-WGMDRT30501', '3 Year': 'NWG-WGMDRT30503' },
    '1001-5000': { '1 Year': 'NWG-WGMDRT30601', '3 Year': 'NWG-WGMDRT30603' },
    '5001+':     { '1 Year': 'NWG-WGMDRT30701', '3 Year': 'NWG-WGMDRT30703' },
  },

  // ─── NDR Products ───────────────────────────────────────
  'ThreatSync+ NDR': {
    '1-50':    { '1 Year': 'NWG-WGTSNDR30101', '3 Year': 'NWG-WGTSNDR30103' },
    '51-100':  { '1 Year': 'NWG-WGTSNDR30201', '3 Year': 'NWG-WGTSNDR30203' },
    '101-250': { '1 Year': 'NWG-WGTSNDR30301', '3 Year': 'NWG-WGTSNDR30303' },
    '251-500': { '1 Year': 'NWG-WGTSNDR30401', '3 Year': 'NWG-WGTSNDR30403' },
  },

  'Total NDR': {
    '1-50':    { '1 Year': 'NWG-WGTSST30101', '3 Year': 'NWG-WGTSST30103' },
    '51-100':  { '1 Year': 'NWG-WGTSST30201', '3 Year': 'NWG-WGTSST30203' },
    '101-250': { '1 Year': 'NWG-WGTSST30301', '3 Year': 'NWG-WGTSST30303' },
    '251+':    { '1 Year': 'NWG-WGTSST30401', '3 Year': 'NWG-WGTSST30403' },
  },

  'ThreatSync+ SaaS': {
    '1-50':    { '1 Year': 'NWG-WGTSSAAS30101', '3 Year': 'NWG-WGTSSAAS30103' },
    '51-100':  { '1 Year': 'NWG-WGTSSAAS30201', '3 Year': 'NWG-WGTSSAAS30203' },
    '101-250': { '1 Year': 'NWG-WGTSSAAS30301', '3 Year': 'NWG-WGTSSAAS30303' },
    '251+':    { '1 Year': 'NWG-WGTSSAAS30401', '3 Year': 'NWG-WGTSSAAS30403' },
  },
};
