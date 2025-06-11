import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { tripService, expenseService } from '../services';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripsData, expensesData] = await Promise.all([
        tripService.getAll(),
        expenseService.getAll()
      ]);
      setTrips(tripsData);
      setExpenses(expensesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activeTrips = trips.filter(trip => trip.status === 'active');
  const totalBudget = activeTrips.reduce((sum, trip) => sum + trip.budget, 0);
  const totalSpent = activeTrips.reduce((sum, trip) => sum + trip.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = [
    { id: 'transport', label: 'Transport', icon: 'Car', color: 'bg-blue-100 text-blue-700' },
    { id: 'accommodation', label: 'Hotels', icon: 'Bed', color: 'bg-purple-100 text-purple-700' },
    { id: 'meals', label: 'Meals', icon: 'UtensilsCrossed', color: 'bg-green-100 text-green-700' },
    { id: 'activities', label: 'Activities', icon: 'Camera', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'other', label: 'Other', icon: 'ShoppingBag', color: 'bg-gray-100 text-gray-700' }
  ];

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getBudgetStatus = (percentage) => {
    if (percentage >= 90) return { status: 'danger', color: 'text-error', bgColor: 'bg-error' };
    if (percentage >= 75) return { status: 'warning', color: 'text-warning', bgColor: 'bg-warning' };
    return { status: 'good', color: 'text-success', bgColor: 'bg-success' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="h-2 bg-surface-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-surface-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load dashboard</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadDashboardData}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  const budgetStatus = getBudgetStatus(budgetUtilization);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Active Trips</h3>
            <ApperIcon name="MapPin" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{activeTrips.length}</p>
          <p className="text-sm text-surface-500 mt-1">
            {trips.length - activeTrips.length} completed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Total Budget</h3>
            <ApperIcon name="Wallet" className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{formatCurrency(totalBudget)}</p>
          <div className="flex items-center mt-1">
            <div className="flex-1 bg-surface-200 rounded-full h-2 mr-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${budgetStatus.bgColor}`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${budgetStatus.color}`}>
              {Math.round(budgetUtilization)}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Total Spent</h3>
            <ApperIcon name="Receipt" className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{formatCurrency(totalSpent)}</p>
          <p className="text-sm text-surface-500 mt-1">
            {formatCurrency(totalBudget - totalSpent)} remaining
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trips */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Active Trips</h3>
          </div>
          
          {activeTrips.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="MapPin" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No active trips</p>
              <p className="text-sm text-surface-500 mt-1">Create a trip to start tracking expenses</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-200">
              {activeTrips.slice(0, 3).map((trip, index) => {
                const spentPercentage = (trip.spent / trip.budget) * 100;
                const status = getBudgetStatus(spentPercentage);
                
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-4 hover:bg-surface-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-surface-900 truncate">{trip.name}</h4>
                        <p className="text-sm text-surface-600">{trip.destination}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          <div className="flex-1 bg-surface-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${status.bgColor}`}
                              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${status.color}`}>
                            {Math.round(spentPercentage)}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-surface-900">
                          {formatCurrency(trip.spent, trip.currency)}
                        </p>
                        <p className="text-sm text-surface-600">
                          of {formatCurrency(trip.budget, trip.currency)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Recent Expenses</h3>
          </div>
          
          {recentExpenses.length === 0 ? (
            <div className="p-6 text-center">
              <ApperIcon name="Receipt" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
              <p className="text-surface-600">No expenses yet</p>
              <p className="text-sm text-surface-500 mt-1">Add your first expense to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-200">
              {recentExpenses.map((expense, index) => {
                const category = categories.find(c => c.id === expense.category);
                const trip = trips.find(t => t.id === expense.tripId);
                
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="p-4 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color || 'bg-gray-100 text-gray-700'}`}>
                        <ApperIcon name={category?.icon || 'Receipt'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-surface-900 truncate">
                            {expense.merchant || category?.label || 'Expense'}
                          </p>
                          <p className="font-semibold text-surface-900">
                            {formatCurrency(expense.amount, expense.currency)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-surface-600">
                          <span>{trip?.name || 'Unknown Trip'}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const amount = expensesByCategory[category.id] || 0;
              const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + categories.indexOf(category) * 0.05 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2 ${category.color}`}>
                    <ApperIcon name={category.icon} className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-surface-900">{category.label}</p>
                  <p className="text-lg font-bold text-surface-900">{formatCurrency(amount)}</p>
                  <p className="text-xs text-surface-500">{Math.round(percentage)}%</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;