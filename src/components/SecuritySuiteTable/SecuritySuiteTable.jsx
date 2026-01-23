import React, { useState } from 'react';
import styles from './SecuritySuiteTable.module.css';

function SecuritySuiteTable() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className={styles.section}>
      <button
        className={styles.toggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <span>Compare Security Suite Features</span>
        <span className={styles.icon}>▼</span>
      </button>

      {expanded && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Standard Support</th>
                <th>Basic Security</th>
                <th>Total Security</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Stateful Firewall</strong>
                  <br />
                  a stateful firewall tracks active connections to distinguish legitimate traffic
                  from malicious attempts, providing enhanced security
                </td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>VPN</strong>
                  <br />
                  a virtual private network (VPN) creates an encrypted, private connection over
                  the public internet
                </td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>SD-WAN</strong>
                  <br />
                  software-defined WAN (SD-WAN) automatically manages network traffic across
                  multiple WAN connections according to defined policies
                </td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Access Portal</strong>
                  <br />
                  a clientless VPN solution that enables safe remote access to essential web
                  applications from anywhere
                </td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Intrusion Prevention Service (IPS)</strong>
                  <br />
                  IPS uses constantly updated signatures to monitor all major protocols, ensuring
                  real-time protection against network threats
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Application Control</strong>
                  <br />
                  controls access to applications by granting, denying, or limiting permissions
                  based on a user's department, role, and the time of day, enhancing security and
                  operational efficiency
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>WebBlocker</strong>
                  <br />
                  automatically blocks known malicious sites and uses detailed content and URL
                  filtering tools to prevent inappropriate content, save bandwidth, and boost
                  productivity
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>spamBlocker</strong>
                  <br />
                  provides real-time, continuous, and highly reliable protection from spam and
                  phishing attempts
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Gateway AntiVirus</strong>
                  <br />
                  detects and blocks spyware, viruses, trojans, worms, rogueware, and complex
                  threats, including the latest variants of known viruses
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Reputation Enabled Defense</strong>
                  <br />
                  cloud-based web reputation service that aggregates data from multiple feeds to
                  provide real-time protection from malicious sites and botnets
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>Network Discovery</strong>
                  <br />
                  generates a visual map of all nodes on your network, ensuring only authorized
                  devices are connected while detecting all open ports and protocols
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>APT Blocker</strong>
                  <br />
                  detects and stops the most sophisticated attacks, including ransomware, zero-day
                  threats, and other advanced malware
                </td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>DNSWatch</strong>
                  <br />
                  blocks malicious DNS requests, redirects users to a secure, informative page, and
                  promotes best security practices to prevent phishing attacks and reduce malware
                  infections
                </td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>IntelligentAV</strong>
                  <br />
                  automates malware discovery and classify current and future threats in mere
                  seconds with AI-powered intelligence
                </td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>ThreatSync (XDR)</strong>
                  <br />
                  AI-driven threat detection and response for advanced threats, including
                  ransomware, supply chain, and vulnerability-based attacks
                </td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>EDR Core</strong>
                  <br />
                  continuous AI-powered endpoint monitoring for suspicious activity that detects
                  threats in real time, and enables rapid investigation and response
                </td>
                <td></td>
                <td></td>
                <td>✓</td>
              </tr>
              <tr>
                <td>
                  <strong>WatchGuard Cloud</strong>
                  <br />
                  securely stores firewall logs and reports for easy access, analysis, and
                  compliance
                </td>
                <td></td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr className={styles.subRow}>
                <td className={styles.subLabel}>Log Data Retention:</td>
                <td></td>
                <td className={styles.textCell}>90 Days</td>
                <td className={styles.textCell}>365 Days</td>
              </tr>
              <tr className={styles.subRow}>
                <td className={styles.subLabel}>Report Data Retention:</td>
                <td></td>
                <td className={styles.textCell}>1 Day</td>
                <td className={styles.textCell}>30 Days</td>
              </tr>
              <tr>
                <td>
                  <strong>Support</strong>
                  <br />
                  Access to live personal support, video tutorials, training, and online tools to
                  ensure continuous and dependable support for partners and customers
                </td>
                <td className={styles.textCell}>Standard (24x7)</td>
                <td className={styles.textCell}>Standard (24x7)</td>
                <td className={styles.goldText}>Gold (24x7)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default SecuritySuiteTable;
