import React from 'react';
import styles from './MDRSection.module.css';

function MDRSection() {
  return (
    <div className={styles.section}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>🛡️</div>
        <h2>Managed Detection and Response</h2>
        <p>
          WatchGuard MDR provides 24/7 threat monitoring, detection, and response 
          services powered by a team of elite security experts.
        </p>
        <div className={styles.comingSoon}>
          <span>Configuration options coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default MDRSection;
