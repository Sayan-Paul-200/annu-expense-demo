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
    <Paper withBorder p="xs" radius="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', minWidth: 0 }}>
      <Group justify="space-between" align="center" wrap="nowrap" gap={4}>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="xs" c="#4B5563" fw={500} truncate>
            {title}
          </Text>
          <Text fw={700} size="sm" mt={2} style={{ color: '#1F2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formattedValue}
          </Text>
        </Box>
        <ThemeIcon
          color={color}
          variant="light"
          size={32}
          radius="md"
          style={{ flexShrink: 0 }}
        >
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
