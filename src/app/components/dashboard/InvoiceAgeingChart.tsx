import { Paper, Title, Box } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AgeingData {
  range: string;
  invoiceDate: number;
  submissionDate: number;
}

interface InvoiceAgeingChartProps {
  data: AgeingData[];
}

export function InvoiceAgeingChart({ data }: InvoiceAgeingChartProps) {
  return (
    <Paper withBorder p="md" radius="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title order={5} fw={600} c="#374151" ta="center" mb="xl">
        Invoice Ageing Status
      </Title>

      <Box style={{ flex: 1, minHeight: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }} 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="invoiceDate" name="Invoice Date" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="submissionDate" name="Submission Date" fill="#FCD34D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
