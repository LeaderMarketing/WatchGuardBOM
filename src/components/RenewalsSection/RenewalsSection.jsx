import React from 'react';
import styles from './RenewalsSection.module.css';

function RenewalsSection() {
  return (
    <section className={styles.section}>
      <h2>Renewals &amp; Upgrades</h2>
      <p className={styles.intro}>
        Renew, upgrade, or trade in your WatchGuard Firebox and services with expert guidance and
        fast activation.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.imagePlaceholder}>Add image</div>
          <div>
            <h3>Renewals &amp; Upgrades</h3>
            <p>
              Renew Total Security, Basic Security, Standard Support, and individual services. Fast
              activation and expert help from a WatchGuard Gold Distributor.
            </p>
            <button className={styles.btnPrimary}>Renew or Upgrade Licence</button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.imagePlaceholder}>Add image</div>
          <div>
            <h3>Trade Up Program</h3>
            <p>
              Upgrade from an older WatchGuard appliance to the latest model at up to 25% off. Retire
              your old device and boost your security.
            </p>
            <button className={styles.btnPrimary}>Trade Up Appliance</button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.imagePlaceholder}>Add image</div>
          <div>
            <h3>Competitive Trade-In</h3>
            <p>
              Switch from another vendor and upgrade to a WatchGuard Firebox. Get the latest security
              with special pricing and offers.
            </p>
            <button className={styles.btnPrimary}>Switch to WatchGuard</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RenewalsSection;
