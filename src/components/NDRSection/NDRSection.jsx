import React from 'react';
import styles from './NDRSection.module.css';

function NDRSection() {
  return (
    <div className={styles.section}>
      <div className={styles.placeholder}>
        <div className={styles.icon}>🔍</div>
        <h2>Network Detection and Response</h2>
        <p>
          WatchGuard NDR uses AI-powered analytics to detect and respond to 
          advanced threats hiding in your network traffic.
        </p>
        <div className={styles.comingSoon}>
          <span>Configuration options coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default NDRSection;
