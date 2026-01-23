// Get base URL for assets (handles GitHub Pages subdirectory)
const BASE_URL = import.meta.env.BASE_URL;

// Helper to get full image path
const img = (path) => `${BASE_URL}products/${path}`;

export const productData = {
  tabletop: {
    products: [
      { name: 'Firebox T115-W', image: img('T115-W.jpg'), description: 'Entry-level firewall with built-in Wi-Fi 7 for small offices' },
      { name: 'Firebox T125', image: img('T125.jpg'), description: 'Compact UTM appliance for small business networks' },
      { name: 'Firebox T125-W', image: img('T125-W.jpg'), description: 'Compact UTM appliance with built-in Wi-Fi 7 antennas' },
      { name: 'Firebox T145', image: img('T145.jpg'), description: 'Mid-range tabletop firewall with SFP+ connectivity' },
      { name: 'Firebox T185', image: img('T185.jpg'), description: 'High-performance tabletop for growing businesses' },
      { name: 'Firebox T185 (High Availability)', image: img('T185.jpg'), description: 'Pair this with a fully licensed T185' }
    ],
    sections: [
      {
        title: 'Overview',
        rows: [{ label: 'Ideal For', values: ['5 Users', '25 Users', '25 Users', '50 Users', '100 Users', '100 Users'] }]
      },
      {
        title: 'Performance',
        rows: [
          { label: 'UTM (Full Scan)', values: ['280 Mbps', '510 Mbps', '510 Mbps', '710 Mbps', '1.83 Gbps', '1.83 Gbps'] },
          { label: 'Firewall (UDP 1518)', values: ['1.02 Gbps', '2.28 Gbps', '2.28 Gbps', '3.9 Gbps', '7.9 Gbps', '7.9 Gbps'] },
          { label: 'VPN (UDP 1518)', values: ['640 Mbps', '1.44 Gbps', '1.44 Gbps', '1.94 Gbps', '5.8 Gbps', '5.8 Gbps'] },
          { label: 'VPN (IMIX)', values: ['210 Mbps', '480 Mbps', '480 Mbps', '680 Mbps', '1.14 Gbps', '1.14 Gbps'] },
          { label: 'AntiVirus', values: ['450 Mbps', '880 Mbps', '880 Mbps', '1.06 Gbps', '3 Gbps', '3 Gbps'] },
          { label: 'IPS (Full Scan)', values: ['375 Mbps', '725 Mbps', '725 Mbps', '1.03 Gbps', '2.41 Gbps', '2.41 Gbps'] },
          { label: 'HTTPS (Full Scan)', values: ['140 Mbps', '270 Mbps', '270 Mbps', '380 Mbps', '1 Gbps', '1 Gbps'] }
        ]
      },
      {
        title: 'VPN Tunnels',
        rows: [
          { label: 'Branch Office VPN Tunnels', values: ['5', '10', '10', '25', '100', '100'] },
          { label: 'Mobile VPN', values: ['5', '10', '10', '25', '100', '100'] }
        ]
      },
      {
        title: 'Hardware',
        rows: [
          {
            label: 'Interfaces & Modules',
            values: [
              '3 x 1 Gb',
              '1 x 2.5 Gb, 4 x 1 Gb',
              '1 x 2.5 Gb, 4 x 1 Gb',
              '1 x 2.5 Gb, 4 x 1 Gb, 1 x SFP/SFP+',
              '4 x 1 Gb, 4 x 2.5 Gbps, 1 x SFP/SFP+',
              '4 x 1 Gb, 4 x 2.5 Gbps, 1 x SFP/SFP+'
            ]
          },
          {
            label: 'Wireless Models',
            values: [
              'T115-W comes with Wi-Fi 7',
              'N/A',
              'Comes with Wi-Fi 7',
              'T145-W comes with Wi-Fi 7',
              'N/A',
              'N/A'
            ]
          }
        ]
      },
      {
        title: 'Networking Features',
        rows: [
          { label: 'VLAN', values: ['Unrestricted', 'Unrestricted', 'Unrestricted', 'Unrestricted', 'Unrestricted', 'Unrestricted'] },
          { label: 'SD-WAN Dynamic Path Selection', values: ['✓', '✓', '✓', '✓', '✓', '✓'] }
        ]
      }
    ]
  },
  'm-series': {
    products: [
      { name: 'Firebox M295', image: img('m295.jpg'), description: 'Rackmount UTM for medium-sized businesses' },
      { name: 'Firebox M395', image: img('m395.jpg'), description: 'High-throughput firewall for demanding networks' },
      { name: 'Firebox M495', image: img('m495.jpg'), description: 'Enterprise-grade security with modular expansion' },
      { name: 'Firebox M595', image: img('m595.jpg'), description: 'Advanced threat protection for large organizations' },
      { name: 'Firebox M695', image: img('m695.jpg'), description: 'Maximum performance rackmount appliance' },
      { name: 'Firebox M4800', image: img('m4800.jpg'), description: 'Data center firewall with 40Gb fiber options' },
      { name: 'Firebox M5800', image: img('m5800.jpg'), description: 'Enterprise flagship with unrestricted VPN tunnels' }
    ],
    sections: [
      {
        title: 'Overview',
        rows: [
          {
            label: 'Ideal For',
            values: [
              '100 Users',
              '250 Users',
              '500 Users',
              '850 Users',
              '1250 Users',
              '2500 Users',
              '7500 Users'
            ]
          }
        ]
      },
      {
        title: 'Performance',
        rows: [
          {
            label: 'UTM (Full Scan)',
            values: ['1.85 Gbps', '3 Gbps', '6.3 Gbps', '7.2 Gbps', '10.2 Gbps', '6.8 Gbps', '11.3 Gbps']
          },
          {
            label: 'Firewall (UDP 1518)',
            values: ['7.9 Gbps', '20 Gbps', '37 Gbps', '43 Gbps', '45 Gbps', '49.6 Gbps', '87 Gbps']
          },
          {
            label: 'VPN (UDP 1518)',
            values: ['5.8 Gbps', '8.1 Gbps', '10 Gbps', '11.5 Gbps', '13 Gbps', '16.4 Gbps', '18.8 Gbps']
          },
          {
            label: 'VPN (IMIX)',
            values: ['1.8 Gbps', '2.55 Gbps', '3 Gbps', '3.5 Gbps', '4 Gbps', '4.4 Gbps', '5.2 Gbps']
          },
          {
            label: 'AntiVirus',
            values: ['3 Gbps', '5.9 Gbps', '6.3 Gbps', '7.6 Gbps', '11.5 Gbps', '12.5 Gbps', '22 Gbps']
          },
          {
            label: 'IPS (Full Scan)',
            values: ['2.41 Gbps', '4.5 Gbps', '7.4 Gbps', '9.4 Gbps', '10.8 Gbps', '8.1 Gbps', '12.5 Gbps']
          },
          {
            label: 'HTTPS (Full Scan)',
            values: ['1.12 Gbps', '1.9 Gbps', '3.5 Gbps', '4.8 Gbps', '5.2 Gbps', '4.2 Gbps', '4.9 Gbps']
          }
        ]
      },
      {
        title: 'VPN Tunnels',
        rows: [
          {
            label: 'Branch Office VPN Tunnels',
            values: ['100', '350', '800', '1200', '2000', '5,000', 'Unrestricted']
          },
          {
            label: 'Mobile VPN',
            values: ['100', '350', '800', '1200', '2000', '10,000', 'Unrestricted']
          }
        ]
      },
      {
        title: 'Hardware',
        rows: [
          {
            label: 'Interfaces & Modules',
            values: [
              '4x2.5Gb, 4x1Gb, 2xSFP+',
              '2.5Gbps RJ45 x 12, 10Gbps SFP x 2, 10Gbps SFP+ x 2',
              '2.5Gbps RJ45 x 12, 10Gbps RJ45 x 2, 10Gbps SFP x 2, 10Gbps SFP+ x 4',
              '2.5Gbps RJ45 x 12, 10Gbps RJ45 x 2, 10Gbps SFP x 2, 10Gbps SFP+ x 4',
              '2.5Gbps RJ45 x 12, 10Gbps RJ45 x 2, 10Gbps SFP x 2, 10Gbps SFP+ x 4',
              '8x1Gb (included), Optional 8x1Gb, 8x1Gb fiber, 4x10Gb fiber, 2x40Gb fiber',
              '8x1Gb, 4x10Gb fiber (included), Optional 8x1Gb, 8x1Gb fiber, 4x10Gb fiber, 2x40Gb fiber'
            ]
          },
          {
            label: 'Wireless Models',
            values: ['N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A']
          }
        ]
      },
      {
        title: 'Networking Features',
        rows: [
          {
            label: 'VLAN',
            values: ['Unrestricted', 'Unrestricted', 'Unrestricted', 'Unrestricted', 'Unrestricted', '1,000', 'Unrestricted']
          },
          {
            label: 'SD-WAN Dynamic Path Selection',
            values: ['✓', '✓', '✓', '✓', '✓', '✓', '✓']
          }
        ]
      }
    ]
  },
  wifi6: {
    indoor: {
      products: [
        { name: 'AP130', image: img('AP130.jpg'), description: 'Entry-level Wi-Fi 6 for small offices and remote workers' },
        { name: 'AP230W', image: img('AP230W.jpg'), description: 'Wall-plate AP with built-in switch for hospitality' },
        { name: 'AP330', image: img('AP330.jpg'), description: 'Medium-density AP for retail and K-12 schools' },
        { name: 'AP432', image: img('AP432.jpg'), description: 'High-density 4x4 AP for large campuses' }
      ],
      sections: [
        {
          title: 'Overview',
          rows: [
            {
              label: 'Recommended Use Cases',
              values: [
                'Low-density for indoor environments such as small offices, remote workers, and meeting rooms',
                'Low- to medium-density indoor environments like hospitality, classrooms, multi-unit dwellings, and conference rooms.',
                'Medium-density for retail, point of sale systems in retail, K-12 schools, and offices',
                'High-density indoor environments, including expansive offices, large corporate or education campuses'
              ]
            }
          ]
        },
        {
          title: 'Technical Specs',
          rows: [
            {
              label: 'Radios & Streams',
              values: [
                'Wi-Fi 6 2x2',
                'Wi-Fi 6 2x2 w/ 2x2 Dedicated Scanning Security Radio',
                'Wi-Fi 6 2x2 w/ 2x2 Dedicated Scanning Security Radio',
                'Wi-Fi 6 4x4'
              ]
            },
            {
              label: 'Number of Antennas',
              values: [
                '4 Internal Omnidirectional',
                '3 Internal Omnidirectional',
                '6 Internal Omnidirectional',
                '8 Internal Omnidirectional'
              ]
            },
            {
              label: 'Maximum Data Rate',
              values: [
                '1201 Mbps / 574 Mbps',
                '1201 Mbps / 574 Mbps',
                '1201 Mbps / 574 Mbps',
                '2402 Mbps / 1148 Mbps'
              ]
            },
            {
              label: 'Ports',
              values: [
                '1 x 1Gbps (PoE+)',
                'Uplink: 1 x 1 Gbps (PoE+), Extension: 4 x 1 Gbps',
                '1 x 2.5 Gbps (PoE+)',
                '1 x 2.5 Gbps (PoE+)'
              ]
            },
            {
              label: 'Power Consumption',
              values: [
                'Peak: 10.9W<br>Average: 10.5W',
                'Peak: 13.19W<br>Average: 10.5W',
                'Peak: 15.9W<br>Average: 15.5W',
                'Peak: 19.5W<br>Average: 11.65W'
              ]
            },
            {
              label: 'Mounting Options (Included)',
              values: [
                'T-Bar Ceiling<br>Flat Surface Mount',
                'Flat Surface Mount',
                'T-Bar Ceiling<br>Flat Surface Mount',
                'T-Bar Ceiling<br>Flat Surface Mount'
              ]
            },
            {
              label: 'Optional Accessories',
              values: [
                'Universal Standing Bracket<br>802.3at PoE+ Injector',
                'Universal Standing Bracket<br>802.3at PoE+ Injector',
                'Universal Standing Bracket<br>802.3at PoE+ Injector',
                'Universal Standing Bracket<br>802.3at PoE+ Injector'
              ]
            }
          ]
        }
      ]
    },
    outdoor: {
      products: [
        { name: 'AP332CR', image: img('AP332CER.jpg'), description: 'Rugged outdoor AP for retail and manufacturing' },
        { name: 'AP430CR', image: img('AP430CR.jpg'), description: 'High-density outdoor AP for stadiums and campuses' }
      ],
      sections: [
        {
          title: 'Overview',
          rows: [
            {
              label: 'Recommended Use Cases',
              values: [
                'Medium-density for rugged or outdoor environments such as commercial retail, K-12 schools, manufacturing, and offices',
                'High-density for rugged or outdoor environments such as expansive campuses, manufacturing, stadiums, and hospital facilities'
              ]
            }
          ]
        },
        {
          title: 'Technical Specs',
          rows: [
            {
              label: 'Radios & Streams',
              values: [
                'Wi-Fi 6 2x2',
                'Wi-Fi 6 4x4<br>w/ 2x2 Dedicated Scanning Security Radio'
              ]
            },
            {
              label: 'Number of Antennas',
              values: [
                '4 External Omnidirectional (antennas included)',
                '6 External N-Type Connectors (antennas required, sold separately)'
              ]
            },
            {
              label: 'Maximum Data Rate',
              values: ['1201 Mbps / 574 Mbps', '2402 Mbps (4x4) / 574 Mbps (2x2)']
            },
            {
              label: 'Ports',
              values: ['1 x 2.5 Gbps (PoE+)', '1 x 5 Gbps (PoE+)<br>1 x 1 Gbps']
            },
            {
              label: 'Power Consumption',
              values: ['Peak: 15.9W<br>Average: 11.65W', 'Peak: 21.3W<br>Average: 16W']
            },
            {
              label: 'Mounting Options (Included)',
              values: ['Flat Surface Mount<br>Pole Mount', 'Flat Surface Mount<br>Pole Mount']
            },
            {
              label: 'Optional Accessories',
              values: ['802.3at PoE+ Injector', '802.3at PoE+ Injector']
            }
          ]
        }
      ]
    }
  }
};
