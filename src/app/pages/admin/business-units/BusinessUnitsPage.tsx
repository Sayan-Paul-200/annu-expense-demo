import { useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconEye, IconSearch, IconX } from '@tabler/icons-react';
import { dashboardLedger } from '../dummyData';

interface BusinessUnitSummary {
  id: string;
  name: string;
  projectCount: number;
  states: string[];
  categories: string[];
  allocatedBudget: number;
  utilizedBudget: number;
  expenseAmount: number;
  status: string;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Critical':
      return 'red';
    case 'At Risk':
      return 'orange';
    case 'On Track':
      return 'teal';
    default:
      return 'gray';
  }
}

function getBusinessUnitRows(): BusinessUnitSummary[] {
  const grouped = new Map<string, BusinessUnitSummary>();

  dashboardLedger.forEach((record) => {
    const current = grouped.get(record.businessUnit) ?? {
      id: record.businessUnit,
      name: record.businessUnit,
      projectCount: 0,
      states: [],
      categories: [],
      allocatedBudget: 0,
      utilizedBudget: 0,
      expenseAmount: 0,
      status: 'On Track',
    };

    current.allocatedBudget += record.allocatedBudget;
    current.utilizedBudget += record.utilizedBudget;
    current.expenseAmount += record.expenseAmount;
    current.states = Array.from(new Set([...current.states, record.state])).sort();
    current.categories = Array.from(new Set([...current.categories, record.category])).sort();

    if (record.expenseScope === 'project') {
      const projectNames = new Set(
        dashboardLedger
          .filter((item) => item.businessUnit === record.businessUnit && item.expenseScope === 'project')
          .map((item) => item.project)
      );
      current.projectCount = projectNames.size;
    }

    const utilizationPct = current.allocatedBudget > 0 ? (current.utilizedBudget / current.allocatedBudget) * 100 : 0;
    if (utilizationPct > 95 || current.utilizedBudget > current.allocatedBudget) current.status = 'Critical';
    else if (utilizationPct > 85) current.status = 'At Risk';
    else current.status = 'On Track';

    grouped.set(record.businessUnit, current);
  });

  return Array.from(grouped.values()).sort((a, b) => b.expenseAmount - a.expenseAmount);
}

export default function BusinessUnitsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [viewingUnit, setViewingUnit] = useState<BusinessUnitSummary | null>(null);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);

  const rows = useMemo(() => getBusinessUnitRows(), []);
  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return rows;

    return rows.filter((row) =>
      [row.name, row.status, row.states.join(' '), row.categories.join(' ')].join(' ').toLowerCase().includes(search)
    );
  }, [rows, searchValue]);

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        allocated: acc.allocated + row.allocatedBudget,
        utilized: acc.utilized + row.utilizedBudget,
        expense: acc.expense + row.expenseAmount,
      }),
      { allocated: 0, utilized: 0, expense: 0 }
    );
  }, [filteredRows]);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Box>
          <Title order={2} fw={700} c="gray.9">
            Business Units
          </Title>
          <Text size="sm" c="dimmed">
            Operating divisions with budget, utilization, project footprint, and state coverage.
          </Text>
        </Box>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>Allocated Budget</Text>
          <Text size="lg" fw={800}>{formatCurrency(totals.allocated)}</Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>Utilized Budget</Text>
          <Text size="lg" fw={800} c="orange.7">{formatCurrency(totals.utilized)}</Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>Total Expense</Text>
          <Text size="lg" fw={800} c="blue.7">{formatCurrency(totals.expense)}</Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="md" gap="sm">
          <TextInput
            placeholder="Search business unit, state, category..."
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchValue ? (
                <ActionIcon variant="transparent" onClick={() => setSearchValue('')} aria-label="Clear search">
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            style={{ flex: '1 1 280px' }}
          />
          <Button variant="outline" leftSection={<IconDownload size={17} />}>
            Export
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={980}>
          <Table verticalSpacing="sm" striped highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#F9FAFB' }}>
              <Table.Tr>
                <Table.Th>Business Unit</Table.Th>
                <Table.Th>Projects</Table.Th>
                <Table.Th>States</Table.Th>
                <Table.Th>Allocated</Table.Th>
                <Table.Th>Utilized</Table.Th>
                <Table.Th>Utilization</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRows.map((row) => {
                const utilizationPct = row.allocatedBudget > 0 ? (row.utilizedBudget / row.allocatedBudget) * 100 : 0;

                return (
                  <Table.Tr key={row.id}>
                    <Table.Td>
                      <Text size="sm" fw={700}>{row.name}</Text>
                      <Text size="xs" c="dimmed">{row.categories.slice(0, 3).join(', ')}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color="blue" variant="light">{row.projectCount}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{row.states.slice(0, 3).join(', ')}</Text>
                      {row.states.length > 3 ? <Text size="xs" c="dimmed">+{row.states.length - 3} more</Text> : null}
                    </Table.Td>
                    <Table.Td><Text size="sm" fw={600}>{formatCurrency(row.allocatedBudget)}</Text></Table.Td>
                    <Table.Td><Text size="sm" fw={600}>{formatCurrency(row.utilizedBudget)}</Text></Table.Td>
                    <Table.Td style={{ width: 180 }}>
                      <Text size="xs" fw={700} c={getStatusColor(row.status)} mb={4}>{utilizationPct.toFixed(1)}%</Text>
                      <Progress value={Math.min(utilizationPct, 100)} color={getStatusColor(row.status)} size="sm" radius="xl" />
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(row.status)} variant="light">{row.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        aria-label="View business unit"
                        onClick={() => {
                          setViewingUnit(row);
                          openView();
                        }}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <Modal opened={viewOpened} onClose={closeView} title="Business Unit Details" size="lg" padding="xl">
        {viewingUnit ? (
          <Stack gap="md">
            <Group justify="space-between">
              <Box>
                <Title order={4}>{viewingUnit.name}</Title>
                <Text size="sm" c="dimmed">{viewingUnit.projectCount} active projects</Text>
              </Box>
              <Badge color={getStatusColor(viewingUnit.status)} variant="light">{viewingUnit.status}</Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Allocated</Text><Text fw={800}>{formatCurrency(viewingUnit.allocatedBudget)}</Text></Paper>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Utilized</Text><Text fw={800}>{formatCurrency(viewingUnit.utilizedBudget)}</Text></Paper>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Expense</Text><Text fw={800}>{formatCurrency(viewingUnit.expenseAmount)}</Text></Paper>
            </SimpleGrid>
            <ScrollArea h={120} type="hover">
              <Text size="sm" fw={600}>States</Text>
              <Text size="sm" c="dimmed" mb="sm">{viewingUnit.states.join(', ')}</Text>
              <Text size="sm" fw={600}>Categories</Text>
              <Text size="sm" c="dimmed">{viewingUnit.categories.join(', ')}</Text>
            </ScrollArea>
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  );
}
