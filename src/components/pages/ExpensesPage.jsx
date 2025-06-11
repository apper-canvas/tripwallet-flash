import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseService, tripService } from '@/services'; // Keep services imports
import PageHeader from '@/components/molecules/PageHeader';
import ExpenseFilterSort from '@/components/organisms/ExpenseFilterSort';
import ExpenseTable from '@/components/organisms/ExpenseTable';
import ExpenseFormModal from '@/components/organisms/ExpenseFormModal';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import Spinner from '@/components/atoms/Spinner';

const ExpensesPage = () => {
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
      tripId: '', amount: '', currency: 'USD', category: 'meals', merchant: '', date: new Date().toISOString().split('T')[0], notes: '', isReimbursable: true
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
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Expenses"
        subtitle={`${filteredAndSortedExpenses.length} expenses`}
        onAddClick={() => setShowModal(true)}
        addLabel="Add Expense"
      />

      <ExpenseFilterSort
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        trips={trips}
        categories={categories}
      />

      <ExpenseTable
        expenses={filteredAndSortedExpenses}
        trips={trips}
        categories={categories}
        formatCurrency={formatCurrency}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onAddExpenseClick={() => setShowModal(true)}
        initialExpensesLength={expenses.length} // Pass original length for empty state message
      />

      <ExpenseFormModal
        isOpen={showModal}
        onClose={() => {setShowModal(false); setEditingExpense(null); resetForm();}}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingExpense={editingExpense}
        trips={trips}
        categories={categories}
        currencies={currencies}
      />
    </div>
  );
};

export default ExpensesPage;