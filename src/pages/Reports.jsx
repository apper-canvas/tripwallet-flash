import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { expenseService, tripService } from '../services';
import { format } from 'date-fns';

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    tripId: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    reimbursableOnly: false
  });

  const categories = [
    { id: 'transport', label: 'Transport' },
    { id: 'accommodation', label: 'Hotels' },
    { id: 'meals', label: 'Meals' },
    { id: 'activities', label: 'Activities' },
    { id: 'other', label: 'Other' }
  ];

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

  const filteredExpenses = expenses.filter(expense => {
    if (reportFilters.tripId && expense.tripId !== reportFilters.tripId) return false;
    if (reportFilters.category && expense.category !== reportFilters.category) return false;
    if (reportFilters.dateFrom && expense.date < reportFilters.dateFrom) return false;
    if (reportFilters.dateTo && expense.date > reportFilters.dateTo) return false;
    if (reportFilters.reimbursableOnly && !expense.isReimbursable) return false;
    return true;
  });

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const generateCSV = () => {
    const headers = [
      'Trip',
      'Date',
      'Category',
      'Merchant',
      'Amount',
      'Currency',
      'Converted Amount (USD)',
      'Reimbursable',
      'Notes'
    ];

    const rows = filteredExpenses.map(expense => {
      const trip = trips.find(t => t.id === expense.tripId);
      return [
        trip?.name || 'Unknown Trip',
        format(new Date(expense.date), 'yyyy-MM-dd'),
        expense.category,
        expense.merchant || '',
        expense.amount,
        expense.currency,
        expense.convertedAmount || expense.amount,
        expense.isReimbursable ? 'Yes' : 'No',
        expense.notes || ''
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expense_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast.success('CSV report downloaded successfully!');
  };

  const generatePDF = () => {
    // In a real app, this would generate an actual PDF
    // For this demo, we'll create a formatted text report
    const reportData = {
      title: 'Expense Report',
      generatedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      filters: reportFilters,
      expenses: filteredExpenses,
      trips: trips,
      summary: getReportSummary()
    };

    const reportText = `
EXPENSE REPORT
Generated: ${reportData.generatedDate}

FILTERS:
${reportFilters.tripId ? `Trip: ${trips.find(t => t.id === reportFilters.tripId)?.name}` : 'All Trips'}
${reportFilters.category ? `Category: ${categories.find(c => c.id === reportFilters.category)?.label}` : 'All Categories'}
${reportFilters.dateFrom ? `Date From: ${reportFilters.dateFrom}` : ''}
${reportFilters.dateTo ? `Date To: ${reportFilters.dateTo}` : ''}
${reportFilters.reimbursableOnly ? 'Reimbursable Only: Yes' : ''}

SUMMARY:
Total Expenses: ${filteredExpenses.length}
Total Amount: ${formatCurrency(reportData.summary.totalAmount)}
Reimbursable: ${formatCurrency(reportData.summary.reimbursableAmount)}

EXPENSES:
${filteredExpenses.map(expense => {
  const trip = trips.find(t => t.id === expense.tripId);
  return `${format(new Date(expense.date), 'yyyy-MM-dd')} | ${trip?.name || 'Unknown'} | ${expense.category} | ${expense.merchant || ''} | ${formatCurrency(expense.amount, expense.currency)}`;
}).join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `expense_report_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    link.click();
    
    toast.success('PDF report downloaded successfully!');
  };

  const getReportSummary = () => {
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const reimbursableAmount = filteredExpenses
      .filter(expense => expense.isReimbursable)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const categoryBreakdown = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const tripBreakdown = filteredExpenses.reduce((acc, expense) => {
      const trip = trips.find(t => t.id === expense.tripId);
      const tripName = trip?.name || 'Unknown Trip';
      acc[tripName] = (acc[tripName] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      totalAmount,
      reimbursableAmount,
      categoryBreakdown,
      tripBreakdown,
      expenseCount: filteredExpenses.length,
      reimbursableCount: filteredExpenses.filter(e => e.isReimbursable).length
    };
  };

  const summary = getReportSummary();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-surface-200 rounded w-3/4"></div>
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
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load reports</h3>
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
      {/* Report Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Report Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Trip</label>
            <select
              value={reportFilters.tripId}
              onChange={(e) => setReportFilters({ ...reportFilters, tripId: e.target.value })}
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
              value={reportFilters.category}
              onChange={(e) => setReportFilters({ ...reportFilters, category: e.target.value })}
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
              value={reportFilters.dateFrom}
              onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">To Date</label>
            <input
              type="date"
              value={reportFilters.dateTo}
              onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Options</label>
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                id="reimbursableOnly"
                checked={reportFilters.reimbursableOnly}
                onChange={(e) => setReportFilters({ ...reportFilters, reimbursableOnly: e.target.checked })}
                className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
              />
              <label htmlFor="reimbursableOnly" className="ml-2 text-sm text-surface-700">
                Reimbursable only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Total Expenses</h3>
            <ApperIcon name="Receipt" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{summary.expenseCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Total Amount</h3>
            <ApperIcon name="DollarSign" className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{formatCurrency(summary.totalAmount)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Reimbursable</h3>
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-surface-900">{formatCurrency(summary.reimbursableAmount)}</p>
          <p className="text-sm text-surface-500 mt-1">{summary.reimbursableCount} expenses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-surface-600">Personal</h3>
            <ApperIcon name="User" className="w-5 h-5 text-warning" />
          </div>
          <p className="text-3xl font-bold text-surface-900">
            {formatCurrency(summary.totalAmount - summary.reimbursableAmount)}
          </p>
          <p className="text-sm text-surface-500 mt-1">
            {summary.expenseCount - summary.reimbursableCount} expenses
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {Object.entries(summary.categoryBreakdown).map(([categoryId, amount]) => {
              const category = categories.find(c => c.id === categoryId);
              const percentage = (amount / summary.totalAmount) * 100;
              
              return (
                <div key={categoryId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-surface-900 font-medium">
                      {category?.label || categoryId}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-surface-900">{formatCurrency(amount)}</p>
                    <p className="text-sm text-surface-500">{Math.round(percentage)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Trip Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Spending by Trip</h3>
          <div className="space-y-3">
            {Object.entries(summary.tripBreakdown).map(([tripName, amount]) => {
              const percentage = (amount / summary.totalAmount) * 100;
              
              return (
                <div key={tripName} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    <span className="text-surface-900 font-medium truncate">{tripName}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-surface-900">{formatCurrency(amount)}</p>
                    <p className="text-sm text-surface-500">{Math.round(percentage)}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Export Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Export Report</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateCSV}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <ApperIcon name="Download" className="w-5 h-5" />
            <span>Export as CSV</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePDF}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-secondary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            <ApperIcon name="FileText" className="w-5 h-5" />
            <span>Export as PDF</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Expense Report',
                  text: `Expense report with ${summary.expenseCount} expenses totaling ${formatCurrency(summary.totalAmount)}`
                });
              } else {
                toast.info('Sharing not supported on this device');
              }
            }}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
          >
            <ApperIcon name="Share2" className="w-5 h-5" />
            <span>Share Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Expense Preview */}
      {filteredExpenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-surface-200">
            <h3 className="text-lg font-semibold text-surface-900">Expense Details</h3>
            <p className="text-surface-600">{filteredExpenses.length} expenses in report</p>
          </div>
          <div className="divide-y divide-surface-200 max-h-96 overflow-y-auto">
            {filteredExpenses.slice(0, 10).map((expense, index) => {
              const trip = trips.find(t => t.id === expense.tripId);
              const category = categories.find(c => c.id === expense.category);
              
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="p-4 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
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
                        <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                        <span>•</span>
                        <span>{category?.label || expense.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-surface-900">
                        {formatCurrency(expense.amount, expense.currency)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {filteredExpenses.length > 10 && (
              <div className="p-4 text-center text-surface-500">
                And {filteredExpenses.length - 10} more expenses...
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;