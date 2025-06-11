import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { tripService, expenseService, exchangeRateService } from '../services';

const MainFeature = () => {
  const [activeTrips, setActiveTrips] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickExpense, setQuickExpense] = useState({
    tripId: '',
    amount: '',
    category: 'meals',
    currency: 'USD',
    merchant: '',
    notes: ''
  });

  const categories = [
    { id: 'transport', label: 'Transport', icon: 'Car', color: 'bg-blue-100 text-blue-700' },
    { id: 'accommodation', label: 'Hotels', icon: 'Bed', color: 'bg-purple-100 text-purple-700' },
    { id: 'meals', label: 'Meals', icon: 'UtensilsCrossed', color: 'bg-green-100 text-green-700' },
    { id: 'activities', label: 'Activities', icon: 'Camera', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'other', label: 'Other', icon: 'ShoppingBag', color: 'bg-gray-100 text-gray-700' }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [trips, expenses, rates] = await Promise.all([
        tripService.getAll(),
        expenseService.getAll(),
        exchangeRateService.getAll()
      ]);

      const active = trips.filter(trip => trip.status === 'active');
      setActiveTrips(active);
      
      const recent = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentExpenses(recent);
      
      setExchangeRates(rates);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickExpense.tripId || !quickExpense.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const selectedTrip = activeTrips.find(t => t.id === quickExpense.tripId);
      const baseAmount = parseFloat(quickExpense.amount);
      
      // Convert to trip currency if different
      let convertedAmount = baseAmount;
      if (quickExpense.currency !== selectedTrip.currency) {
        const rate = exchangeRates.find(r => 
          r.from === quickExpense.currency && r.to === selectedTrip.currency
        );
        if (rate) {
          convertedAmount = baseAmount * rate.rate;
        }
      }

      const newExpense = {
        ...quickExpense,
        amount: baseAmount,
        convertedAmount,
        date: new Date().toISOString(),
        isReimbursable: true,
        receiptUrl: null
      };

      await expenseService.create(newExpense);
      
      // Update trip spent amount
      const updatedTrip = {
        ...selectedTrip,
        spent: selectedTrip.spent + convertedAmount
      };
      await tripService.update(selectedTrip.id, updatedTrip);
      
      toast.success('Expense added successfully!');
      setShowQuickAdd(false);
      setQuickExpense({
        tripId: '',
        amount: '',
        category: 'meals',
        currency: 'USD',
        merchant: '',
        notes: ''
      });
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const getBudgetStatus = (trip) => {
    const percentage = (trip.spent / trip.budget) * 100;
    if (percentage >= 90) return { status: 'danger', color: 'text-error' };
    if (percentage >= 75) return { status: 'warning', color: 'text-warning' };
    return { status: 'good', color: 'text-success' };
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-surface-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-surface-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Quick Add Expense</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-surface-200 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
        >
          <ApperIcon name="Upload" className="w-4 h-4" />
          <span>Scan Receipt</span>
        </motion.button>
      </div>

      {/* Active Trips Overview */}
      {activeTrips.length === 0 ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No active trips</h3>
          <p className="mt-2 text-surface-500">Create your first trip to start tracking expenses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Create Trip
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTrips.map((trip, index) => {
            const budgetStatus = getBudgetStatus(trip);
            const spentPercentage = Math.min((trip.spent / trip.budget) * 100, 100);
            
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-surface-900 truncate">{trip.name}</h3>
                    <p className="text-sm text-surface-600">{trip.destination}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-surface-500 bg-surface-100 px-2 py-1 rounded-full">
                    <ApperIcon name="Calendar" className="w-3 h-3" />
                    <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Budget Progress Ring */}
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-all duration-500 ${
                        budgetStatus.status === 'danger' ? 'text-error' :
                        budgetStatus.status === 'warning' ? 'text-warning' : 'text-success'
                      }`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${spentPercentage}, 100`}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-surface-900">
                      {Math.round(spentPercentage)}%
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-surface-600">
                    {formatCurrency(trip.spent, trip.currency)} of {formatCurrency(trip.budget, trip.currency)}
                  </p>
                  <p className={`text-xs font-medium ${budgetStatus.color}`}>
                    {formatCurrency(trip.budget - trip.spent, trip.currency)} remaining
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Recent Expenses</h3>
          </div>
          <div className="divide-y divide-surface-200">
            {recentExpenses.map((expense, index) => {
              const category = categories.find(c => c.id === expense.category);
              const trip = activeTrips.find(t => t.id === expense.tripId);
              
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
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
        </div>
      )}

      {/* Currency Converter Widget */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Live Exchange Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exchangeRates.slice(0, 4).map((rate, index) => (
            <motion.div
              key={`${rate.from}-${rate.to}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-surface-50 rounded-lg"
            >
              <div className="flex items-center justify-center space-x-1 mb-2">
                <span className="text-xs font-medium text-surface-600">{rate.from}</span>
                <ApperIcon name="ArrowRight" className="w-3 h-3 text-surface-400" />
                <span className="text-xs font-medium text-surface-600">{rate.to}</span>
              </div>
              <p className="font-bold text-surface-900">{rate.rate.toFixed(4)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Add Expense Modal */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowQuickAdd(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Quick Add Expense</h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
              </button>
            </div>

            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Trip *</label>
                <select
                  value={quickExpense.tripId}
                  onChange={(e) => setQuickExpense({ ...quickExpense, tripId: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a trip</option>
                  {activeTrips.map(trip => (
                    <option key={trip.id} value={trip.id}>{trip.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={quickExpense.amount}
                    onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Currency</label>
                  <select
                    value={quickExpense.currency}
                    onChange={(e) => setQuickExpense({ ...quickExpense, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {currencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select
                  value={quickExpense.category}
                  onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Merchant</label>
                <input
                  type="text"
                  value={quickExpense.merchant}
                  onChange={(e) => setQuickExpense({ ...quickExpense, merchant: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Restaurant, Hotel, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                <textarea
                  value={quickExpense.notes}
                  onChange={(e) => setQuickExpense({ ...quickExpense, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="2"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
                >
                  Add Expense
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MainFeature;