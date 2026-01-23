import React from 'react';
import styles from './FireCloudSection.module.css';

function FireCloudSection() {
  return (
    <div className={styles.section}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>☁️</div>
        <h2>FireCloud Renewals/Upgrades</h2>
        <p>
          Manage your WatchGuard FireCloud subscriptions, renewals, and upgrades 
          for cloud-managed network security.
        </p>
        <div className={styles.comingSoon}>
          <span>Configuration options coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default FireCloudSection;
