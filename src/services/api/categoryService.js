const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [
      {
        id: 'meals',
        name: 'Meals & Dining',
        icon: '🍽️',
        color: '#FF6B6B',
        isDefault: true,
        budget: 5000,
        spent: 4580.30
      },
      {
        id: 'transport',
        name: 'Transportation',
        icon: '🚗',
        color: '#4ECDC4',
        isDefault: true,
        budget: 4000,
        spent: 3240.50
      },
      {
        id: 'accommodation',
        name: 'Accommodation',
        icon: '🏨',
        color: '#45B7D1',
        isDefault: true,
        budget: 4000,
        spent: 2890.20
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎭',
        color: '#F9CA24',
        isDefault: true,
        budget: 1500,
        spent: 1150.40
      },
      {
        id: 'shopping',
        name: 'Shopping',
        icon: '🛍️',
        color: '#F0932B',
        isDefault: true,
        budget: 1000,
        spent: 234.80
      },
      {
        id: 'health',
        name: 'Health & Medical',
        icon: '🏥',
        color: '#6C5CE7',
        isDefault: true,
        budget: 500,
        spent: 120.50
      },
      {
        id: 'business',
        name: 'Business Expenses',
        icon: '💼',
        color: '#2D3436',
        isDefault: true,
        budget: 2000,
        spent: 1456.30
      },
      {
        id: 'other',
        name: 'Other',
        icon: '📝',
        color: '#636E72',
        isDefault: true,
        budget: 500,
        spent: 686.40
      }
    ];
  }

  async getAllCategories() {
    await delay(200);
    return [...this.categories];
  }

  async getCategoryById(id) {
    await delay(150);
    const category = this.categories.find(c => c.id === id);
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  }

  async createCategory(categoryData) {
    await delay(400);
    
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }

    // Check if category already exists
    const existingCategory = this.categories.find(c => 
      c.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    const newCategory = {
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryData.name,
      icon: categoryData.icon || '📝',
      color: categoryData.color || '#636E72',
      isDefault: false,
      budget: categoryData.budget || 0,
      spent: 0,
      createdAt: new Date().toISOString()
    };

    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async updateCategory(id, updateData) {
    await delay(350);
    
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    const category = this.categories[categoryIndex];
    
    // Prevent updating default categories' core properties
    if (category.isDefault && (updateData.id || updateData.isDefault === false)) {
      throw new Error('Cannot modify core properties of default categories');
    }

    this.categories[categoryIndex] = {
      ...category,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.categories[categoryIndex] };
  }

  async deleteCategory(id) {
    await delay(300);
    
    const categoryIndex = this.categories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }

    const category = this.categories[categoryIndex];
    
    // Prevent deleting default categories
    if (category.isDefault) {
      throw new Error('Cannot delete default categories');
    }

    this.categories.splice(categoryIndex, 1);
    return true;
  }

  async getCategoryStats() {
    await delay(250);
    
    const totalBudget = this.categories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
    const totalSpent = this.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
    const overBudgetCategories = this.categories.filter(cat => 
      cat.spent > cat.budget && cat.budget > 0
    );

    return {
      totalCategories: this.categories.length,
      customCategories: this.categories.filter(c => !c.isDefault).length,
      totalBudget,
      totalSpent,
      remainingBudget: totalBudget - totalSpent,
      overBudgetCount: overBudgetCategories.length,
      overBudgetCategories: overBudgetCategories.map(c => ({
        id: c.id,
        name: c.name,
        budget: c.budget,
        spent: c.spent,
        overage: c.spent - c.budget
      }))
    };
  }

  async updateCategorySpending(categoryId, amount) {
    await delay(150);
    
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    category.spent = (category.spent || 0) + amount;
    return { ...category };
  }

  async getCategoriesByBudgetStatus() {
    await delay(200);
    
    const result = {
      withinBudget: [],
      overBudget: [],
      noBudget: []
    };

    this.categories.forEach(category => {
      if (!category.budget || category.budget === 0) {
        result.noBudget.push({ ...category });
      } else if (category.spent > category.budget) {
        result.overBudget.push({ 
          ...category, 
          overage: category.spent - category.budget 
        });
      } else {
        result.withinBudget.push({ 
          ...category, 
          remaining: category.budget - category.spent 
        });
      }
    });

    return result;
  }
}

export default new CategoryService();