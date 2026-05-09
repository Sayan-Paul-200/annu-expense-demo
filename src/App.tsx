import './styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { generateRouterConfig } from './app/routes/utils';
import { adminRoutes } from './app/routes/routes.admin';
import { AppLayout } from './app/layouts/AppLayout';
import { lazy, Suspense } from 'react';



const Login = lazy(() => import('./app/pages/default/Login'));
const NotFound = lazy(() => import('./app/pages/default/NotFound'));

// Combine and generate routes
const routerConfig = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin" replace />,
      },
      ...generateRouterConfig(adminRoutes),
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routerConfig);

const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
  colors: {
    blue: [
      '#eff6ff',
      '#dbeafe',
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af',
      '#1e3a8a',
    ],
  },
  components: {
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'none',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'none',
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  );
}