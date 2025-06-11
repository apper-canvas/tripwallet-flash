import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { expenseService, tripService } from '@/services'; // Keep services imports
import { format } from 'date-fns'; // Keep date-fns
import ReportFilters from '@/components/organisms/ReportFilters';
import ReportSummaryCards from '@/components/organisms/ReportSummaryCards';
import ReportBreakdowns from '@/components/organisms/ReportBreakdowns';
import ReportExportActions from '@/components/organisms/ReportExportActions';
import ReportExpensePreview from '@/components/organisms/ReportExpensePreview';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import Spinner from '@/components/atoms/Spinner';

const ReportsPage = () => {
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
      'Trip', 'Date', 'Category', 'Merchant', 'Amount', 'Currency', 'Converted Amount (USD)', 'Reimbursable', 'Notes'
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

  const shareReport = () => {
    const summary = getReportSummary(); // Need to call this here
    if (navigator.share) {
        navigator.share({
            title: 'Expense Report',
            text: `Expense report with ${summary.expenseCount} expenses totaling ${formatCurrency(summary.totalAmount)}`
        });
    } else {
        toast.info('Sharing not supported on this device');
    }
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
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <ReportFilters filters={reportFilters} setFilters={setReportFilters} trips={trips} categories={categories} />
      <ReportSummaryCards summary={summary} formatCurrency={formatCurrency} loading={loading} />
      <ReportBreakdowns summary={summary} categories={categories} formatCurrency={formatCurrency} />
      <ReportExportActions generateCSV={generateCSV} generatePDF={generatePDF} shareReport={shareReport} />
      <ReportExpensePreview expenses={filteredExpenses} trips={trips} categories={categories} formatCurrency={formatCurrency} />
    </div>
  );
};

export default ReportsPage;