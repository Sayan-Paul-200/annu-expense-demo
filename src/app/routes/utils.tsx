import { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { AppRoute, NavbarMenuItem } from './types';

export function generateRouterConfig(routes: AppRoute[]): RouteObject[] {
  const result: RouteObject[] = [];

  const processRoutes = (routeList: AppRoute[], parentPath = '') => {
    routeList.forEach((route) => {
      const fullPath = `${parentPath}${route.path}`.replace(/\/+/g, '/');

      if (route.element) {
        result.push({
          path: fullPath,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              {route.element}
            </Suspense>
          ),
        });
      }

      if (route.children && route.children.length > 0) {
        processRoutes(route.children, fullPath);
      }
    });
  };

  processRoutes(routes);
  return result;
}

export function generateNavbarMenu(
  routes: AppRoute[],
  _userRole?: string | null,
  userPermissions?: string[]
): NavbarMenuItem[] {
  const filterRoutes = (routeList: AppRoute[]): NavbarMenuItem[] => {
    return routeList
      .filter((route) => {
        if (route.hidden) return false;
        
        // Simple permission check (can be expanded based on complex requirements)
        if (route.permissions && route.permissions.length > 0) {
           if (!userPermissions || !route.permissions.some(p => userPermissions.includes(p))) {
             return false;
           }
        }
        return true;
      })
      .map((route) => {
        const item: NavbarMenuItem = { ...route };
        if (item.children) {
          item.children = filterRoutes(item.children);
        }
        return item;
      });
  };

  return filterRoutes(routes);
}
