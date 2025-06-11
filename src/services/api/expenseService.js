import expenseData from '../mockData/expenses.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExpenseService {
  constructor() {
    this.data = [...expenseData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const expense = this.data.find(e => e.id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  }

  async getByTripId(tripId) {
    await delay(200);
    return this.data.filter(e => e.tripId === tripId).map(e => ({ ...e }));
  }

  async create(expenseData) {
    await delay(300);
    const newExpense = {
      ...expenseData,
      id: Date.now().toString()
    };
    this.data.push(newExpense);
    return { ...newExpense };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new ExpenseService();