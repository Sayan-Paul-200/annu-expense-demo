import { Paper, Skeleton, Group, Stack, Box } from '@mantine/core';

interface ChartSkeletonProps {
  type: 'kpi' | 'bar' | 'donut' | 'budgetTrend' | 'topCategories' | 'deductions' | 'table';
}

export function ChartSkeleton({ type }: ChartSkeletonProps) {
  if (type === 'kpi') {
    return (
      <Paper withBorder p="md" radius="md">
        <Group justify="space-between" align="center">
          <Box>
            <Skeleton height={14} width={80} mb={8} />
            <Skeleton height={24} width={120} />
          </Box>
          <Skeleton height={40} width={40} radius="md" />
        </Group>
      </Paper>
    );
  }

  if (type === 'deductions') {
    return (
      <Paper withBorder radius="md" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box p="md" pb="xs">
          <Skeleton height={20} width={100} />
        </Box>
        <Box style={{ flex: 1, padding: '0 16px' }}>
          {[...Array(6)].map((_, i) => (
            <Group key={i} justify="space-between" mb="sm">
              <Skeleton height={24} width={150} />
              <Skeleton height={24} width={60} radius="xl" />
            </Group>
          ))}
        </Box>
        <Box p="md" mt="auto">
          <Group justify="space-between">
            <Skeleton height={20} width={100} />
            <Skeleton height={20} width={80} />
          </Group>
        </Box>
      </Paper>
    );
  }

  if (type === 'budgetTrend') {
    return (
      <Paper withBorder p="md" radius="md" style={{ height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
        <Group justify="space-between" mb="md">
          <Box>
            <Skeleton height={20} width={280} mb={8} />
            <Skeleton height={12} width={220} />
          </Box>
        </Group>
        <Group gap="md" mb="lg">
          <Group gap={6}>
            <Skeleton height={10} width={10} circle />
            <Skeleton height={12} width={100} />
          </Group>
          <Group gap={6}>
            <Skeleton height={10} width={10} circle />
            <Skeleton height={12} width={104} />
          </Group>
        </Group>
        <Box style={{ flex: 1, minHeight: 0, position: 'relative', padding: '12px 8px 18px 26px' }}>
          <Stack gap={36} style={{ height: '100%' }}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={1} width="100%" />
            ))}
          </Stack>
          <Box
            style={{
              position: 'absolute',
              left: 32,
              right: 14,
              bottom: 42,
              display: 'flex',
              alignItems: 'flex-end',
              gap: '5%',
              height: '58%',
            }}
          >
            {[72, 78, 84, 88, 94, 100].map((height, index) => (
              <Box key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
                <Skeleton height={4} width="100%" radius="xl" />
                <Skeleton height={`${height}%`} width="100%" radius="sm" />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    );
  }

  if (type === 'topCategories') {
    return (
      <Paper withBorder p="md" radius="md" style={{ height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
        <Box mb="lg">
          <Skeleton height={20} width={180} mb={8} />
          <Skeleton height={12} width={160} />
        </Box>
        <Stack gap="md" style={{ flex: 1, justifyContent: 'center' }}>
          {[88, 74, 62, 48, 36].map((width, index) => (
            <Group key={index} wrap="nowrap" gap="sm">
              <Skeleton height={14} width={76} />
              <Skeleton height={20} width={`${width}%`} radius="sm" />
            </Group>
          ))}
        </Stack>
      </Paper>
    );
  }

  if (type === 'bar' || type === 'donut') {
    return (
      <Paper withBorder p="md" radius="md" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Group justify="center" mb="xl">
          <Skeleton height={20} width={200} />
        </Group>
        <Box style={{ flex: 1, minHeight: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {type === 'bar' ? (
            <>
              <Skeleton height={150} width={40} />
              <Skeleton height={200} width={40} />
              <Skeleton height={120} width={40} />
              <Skeleton height={180} width={40} />
              <Skeleton height={160} width={40} />
            </>
          ) : (
            <Skeleton height={180} circle mb="xl" />
          )}
        </Box>
        {type === 'donut' && (
          <Stack mt="md" gap="xs">
            <Skeleton height={16} width="100%" />
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="95%" />
          </Stack>
        )}
      </Paper>
    );
  }

  if (type === 'table') {
    return (
      <Box mt="xl">
        <Group justify="space-between" mb="md">
          <Skeleton height={24} width={150} />
          <Skeleton height={30} width={120} radius="xl" />
        </Group>
        <Paper withBorder radius="md" p="md">
          <Stack>
            <Skeleton height={40} width="100%" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={30} width="100%" />
            ))}
          </Stack>
        </Paper>
      </Box>
    );
  }

  return null;
}
