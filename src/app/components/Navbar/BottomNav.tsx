import { Box, Group, UnstyledButton, Text } from '@mantine/core';
import type { NavbarMenuItem } from '../../routes/types';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  data: NavbarMenuItem[];
}

export function BottomNav({ data }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = data.slice(0, 5).map((item) => {
    const isActive = location.pathname.startsWith(item.path);
    return (
      <UnstyledButton
        key={item.label}
        onClick={() => navigate(item.path)}
        style={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          color: isActive ? theme.colors.blue[6] : theme.colors.gray[6],
        })}
      >
        {item.icon}
        <Text size="xs" mt={4} style={{ fontSize: '10px' }}>
          {item.label}
        </Text>
      </UnstyledButton>
    );
  });

  return (
    <Box
      style={(theme) => ({
        height: '65px',
        backgroundColor: '#ffffff',
        borderTop: `1px solid ${theme.colors.gray[2]}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
      })}
    >
      <Group grow style={{ width: '100%' }} gap={0}>
        {links}
      </Group>
    </Box>
  );
}
