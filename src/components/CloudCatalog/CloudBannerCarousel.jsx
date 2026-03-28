import React, { useState, useEffect, useRef } from 'react';
import styles from '../VirtualCatalog/VirtualCatalog.module.css';

// Gradient fallbacks per service (used when banner images aren't available)
const SERVICE_GRADIENTS = {
  WebBlocker: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'Gateway AntiVirus': 'linear-gradient(135deg, #1a1a2e 0%, #1b2d3d 50%, #0d4a4a 100%)',
  'Intrusion Prevention Service': 'linear-gradient(135deg, #1a1a2e 0%, #1e3a2f 50%, #1a5c3a 100%)',
  'Reputation Enabled Defense': 'linear-gradient(135deg, #1a1a2e 0%, #3d2d1b 50%, #5c3a1a 100%)',
  'Application Control': 'linear-gradient(135deg, #1a1a2e 0%, #2e1a2e 50%, #4a1a5c 100%)',
  'APT Blocker': 'linear-gradient(135deg, #1a1a2e 0%, #3d1b1b 50%, #5c1a1a 100%)',
};

// Banner data: 6 Cloud individual subs (no spamBlocker, no Network Discovery)
const BANNERS = [
  {
    key: 'WebBlocker',
    headline: 'WebBlocker',
    subheadline: 'URL and content filtering to block access to malicious and inappropriate websites — keeping your cloud network safe from web-based threats.',
    bg: '/WatchGuardBOM/banners/webblocker-bg.jpg',
    hero: '/WatchGuardBOM/banners/webblocker-hero.png',
  },
  {
    key: 'Gateway AntiVirus',
    headline: 'Gateway AntiVirus',
    subheadline: 'Signature-based antivirus scanning at the gateway to catch known threats before they reach your cloud workloads.',
    bg: '/WatchGuardBOM/banners/gav-bg.jpg',
    hero: '/WatchGuardBOM/banners/gav-hero.png',
  },
  {
    key: 'Intrusion Prevention Service',
    headline: 'Intrusion Prevention Service',
    subheadline: 'Network-based IPS to detect and block exploit attempts in real time, protecting against known vulnerabilities.',
    bg: '/WatchGuardBOM/banners/ips-bg.jpg',
    hero: '/WatchGuardBOM/banners/ips-hero.png',
  },
  {
    key: 'Reputation Enabled Defense',
    headline: 'Reputation Enabled Defense',
    subheadline: 'Cloud-based reputation lookup to block traffic from known bad sources, reducing attack surface instantly.',
    bg: '/WatchGuardBOM/banners/red-bg.jpg',
    hero: '/WatchGuardBOM/banners/red-hero.png',
  },
  {
    key: 'Application Control',
    headline: 'Application Control',
    subheadline: 'Granular control over 1,800+ applications to enforce usage policies and prevent shadow IT.',
    bg: '/WatchGuardBOM/banners/appcontrol-bg.jpg',
    hero: '/WatchGuardBOM/banners/appcontrol-hero.png',
  },
  {
    key: 'APT Blocker',
    headline: 'APT Blocker',
    subheadline: 'Full-system sandbox analysis to identify advanced zero-day malware that evades traditional signature-based detection.',
    bg: '/WatchGuardBOM/banners/aptblocker-bg.jpg',
    hero: '/WatchGuardBOM/banners/aptblocker-hero.png',
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function CloudBannerCarousel({ onScrollTo }) {
  const [active, setActive] = useState(0);
  const [bgFailed, setBgFailed] = useState({});
  const timer = useRef();

  useEffect(() => {
    timer.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % BANNERS.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearTimeout(timer.current);
  }, [active]);

  // Pre-check if background image exists
  useEffect(() => {
    BANNERS.forEach((b) => {
      const img = new Image();
      img.onerror = () => setBgFailed((prev) => ({ ...prev, [b.key]: true }));
      img.src = b.bg;
    });
  }, []);

  const goTo = (i) => setActive(i);
  const banner = BANNERS[active];
  const useFallback = bgFailed[banner.key];
  const bgStyle = useFallback
    ? { background: SERVICE_GRADIENTS[banner.key] }
    : { backgroundImage: `url(${banner.bg})` };

  return (
    <div className={styles.bannerCarousel} style={bgStyle}>
      <div className={styles.bannerCarouselOverlay} />
      <div className={styles.bannerCarouselContent}>
        <div className={styles.bannerCarouselText}>
          <h2>{banner.headline}</h2>
          <p>{banner.subheadline}</p>
          <button
            className={styles.bannerCarouselCta}
            onClick={() => onScrollTo?.(banner.key)}
          >
            Learn more
          </button>
        </div>
        {!useFallback && (
          <div className={styles.bannerCarouselHeroWrap}>
            <img
              src={banner.hero}
              alt={banner.headline}
              className={styles.bannerCarouselHero}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>
      <div className={styles.bannerCarouselBullets}>
        {BANNERS.map((b, i) => (
          <button
            key={b.key}
            className={i === active ? styles.bannerCarouselBulletActive : styles.bannerCarouselBullet}
            onClick={() => goTo(i)}
            aria-label={`Go to ${b.headline}`}
          />
        ))}
      </div>
    </div>
  );
}
