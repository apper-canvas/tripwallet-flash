const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DashboardService {
  constructor() {
    // Mock dashboard data
    this.dashboardData = {
      summary: {
        totalTrips: 5,
        activeTrips: 2,
        totalExpenses: 12547.80,
        thisMonthExpenses: 3247.50,
        averagePerTrip: 2509.56,
        topCategory: 'meals'
      },
      recentExpenses: [
        {
          id: '1',
          amount: 125.50,
          description: 'Hotel breakfast',
          category: 'meals',
          date: '2024-01-20',
          tripName: 'NYC Business Trip'
        },
        {
          id: '2',
          amount: 89.30,
          description: 'Uber to meeting',
          category: 'transport',
          date: '2024-01-19',
          tripName: 'NYC Business Trip'
        },
        {
          id: '3',
          amount: 245.00,
          description: 'Client dinner',
          category: 'meals',
          date: '2024-01-18',
          tripName: 'NYC Business Trip'
        }
      ],
      monthlyTrends: [
        { month: 'Jan 2024', expenses: 3247.50, trips: 2 },
        { month: 'Dec 2023', expenses: 4150.20, trips: 3 },
        { month: 'Nov 2023', expenses: 2890.40, trips: 1 },
        { month: 'Oct 2023', expenses: 3560.80, trips: 2 },
        { month: 'Sep 2023', expenses: 2120.90, trips: 1 },
        { month: 'Aug 2023', expenses: 4290.30, trips: 3 }
      ],
      categoryBreakdown: {
        meals: 4580.30,
        transport: 3240.50,
        accommodation: 2890.20,
        entertainment: 1150.40,
        other: 686.40
      }
    };
  }

  async getDashboardSummary() {
    await delay(400);
    return { ...this.dashboardData.summary };
  }

  async getRecentExpenses(limit = 10) {
    await delay(300);
    return this.dashboardData.recentExpenses.slice(0, limit);
  }

  async getMonthlyTrends(months = 6) {
    await delay(350);
    return this.dashboardData.monthlyTrends.slice(0, months);
  }

  async getCategoryBreakdown() {
    await delay(250);
    return { ...this.dashboardData.categoryBreakdown };
  }

  async getExpensesByDateRange(startDate, endDate) {
    await delay(400);
    
    // Simulate filtering expenses by date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filteredExpenses = this.dashboardData.recentExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });

    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      expenses: filteredExpenses,
      total,
      count: filteredExpenses.length
    };
  }

  async getTopCategories(limit = 5) {
    await delay(200);
    
    const categories = Object.entries(this.dashboardData.categoryBreakdown)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
    
    return categories;
  }

  async getExpenseTrends(period = 'monthly') {
    await delay(300);
    
    if (period === 'monthly') {
      return this.dashboardData.monthlyTrends;
    }
    
    // Simulate weekly trends
    if (period === 'weekly') {
      return [
        { week: 'Week 4', expenses: 845.20, trips: 1 },
        { week: 'Week 3', expenses: 1290.30, trips: 1 },
        { week: 'Week 2', expenses: 672.50, trips: 0 },
        { week: 'Week 1', expenses: 439.50, trips: 0 }
      ];
    }
    
    return this.dashboardData.monthlyTrends;
  }

  async getBudgetAnalysis() {
    await delay(350);
    
    return {
      totalBudget: 15000,
      spentAmount: 12547.80,
      remainingBudget: 2452.20,
      budgetUtilization: 83.65,
      projectedOverspend: false,
      categories: {
        meals: { budget: 5000, spent: 4580.30, remaining: 419.70 },
        transport: { budget: 4000, spent: 3240.50, remaining: 759.50 },
        accommodation: { budget: 4000, spent: 2890.20, remaining: 1109.80 },
        entertainment: { budget: 1500, spent: 1150.40, remaining: 349.60 },
        other: { budget: 500, spent: 686.40, remaining: -186.40 }
      }
    };
  }
}

export default new DashboardService();