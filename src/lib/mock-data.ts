export const mockDatasets = [
  { id: 'ds_001', name: 'Real-time User Activity', type: 'Stream', status: 'Active', trend: '+12.5%', records: '2.5M', size: '1.2TB', created: '2023-01-15', lastUpdate: 'Live', owner: 'Alex Moran', sensitivity: 'High' },
  { id: 'ds_002', name: 'Product Catalog (Staging)', type: 'Database', status: 'Active', trend: '+5.2%', records: '1.2K', size: '150MB', created: '2023-02-01', lastUpdate: '2023-11-10', owner: 'Data Ops', sensitivity: 'Medium' },
  { id: 'ds_003', name: 'Quarterly Sales Projections', type: 'File', status: 'Active', trend: '-2.4%', records: '850', size: '25MB', created: '2023-03-20', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'High' },
  { id: 'ds_004', name: 'API Gateway Logs (Jan)', type: 'Log', status: 'Archived', trend: '0.0%', records: '150M', size: '25.6TB', created: '2023-01-31', lastUpdate: '2023-02-01', owner: 'DevOps', sensitivity: 'Medium' },
  { id: 'ds_005', name: 'Customer Support Tickets', type: 'Database', status: 'Active', trend: '+18.3%', records: '45.2K', size: '2.2GB', created: '2022-11-10', lastUpdate: '2023-11-11', owner: 'Support Team', sensitivity: 'High' },
  { id: 'ds_006', name: 'Marketing Campaign ROI', type: 'Static', status: 'Active', trend: '+8.1%', records: '5.6K', size: '110MB', created: '2023-04-05', lastUpdate: '2023-10-28', owner: 'Marketing', sensitivity: 'Medium' },
  { id: 'ds_007', name: 'IoT Sensor Data (Factory A)', type: 'Stream', status: 'Paused', trend: 'N/A', records: 'N/A', size: 'N/A', created: '2023-05-15', lastUpdate: '2023-11-05', owner: 'Ops', sensitivity: 'Low' },
  { id: 'ds_008', name: 'Employee Directory', type: 'Database', status: 'Active', trend: '+1.0%', records: '1.8K', size: '90MB', created: '2022-01-01', lastUpdate: '2023-11-11', owner: 'HR', sensitivity: 'High' },
  { id: 'ds_009', name: 'Web Analytics (Main Site)', type: 'Stream', status: 'Error', trend: '-5.5%', records: '800K', size: '500GB', created: '2023-06-01', lastUpdate: '2023-11-12', owner: 'Marketing', sensitivity: 'Medium' },
  { id: 'ds_010', name: 'Financial Transactions Q3', type: 'Static', status: 'Active', trend: '+3.2%', records: '1.1M', size: '1.5GB', created: '2023-10-01', lastUpdate: '2023-11-01', owner: 'Finance Team', sensitivity: 'Confidential' },
];

export const chartData = {
  requests: {
    Month: [
      { name: 'Jan', requests: 4000 }, { name: 'Feb', requests: 3000 }, { name: 'Mar', requests: 2000 },
      { name: 'Apr', requests: 2780 }, { name: 'May', requests: 1890 }, { name: 'Jun', requests: 2390 },
      { name: 'Jul', requests: 3490 }, { name: 'Aug', requests: 3000 }, { name: 'Sep', requests: 3500 },
      { name: 'Oct', requests: 4100 }, { name: 'Nov', requests: 4300 }, { name: 'Dec', requests: 4500 },
    ],
    Week: [
      { name: 'Mon', requests: 820 }, { name: 'Tue', requests: 932 }, { name: 'Wed', requests: 901 },
      { name: 'Thu', requests: 1120 }, { name: 'Fri', requests: 1290 }, { name: 'Sat', requests: 1250 },
      { name: 'Sun', requests: 1100 },
    ],
    Day: [
      { name: '00:00', requests: 110 }, { name: '02:00', requests: 100 }, { name: '04:00', requests: 120 },
      { name: '06:00', requests: 180 }, { name: '08:00', requests: 250 }, { name: '10:00', requests: 300 },
      { name: '12:00', requests: 280 }, { name: '14:00', requests: 310 }, { name: '16:00', requests: 350 },
      { name: '18:00', requests: 320 }, { name: '20:00', requests: 280 }, { name: '22:00', requests: 200 },
    ],
  },
  trending: {
    Month: [
      { name: 'Jan', crypto: 40, shipping: 35, userData: 38 },
      { name: 'Feb', crypto: 42, shipping: 38, userData: 40 },
      { name: 'Mar', crypto: 55, shipping: 60, userData: 45 },
      { name: 'Apr', crypto: 52, shipping: 70, userData: 48 },
      { name: 'May', crypto: 60, shipping: 72, userData: 55 },
      { name: 'Jun', crypto: 75, shipping: 85, userData: 58 },
      { name: 'Jul', crypto: 78, shipping: 88, userData: 65 },
      { name: 'Aug', crypto: 85, shipping: 92, userData: 72 },
      { name: 'Sep', crypto: 92, shipping: 100, userData: 80 },
      { name: 'Oct', crypto: 98, shipping: 108, userData: 85 },
      { name: 'Nov', crypto: 112, shipping: 120, userData: 95 },
      { name: 'Dec', crypto: 120, shipping: 130, userData: 100 },
    ],
    Week: [
      { name: 'Mon', crypto: 80, shipping: 82, userData: 70 },
      { name: 'Tue', crypto: 85, shipping: 85, userData: 72 },
      { name: 'Wed', crypto: 82, shipping: 88, userData: 75 },
      { name: 'Thu', crypto: 88, shipping: 90, userData: 78 },
      { name: 'Fri', crypto: 90, shipping: 95, userData: 80 },
      { name: 'Sat', crypto: 95, shipping: 98, userData: 82 },
      { name: 'Sun', crypto: 98, shipping: 102, userData: 85 },
    ],
    Day: [
      { name: '00:00', crypto: 50, shipping: 40, userData: 30 },
      { name: '04:00', crypto: 55, shipping: 42, userData: 35 },
      { name: '08:00', crypto: 60, shipping: 48, userData: 40 },
      { name: '12:00', crypto: 65, shipping: 55, userData: 42 },
      { name: '16:00', crypto: 70, shipping: 60, userData: 48 },
      { name: '20:00', crypto: 68, shipping: 58, userData: 45 },
    ]
  },
  latency: {
    Month: [
      { name: 'Jan', latency: 30 }, { name: 'Feb', latency: 28 }, { name: 'Mar', latency: 32 },
      { name: 'Apr', latency: 30 }, { name: 'May', latency: 25 }, { name: 'Jun', latency: 22 },
      { name: 'Jul', latency: 24 }, { name: 'Aug', latency: 28 }, { name: 'Sep', latency: 26 },
      { name: 'Oct', latency: 30 }, { name: 'Nov', latency: 32 }, { name: 'Dec', latency: 28 },
    ],
    Week: [
      { name: 'Mon', latency: 32 }, { name: 'Tue', latency: 30 }, { name: 'Wed', latency: 28 },
      { name: 'Thu', latency: 25 }, { name: 'Fri', latency: 28 }, { name: 'Sat', latency: 30 },
      { name: 'Sun', latency: 29 },
    ],
    Day: [
      { name: '00:00', latency: 20 }, { name: '02:00', latency: 22 }, { name: '04:00', latency: 25 },
      { name: '06:00', latency: 30 }, { name: '08:00', latency: 35 }, { name: '10:00', latency: 40 },
      { name: '12:00', latency: 38 }, { name: '14:00', latency: 35 }, { name: '16:00', latency: 32 },
      { name: '18:00', latency: 28 }, { name: '20:00', latency: 25 }, { name: '22:00', latency: 22 },
    ]
  },
  users: {
    Month: [
      { name: 'Jan', users: 500 }, { name: 'Feb', users: 520 }, { name: 'Mar', users: 510 },
      { name: 'Apr', users: 550 }, { name: 'May', users: 580 }, { name: 'Jun', users: 620 },
      { name: 'Jul', users: 650 }, { name: 'Aug', users: 680 }, { name: 'Sep', users: 700 },
      { name: 'Oct', users: 710 }, { name: 'Nov', users: 730 }, { name: 'Dec', users: 750 },
    ],
    Week: [
      { name: 'Mon', users: 680 }, { name: 'Tue', users: 700 }, { name: 'Wed', users: 710 },
      { name: 'Thu', users: 730 }, { name: 'Fri', users: 750 }, { name: 'Sat', users: 740 },
      { name: 'Sun', users: 720 },
    ],
    Day: [
      { name: '00:00', users: 300 }, { name: '02:00', users: 250 }, { name: '04:00', users: 280 },
      { name: '06:00', users: 350 }, { name: '08:00', users: 450 }, { name: '10:00', users: 550 },
      { name: '12:00', users: 600 }, { name: '14:00', users: 620 }, { name: '16:00', users: 650 },
      { name: '18:00', users: 630 }, { name: '20:00', users: 580 }, { name: '22:00', users: 450 },
    ]
  }
};

export const donutData = [
  { name: 'Stream', value: 3, color: '#3b82f6' },   // blue
  { name: 'Database', value: 3, color: '#ec4899' }, // pink
  { name: 'Log', value: 1, color: '#f97316' },     // orange
  { name: 'Static', value: 2, color: '#a855f7' },  // purple
];
