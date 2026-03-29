# NDR Tab Content Design

**Date:** 2026-03-29
**Status:** Approved
**Scope:** Approach B — Essential sections (comparison table + capabilities + metrics)

## Context

The MDR/NDR tab (`MdrNdrCatalog.jsx`) has a fully built MDR section with 6 content sections. The NDR section is a placeholder ("coming soon"). All NDR SKU data is already loaded and product cards render with pricing. This design adds surrounding content sections to make the NDR tab production-ready.

## Products (Good-Better-Best Order)

1. **ThreatSync+ SaaS** — Office 365 application monitoring, lightweight entry point
2. **ThreatSync+ NDR** — Full-spectrum AI-powered NDR for network, cloud, and on-prem
3. **Total NDR** — Everything in NDR + compliance reporting

Product cards and comparison table columns follow this left-to-right order.

## Changes

### 1. Remove Tab Counts

Remove the "(3)" count from MDR and NDR tab buttons. Currently shows "MDR (3)" and "NDR (3)" — change to just "MDR" and "NDR".

### 2. NDR Banner Header

- **Headline:** "AI-Powered Network Detection and Response"
- **Description:** "Gain complete visibility across your network — from Firebox appliances to third-party infrastructure and cloud workloads. WatchGuard NDR uses multi-layer neural networks and flow-based ML to detect threats like lateral movement, ransomware, and command-and-control traffic — no SOC required."
- Uses existing NDR gradient fallback (dark blue: #0a1628 → #1a2744 → #1e6f9f)

### 3. NDR Comparison Table

**Headline:** "Which NDR Solution Is Right for You?"
**Subtitle:** "From SaaS application monitoring to full-spectrum network detection with compliance reporting."

Columns: ThreatSync+ SaaS | ThreatSync+ NDR | Total NDR

**Network Monitoring**
| Feature | SaaS | NDR | Total |
|---------|:---:|:---:|:---:|
| Firebox network activity (incl. VPN, DHCP) | — | Yes | Yes |
| NetFlow/Flow logs (any switch, router, firewall) | — | Yes | Yes |
| DHCP logs from Active Directory | — | Yes | Yes |
| Cloud workload flow logs (Azure, AWS, IONOS) | — | Yes | Yes |
| Office 365 application logs | Yes | — | — |

**Response Actions**
| Feature | SaaS | NDR | Total |
|---------|:---:|:---:|:---:|
| Block IP on Firebox | — | Yes | Yes |
| Block device via WatchGuard EPDR | Yes | Yes | Yes |
| Disable users via AD or AuthPoint | Yes | Yes | Yes |

**Reporting**
| Feature | SaaS | NDR | Total |
|---------|:---:|:---:|:---:|
| Executive Summary report | Yes | Yes | Yes |
| Ransomware Prevention report | — | Yes | Yes |
| Defense Goal reports | — | Yes | Yes |
| Compliance reports | — | — | Yes |

### 4. Key Capabilities (6 Cards)

| Phosphor Icon | Title | Description |
|---------------|-------|-------------|
| MagnifyingGlass | AI-Driven Threat Detection | Multi-layer neural networks analyze network flows to catch threats signature-based tools miss. |
| ShieldWarning | Ransomware Prevention | Early-stage detection of ransomware behaviors with guided remediation before encryption begins. |
| ArrowsOutCardinal | Lateral Movement Detection | Spot attackers moving between systems — even across network segments and VPN tunnels. |
| Cloud | Cloud Workload Monitoring | Monitor flow logs from Azure, AWS, and IONOS alongside on-premises network traffic. |
| Desktop | Rogue Device Discovery | Identify unmanaged and unauthorized devices on your network with continuous visibility. |
| Lightning | Automated Response | Integrated with ThreatSync XDR to block IPs, isolate devices, and disable compromised users. |

### 5. Metrics Bar (4 Stats)

| Value | Label |
|-------|-------|
| 100% | Cloud-Native |
| Weeks → Hours | Threat response time |
| Zero | On-prem hardware required |
| Full Stack | Network + Cloud + SaaS visibility |

## Files to Modify

1. **`src/components/MdrNdrCatalog/MdrNdrCatalog.jsx`** — Replace NdrContent placeholder with real sections; remove tab counts; reorder NDR products
2. **`src/components/MdrNdrCatalog/hooks/useMdrNdrData.js`** — Reorder NDR products array (SaaS, NDR, Total NDR)
3. **`src/components/MdrNdrCatalog/MdrNdrCatalog.module.css`** — Add styles for new NDR sections (reuse MDR patterns where possible)

## Out of Scope

- Banner image (gradient fallback is fine)
- Product JSON enrichment (specs/features in static data files)
- Rebranding ThreatSync+ → WatchGuard NDR (SKU names stay as-is)
- "Why WatchGuard", testimonial, or attack surface sections
