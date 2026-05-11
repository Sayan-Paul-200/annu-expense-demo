export type ExpenseScope = 'company' | 'business-unit' | 'project';

export interface DashboardLedgerRecord {
  id: string;
  date: string;
  monthKey: string;
  month: string;
  businessUnit: string;
  project: string;
  state: string;
  category: string;
  subCategory: string;
  expenseScope: ExpenseScope;
  allocatedBudget: number;
  utilizedBudget: number;
  expenseAmount: number;
}

export interface DashboardFilterState {
  businessUnit: string | null;
  project: string | null;
  state: string | null;
  category: string | null;
  subCategory: string | null;
  dateRange: [string | null, string | null];
}

interface SubCategoryBreakdownItem {
  label: string;
  category: string;
  value: number;
  bgColor: string;
  icon: string;
}

interface ProjectBudgetSummary {
  id: number;
  name: string;
  bu: string;
  allocated: number;
  utilized: number;
  status: string;
}

const CRORE = 10000000;

const monthBuckets = [
  { key: '2025-10', label: 'Oct', date: '2025-10-15' },
  { key: '2025-11', label: 'Nov', date: '2025-11-15' },
  { key: '2025-12', label: 'Dec', date: '2025-12-15' },
  { key: '2026-01', label: 'Jan', date: '2026-01-15' },
  { key: '2026-02', label: 'Feb', date: '2026-02-15' },
  { key: '2026-03', label: 'Mar', date: '2026-03-15' },
];

const budgetMonthFactors = [1, 1.12, 0.94, 1.24, 1.08, 1.34];
const utilizationMonthFactors = [0.82, 0.91, 0.78, 1.03, 0.88, 1.12];

const categoryMap: Record<string, string[]> = {
  Office: ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Legal & Notary Charges', 'Tour & Travel', 'Admin', 'Misc', 'Staff Salary', 'Banking Charges', 'IT Assets'],
  Compliance: ['CA Fees', 'Taxes & Duties', 'Project Insurance', 'Labour License', 'Registration Expenses', 'Consultancy Charges'],
  'Guest House': ['Rent', 'Maintenance', 'Care Taker Salary', 'Guest House Admin Expenses'],
  Tender: ['EMD', 'Cost of Tender Document'],
  Vehicle: ['Vehicle EMI', 'Vehicle Diesel', 'Vehicle Fuel'],
  'Plant & Machinery': ['Equipment EMI', 'Equipment- Diesel', 'Equipment- Insurance', 'Equipment- Maintenance', 'Equipment- Spares', 'Equipment- Transporation', 'Spares- Transporation', 'Equipment - Purchase', 'Equipment - Downpayment'],
  Material: ['Supply', 'Primary Transportation', 'Secondary Transportation'],
  Services: ['Vendor Payment', 'Right of Way Payment', 'Labour Charges', 'Site Expenses'],
  Warehouse: ['Rent', 'Security Deposit', 'Electricity Charges', 'Maintenance', 'Printing & Stationery', 'Establishment', 'Security', 'IT Assets', 'Labour Charges Loading-Unloading'],
  Finance: ['Finance Charges'],
};

const categoryStyles = [
  { bgColor: '#e7f5ff', icon: 'O' },
  { bgColor: '#ebfbee', icon: 'C' },
  { bgColor: '#fff3bf', icon: 'G' },
  { bgColor: '#ffe3e3', icon: 'T' },
  { bgColor: '#f3d9fa', icon: 'V' },
  { bgColor: '#e3fafc', icon: 'P' },
  { bgColor: '#fff0f6', icon: 'M' },
  { bgColor: '#f4fce3', icon: 'S' },
  { bgColor: '#e6fcf5', icon: 'W' },
  { bgColor: '#fff4e6', icon: 'F' },
];

const projectProfiles = [
  { project: 'Bharat Net', businessUnit: 'Telecom', states: ['Bihar', 'Jharkhand', 'Madhya Pradesh'], baseBudget: 9.5 * CRORE, utilizationBias: 0.74 },
  { project: 'NFS', businessUnit: 'Telecom', states: ['Sikkim', 'Nagaland', 'Manipur', 'Mizoram', 'Meghalaya'], baseBudget: 18 * CRORE, utilizationBias: 0.96 },
  { project: 'GAIL', businessUnit: 'Gas Pipelines', states: ['Delhi', 'Madhya Pradesh', 'Goa'], baseBudget: 12 * CRORE, utilizationBias: 0.71 },
  { project: 'BGCL', businessUnit: 'Gas Pipelines', states: ['Bihar', 'Jharkhand', 'Delhi'], baseBudget: 7.5 * CRORE, utilizationBias: 0.42 },
  { project: 'STP', businessUnit: 'Sewerage', states: ['Goa', 'Madhya Pradesh', 'Bihar'], baseBudget: 6 * CRORE, utilizationBias: 0.98 },
  { project: 'NFS AMC', businessUnit: 'Railways', states: ['Delhi', 'Goa', 'Sikkim'], baseBudget: 5.2 * CRORE, utilizationBias: 0.63 },
  { project: 'RailTel Yard', businessUnit: 'Railways', states: ['Delhi', 'Madhya Pradesh', 'Jharkhand'], baseBudget: 4.8 * CRORE, utilizationBias: 0.81 },
  { project: 'City Sewer Grid', businessUnit: 'Sewerage', states: ['Goa', 'Bihar', 'Madhya Pradesh'], baseBudget: 5.6 * CRORE, utilizationBias: 0.69 },
];

const companyCostCentres = [
  { project: 'Corporate Office', businessUnit: 'Telecom', state: 'Delhi', category: 'Office', subCategory: 'Rent', baseBudget: 1.4 * CRORE, utilizationBias: 0.82 },
  { project: 'Finance Shared Services', businessUnit: 'Gas Pipelines', state: 'Delhi', category: 'Finance', subCategory: 'Finance Charges', baseBudget: 0.9 * CRORE, utilizationBias: 0.68 },
  { project: 'Legal & Compliance', businessUnit: 'Sewerage', state: 'Madhya Pradesh', category: 'Compliance', subCategory: 'Registration Expenses', baseBudget: 0.8 * CRORE, utilizationBias: 0.76 },
  { project: 'Admin Operations', businessUnit: 'Railways', state: 'Goa', category: 'Office', subCategory: 'Staff Salary', baseBudget: 1.1 * CRORE, utilizationBias: 0.88 },
  { project: 'Central Procurement', businessUnit: 'Telecom', state: 'Jharkhand', category: 'Office', subCategory: 'Printing & Stationery', baseBudget: 0.55 * CRORE, utilizationBias: 0.61 },
  { project: 'Tender Desk', businessUnit: 'Gas Pipelines', state: 'Bihar', category: 'Tender', subCategory: 'EMD', baseBudget: 0.72 * CRORE, utilizationBias: 0.73 },
  { project: 'Guest House Network', businessUnit: 'Railways', state: 'Sikkim', category: 'Guest House', subCategory: 'Maintenance', baseBudget: 0.48 * CRORE, utilizationBias: 0.67 },
  { project: 'IT Asset Pool', businessUnit: 'Sewerage', state: 'Manipur', category: 'Office', subCategory: 'IT Assets', baseBudget: 0.68 * CRORE, utilizationBias: 0.79 },
];

const buOperatingProfiles = [
  { businessUnit: 'Telecom', state: 'Bihar', category: 'Services', subCategory: 'Right of Way Payment', baseBudget: 2.4 * CRORE, utilizationBias: 0.78 },
  { businessUnit: 'Gas Pipelines', state: 'Madhya Pradesh', category: 'Vehicle', subCategory: 'Vehicle Fuel', baseBudget: 1.7 * CRORE, utilizationBias: 0.69 },
  { businessUnit: 'Sewerage', state: 'Goa', category: 'Warehouse', subCategory: 'Rent', baseBudget: 1.2 * CRORE, utilizationBias: 0.84 },
  { businessUnit: 'Railways', state: 'Delhi', category: 'Compliance', subCategory: 'Project Insurance', baseBudget: 1.5 * CRORE, utilizationBias: 0.92 },
  { businessUnit: 'Telecom', state: 'Nagaland', category: 'Material', subCategory: 'Primary Transportation', baseBudget: 1.9 * CRORE, utilizationBias: 0.72 },
  { businessUnit: 'Gas Pipelines', state: 'Jharkhand', category: 'Plant & Machinery', subCategory: 'Equipment- Diesel', baseBudget: 1.45 * CRORE, utilizationBias: 0.81 },
  { businessUnit: 'Sewerage', state: 'Madhya Pradesh', category: 'Services', subCategory: 'Labour Charges', baseBudget: 1.35 * CRORE, utilizationBias: 0.77 },
  { businessUnit: 'Railways', state: 'Goa', category: 'Vehicle', subCategory: 'Vehicle EMI', baseBudget: 0.95 * CRORE, utilizationBias: 0.65 },
];

const projectWorkstreams = [
  { category: 'Material', subCategory: 'Supply', weight: 0.34, utilizationOffset: 0.02 },
  { category: 'Services', subCategory: 'Vendor Payment', weight: 0.24, utilizationOffset: -0.04 },
  { category: 'Plant & Machinery', subCategory: 'Equipment- Maintenance', weight: 0.18, utilizationOffset: 0.05 },
  { category: 'Vehicle', subCategory: 'Vehicle Diesel', weight: 0.11, utilizationOffset: -0.01 },
  { category: 'Warehouse', subCategory: 'Rent', weight: 0.08, utilizationOffset: 0.03 },
  { category: 'Compliance', subCategory: 'Labour License', weight: 0.05, utilizationOffset: -0.02 },
] as const;

function getLedgerDate(baseDate: string, dayOffset: number) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().slice(0, 10);
}

function createLedger(): DashboardLedgerRecord[] {
  const records: DashboardLedgerRecord[] = [];

  monthBuckets.forEach((month, monthIndex) => {
    companyCostCentres.forEach((centre, centreIndex) => {
      const allocatedBudget = Math.round(
        centre.baseBudget * budgetMonthFactors[monthIndex] * (1 + centreIndex * 0.025)
      );
      const utilizedBudget = Math.round(
        allocatedBudget * Math.min(centre.utilizationBias * utilizationMonthFactors[monthIndex], 1.08)
      );

      records.push({
        id: `company-${month.key}-${centreIndex}`,
        date: getLedgerDate(month.date, (centreIndex % 4) * 3 - 5),
        monthKey: month.key,
        month: month.label,
        businessUnit: centre.businessUnit,
        project: centre.project,
        state: centre.state,
        category: centre.category,
        subCategory: centre.subCategory,
        expenseScope: 'company',
        allocatedBudget,
        utilizedBudget,
        expenseAmount: utilizedBudget,
      });
    });

    buOperatingProfiles.forEach((profile, profileIndex) => {
      const allocatedBudget = Math.round(
        profile.baseBudget * budgetMonthFactors[monthIndex] * (1 + profileIndex * 0.02)
      );
      const utilizedBudget = Math.round(
        allocatedBudget * Math.min(profile.utilizationBias * utilizationMonthFactors[monthIndex], 1.1)
      );

      records.push({
        id: `bu-${month.key}-${profileIndex}`,
        date: getLedgerDate(month.date, (profileIndex % 5) * 2 - 4),
        monthKey: month.key,
        month: month.label,
        businessUnit: profile.businessUnit,
        project: `${profile.businessUnit} Operations`,
        state: profile.state,
        category: profile.category,
        subCategory: profile.subCategory,
        expenseScope: 'business-unit',
        allocatedBudget,
        utilizedBudget,
        expenseAmount: utilizedBudget,
      });
    });

    projectProfiles.forEach((profile, profileIndex) => {
      projectWorkstreams.forEach((workstream, workstreamIndex) => {
        const state = profile.states[(monthIndex + workstreamIndex) % profile.states.length];
        const allocatedBudget = Math.round(
          profile.baseBudget *
            workstream.weight *
            budgetMonthFactors[monthIndex] *
            (1 + profileIndex * 0.018 + workstreamIndex * 0.012)
        );
        const utilizedBudget = Math.round(
          allocatedBudget *
            Math.min(profile.utilizationBias * utilizationMonthFactors[monthIndex] + workstream.utilizationOffset, 1.16)
        );

        records.push({
          id: `project-${month.key}-${profileIndex}-${workstreamIndex}`,
          date: getLedgerDate(month.date, (workstreamIndex % 6) * 2 - 5),
          monthKey: month.key,
          month: month.label,
          businessUnit: profile.businessUnit,
          project: profile.project,
          state,
          category: workstream.category,
          subCategory: workstream.subCategory,
          expenseScope: 'project',
          allocatedBudget,
          utilizedBudget,
          expenseAmount: utilizedBudget,
        });
      });
    });
  });

  return records;
}

export const dashboardLedger = createLedger();

export const dashboardFilters = {
  businessUnits: Array.from(new Set(dashboardLedger.map((item) => item.businessUnit))).sort(),
  projects: Array.from(new Set(dashboardLedger.filter((item) => item.expenseScope === 'project').map((item) => item.project))).sort(),
  states: Array.from(new Set(dashboardLedger.map((item) => item.state))).sort(),
  categories: Object.keys(categoryMap),
  subCategories: categoryMap,
};

function matchesFilters(record: DashboardLedgerRecord, filters: DashboardFilterState) {
  const [startDate, endDate] = filters.dateRange;
  const recordTime = new Date(record.date).getTime();
  const startTime = startDate ? new Date(startDate).getTime() : null;
  const endTime = endDate ? new Date(endDate).getTime() : null;

  return (
    (!filters.businessUnit || record.businessUnit === filters.businessUnit) &&
    (!filters.project || record.project === filters.project) &&
    (!filters.state || record.state === filters.state) &&
    (!filters.category || record.category === filters.category) &&
    (!filters.subCategory || record.subCategory === filters.subCategory) &&
    (!startTime || recordTime >= startTime) &&
    (!endTime || recordTime <= endTime)
  );
}

function toCrores(value: number) {
  return Number((value / CRORE).toFixed(1));
}

function groupSubCategories(records: DashboardLedgerRecord[]): SubCategoryBreakdownItem[] {
  const grouped = new Map<string, { category: string; label: string; value: number }>();

  records.forEach((record) => {
    const key = `${record.category}:${record.subCategory}`;
    const current = grouped.get(key) ?? { category: record.category, label: record.subCategory, value: 0 };
    current.value += record.expenseAmount;
    grouped.set(key, current);
  });

  return Array.from(grouped.values())
    .map((item) => {
      const categoryIndex = dashboardFilters.categories.indexOf(item.category);
      const style = categoryStyles[Math.max(categoryIndex, 0) % categoryStyles.length];
      return {
        label: item.label,
        category: item.category,
        value: toCrores(item.value),
        bgColor: style.bgColor,
        icon: style.icon,
      };
    })
    .sort((a, b) => b.value - a.value);
}

function groupTopCategories(records: DashboardLedgerRecord[]) {
  const grouped = new Map<string, number>();

  records.forEach((record) => {
    grouped.set(record.category, (grouped.get(record.category) ?? 0) + record.expenseAmount);
  });

  return Array.from(grouped.entries())
    .map(([name, value]) => ({ name, value: toCrores(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function buildBudgetTrend(records: DashboardLedgerRecord[]) {
  return monthBuckets.map((month) => {
    const monthRecords = records.filter((record) => record.monthKey === month.key);
    return {
      month: month.label,
      allottedBudget: toCrores(monthRecords.reduce((sum, record) => sum + record.allocatedBudget, 0)),
      utilizedBudget: toCrores(monthRecords.reduce((sum, record) => sum + record.utilizedBudget, 0)),
    };
  });
}

function buildProjectBudgets(records: DashboardLedgerRecord[]): ProjectBudgetSummary[] {
  const grouped = new Map<string, { name: string; bu: string; allocated: number; utilized: number }>();

  records
    .filter((record) => record.expenseScope === 'project')
    .forEach((record) => {
      const current = grouped.get(record.project) ?? {
        name: record.project,
        bu: record.businessUnit,
        allocated: 0,
        utilized: 0,
      };
      current.allocated += record.allocatedBudget;
      current.utilized += record.utilizedBudget;
      grouped.set(record.project, current);
    });

  return Array.from(grouped.values())
    .map((project, index) => {
      const utilizationPct = project.allocated > 0 ? (project.utilized / project.allocated) * 100 : 0;
      let status = 'On Track';
      if (utilizationPct > 95 || project.utilized > project.allocated) status = 'Critical';
      else if (utilizationPct > 85) status = 'At Risk';

      return {
        id: index + 1,
        ...project,
        status,
      };
    })
    .sort((a, b) => b.utilized - a.utilized);
}

export function deriveDashboardData(filters: DashboardFilterState) {
  const filteredRecords = dashboardLedger.filter((record) => matchesFilters(record, filters));
  const projectRecords = filteredRecords.filter((record) => record.expenseScope === 'project');
  const projectAllocatedBudget = projectRecords.reduce((sum, record) => sum + record.allocatedBudget, 0);
  const projectUtilizedBudget = projectRecords.reduce((sum, record) => sum + record.utilizedBudget, 0);
  const grandTotalExpense = filteredRecords.reduce((sum, record) => sum + record.expenseAmount, 0);

  return {
    records: filteredRecords,
    kpis: {
      grandTotalExpense,
      companyTotalExpense: filteredRecords
        .filter((record) => record.expenseScope === 'company')
        .reduce((sum, record) => sum + record.expenseAmount, 0),
      businessUnitTotalExpense: filteredRecords
        .filter((record) => record.expenseScope === 'business-unit')
        .reduce((sum, record) => sum + record.expenseAmount, 0),
      totalProjectBudget: projectAllocatedBudget,
      utilizedBudget: projectUtilizedBudget,
      balanceBudget: projectAllocatedBudget - projectUtilizedBudget,
    },
    subCategoryBreakdown: groupSubCategories(filteredRecords),
    totalSubCategoryValue: toCrores(grandTotalExpense),
    charts: {
      expenseTrend: buildBudgetTrend(filteredRecords),
      topCategories: groupTopCategories(filteredRecords),
    },
    projectBudgets: buildProjectBudgets(filteredRecords),
  };
}

export const emptyDashboardFilters: DashboardFilterState = {
  businessUnit: null,
  project: null,
  state: null,
  category: null,
  subCategory: null,
  dateRange: [null, null],
};

export const dummyDashboardData = {
  filters: dashboardFilters,
  ...deriveDashboardData(emptyDashboardFilters),
};
