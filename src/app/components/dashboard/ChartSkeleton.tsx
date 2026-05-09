import { Paper, Skeleton, Group, Stack, Box } from '@mantine/core';

interface ChartSkeletonProps {
  type: 'kpi' | 'bar' | 'donut' | 'deductions' | 'table';
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
