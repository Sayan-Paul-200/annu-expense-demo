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
  allottedBudget: number;
  utilizedBudget: number;
}

interface ExpenseTrendAreaChartProps {
  data: ExpenseTrendItem[];
}

interface TrendTooltipPayload {
  color?: string;
  name?: string;
  value?: number;
}

interface TrendTooltipProps {
  active?: boolean;
  payload?: TrendTooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TrendTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="sm" withBorder shadow="sm" radius="md" style={{ backgroundColor: 'white' }}>
        <Text fw={600} mb={5}>{label}</Text>
        {payload.map((entry, index) => (
          <Group key={index} justify="space-between" mb={2}>
            <Group gap="xs">
              <Box w={10} h={10} style={{ borderRadius: '50%', backgroundColor: entry.color }} />
              <Text size="sm" c="dimmed">{entry.name}</Text>
            </Group>
            <Text size="sm" fw={600}>₹ {(entry.value ?? 0).toFixed(1)} Cr</Text>
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
            6-Month Allotted vs. Utilized Budget Trend
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            Budget allocation and utilization movement (in Crores)
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
              <linearGradient id="colorAllottedBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUtilizedBudget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
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
              dataKey="allottedBudget" 
              name="Allotted Budget" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorAllottedBudget)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="utilizedBudget" 
              name="Utilized Budget" 
              stroke="#F59E0B" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorUtilizedBudget)" 
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
