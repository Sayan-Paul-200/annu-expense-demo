import React from 'react';

export type NavbarMenuItem = {
  label: string;
  icon?: any; // Tabler Icon or SVG string
  path: string;
  element?: React.ReactNode;
  children?: NavbarMenuItem[];
  hidden?: boolean;
  permissions?: string[];
};

export type AppRoute = NavbarMenuItem;
