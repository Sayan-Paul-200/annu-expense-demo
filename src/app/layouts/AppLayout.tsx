import { useEffect, useState } from 'react';
import { AppShell, Burger, Group, Title, ActionIcon, Box, Button, Avatar, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IconSettings, IconSparkle2, IconLayoutDashboard } from '@tabler/icons-react';
import { Sidebar } from '../components/Navbar/Sidebar';
import { BottomNav } from '../components/Navbar/BottomNav';
import { useAppState } from '../../lib/appState';
import { adminRoutes } from '../routes/routes.admin';
import { generateNavbarMenu } from '../routes/utils';
import { AiSummaryDrawer } from '../components/dashboard/AiSummaryDrawer';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();
  const appState = useAppState();
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Generate navbar menu based on current routes (assuming admin for now)
  const navbarMenu = generateNavbarMenu(adminRoutes, appState.role);

  useEffect(() => {
    // Role verification logic
    if (location.pathname.startsWith('/admin')) {
      setIsAuthorized(true);
    }
  }, [location.pathname, appState.role]);

  if (!isAuthorized) {
    navigate('/login');
    return null;
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}
    >
      <AppShell.Header withBorder={false} style={{ borderBottom: 'none', boxShadow: 'var(--mantine-shadow-xs)' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="xs" visibleFrom="sm">
              <ThemeIcon variant="light" size={40} radius="md" color="blue">
                <IconLayoutDashboard size={24} />
              </ThemeIcon>
              <Title order={3} fw={700} c="#111827" ml="sm">
                Dashboard
              </Title>
            </Group>
          </Group>
          <Group gap="md">
            <Button 
              variant="outline" 
              color="blue" 
              radius="xl" 
              size="sm"
              leftSection={<IconSparkle2 size={16} />}
              style={{ borderColor: '#3B82F6', color: '#3B82F6' }}
              onClick={openDrawer}
            >
              Analysis Report
            </Button>
            <ActionIcon variant="subtle" size="lg" radius="xl" color="gray">
              <IconSettings size={22} color="#6B7280" />
            </ActionIcon>
            <Avatar color="red" radius="xl" src={null} alt="User Avatar" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar style={{ borderRight: '1px solid #f1f5f9' }}>
        <Sidebar data={navbarMenu} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box pb={{ base: 80, sm: 0 }}>
          <Outlet />
        </Box>
      </AppShell.Main>

      {/* Mobile Bottom Nav */}
      <Box
        hiddenFrom="sm"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <BottomNav data={navbarMenu} />
      </Box>

      {/* Presentation Feature 1: AI Summary Drawer */}
      <AiSummaryDrawer opened={drawerOpened} onClose={closeDrawer} />
    </AppShell>
  );
}
