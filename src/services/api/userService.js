const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.currentUser = null;
    this.users = [
      {
        id: '1',
        email: 'demo@tripwallet.com',
        name: 'Demo User',
        avatar: null,
        preferences: {
          currency: 'USD',
          dateFormat: 'MM/DD/YYYY',
          defaultCategory: 'other',
          notifications: true
        },
        createdAt: '2024-01-01T00:00:00Z'
      }
    ];
  }

  async login(email, password) {
    await delay(800);
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Simulate authentication
    if (email === 'demo@tripwallet.com' && password === 'demo123') {
      this.currentUser = { ...this.users[0] };
      return {
        user: this.currentUser,
        token: 'mock-jwt-token-' + Date.now()
      };
    }

    throw new Error('Invalid email or password');
  }

  async register(userData) {
    await delay(1000);
    
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Email, password, and name are required');
    }

    // Check if user already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      avatar: null,
      preferences: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        defaultCategory: 'other',
        notifications: true
      },
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.currentUser = { ...newUser };

    return {
      user: this.currentUser,
      token: 'mock-jwt-token-' + Date.now()
    };
  }

  async logout() {
    await delay(200);
    this.currentUser = null;
    return true;
  }

  async getCurrentUser() {
    await delay(100);
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }
    return { ...this.currentUser };
  }

  async updateProfile(updateData) {
    await delay(600);
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    this.currentUser = {
      ...this.currentUser,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update in users array
    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.currentUser };
    }

    return { ...this.currentUser };
  }

  async updatePreferences(preferences) {
    await delay(400);
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    this.currentUser.preferences = {
      ...this.currentUser.preferences,
      ...preferences
    };

    // Update in users array
    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.currentUser };
    }

    return { ...this.currentUser };
  }

  async changePassword(currentPassword, newPassword) {
    await delay(700);
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // In a real app, verify current password
    // For demo, just simulate success
    return true;
  }

  async resetPassword(email) {
    await delay(500);
    
    if (!email) {
      throw new Error('Email is required');
    }

    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User with this email does not exist');
    }

    // Simulate sending reset email
    return {
      message: 'Password reset email sent successfully'
    };
  }
}

export default new UserService();