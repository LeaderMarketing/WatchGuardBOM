import React, { useState } from 'react';
import styles from './WifiSubscriptions.module.css';

const wifiFeatures = [
  { feature: 'Native WatchGuard Cloud Management Features', standard: true, usp: true },
  { feature: '24/7 Support and Hardware Warranty', standard: true, usp: true },
  { feature: 'Inventory Management', standard: true, usp: true },
  { feature: 'SSH/CLI Access', standard: true, usp: true },
  { feature: 'Configuration of Radio Settings', standard: true, usp: true },
  { feature: 'Firmware Updates', standard: true, usp: true },
  { feature: '24-Hour Reporting/Visibility', standard: true, usp: true },
  { feature: 'Live Status Visibility', standard: true, usp: true },
  { feature: 'WatchGuard Cloud API Integration for PSA', standard: true, usp: true },
  { feature: 'AP Site Templating', standard: true, usp: true },
  { feature: 'Captive Portal', standard: true, usp: true },
  { feature: 'Syslog Server Output', standard: false, usp: true },
  { feature: 'IKEv2 VPN Features (RAP)', standard: false, usp: true },
  { feature: '30-Day Reporting/Visibility', standard: false, usp: true },
  { feature: 'Future WatchGuard Portfolio Integrations', standard: false, usp: true },
  { feature: 'Future Security and Wi-Fi Features*', standard: false, usp: true },
];

function WifiSubscriptions({ selectedWifiLicense, onSelectWifiLicense, disabled }) {
  const [tableOpen, setTableOpen] = useState(false);

  return (
    <section className={styles.section}>
      <h2>Select Access Point Management Licence</h2>
      <p>
        Choose the management license that best suits your Wi-Fi deployment needs. 
        Both options provide comprehensive cloud management with different feature sets.
      </p>
      
      <div className={styles.licensesGrid}>
        <button
          type="button"
          className={`${styles.licenseCard} ${
            selectedWifiLicense === 'Standard Wi-Fi' ? styles.selected : ''
          }`}
          onClick={() => onSelectWifiLicense && onSelectWifiLicense('Standard Wi-Fi')}
        >
          <h3>Standard Wi-Fi</h3>
          <p>
            A standard license for Wi-Fi in WatchGuard Cloud offers basic Cloud management features 
            including 24-hour reporting, comprehensive 24/7 support, diagnostics, inventory management 
            and beyond.
          </p>
        </button>

        <button
          type="button"
          className={`${styles.licenseCard} ${
            selectedWifiLicense === 'USP Wi-Fi' ? styles.selected : ''
          }`}
          onClick={() => onSelectWifiLicense && onSelectWifiLicense('USP Wi-Fi')}
        >
          <h3>Unified Security Platform® (USP) Wi-Fi</h3>
          <p>
            WatchGuard USP licenses for Wi-Fi in WatchGuard Cloud offer everything included in 
            standard licenses plus 30 days of reporting, VPN configuration, advanced PSA integration 
            and much more.
          </p>
          <span className={styles.recommendedBadge}>Recommended</span>
        </button>
      </div>

      {/* Collapsible Feature Comparison Table */}
      <div className={styles.comparisonSection}>
        <button
          type="button"
          className={styles.collapseToggle}
          onClick={() => setTableOpen((prev) => !prev)}
          aria-expanded={tableOpen}
        >
          <span>Compare Wi-Fi License Features</span>
          <span className={`${styles.arrow} ${tableOpen ? styles.open : ''}`}>▼</span>
        </button>

        {tableOpen && (
          <div className={styles.tableWrapper}>
            <table className={styles.featureTable}>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Standard Wi-Fi</th>
                  <th>USP Wi-Fi</th>
                </tr>
              </thead>
              <tbody>
                {wifiFeatures.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.feature}</td>
                    <td className={styles.checkCell}>
                      {row.standard ? <span className={styles.check}>✓</span> : ''}
                    </td>
                    <td className={styles.checkCell}>
                      {row.usp ? <span className={styles.check}>✓</span> : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={styles.disclaimer}>
              *Features included in the Unified Security Platform license will be determined by WatchGuard. 
              Some features may require additional products from WatchGuard to work.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default WifiSubscriptions;
