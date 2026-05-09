import { useState } from 'react';
import { Box, Table, Group, Button, TextInput, ActionIcon, Title, Paper, Pagination } from '@mantine/core';
import { IconSearch, IconDownload, IconPlus, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { FormModal } from '../FormComponents/FormModal';
import type { FormFieldConfig } from '../FormComponents/FormModal';

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface MasterDataPageProps {
  title: string;
  apiEndpoint: string;
  columns: ColumnConfig[];
  formConfig: FormFieldConfig[];
  // Props for demo purposes (usually data is fetched inside based on apiEndpoint)
  mockData?: any[];
}

export function MasterDataPage({ title, columns, formConfig, mockData = [] }: MasterDataPageProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const [activePage, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleAddNew = () => {
    setEditingRecord(null);
    open();
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    open();
  };

  const handleDelete = (record: any) => {
    console.log('Delete', record);
  };

  const handleFormSubmit = async (values: Record<string, any>): Promise<void> => {
    console.log('Submit', values);
    // Submit to API
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const filteredData = mockData.filter((item) => {
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const rows = filteredData.map((element, index) => (
    <Table.Tr key={element.id || index}>
      {columns.map((col) => (
        <Table.Td key={col.key} className="tableText">
          {col.render ? col.render(element) : element[col.key]}
        </Table.Td>
      ))}
      <Table.Td>
        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray">
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(element)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(element)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={3} className="brandText">{title}</Title>
      </Group>

      <Paper withBorder radius="md" p="md">
        <Group justify="space-between" mb="md">
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ width: '300px' }}
          />
          <Group>
            <Button variant="default" leftSection={<IconDownload size={16} />}>
              Export
            </Button>
            <Button color="blue" leftSection={<IconPlus size={16} />} onClick={handleAddNew}>
              Add New
            </Button>
          </Group>
        </Group>

        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                {columns.map((col) => (
                  <Table.Th key={col.key} className="tableText">{col.label}</Table.Th>
                ))}
                <Table.Th className="tableText">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows.length > 0 ? rows : (
              <Table.Tr>
                <Table.Td colSpan={columns.length + 1} align="center" py="xl">
                  No records found
                </Table.Td>
              </Table.Tr>
            )}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Group justify="flex-end" mt="md">
          <Pagination value={activePage} onChange={setPage} total={10} color="blue" size="sm" />
        </Group>
      </Paper>

      <FormModal
        opened={opened}
        onClose={close}
        title={editingRecord ? `Edit ${title}` : `Add ${title}`}
        fields={formConfig}
        initialValues={editingRecord}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
}
