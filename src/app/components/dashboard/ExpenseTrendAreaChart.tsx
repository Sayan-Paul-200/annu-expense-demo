import { Paper, Title, Box, Group, Text } from '@mantine/core';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ExpenseTrendItem {
  month: string;
  invoiced: number;
  paid: number;
}

interface ExpenseTrendAreaChartProps {
  data: ExpenseTrendItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="sm" withBorder shadow="sm" radius="md" style={{ backgroundColor: 'white' }}>
        <Text fw={600} mb={5}>{label}</Text>
        {payload.map((entry: any, index: number) => (
          <Group key={index} justify="space-between" mb={2}>
            <Group gap="xs">
              <Box w={10} h={10} style={{ borderRadius: '50%', backgroundColor: entry.color }} />
              <Text size="sm" c="dimmed">{entry.name}</Text>
            </Group>
            <Text size="sm" fw={600}>₹ {entry.value.toFixed(1)} Cr</Text>
          </Group>
        ))}
      </Paper>
    );
  }
  return null;
};

export function ExpenseTrendAreaChart({ data }: ExpenseTrendAreaChartProps) {
  return (
    <Paper withBorder radius="md" p="md" style={{ height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
      <Group justify="space-between" mb="lg">
        <Box>
          <Title order={5} fw={600} c="#374151">
            6-Month Expense vs. Paid Trend
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            Cash flow velocity (in Crores)
          </Text>
        </Box>
      </Group>

      <Box style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FA5252" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FA5252" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#40C057" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#40C057" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#4B5563' }} />
            <Area 
              type="monotone" 
              dataKey="invoiced" 
              name="Invoiced Amount" 
              stroke="#FA5252" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorInvoiced)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="paid" 
              name="Paid Amount" 
              stroke="#40C057" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPaid)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
