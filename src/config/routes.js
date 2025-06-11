import HomePage from '@/components/pages/HomePage';
import TripsPage from '@/components/pages/TripsPage';
import ExpensesPage from '@/components/pages/ExpensesPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: HomePage
  },
  trips: {
    id: 'trips',
    label: 'Trips',
    path: '/trips',
    icon: 'MapPin',
component: TripsPage
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: 'Receipt',
component: ExpensesPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'FileText',
component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
component: SettingsPage
  }
};

export const routeArray = Object.values(routes);