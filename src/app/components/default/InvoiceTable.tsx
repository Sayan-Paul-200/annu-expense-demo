import { Paper, Table, Text, Badge, Group, Title, Button, Box } from '@mantine/core';

interface Invoice {
  sNo: number;
  invoiceNo: string;
  date: string;
  basicAmt: number;
  gstAmt: number;
  totalAmt: number;
  deduction: number;
  netPayable: number;
  paid: number;
  pending: number;
  status: string;
}

interface InvoiceTableProps {
  data: Invoice[];
}

export function InvoiceTable({ data }: InvoiceTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'teal.5'; // Lighter green
      case 'cancelled':
        return 'red.6';
      case 'declined':
        return 'red.9';
      case 'under process':
        return 'yellow.6';
      case 'credit note issued':
        return 'blue.5';
      default:
        return 'gray';
    }
  };

  const rows = data.map((item) => (
    <Table.Tr key={item.invoiceNo}>
      <Table.Td><Text size="sm" fw={600} c="#111827">{item.sNo}</Text></Table.Td>
      <Table.Td><Text size="sm" c="blue" fw={500} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{item.invoiceNo}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.date}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.basicAmt.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.gstAmt.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.totalAmt.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.deduction.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.netPayable.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.paid.toFixed(2)}</Text></Table.Td>
      <Table.Td><Text size="sm" c="#111827" fw={500}>{item.pending.toFixed(2)}</Text></Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(item.status)} variant="filled" radius="sm" size="sm" style={{ textTransform: 'none', fontWeight: 600 }}>
          {item.status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  // Calculate totals
  const totalBasic = data.reduce((acc, curr) => acc + curr.basicAmt, 0);
  const totalGst = data.reduce((acc, curr) => acc + curr.gstAmt, 0);
  const totalAmt = data.reduce((acc, curr) => acc + curr.totalAmt, 0);
  const totalDeduction = data.reduce((acc, curr) => acc + curr.deduction, 0);
  const totalNet = data.reduce((acc, curr) => acc + curr.netPayable, 0);
  const totalPaid = data.reduce((acc, curr) => acc + curr.paid, 0);
  const totalPending = data.reduce((acc, curr) => acc + curr.pending, 0);

  return (
    <Box mt="xl">
      <Group justify="space-between" mb="md">
        <Title order={4} fw={600} c="#111827">Latest Invoices</Title>
        <Button variant="outline" color="blue" size="xs" radius="xl">View All Invoices</Button>
      </Group>

      <Paper withBorder radius="md">
        <Table.ScrollContainer minWidth={1000}>
          <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Text size="xs" fw={700}>S.No</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Invoice No</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Invoice Date</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Basic Amt</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>GST Amt</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Total Amt</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Deduction</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Net Payable</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Paid</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Pending</Text></Table.Th>
                <Table.Th><Text size="xs" fw={700}>Status</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows}
              <Table.Tr style={{ backgroundColor: '#F9FAFB' }}>
                <Table.Td colSpan={3} align="center"><Text size="sm" fw={700}>Total</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalBasic.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalGst.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalAmt.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalDeduction.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalNet.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalPaid.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td><Text size="sm" fw={600} c="blue">₹ {totalPending.toLocaleString('en-IN')}</Text></Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Box>
  );
}
