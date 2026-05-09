import { ScrollArea, Box, Title, Group, Avatar, Text, Badge, ThemeIcon } from '@mantine/core';
import { LinksGroup } from './LinksGroup';
import type { NavbarMenuItem } from '../../routes/types';
import { useAppState } from '../../../lib/appState';
import { IconTriangleFilled } from '@tabler/icons-react';

interface SidebarProps {
  data: NavbarMenuItem[];
}

export function Sidebar({ data }: SidebarProps) {
  const links = data.map((item) => <LinksGroup {...item} key={item.label} />);
  const appState = useAppState();

  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box p="md" mt="xs" mb="xs">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="gradient" gradient={{ from: 'red', to: 'yellow' }} size={32} radius="md" style={{ transform: 'rotate(180deg)' }}>
            <IconTriangleFilled size={20} />
          </ThemeIcon>
          <Box>
            <Title order={5} fw={700} c="#111827" style={{ lineHeight: 1.2 }}>
              Annu Projects Ltd.
            </Title>
            <Text size="xs" c="dimmed" style={{ lineHeight: 1 }}>
              v4.1.0
            </Text>
          </Box>
        </Group>
      </Box>

      <ScrollArea style={{ flex: 1, padding: '0 16px' }}>
        <Box mt="md">{links}</Box>
      </ScrollArea>

      <Box p="md" style={{ borderTop: '1px solid #E5E7EB' }}>
        <Group wrap="nowrap">
          <Avatar src={appState.profilePhotoUrl} radius="xl" color="red" />
          <Box style={{ flex: 1 }}>
            <Text size="sm" fw={600} c="#111827" style={{ lineHeight: 1.2 }}>
              System Admin
            </Text>
            <Group gap={4} mt={2}>
              <Badge color="blue" variant="light" size="xs" radius="sm" style={{ letterSpacing: '0.5px' }}>
                ADMIN
              </Badge>
            </Group>
            <Text size="xs" fw={600} c="grape" mt={2} style={{ fontSize: '10px' }}>
              All Projects
            </Text>
          </Box>
        </Group>
      </Box>
    </Box>
  );
}
