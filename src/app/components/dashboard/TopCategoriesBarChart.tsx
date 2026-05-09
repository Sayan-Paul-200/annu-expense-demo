import { Paper, Title, Box, Text, Group } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface CategoryData {
  name: string;
  value: number;
}

interface TopCategoriesBarChartProps {
  data: CategoryData[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="xs" withBorder shadow="sm" radius="md" style={{ backgroundColor: 'white' }}>
        <Text size="sm" fw={600} mb={2}>{payload[0].payload.name}</Text>
        <Text size="sm" c="dimmed">₹ {payload[0].value.toFixed(1)} Cr</Text>
      </Paper>
    );
  }
  return null;
};

export function TopCategoriesBarChart({ data }: TopCategoriesBarChartProps) {
  return (
    <Paper withBorder radius="md" p="md" style={{ height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
      <Group justify="space-between" mb="lg">
        <Box>
          <Title order={5} fw={600} c="#374151">
            Top Expense Categories
          </Title>
          <Text size="xs" c="dimmed" mt={4}>
            Highest spending areas (in Crores)
          </Text>
        </Box>
      </Group>

      <Box style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: -10, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} 
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
