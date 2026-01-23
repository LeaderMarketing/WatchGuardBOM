import React from 'react';
import styles from './TopLevelNav.module.css';
import { navigationConfig } from '../../data/navigationConfig.js';

function TopLevelNav({ activeSection, onSectionChange }) {
  const handleTabClick = (sectionId) => {
    // Update hash in URL
    window.location.hash = sectionId;
    onSectionChange(sectionId);
  };

  return (
    <nav className={styles.topNav}>
      <div className={styles.tabContainer}>
        {navigationConfig.map((section) => (
          <button
            key={section.id}
            className={`${styles.tab} ${activeSection === section.id ? styles.active : ''}`}
            onClick={() => handleTabClick(section.id)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default TopLevelNav;
