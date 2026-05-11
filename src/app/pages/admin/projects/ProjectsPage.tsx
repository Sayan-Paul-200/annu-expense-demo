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
  Select,
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

interface ProjectSummary {
  id: string;
  name: string;
  businessUnit: string;
  states: string[];
  categories: string[];
  allocatedBudget: number;
  utilizedBudget: number;
  balanceBudget: number;
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

function getProjectRows(): ProjectSummary[] {
  const grouped = new Map<string, ProjectSummary>();

  dashboardLedger
    .filter((record) => record.expenseScope === 'project')
    .forEach((record) => {
      const current = grouped.get(record.project) ?? {
        id: record.project,
        name: record.project,
        businessUnit: record.businessUnit,
        states: [],
        categories: [],
        allocatedBudget: 0,
        utilizedBudget: 0,
        balanceBudget: 0,
        status: 'On Track',
      };

      current.allocatedBudget += record.allocatedBudget;
      current.utilizedBudget += record.utilizedBudget;
      current.balanceBudget = current.allocatedBudget - current.utilizedBudget;
      current.states = Array.from(new Set([...current.states, record.state])).sort();
      current.categories = Array.from(new Set([...current.categories, record.category])).sort();

      const utilizationPct = current.allocatedBudget > 0 ? (current.utilizedBudget / current.allocatedBudget) * 100 : 0;
      if (utilizationPct > 95 || current.utilizedBudget > current.allocatedBudget) current.status = 'Critical';
      else if (utilizationPct > 85) current.status = 'At Risk';
      else current.status = 'On Track';

      grouped.set(record.project, current);
    });

  return Array.from(grouped.values()).sort((a, b) => b.utilizedBudget - a.utilizedBudget);
}

export default function ProjectsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewingProject, setViewingProject] = useState<ProjectSummary | null>(null);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);

  const rows = useMemo(() => getProjectRows(), []);
  const businessUnits = useMemo(() => Array.from(new Set(rows.map((row) => row.businessUnit))).sort(), [rows]);
  const statuses = ['On Track', 'At Risk', 'Critical'];

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !search ||
        [row.name, row.businessUnit, row.status, row.states.join(' '), row.categories.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(search);

      return (
        matchesSearch &&
        (!businessUnitFilter || row.businessUnit === businessUnitFilter) &&
        (!statusFilter || row.status === statusFilter)
      );
    });
  }, [businessUnitFilter, rows, searchValue, statusFilter]);

  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        allocated: acc.allocated + row.allocatedBudget,
        utilized: acc.utilized + row.utilizedBudget,
        balance: acc.balance + row.balanceBudget,
      }),
      { allocated: 0, utilized: 0, balance: 0 }
    );
  }, [filteredRows]);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Box>
          <Title order={2} fw={700} c="gray.9">
            Projects
          </Title>
          <Text size="sm" c="dimmed">
            Project portfolio with budget utilization, state coverage, and category mix.
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
          <Text size="xs" c="dimmed" fw={600}>Balance Budget</Text>
          <Text size="lg" fw={800} c={totals.balance < 0 ? 'red.7' : 'teal.7'}>{formatCurrency(totals.balance)}</Text>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="md" gap="sm">
          <TextInput
            placeholder="Search project, BU, state, category..."
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
          <Select
            placeholder="All Business Units"
            data={businessUnits}
            value={businessUnitFilter}
            onChange={setBusinessUnitFilter}
            clearable
            style={{ flex: '1 1 180px' }}
          />
          <Select
            placeholder="All Statuses"
            data={statuses}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ flex: '1 1 160px' }}
          />
          <Button variant="outline" leftSection={<IconDownload size={17} />}>
            Export
          </Button>
        </Group>

        <Table.ScrollContainer minWidth={1080}>
          <Table verticalSpacing="sm" striped highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#F9FAFB' }}>
              <Table.Tr>
                <Table.Th>Project</Table.Th>
                <Table.Th>Business Unit</Table.Th>
                <Table.Th>States</Table.Th>
                <Table.Th>Allocated</Table.Th>
                <Table.Th>Utilized</Table.Th>
                <Table.Th>Balance</Table.Th>
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
                    <Table.Td><Badge color="blue" variant="light">{row.businessUnit}</Badge></Table.Td>
                    <Table.Td>
                      <Text size="sm">{row.states.slice(0, 3).join(', ')}</Text>
                      {row.states.length > 3 ? <Text size="xs" c="dimmed">+{row.states.length - 3} more</Text> : null}
                    </Table.Td>
                    <Table.Td><Text size="sm" fw={600}>{formatCurrency(row.allocatedBudget)}</Text></Table.Td>
                    <Table.Td><Text size="sm" fw={600}>{formatCurrency(row.utilizedBudget)}</Text></Table.Td>
                    <Table.Td><Text size="sm" fw={600} c={row.balanceBudget < 0 ? 'red' : '#111827'}>{formatCurrency(row.balanceBudget)}</Text></Table.Td>
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
                        aria-label="View project"
                        onClick={() => {
                          setViewingProject(row);
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

      <Modal opened={viewOpened} onClose={closeView} title="Project Details" size="lg" padding="xl">
        {viewingProject ? (
          <Stack gap="md">
            <Group justify="space-between">
              <Box>
                <Title order={4}>{viewingProject.name}</Title>
                <Text size="sm" c="dimmed">{viewingProject.businessUnit}</Text>
              </Box>
              <Badge color={getStatusColor(viewingProject.status)} variant="light">{viewingProject.status}</Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Allocated</Text><Text fw={800}>{formatCurrency(viewingProject.allocatedBudget)}</Text></Paper>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Utilized</Text><Text fw={800}>{formatCurrency(viewingProject.utilizedBudget)}</Text></Paper>
              <Paper withBorder p="sm"><Text size="xs" c="dimmed">Balance</Text><Text fw={800}>{formatCurrency(viewingProject.balanceBudget)}</Text></Paper>
            </SimpleGrid>
            <ScrollArea h={120} type="hover">
              <Text size="sm" fw={600}>States</Text>
              <Text size="sm" c="dimmed" mb="sm">{viewingProject.states.join(', ')}</Text>
              <Text size="sm" fw={600}>Categories</Text>
              <Text size="sm" c="dimmed">{viewingProject.categories.join(', ')}</Text>
            </ScrollArea>
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  );
}
