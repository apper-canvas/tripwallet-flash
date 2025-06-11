const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExpenseService {
  constructor() {
    this.expenses = [
      {
        id: '1',
        tripId: '1',
        amount: 125.50,
        description: 'Hotel breakfast',
        category: 'meals',
        date: '2024-01-15',
        merchant: 'Hilton Hotel',
        receiptUrl: null,
        createdAt: '2024-01-15T08:30:00Z'
      },
      {
        id: '2',
        tripId: '1',
        amount: 45.20,
        description: 'Taxi to airport',
        category: 'transport',
        date: '2024-01-15',
        merchant: 'Yellow Cab',
        receiptUrl: null,
        createdAt: '2024-01-15T06:00:00Z'
      }
    ];
  }

  async getAllExpenses(tripId = null) {
    await delay(300);
    
    if (tripId) {
      return this.expenses.filter(expense => expense.tripId === tripId);
    }
    
    return [...this.expenses];
  }

  async getExpenseById(id) {
    await delay(200);
    const expense = this.expenses.find(e => e.id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  }

  async createExpense(expenseData) {
    await delay(500);
    
    if (!expenseData.amount || !expenseData.description) {
      throw new Error('Amount and description are required');
    }

    if (expenseData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const newExpense = {
      id: Date.now().toString(),
      tripId: expenseData.tripId,
      amount: parseFloat(expenseData.amount),
      description: expenseData.description,
      category: expenseData.category || 'other',
      date: expenseData.date || new Date().toISOString().split('T')[0],
      merchant: expenseData.merchant || '',
      receiptUrl: expenseData.receiptUrl || null,
      createdAt: new Date().toISOString()
    };

    this.expenses.push(newExpense);
    return { ...newExpense };
  }

  async updateExpense(id, updateData) {
    await delay(400);
    
    const expenseIndex = this.expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
      throw new Error('Expense not found');
    }

    if (updateData.amount && updateData.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    this.expenses[expenseIndex] = {
      ...this.expenses[expenseIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.expenses[expenseIndex] };
  }

  async deleteExpense(id) {
    await delay(300);
    
    const expenseIndex = this.expenses.findIndex(e => e.id === id);
    if (expenseIndex === -1) {
      throw new Error('Expense not found');
    }

    this.expenses.splice(expenseIndex, 1);
    return true;
  }

  async getExpensesByCategory(tripId = null) {
    await delay(250);
    
    const expenses = tripId 
      ? this.expenses.filter(e => e.tripId === tripId)
      : this.expenses;

    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    return categoryTotals;
  }

  async getExpensesByDateRange(startDate, endDate, tripId = null) {
    await delay(300);
    
    const expenses = tripId 
      ? this.expenses.filter(e => e.tripId === tripId)
      : this.expenses;

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });
  }
}

export default new ExpenseService();