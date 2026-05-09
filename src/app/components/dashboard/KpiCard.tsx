import { Paper, Group, Box, Text, ThemeIcon } from '@mantine/core';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string; // Mantine color string like 'blue', 'green', 'indigo'
  isCurrency?: boolean;
}

export function KpiCard({ title, value, icon, color = 'blue', isCurrency = false }: KpiCardProps) {
  const formattedValue = isCurrency && typeof value === 'number'
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }).format(value)
    : value;

  return (
    <Paper withBorder p="md" radius="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Group justify="space-between" align="center" wrap="nowrap">
        <Box>
          <Text size="sm" c="#4B5563" fw={500}>
            {title}
          </Text>
          <Text fw={600} size="lg" mt={4} style={{ color: '#1F2937' }}>
            {formattedValue}
          </Text>
        </Box>
        <ThemeIcon
          color={color}
          variant="light"
          size={40}
          radius="md"
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
