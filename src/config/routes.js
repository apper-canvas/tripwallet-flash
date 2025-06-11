import Dashboard from '../pages/Dashboard';
import Trips from '../pages/Trips';
import Expenses from '../pages/Expenses';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  trips: {
    id: 'trips',
    label: 'Trips',
    path: '/trips',
    icon: 'MapPin',
    component: Trips
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
    component: Expenses
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);