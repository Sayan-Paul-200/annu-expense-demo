const generateSubCategoriesBreakdown = () => {
  const categoriesMap: Record<string, string[]> = {
    'Office': ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Legal & Notary Charges', 'Tour & Travel', 'Admin', 'Misc', 'Staff Salary', 'Banking Charges', 'IT Assets'],
    'Compliance': ['CA Fees', 'Taxes & Duties', 'Project Insurance', 'Labour License', 'Registration Expenses', 'Consultancy Charges'],
    'Guest House': ['Rent', 'Maintenance', 'Care Taker Salary', 'Guest House Admin Expenses'],
    'Tender': ['EMD', 'Cost of Tender Document'],
    'Vehicle': ['Vehicle EMI', 'Vehicle Diesel', 'Vehicle Fuel'],
    'Plant & Machinery': ['Equipment EMI', 'Equipment- Diesel', 'Equipment- Insurance', 'Equipment- Maintenance', 'Equipment- Spares', 'Equipment- Transporation', 'Spares- Transporation', 'Equipment - Purchase', 'Equipment - Downpayment'],
    'Material': ['Supply', 'Primary Transportation', 'Secondary Transportation'],
    'Services': ['Vendor Payment', 'Right of Way Payment', 'Labour Charges', 'Site Expenses'],
    'Warehouse': ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Establishment', 'Security', 'IT Assets', 'Labour Charges Loading-Unloading'],
    'Finance': ['Finance Charges'],
  };

  const colors = ['#e7f5ff', '#ebfbee', '#fff3bf', '#ffe3e3', '#f3d9fa', '#e3fafc', '#fff0f6', '#f4fce3', '#e6fcf5', '#fff4e6'];
  const icons = ['🏢', '✅', '🏠', '📄', '🚗', '⚙️', '📦', '🛠️', '🏭', '💰'];

  const breakdown = [];
  let colorIndex = 0;
  for (const [cat, subs] of Object.entries(categoriesMap)) {
    const bgColor = colors[colorIndex % colors.length];
    const icon = icons[colorIndex % icons.length];
    for (const sub of subs) {
      breakdown.push({
        label: sub,
        category: cat,
        value: Math.floor(Math.random() * 50) + 10, // random mock value
        bgColor,
        icon,
      });
    }
    colorIndex++;
  }
  return breakdown;
};

export const dummyDashboardData = {
  kpis: {
    invoiceBasicValue: 2693389705.63,
    invoiceGstAmount: 324120281.14,
    totalInvoiceAmount: 3017509986.77,
    netPayable: 3017509844.77,
    totalPaidByClient: 188307932.84,
    balancePending: 2829201911.93,
  },
  subCategoryBreakdown: generateSubCategoriesBreakdown(),
  totalSubCategoryValue: 1420.0,
  charts: {
    expenseTrend: [
      { month: 'Oct', invoiced: 420.5, paid: 380.0 },
      { month: 'Nov', invoiced: 480.2, paid: 410.5 },
      { month: 'Dec', invoiced: 510.8, paid: 460.2 },
      { month: 'Jan', invoiced: 390.4, paid: 450.0 },
      { month: 'Feb', invoiced: 620.1, paid: 520.8 },
      { month: 'Mar', invoiced: 710.9, paid: 640.5 },
    ],
    topCategories: [
      { name: 'Material', value: 450.5 },
      { name: 'Services', value: 380.2 },
      { name: 'Plant & Mach.', value: 290.8 },
      { name: 'Office', value: 150.4 },
      { name: 'Vehicle', value: 95.0 },
    ],
    statusDistribution: [
      { name: 'Paid', value: 18.8, percentage: 6.2, color: '#22C55E' },
      { name: 'Cancelled', value: 90.9, percentage: 30.1, color: '#EF4444' },
      { name: 'Under Process', value: 99.7, percentage: 33.0, color: '#F59E0B' },
      { name: 'Credit Note Issued', value: 92.4, percentage: 30.6, color: '#3B82F6' },
    ],
    stateWiseAmount: [
      { state: 'State 1', amount: 35 },
      { state: 'State 2', amount: 50 },
      { state: 'State 3', amount: 30 },
      { state: 'State 4', amount: 40 },
      { state: 'State 5', amount: 35 },
      { state: 'State 6', amount: 30 },
      { state: 'State 7', amount: 32 },
    ],
    ageing: [
      { range: '0-15 Days', invoiceDate: 20, submissionDate: 15 },
      { range: '16-30 Days', invoiceDate: 35, submissionDate: 25 },
      { range: '31-45 Days', invoiceDate: 15, submissionDate: 10 },
      { range: '45+ Days', invoiceDate: 10, submissionDate: 5 },
    ],
  },
  filters: {
    businessUnits: ['Telecom', 'Gas Pipelines', 'Sewerage', 'Railways'],
    projects: ['BGCL', 'Bharat Net', 'GAIL', 'NFS', 'NFS AMC', 'STP'],
    states: ['Delhi', 'Bihar', 'Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Meghalaya', 'Jharkhand', 'Madhya Pradesh', 'Goa'],
    categories: ['Office', 'Tender', 'Compliance', 'Guest House', 'Vehicle', 'Plant & Machinery', 'Material', 'Services', 'Warehouse', 'Finance'],
    subCategories: {
      'Office': ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Legal & Notary Charges', 'Tour & Travel', 'Admin', 'Misc', 'Staff Salary', 'Banking Charges', 'IT Assets'],
      'Compliance': ['CA Fees', 'Taxes & Duties', 'Project Insurance', 'Labour License', 'Registration Expenses', 'Consultancy Charges'],
      'Guest House': ['Rent', 'Maintenance', 'Care Taker Salary', 'Guest House Admin Expenses'],
      'Tender': ['EMD', 'Cost of Tender Document'],
      'Vehicle': ['Vehicle EMI', 'Vehicle Diesel', 'Vehicle Fuel'],
      'Plant & Machinery': ['Equipment EMI', 'Equipment- Diesel', 'Equipment- Insurance', 'Equipment- Maintenance', 'Equipment- Spares', 'Equipment- Transporation', 'Spares- Transporation', 'Equipment - Purchase', 'Equipment - Downpayment'],
      'Material': ['Supply', 'Primary Transportation', 'Secondary Transportation'],
      'Services': ['Vendor Payment', 'Right of Way Payment', 'Labour Charges', 'Site Expenses'],
      'Warehouse': ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Establishment', 'Security', 'IT Assets', 'Labour Charges Loading-Unloading'],
      'Finance': ['Finance Charges'],
    } as Record<string, string[]>,
  },
  projectBudgets: [
    { id: 1, name: 'Bharat Net', bu: 'Telecom', allocated: 50000000, utilized: 45000000, status: 'At Risk' },
    { id: 2, name: 'GAIL', bu: 'Gas Pipelines', allocated: 85000000, utilized: 60000000, status: 'On Track' },
    { id: 3, name: 'BGCL', bu: 'Gas Pipelines', allocated: 42000000, utilized: 12000000, status: 'On Track' },
    { id: 4, name: 'NFS', bu: 'Telecom', allocated: 120000000, utilized: 115000000, status: 'Critical' },
    { id: 5, name: 'STP', bu: 'Sewerage', allocated: 35000000, utilized: 34500000, status: 'Critical' },
  ],
  recentInvoices: [
    { sNo: 1, invoiceNo: 'test1223456', date: '31/03/2026', basicAmt: 1500.0, gstAmt: 180.0, totalAmt: 1680.0, deduction: 0.0, netPayable: 1680.0, paid: 0.0, pending: 0.0, status: 'Cancelled' },
    { sNo: 2, invoiceNo: 'test-2', date: '13/02/2026', basicAmt: 100.0, gstAmt: 12.0, totalAmt: 112.0, deduction: 0.0, netPayable: 112.0, paid: 112.0, pending: 0.0, status: 'Paid' },
    { sNo: 3, invoiceNo: 'cgvsFb', date: '13/02/2026', basicAmt: 1520.0, gstAmt: 273.6, totalAmt: 1793.6, deduction: 0.0, netPayable: 1793.6, paid: 0.0, pending: 0.0, status: 'Cancelled' },
    { sNo: 4, invoiceNo: 'test-4', date: '12/02/2026', basicAmt: 1000.0, gstAmt: 100.0, totalAmt: 1100.0, deduction: 100.0, netPayable: 1000.0, paid: 1000.0, pending: 0.0, status: 'Declined' },
    { sNo: 5, invoiceNo: 'hnfg', date: '12/02/2026', basicAmt: 21324.0, gstAmt: 2558.88, totalAmt: 23882.88, deduction: 0.0, netPayable: 23882.88, paid: 0.0, pending: 23882.88, status: 'Under Process' },
    { sNo: 6, invoiceNo: 'test2', date: '11/02/2026', basicAmt: 103230.0, gstAmt: 18581.4, totalAmt: 121811.4, deduction: 10.0, netPayable: 121801.4, paid: 121801.4, pending: 0.0, status: 'Declined' },
    { sNo: 7, invoiceNo: 'cancel', date: '08/02/2026', basicAmt: 123543.0, gstAmt: 0.0, totalAmt: 123543.0, deduction: 0.0, netPayable: 123543.0, paid: 0.0, pending: 0.0, status: 'Cancelled' },
    { sNo: 8, invoiceNo: 'dv', date: '07/02/2026', basicAmt: 1502.0, gstAmt: 150.2, totalAmt: 1652.2, deduction: 0.0, netPayable: 1652.2, paid: 0.0, pending: 0.0, status: 'Cancelled' },
    { sNo: 9, invoiceNo: 'credit', date: '06/02/2026', basicAmt: 14356.0, gstAmt: 0.0, totalAmt: 14356.0, deduction: 0.0, netPayable: 14356.0, paid: 0.0, pending: 0.0, status: 'Credit Note Issued' },
    { sNo: 10, invoiceNo: 'Balance', date: '06/02/2026', basicAmt: 15820.0, gstAmt: 4429.6, totalAmt: 20249.6, deduction: 0.0, netPayable: 20249.6, paid: 0.0, pending: 20249.6, status: 'Under Process' },
  ]
};
