import { Box, Paper, Stack, Tabs } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExpenseListPage } from './ExpenseListPage';
import type { ExpensePageKind } from './expenseData';
import { expenseDatasets } from './expenseData';

const expenseTabs: { value: ExpensePageKind; label: string; path: string }[] = [
  { value: 'company', label: 'Company Expenses', path: '/admin/expenses/company' },
  { value: 'business-unit', label: 'Business Unit Expenses', path: '/admin/expenses/business-unit' },
  { value: 'project', label: 'Project Expenses', path: '/admin/expenses/project' },
];

function getActiveExpenseKind(pathname: string): ExpensePageKind {
  const matchedTab = expenseTabs.find((tab) => pathname === tab.path);
  return matchedTab?.value ?? 'company';
}

export default function ExpensesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeKind = getActiveExpenseKind(location.pathname);
  const activeDataset = expenseDatasets[activeKind];

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="6" style={{ backgroundColor: 'white' }}>
        <Tabs
          value={activeKind}
          onChange={(value) => {
            const nextTab = expenseTabs.find((tab) => tab.value === value);
            if (nextTab) {
              navigate(nextTab.path);
            }
          }}
          variant="pills"
          radius="md"
        >
          <Tabs.List grow>
            {expenseTabs.map((tab) => (
              <Tabs.Tab key={tab.value} value={tab.value}>
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Paper>

      <Box>
        <ExpenseListPage key={activeDataset.kind} dataset={activeDataset} />
      </Box>
    </Stack>
  );
}
