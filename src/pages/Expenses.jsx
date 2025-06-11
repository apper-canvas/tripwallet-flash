import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { expenseService, tripService } from '../services';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    tripId: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [formData, setFormData] = useState({
    tripId: '',
    amount: '',
    currency: 'USD',
    category: 'meals',
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    isReimbursable: true
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
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesData, tripsData] = await Promise.all([
        expenseService.getAll(),
        tripService.getAll()
      ]);
      setExpenses(expensesData);
      setTrips(tripsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tripId || !formData.amount) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        convertedAmount: parseFloat(formData.amount) // Simplified - would normally convert currencies
      };

      if (editingExpense) {
        await expenseService.update(editingExpense.id, expenseData);
        toast.success('Expense updated successfully!');
      } else {
        await expenseService.create(expenseData);
        toast.success('Expense added successfully!');
      }

      setShowModal(false);
      setEditingExpense(null);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(editingExpense ? 'Failed to update expense' : 'Failed to add expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      tripId: expense.tripId,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      merchant: expense.merchant || '',
      date: expense.date.split('T')[0],
      notes: expense.notes || '',
      isReimbursable: expense.isReimbursable
    });
    setShowModal(true);
  };

  const handleDelete = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expenseService.delete(expenseId);
      toast.success('Expense deleted successfully!');
      loadData();
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const resetForm = () => {
    setFormData({
      tripId: '',
      amount: '',
      currency: 'USD',
      category: 'meals',
      merchant: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      isReimbursable: true
    });
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter(expense => {
      if (filters.tripId && expense.tripId !== filters.tripId) return false;
      if (filters.category && expense.category !== filters.category) return false;
      if (filters.dateFrom && expense.date < filters.dateFrom) return false;
      if (filters.dateTo && expense.date > filters.dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-surface-200">
            <div className="h-5 bg-surface-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="divide-y divide-surface-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load expenses</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-surface-900">All Expenses</h2>
          <p className="text-surface-600">{filteredAndSortedExpenses.length} expenses</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Expense</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Trip</label>
            <select
              value={filters.tripId}
              onChange={(e) => setFilters({ ...filters, tripId: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">All trips</option>
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>{trip.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">All categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Expenses</h3>
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="merchant">Sort by Merchant</option>
                <option value="category">Sort by Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <ApperIcon 
                  name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                  className="w-4 h-4 text-surface-600" 
                />
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <ApperIcon name="Receipt" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">No expenses found</h3>
            <p className="text-surface-500 mb-4">
              {expenses.length === 0 
                ? 'Add your first expense to get started'
                : 'Try adjusting your filters'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
            >
              Add Expense
            </motion.button>
          </div>
        ) : (
          <div className="divide-y divide-surface-200">
            {filteredAndSortedExpenses.map((expense, index) => {
              const category = categories.find(c => c.id === expense.category);
              const trip = trips.find(t => t.id === expense.tripId);
              
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color || 'bg-gray-100 text-gray-700'}`}>
                        <ApperIcon name={category?.icon || 'Receipt'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-surface-900 truncate">
                            {expense.merchant || category?.label || 'Expense'}
                          </p>
                          {expense.isReimbursable && (
                            <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                              Reimbursable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-surface-600">
                          <span>{trip?.name || 'Unknown Trip'}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{category?.label}</span>
                        </div>
                        {expense.notes && (
                          <p className="text-sm text-surface-500 mt-1 truncate">{expense.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-surface-900">
                          {formatCurrency(expense.amount, expense.currency)}
                        </p>
                        {expense.currency !== 'USD' && expense.convertedAmount !== expense.amount && (
                          <p className="text-sm text-surface-500">
                            {formatCurrency(expense.convertedAmount, 'USD')}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-surface-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Expense Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowModal(false);
              setEditingExpense(null);
              resetForm();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingExpense(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Trip *</label>
                  <select
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a trip</option>
                    {trips.map(trip => (
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
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
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
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Merchant/Description</label>
                  <input
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Restaurant, Hotel, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="3"
                    placeholder="Optional notes..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="reimbursable"
                    checked={formData.isReimbursable}
                    onChange={(e) => setFormData({ ...formData, isReimbursable: e.target.checked })}
                    className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="reimbursable" className="ml-2 text-sm text-surface-700">
                    This expense is reimbursable
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingExpense(null);
                      resetForm();
                    }}
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
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;