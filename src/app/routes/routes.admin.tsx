import { lazy } from 'react';
import type { AppRoute } from './types';
import { 
  IconLayoutDashboard, 
  IconFileInvoice, 
  IconBriefcase, 
  IconClipboardList, 
  IconShoppingCart, 
  IconCategory, 
  IconUsers, 
  IconHistory 
} from '@tabler/icons-react';

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

export const adminRoutes: AppRoute[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: <IconLayoutDashboard size={20} />,
    element: <AdminDashboard />,
  },
  {
    label: 'Invoices',
    path: '/admin/invoices',
    icon: <IconFileInvoice size={20} />,
    // element: <div />, 
  },
  {
    label: 'Projects',
    path: '/admin/projects',
    icon: <IconBriefcase size={20} />,
  },
  {
    label: 'Work Orders',
    path: '/admin/work-orders',
    icon: <IconClipboardList size={20} />,
  },
  {
    label: 'Purchase Orders',
    path: '/admin/purchase-orders',
    icon: <IconShoppingCart size={20} />,
  },
  {
    label: 'Commons',
    path: '/admin/commons',
    icon: <IconCategory size={20} />,
    children: [
      {
        label: 'Taxes',
        path: '/admin/commons/taxes',
      }
    ]
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <IconUsers size={20} />,
    children: [
      {
        label: 'Staff',
        path: '/admin/users/staff',
      }
    ]
  },
  {
    label: 'Audit Logs',
    path: '/admin/audit-logs',
    icon: <IconHistory size={20} />,
  },
];
