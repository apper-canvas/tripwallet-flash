import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tripService, expenseService, exchangeRateService } from '@/services'; // Keep services imports
import DashboardStatsOverview from '@/components/organisms/DashboardStatsOverview';
import ActiveTripsList from '@/components/organisms/ActiveTripsList';
import RecentExpensesList from '@/components/organisms/RecentExpensesList';
import CategorySpendingBreakdown from '@/components/organisms/CategorySpendingBreakdown';
import CurrencyExchangeRatesWidget from '@/components/organisms/CurrencyExchangeRatesWidget';
import QuickAddExpenseFormModal from '@/components/organisms/QuickAddExpenseFormModal';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/atoms/ApperIcon';

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickExpenseFormData, setQuickExpenseFormData] = useState({
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

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']; // Used for quick add modal

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripsData, expensesData, ratesData] = await Promise.all([
        tripService.getAll(),
        expenseService.getAll(),
        exchangeRateService.getAll() // Load exchange rates for quick add / widget
      ]);
      setTrips(tripsData);
      setExpenses(expensesData);
      setExchangeRates(ratesData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    if (!quickExpenseFormData.tripId || !quickExpenseFormData.amount) {
        toast.error('Please fill in required fields');
        return;
    }

    try {
        const selectedTrip = trips.find(t => t.id === quickExpenseFormData.tripId);
        const baseAmount = parseFloat(quickExpenseFormData.amount);
        
        let convertedAmount = baseAmount;
        if (quickExpenseFormData.currency !== selectedTrip.currency) {
            const rate = exchangeRates.find(r => 
                r.from === quickExpenseFormData.currency && r.to === selectedTrip.currency
            );
            if (rate) {
                convertedAmount = baseAmount * rate.rate;
            } else {
                toast.warn(`No exchange rate found for ${quickExpenseFormData.currency} to ${selectedTrip.currency}. Amount will be saved without conversion.`);
            }
        }

        const newExpense = {
            ...quickExpenseFormData,
            amount: baseAmount,
            convertedAmount,
            date: new Date().toISOString().split('T')[0], // Use YYYY-MM-DD for consistency
            isReimbursable: quickExpenseFormData.isReimbursable || true,
            receiptUrl: null // No receipt upload in quick add
        };

        await expenseService.create(newExpense);
        
        const updatedTrip = {
            ...selectedTrip,
            spent: selectedTrip.spent + convertedAmount
        };
        await tripService.update(selectedTrip.id, updatedTrip);
        
        toast.success('Expense added successfully!');
        setShowQuickAddModal(false);
        setQuickExpenseFormData({
            tripId: '', amount: '', currency: 'USD', category: 'meals', merchant: '', date: new Date().toISOString().split('T')[0], notes: '', isReimbursable: true
        });
        loadDashboardData(); // Reload data to update dashboard
    } catch (error) {
        console.error('Failed to add quick expense:', error);
        toast.error('Failed to add expense');
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

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setShowQuickAddModal(true)} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Quick Add Expense</span>
        </Button>
        <Button variant="outline"> {/* Placeholder for scan receipt */}
            <ApperIcon name="Upload" className="w-4 h-4" />
            <span>Scan Receipt</span>
        </Button>
      </div>

      <DashboardStatsOverview
        activeTrips={activeTrips}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        budgetUtilization={budgetUtilization}
        formatCurrency={formatCurrency}
        getBudgetStatus={getBudgetStatus}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveTripsList
          activeTrips={activeTrips}
          formatCurrency={formatCurrency}
          getBudgetStatus={getBudgetStatus}
        />
        <RecentExpensesList
          recentExpenses={recentExpenses}
          trips={trips}
          categories={categories}
          formatCurrency={formatCurrency}
        />
      </div>

      {Object.keys(expensesByCategory).length > 0 && (
        <CategorySpendingBreakdown
          expensesByCategory={expensesByCategory}
          categories={categories}
          totalSpent={totalSpent}
          formatCurrency={formatCurrency}
        />
      )}

      {exchangeRates.length > 0 && (
        <CurrencyExchangeRatesWidget exchangeRates={exchangeRates} />
      )}

      <QuickAddExpenseFormModal
        isOpen={showQuickAddModal}
        onClose={() => setShowQuickAddModal(false)}
        formData={quickExpenseFormData}
        setFormData={setQuickExpenseFormData}
        handleSubmit={handleQuickAddSubmit}
        activeTrips={activeTrips}
        categories={categories}
        currencies={currencies}
      />
    </div>
  );
};

export default HomePage;