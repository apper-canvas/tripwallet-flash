import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const currentRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-surface-200 bg-white z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-heading font-semibold text-surface-900">TripWallet AI</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
        >
          <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-surface-700" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-surface-50 border-r border-surface-200">
          {/* Logo */}
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Wallet" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-surface-900">TripWallet AI</h1>
                <p className="text-xs text-surface-600">Smart Travel Expenses</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-white hover:text-surface-900 hover:shadow-sm'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-surface-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-success rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">Business Traveler</p>
                <p className="text-xs text-surface-600 truncate">Free Plan</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-70 bg-white border-r border-surface-200 z-50"
            >
              <div className="p-4 border-b border-surface-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name="Wallet" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-heading font-bold text-surface-900">TripWallet AI</h1>
                    <p className="text-xs text-surface-600">Smart Travel Expenses</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {routeArray.map((route) => (
                  <NavLink
                    key={route.id}
                    to={route.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-surface-700 hover:bg-surface-50 hover:text-surface-900'
                      }`
                    }
                  >
                    <ApperIcon name={route.icon} className="w-5 h-5" />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <div className="p-4 lg:p-6 max-w-full">
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-surface-900">
                {currentRoute?.label || 'Dashboard'}
              </h2>
              <p className="text-surface-600 mt-1">
                {currentRoute?.id === 'dashboard' && 'Monitor your travel expenses and budgets'}
                {currentRoute?.id === 'trips' && 'Manage your trips and track spending'}
                {currentRoute?.id === 'expenses' && 'View and organize all your expenses'}
                {currentRoute?.id === 'reports' && 'Generate and export expense reports'}
                {currentRoute?.id === 'settings' && 'Configure your preferences and settings'}
              </p>
            </div>

            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden bg-white border-t border-surface-200 px-4 py-2">
        <div className="flex justify-around">
          {routeArray.slice(0, 4).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-surface-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{route.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;