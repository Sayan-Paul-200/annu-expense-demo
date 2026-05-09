import { Paper, Title, Box, Text, Group, Table, Badge, Progress, ScrollArea } from '@mantine/core';

interface ProjectBudget {
  id: number;
  name: string;
  bu: string;
  allocated: number;
  utilized: number;
  status: string;
}

interface ProjectBudgetTableProps {
  data: ProjectBudget[];
}

export function ProjectBudgetTable({ data }: ProjectBudgetTableProps) {
  
  const formatCurrency = (value: number) => {
    // Format to Crores for presentation readability
    return `₹ ${(value / 10000000).toFixed(2)} Cr`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'teal';
      case 'At Risk': return 'orange';
      case 'Critical': return 'red';
      default: return 'gray';
    }
  };

  const rows = data.map((project) => {
    const utilizationPct = (project.utilized / project.allocated) * 100;
    const balance = project.allocated - project.utilized;
    
    // Determine progress bar color based on utilization %
    let progressColor = 'teal';
    if (utilizationPct > 85) progressColor = 'orange';
    if (utilizationPct > 95) progressColor = 'red';

    return (
      <Table.Tr key={project.id}>
        <Table.Td>
          <Text size="sm" fw={600} c="#111827">{project.name}</Text>
          <Text size="xs" c="dimmed">{project.bu}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500} c="#4B5563">{formatCurrency(project.allocated)}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={500} c="#4B5563">{formatCurrency(project.utilized)}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm" fw={600} c={balance < 0 ? 'red' : '#111827'}>
            {formatCurrency(balance)}
          </Text>
        </Table.Td>
        <Table.Td style={{ width: '200px' }}>
          <Group justify="space-between" mb={4}>
            <Text size="xs" fw={600} c={progressColor}>{utilizationPct.toFixed(1)}%</Text>
          </Group>
          <Progress value={utilizationPct} color={progressColor} size="sm" radius="xl" />
        </Table.Td>
        <Table.Td>
          <Badge color={getStatusColor(project.status)} variant="light">
            {project.status}
          </Badge>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Paper withBorder radius="md" p="md" style={{ backgroundColor: 'white' }}>
      <Box mb="md">
        <Title order={5} fw={600} c="#374151">
          Top Projects Budget Utilization
        </Title>
        <Text size="xs" c="dimmed" mt={4}>
          Financial health and remaining balance per active project
        </Text>
      </Box>

      <ScrollArea>
        <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
          <Table.Thead style={{ backgroundColor: '#F9FAFB' }}>
            <Table.Tr>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Project / BU</Table.Th>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Allocated Budget</Table.Th>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Utilized Expense</Table.Th>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Balance</Table.Th>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Utilization %</Table.Th>
              <Table.Th style={{ color: '#4B5563', fontWeight: 600 }}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
