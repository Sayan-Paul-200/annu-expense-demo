import { useState } from 'react';
import { Group, Box, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { NavbarMenuItem } from '../../routes/types';

interface LinksGroupProps extends NavbarMenuItem {
  initiallyOpened?: boolean;
}

export function LinksGroup({ icon: Icon, label, path, initiallyOpened, children }: LinksGroupProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasLinks = Array.isArray(children) && children.length > 0;
  
  // Check if current path starts with this link's path to keep it opened
  const isPathActive = location.pathname.startsWith(path);
  const [opened, setOpened] = useState(initiallyOpened || isPathActive);
  const isExactActive = location.pathname === path;

  const items = (hasLinks ? children : []).map((link) => {
    const isChildActive = location.pathname === link.path;
    return (
      <Box
        component="a"
        className="sidebarSubLink"
        href={link.path}
        key={link.label}
        onClick={(event) => {
          event.preventDefault();
          navigate(link.path);
        }}
        style={(theme) => ({
          fontWeight: isChildActive ? 600 : 400,
          display: 'block',
          textDecoration: 'none',
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          paddingLeft: rem(31),
          marginLeft: rem(30),
          fontSize: theme.fontSizes.sm,
          color: isChildActive ? theme.colors.blue[7] : theme.colors.gray[7],
          borderLeft: `1px solid ${isChildActive ? theme.colors.blue[7] : theme.colors.gray[3]}`,
          backgroundColor: isChildActive ? theme.colors.blue[0] : 'transparent',
          '&:hover': {
            backgroundColor: theme.colors.gray[0],
            color: theme.colors.gray[9],
          },
        })}
      >
        {link.label}
      </Box>
    );
  });

  return (
    <>
      <UnstyledButton
        onClick={() => {
          if (hasLinks) {
            setOpened((o) => !o);
          } else {
            navigate(path);
          }
        }}
        style={(theme) => ({
          fontWeight: isExactActive || isPathActive ? 600 : 400,
          display: 'block',
          width: '100%',
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          color: isExactActive ? theme.colors.blue[7] : theme.colors.gray[7],
          backgroundColor: isExactActive ? theme.colors.blue[0] : 'transparent',
          borderRadius: theme.radius.sm,
          '&:hover': {
            backgroundColor: theme.colors.gray[0],
            color: theme.colors.gray[9],
          },
        })}
        className="sidebarLink"
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30} color={isExactActive || isPathActive ? 'blue' : 'gray'}>
              {Icon}
            </ThemeIcon>
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              size="1rem"
              stroke={1.5}
              style={{
                transform: opened ? 'rotate(90deg)' : 'none',
                transition: 'transform 200ms ease',
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Box style={{ display: opened ? 'block' : 'none' }}>{items}</Box> : null}
    </>
  );
}
