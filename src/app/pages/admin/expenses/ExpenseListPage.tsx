import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconDownload,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { DashboardFilters } from '../../../components/dashboard/DashboardFilters';
import type { DemoExpense, ExpenseDataset, ExpenseStatus } from './expenseData';
import {
  businessUnits,
  expenseCategories,
  expenseStatuses,
  expenseSubCategories,
  projectNames,
} from './expenseData';

interface ExpenseListPageProps {
  dataset: ExpenseDataset;
}

interface ExpenseFormState {
  expenseNumber: string;
  date: string;
  scopeLabel: string;
  businessUnit: string;
  project: string;
  category: string;
  subCategory: string;
  vendor: string;
  basicAmount: number;
  gstAmount: number;
  paidAmount: number;
  status: ExpenseStatus;
  remarks: string;
}

const PAGE_SIZE = 6;

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getStatusColor(status: ExpenseStatus) {
  switch (status) {
    case 'Paid':
      return 'teal';
    case 'Under Process':
      return 'blue';
    case 'Pending Approval':
      return 'yellow';
    case 'Overdue':
      return 'red';
    case 'Cancelled':
      return 'gray';
    default:
      return 'gray';
  }
}

function getTodayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyForm(dataset: ExpenseDataset): ExpenseFormState {
  const defaultScope =
    dataset.kind === 'project'
      ? projectNames[0]
      : dataset.kind === 'business-unit'
        ? businessUnits[0]
        : 'Corporate Office';

  return {
    expenseNumber: '',
    date: getTodayInputValue(),
    scopeLabel: defaultScope,
    businessUnit: dataset.kind === 'company' ? '' : businessUnits[0],
    project: dataset.kind === 'project' ? projectNames[0] : '',
    category: expenseCategories[0],
    subCategory: expenseSubCategories[expenseCategories[0]][0],
    vendor: '',
    basicAmount: 0,
    gstAmount: 0,
    paidAmount: 0,
    status: 'Under Process',
    remarks: '',
  };
}

function toFormState(expense: DemoExpense): ExpenseFormState {
  return {
    expenseNumber: expense.expenseNumber,
    date: expense.date,
    scopeLabel: expense.scopeLabel,
    businessUnit: expense.businessUnit ?? '',
    project: expense.project ?? '',
    category: expense.category,
    subCategory: expense.subCategory,
    vendor: expense.vendor,
    basicAmount: expense.basicAmount,
    gstAmount: expense.gstAmount,
    paidAmount: expense.paidAmount,
    status: expense.status,
    remarks: expense.remarks,
  };
}

function buildExpenseFromForm(form: ExpenseFormState, dataset: ExpenseDataset, id: string): DemoExpense {
  const totalAmount = Number(form.basicAmount) + Number(form.gstAmount);
  const pendingAmount = form.status === 'Cancelled' ? 0 : Math.max(totalAmount - Number(form.paidAmount), 0);
  const scopeLabel =
    dataset.kind === 'project'
      ? form.project
      : dataset.kind === 'business-unit'
        ? form.businessUnit
        : form.scopeLabel;

  return {
    id,
    expenseNumber: form.expenseNumber.trim() || `${dataset.kind.toUpperCase()}-${Date.now()}`,
    date: form.date,
    scopeLabel,
    businessUnit: dataset.kind === 'company' ? undefined : form.businessUnit,
    project: dataset.kind === 'project' ? form.project : undefined,
    category: form.category,
    subCategory: form.subCategory,
    vendor: form.vendor.trim() || 'Demo Vendor',
    basicAmount: Number(form.basicAmount),
    gstAmount: Number(form.gstAmount),
    totalAmount,
    paidAmount: form.status === 'Cancelled' ? 0 : Number(form.paidAmount),
    pendingAmount,
    status: form.status,
    remarks: form.remarks,
  };
}

export function ExpenseListPage({ dataset }: ExpenseListPageProps) {
  const [rows, setRows] = useState<DemoExpense[]>(() => dataset.rows);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [subCategoryFilter, setSubCategoryFilter] = useState<string | null>(null);
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState<[string | null, string | null]>([null, null]);
  const [activePage, setActivePage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewingExpense, setViewingExpense] = useState<DemoExpense | null>(null);
  const [editingExpense, setEditingExpense] = useState<DemoExpense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<DemoExpense | null>(null);
  const [form, setForm] = useState<ExpenseFormState>(() => createEmptyForm(dataset));
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [bulkDeleteOpened, { open: openBulkDelete, close: closeBulkDelete }] = useDisclosure(false);
  const [exportOpened, { open: openExport, close: closeExport }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const businessUnitOptions = useMemo(() => {
    if (dataset.kind === 'company') {
      return Array.from(new Set(rows.map((row) => row.scopeLabel))).sort();
    }
    return Array.from(new Set(rows.map((row) => row.businessUnit).filter(Boolean) as string[])).sort();
  }, [dataset.kind, rows]);

  const projectOptions = useMemo(() => {
    if (dataset.kind !== 'project') return [];
    return Array.from(new Set(rows.map((row) => row.project).filter(Boolean) as string[])).sort();
  }, [dataset.kind, rows]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const fromTime = dateRangeFilter[0] ? new Date(dateRangeFilter[0]).getTime() : null;
    const toTime = dateRangeFilter[1] ? new Date(dateRangeFilter[1]).getTime() : null;

    return rows.filter((row) => {
      const searchable = [
        row.expenseNumber,
        row.vendor,
        row.category,
        row.subCategory,
        row.scopeLabel,
        row.businessUnit ?? '',
        row.project ?? '',
        row.status,
      ]
        .join(' ')
        .toLowerCase();
      const rowTime = new Date(row.date).getTime();

      return (
        (!normalizedSearch || searchable.includes(normalizedSearch)) &&
        (!statusFilter || row.status === statusFilter) &&
        (!categoryFilter || row.category === categoryFilter) &&
        (!subCategoryFilter || row.subCategory === subCategoryFilter) &&
        (!businessUnitFilter ||
          (dataset.kind === 'company' ? row.scopeLabel === businessUnitFilter : row.businessUnit === businessUnitFilter)) &&
        (!projectFilter || row.project === projectFilter) &&
        (!fromTime || rowTime >= fromTime) &&
        (!toTime || rowTime <= toTime)
      );
    });
  }, [
    businessUnitFilter,
    categoryFilter,
    dataset.kind,
    dateRangeFilter,
    projectFilter,
    rows,
    searchValue,
    statusFilter,
    subCategoryFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(activePage, totalPages);
  const paginatedRows = filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const visibleRowIds = paginatedRows.map((row) => row.id);
  const allVisibleSelected = visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedRows.includes(id));
  const someVisibleSelected = visibleRowIds.some((id) => selectedRows.includes(id));

  const summary = useMemo(() => {
    return filteredRows.reduce(
      (acc, row) => ({
        total: acc.total + row.totalAmount,
        paid: acc.paid + row.paidAmount,
        pending: acc.pending + row.pendingAmount,
      }),
      { total: 0, paid: 0, pending: 0 }
    );
  }, [filteredRows]);

  const resetFilters = () => {
    setSearchValue('');
    setStatusFilter(null);
    setCategoryFilter(null);
    setSubCategoryFilter(null);
    setBusinessUnitFilter(null);
    setProjectFilter(null);
    setDateRangeFilter([null, null]);
    setActivePage(1);
  };

  const toggleVisibleRows = () => {
    setSelectedRows((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleRowIds.includes(id));
      }
      return Array.from(new Set([...current, ...visibleRowIds]));
    });
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setForm(createEmptyForm(dataset));
    openForm();
  };

  const openEditModal = (expense: DemoExpense) => {
    setEditingExpense(expense);
    setForm(toFormState(expense));
    openForm();
  };

  const openViewModal = (expense: DemoExpense) => {
    setViewingExpense(expense);
    openView();
  };

  const openDeleteModal = (expense: DemoExpense) => {
    setExpenseToDelete(expense);
    openDelete();
  };

  const handleSave = () => {
    const id = editingExpense?.id ?? `${dataset.kind}-${Date.now()}`;
    const nextExpense = buildExpenseFromForm(form, dataset, id);

    setRows((current) => {
      if (editingExpense) {
        return current.map((row) => (row.id === editingExpense.id ? nextExpense : row));
      }
      return [nextExpense, ...current];
    });

    setSelectedRows([]);
    setActivePage(1);
    closeForm();
  };

  const confirmDelete = () => {
    if (!expenseToDelete) return;
    setRows((current) => current.filter((row) => row.id !== expenseToDelete.id));
    setSelectedRows((current) => current.filter((id) => id !== expenseToDelete.id));
    setExpenseToDelete(null);
    closeDelete();
  };

  const confirmBulkDelete = () => {
    setRows((current) => current.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    closeBulkDelete();
  };

  const updateForm = <K extends keyof ExpenseFormState>(key: K, value: ExpenseFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const rowsMarkup = paginatedRows.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>
        <Checkbox
          checked={selectedRows.includes(row.id)}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            setSelectedRows((current) =>
              checked ? [...current, row.id] : current.filter((id) => id !== row.id)
            );
          }}
          aria-label={`Select ${row.expenseNumber}`}
        />
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={700} c="blue.7">
          {row.expenseNumber}
        </Text>
        <Text size="xs" c="dimmed">
          {formatDate(row.date)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600} c="#111827">
          {row.scopeLabel}
        </Text>
        {row.businessUnit && dataset.kind === 'project' ? (
          <Text size="xs" c="dimmed">
            {row.businessUnit}
          </Text>
        ) : null}
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>
          {row.category}
        </Text>
        <Text size="xs" c="dimmed">
          {row.subCategory}
        </Text>
        <Text size="xs" c="dimmed">
          {row.vendor}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={600}>
          {formatCurrency(row.totalAmount)}
        </Text>
        <Text size="xs" c="dimmed">
          GST {formatCurrency(row.gstAmount)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="teal" fw={600}>
          {formatCurrency(row.paidAmount)}
        </Text>
        <Text size="xs" c={row.pendingAmount > 0 ? 'red' : 'dimmed'}>
          Pending {formatCurrency(row.pendingAmount)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(row.status)} variant="light" radius="sm">
          {row.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          <ActionIcon variant="subtle" color="gray" onClick={() => openViewModal(row)} aria-label="View expense">
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="blue" onClick={() => openEditModal(row)} aria-label="Edit expense">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => openDeleteModal(row)} aria-label="Delete expense">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg" pos="relative">
      <LoadingOverlay visible={loading} zIndex={20} overlayProps={{ radius: 'sm', blur: 1 }} />

      <Box>
        <Title order={2} fw={700} c="gray.9">
          {dataset.title}
        </Title>
        <Text size="sm" c="dimmed">
          {dataset.description}
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>
            Filtered Total
          </Text>
          <Text size="lg" fw={800} c="#111827">
            {formatCurrency(summary.total)}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>
            Paid Amount
          </Text>
          <Text size="lg" fw={800} c="teal.7">
            {formatCurrency(summary.paid)}
          </Text>
        </Paper>
        <Paper withBorder radius="md" p="md">
          <Text size="xs" c="dimmed" fw={600}>
            Pending Amount
          </Text>
          <Text size="lg" fw={800} c={summary.pending > 0 ? 'red.7' : '#111827'}>
            {formatCurrency(summary.pending)}
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper
        withBorder
        radius="md"
        p="md"
        pos="sticky"
        top={0}
        style={{ zIndex: 9, backgroundColor: 'white' }}
      >
        <Stack gap="sm">
          <Group justify="space-between" align="flex-end" gap="sm">
            <TextInput
              placeholder="Search expense no, vendor, category..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                searchValue ? (
                  <ActionIcon variant="transparent" onClick={() => setSearchValue('')} aria-label="Clear search">
                    <IconX size={16} />
                  </ActionIcon>
                ) : null
              }
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.currentTarget.value);
                setActivePage(1);
              }}
              style={{ flex: '1 1 260px' }}
            />

            <Group gap="xs" wrap={isMobile ? 'nowrap' : 'wrap'} style={{ overflowX: isMobile ? 'auto' : undefined }}>
              <Button
                variant="outline"
                leftSection={<IconDownload size={17} />}
                onClick={openExport}
                style={{ flexShrink: 0 }}
              >
                Export
              </Button>
              <Button leftSection={<IconPlus size={17} />} onClick={openCreateModal} style={{ flexShrink: 0 }}>
                New Expense
              </Button>
              <Button
                color="red"
                variant="light"
                leftSection={<IconTrash size={17} />}
                disabled={selectedRows.length === 0}
                onClick={openBulkDelete}
                style={{ flexShrink: 0 }}
              >
                Delete {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
              </Button>
            </Group>
          </Group>

          <DashboardFilters
            businessUnits={businessUnitOptions}
            businessUnitPlaceholder={`All ${dataset.scopeColumnLabel}s`}
            projects={projectOptions}
            states={[]}
            statuses={expenseStatuses}
            categories={expenseCategories}
            subCategories={expenseSubCategories}
            selectedBusinessUnit={businessUnitFilter}
            onBusinessUnitChange={(value) => {
              setBusinessUnitFilter(value);
              setActivePage(1);
            }}
            selectedProject={projectFilter}
            onProjectChange={(value) => {
              setProjectFilter(value);
              setActivePage(1);
            }}
            selectedStatus={statusFilter}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setActivePage(1);
            }}
            selectedCategory={categoryFilter}
            onCategoryChange={(value) => {
              setCategoryFilter(value);
              setSubCategoryFilter(null);
              setActivePage(1);
            }}
            selectedSubCategory={subCategoryFilter}
            onSubCategoryChange={(value) => {
              setSubCategoryFilter(value);
              setActivePage(1);
            }}
            selectedDateRange={dateRangeFilter}
            onDateRangeChange={(value) => {
              setDateRangeFilter(value);
              setActivePage(1);
            }}
            onClear={resetFilters}
          />
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="sm">
          <Box>
            <Title order={5} fw={700} c="#374151">
              Expense Register
            </Title>
            <Text size="xs" c="dimmed">
              Showing {paginatedRows.length} of {filteredRows.length} filtered records
            </Text>
          </Box>
          {selectedRows.length > 0 ? (
            <Badge color="blue" variant="light">
              {selectedRows.length} selected
            </Badge>
          ) : null}
        </Group>

        <Table.ScrollContainer minWidth={1050}>
          <Table verticalSpacing="sm" striped highlightOnHover>
            <Table.Thead style={{ backgroundColor: '#F9FAFB' }}>
              <Table.Tr>
                <Table.Th w={48}>
                  <Checkbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected && !allVisibleSelected}
                    onChange={toggleVisibleRows}
                    aria-label="Select visible expenses"
                  />
                </Table.Th>
                <Table.Th>Expense</Table.Th>
                <Table.Th>{dataset.scopeColumnLabel}</Table.Th>
                <Table.Th>Category / Vendor</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Payment</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rowsMarkup.length > 0 ? (
                rowsMarkup
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Box py="xl" ta="center">
                      <Text fw={700} c="#374151">
                        No expenses found
                      </Text>
                      <Text size="sm" c="dimmed" mt={4}>
                        Adjust filters or create a new demo expense.
                      </Text>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Group justify={isMobile ? 'center' : 'space-between'} mt="md">
          <Text size="sm" c="dimmed">
            Page {currentPage} of {totalPages}
          </Text>
          <Pagination value={currentPage} onChange={setActivePage} total={totalPages} size={isMobile ? 'sm' : 'md'} />
        </Group>
      </Paper>

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingExpense ? 'Edit Expense' : 'Create New Expense'}
        size="lg"
        padding="xl"
      >
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <TextInput
              label="Expense Number"
              placeholder="Auto generated if empty"
              value={form.expenseNumber}
              onChange={(event) => updateForm('expenseNumber', event.currentTarget.value)}
            />
            <TextInput
              label="Expense Date"
              type="date"
              value={form.date}
              onChange={(event) => updateForm('date', event.currentTarget.value)}
            />
            {dataset.kind === 'company' ? (
              <TextInput
                label={dataset.formScopeLabel}
                value={form.scopeLabel}
                onChange={(event) => updateForm('scopeLabel', event.currentTarget.value)}
              />
            ) : (
              <Select
                label="Business Unit"
                data={businessUnits}
                value={form.businessUnit}
                onChange={(value) => updateForm('businessUnit', value ?? businessUnits[0])}
              />
            )}
            {dataset.kind === 'project' ? (
              <Select
                label="Project"
                data={projectNames}
                value={form.project}
                onChange={(value) => updateForm('project', value ?? projectNames[0])}
              />
            ) : null}
            <Select
              label="Category"
              data={expenseCategories}
              value={form.category}
              onChange={(value) => {
                const nextCategory = value ?? expenseCategories[0];
                setForm((current) => ({
                  ...current,
                  category: nextCategory,
                  subCategory: expenseSubCategories[nextCategory][0],
                }));
              }}
            />
            <Select
              label="Sub-Category"
              data={expenseSubCategories[form.category] ?? []}
              value={form.subCategory}
              onChange={(value) => updateForm('subCategory', value ?? expenseSubCategories[form.category][0])}
            />
            <TextInput
              label="Vendor"
              value={form.vendor}
              onChange={(event) => updateForm('vendor', event.currentTarget.value)}
            />
            <NumberInput
              label="Basic Amount"
              min={0}
              thousandSeparator=","
              value={form.basicAmount}
              onChange={(value) => updateForm('basicAmount', Number(value) || 0)}
            />
            <NumberInput
              label="GST Amount"
              min={0}
              thousandSeparator=","
              value={form.gstAmount}
              onChange={(value) => updateForm('gstAmount', Number(value) || 0)}
            />
            <NumberInput
              label="Paid Amount"
              min={0}
              thousandSeparator=","
              value={form.paidAmount}
              onChange={(value) => updateForm('paidAmount', Number(value) || 0)}
            />
            <Select
              label="Status"
              data={expenseStatuses}
              value={form.status}
              onChange={(value) => updateForm('status', (value ?? 'Under Process') as ExpenseStatus)}
            />
          </SimpleGrid>
          <Textarea
            label="Remarks"
            minRows={3}
            value={form.remarks}
            onChange={(event) => updateForm('remarks', event.currentTarget.value)}
          />
          <Divider />
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Total will be calculated as basic amount plus GST.
            </Text>
            <Group>
              <Button variant="default" onClick={closeForm}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{editingExpense ? 'Update' : 'Create'}</Button>
            </Group>
          </Group>
        </Stack>
      </Modal>

      <Modal opened={viewOpened} onClose={closeView} title="Expense Details" size="lg" padding="xl">
        {viewingExpense ? (
          <Stack gap="md">
            <Group justify="space-between">
              <Box>
                <Title order={4}>{viewingExpense.expenseNumber}</Title>
                <Text size="sm" c="dimmed">
                  {formatDate(viewingExpense.date)} · {viewingExpense.vendor}
                </Text>
                <Text size="sm" c="dimmed">
                  {viewingExpense.category} / {viewingExpense.subCategory}
                </Text>
              </Box>
              <Badge color={getStatusColor(viewingExpense.status)} variant="light">
                {viewingExpense.status}
              </Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
              <Paper withBorder p="sm">
                <Text size="xs" c="dimmed">
                  Total Amount
                </Text>
                <Text fw={800}>{formatCurrency(viewingExpense.totalAmount)}</Text>
              </Paper>
              <Paper withBorder p="sm">
                <Text size="xs" c="dimmed">
                  Paid
                </Text>
                <Text fw={800} c="teal">
                  {formatCurrency(viewingExpense.paidAmount)}
                </Text>
              </Paper>
              <Paper withBorder p="sm">
                <Text size="xs" c="dimmed">
                  Pending
                </Text>
                <Text fw={800} c={viewingExpense.pendingAmount > 0 ? 'red' : '#111827'}>
                  {formatCurrency(viewingExpense.pendingAmount)}
                </Text>
              </Paper>
            </SimpleGrid>
            <ScrollArea h={120} type="hover">
              <Text size="sm">{viewingExpense.remarks}</Text>
            </ScrollArea>
          </Stack>
        ) : null}
      </Modal>

      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Expense" centered>
        <Text size="sm">
          Delete <Text span fw={700}>{expenseToDelete?.expenseNumber}</Text>? This removes it from the current demo
          session.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Modal opened={bulkDeleteOpened} onClose={closeBulkDelete} title="Delete Selected Expenses" centered>
        <Text size="sm">
          Delete <Text span fw={700}>{selectedRows.length}</Text> selected expenses from the current demo session?
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeBulkDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmBulkDelete}>
            Delete Selected
          </Button>
        </Group>
      </Modal>

      <Modal opened={exportOpened} onClose={closeExport} title="Export Demo" centered>
        <Text size="sm">
          This demo is frontend-only, so the export action is represented as a UI flow. It would export{' '}
          <Text span fw={700}>{filteredRows.length}</Text> filtered expenses in a production build.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={closeExport}>Done</Button>
        </Group>
      </Modal>
    </Stack>
  );
}
