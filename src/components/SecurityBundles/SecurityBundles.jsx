import React from 'react';
import styles from './SecurityBundles.module.css';

function SecurityBundles({
  selectedService,
  onSelectService,
  applianceOnly,
  onToggleApplianceOnly,
  availableServices,
  applianceOnlyAvailable = true,
}) {
  const isServiceAvailable = (service) => {
    if (!availableServices) return true;
    return availableServices.includes(service);
  };

  return (
    <section className={styles.section}>
      <h2>Select Your Security Service Subscription</h2>
      <p>
        Find out what fits your network&apos;s needs. Designed for maximum protection against
        sophisticated threats, our Firebox security services are packaged to remove the guesswork
        from network security.
      </p>

      <label
        className={`${styles.applianceOnlyOption} ${applianceOnly ? styles.selectedOption : ''}`}
      >
        <input
          type="checkbox"
          checked={!!applianceOnly}
          onChange={(e) => onToggleApplianceOnly && onToggleApplianceOnly(e.target.checked)}
          disabled={!applianceOnlyAvailable}
        />
        <span className={styles.applianceOnlyText}>
          <strong>Buying appliance only</strong>
          <small>Purchase device without security subscription</small>
        </span>
      </label>
      <div className={styles.bundlesGrid}>
        <button
          type="button"
          className={`${styles.bundleCard} ${
            selectedService === 'Standard Support' ? styles.selected : ''
          }`}
          onClick={() => isServiceAvailable('Standard Support') && onSelectService && onSelectService('Standard Support')}
          disabled={!isServiceAvailable('Standard Support')}
        >
          <h3>Standard Support</h3>
          <p>
            In addition to stateful firewalling, the <strong>Standard Support</strong> license
            includes centralized management, full VPN capabilities, 24x7 support that shows up, and
            built-in SD-WAN.
          </p>
          <span className={styles.includedBadge}>Included with all appliances</span>
        </button>

        <button
          type="button"
          className={`${styles.bundleCard} ${
            selectedService === 'Basic Security' ? styles.selected : ''
          }`}
          onClick={() => isServiceAvailable('Basic Security') && onSelectService && onSelectService('Basic Security')}
          disabled={!isServiceAvailable('Basic Security')}
        >
          <h3>Basic Security Suite</h3>
          <p>
            The <strong>Basic Security Suite</strong> offers essential network security features
            you&apos;d expect from a UTM device, such as intrusion prevention, antivirus, URL
            filtering, application control, spam blocking, and reputation checks. Plus, it provides
            centralized management, network visibility, and round-the-clock support.
          </p>
        </button>

        <button
          type="button"
          className={`${styles.bundleCard} ${
            selectedService === 'Total Security' ? styles.selected : ''
          }`}
          onClick={() => isServiceAvailable('Total Security') && onSelectService && onSelectService('Total Security')}
          disabled={!isServiceAvailable('Total Security')}
        >
          <h3>Total Security Suite</h3>
          <p>
            The <strong>Total Security Suite</strong> offers all the features of the Basic Security
            Suite, plus advanced protections such as advanced malware detection, ThreatSync (XDR),
            improved network visibility, endpoint security, cloud sandboxing, DNS filtering, and
            real-time threat response directly from WatchGuard Cloud, our centralized management
            hub.
          </p>
        </button>
      </div>
    </section>
  );
}

export default SecurityBundles;
