import { Drawer, Text, ThemeIcon, Group, Box, Divider, List } from '@mantine/core';
import { IconRobot, IconAlertTriangle, IconTrendingUp, IconCashBanknote } from '@tabler/icons-react';

interface AiSummaryDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function AiSummaryDrawer({ opened, onClose }: AiSummaryDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon size={32} radius="md" variant="light" color="grape">
            <IconRobot size={20} />
          </ThemeIcon>
          <Text fw={700} size="lg" c="gray.9">AI Executive Summary</Text>
        </Group>
      }
      position="right"
      size="md"
      padding="lg"
      styles={{
        title: { width: '100%' },
        header: { borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }
      }}
    >
      <Box mt="md">
        <Text size="sm" c="dimmed" mb="lg">
          Auto-generated insights based on the current dashboard filters and real-time financial data.
        </Text>

        <Group wrap="nowrap" align="flex-start" mb="lg">
          <ThemeIcon size={24} radius="xl" color="red" variant="light" mt={2}>
            <IconAlertTriangle size={14} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="sm" c="gray.9">Budget Criticality</Text>
            <Text size="sm" c="gray.7" mt={4}>
              The <Text span fw={700}>NFS Project</Text> (Telecom BU) is currently at <Text span c="red" fw={700}>95.8%</Text> utilization. Immediate intervention is recommended to prevent budget overrun.
            </Text>
          </Box>
        </Group>

        <Divider my="md" variant="dashed" />

        <Group wrap="nowrap" align="flex-start" mb="lg">
          <ThemeIcon size={24} radius="xl" color="green" variant="light" mt={2}>
            <IconTrendingUp size={14} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="sm" c="gray.9">Budget Utilization Velocity</Text>
            <Text size="sm" c="gray.7" mt={4}>
              Utilized budget increased by 23% month-over-month in March, while allotted budget expanded more gradually. Review high-burn projects before the next allocation cycle.
            </Text>
          </Box>
        </Group>

        <Divider my="md" variant="dashed" />

        <Group wrap="nowrap" align="flex-start">
          <ThemeIcon size={24} radius="xl" color="blue" variant="light" mt={2}>
            <IconCashBanknote size={14} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="sm" c="gray.9">Top Expenditure Anomalies</Text>
            <List size="sm" mt={8} spacing="xs" c="gray.7">
              <List.Item>Material expenses account for 45% of total spend this quarter.</List.Item>
              <List.Item>Equipment Maintenance under Plant & Machinery is 22% higher than the historical average.</List.Item>
            </List>
          </Box>
        </Group>
      </Box>
    </Drawer>
  );
}
