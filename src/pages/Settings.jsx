import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultCurrency: 'USD',
    autoSave: true,
    notifications: true,
    darkMode: false,
    receiptReminders: true,
    budgetAlerts: true,
    alertThreshold: 75
  });
  
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
  ];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('tripwallet-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage
      localStorage.setItem('tripwallet-settings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      defaultCurrency: 'USD',
      autoSave: true,
      notifications: true,
      darkMode: false,
      receiptReminders: true,
      budgetAlerts: true,
      alertThreshold: 75
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const exportData = () => {
    // In a real app, this would export all user data
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tripwallet_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Data exported successfully!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Settings" className="w-5 h-5 mr-2" />
          General Settings
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Default Currency
            </label>
            <select
              value={settings.defaultCurrency}
              onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
              className="w-full md:w-64 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <p className="text-sm text-surface-500 mt-1">
              This will be the default currency for new trips and expenses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Budget Alert Threshold
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm font-medium text-surface-900 bg-surface-100 px-3 py-1 rounded-lg">
                {settings.alertThreshold}%
              </span>
            </div>
            <p className="text-sm text-surface-500 mt-1">
              Get notified when you've spent this percentage of your budget
            </p>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
          Notifications
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Push Notifications</h4>
              <p className="text-sm text-surface-500">Receive notifications about your expenses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Budget Alerts</h4>
              <p className="text-sm text-surface-500">Get warned when approaching budget limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.budgetAlerts}
                onChange={(e) => setSettings({ ...settings, budgetAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Receipt Reminders</h4>
              <p className="text-sm text-surface-500">Remind me to add receipts for expenses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.receiptReminders}
                onChange={(e) => setSettings({ ...settings, receiptReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="User" className="w-5 h-5 mr-2" />
          Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Auto-save</h4>
              <p className="text-sm text-surface-500">Automatically save changes as you type</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-surface-900">Dark Mode</h4>
              <p className="text-sm text-surface-500">Use dark theme (coming soon)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer opacity-50">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="sr-only peer"
                disabled
              />
              <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Database" className="w-5 h-5 mr-2" />
          Data Management
        </h3>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-medium text-surface-900">Export Data</h4>
              <p className="text-sm text-surface-500">Download a backup of all your data</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              <ApperIcon name="Download" className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="font-medium text-surface-900">Clear Cache</h4>
              <p className="text-sm text-surface-500">Clear stored data to free up space</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.removeItem('tripwallet-cache');
                toast.success('Cache cleared successfully!');
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span>Clear Cache</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* App Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
          <ApperIcon name="Info" className="w-5 h-5 mr-2" />
          About TripWallet AI
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-surface-700">Version:</span>
              <span className="ml-2 text-surface-600">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-surface-700">Last Updated:</span>
              <span className="ml-2 text-surface-600">December 2024</span>
            </div>
            <div>
              <span className="font-medium text-surface-700">Build:</span>
              <span className="ml-2 text-surface-600">2024.12.001</span>
            </div>
            <div>
              <span className="font-medium text-surface-700">Platform:</span>
              <span className="ml-2 text-surface-600">Web Application</span>
            </div>
          </div>

          <div className="pt-4 border-t border-surface-200">
            <p className="text-sm text-surface-600 leading-relaxed">
              TripWallet AI is your intelligent travel expense companion, designed to simplify expense tracking
              and budget management for business travelers and vacation planners. Track expenses, monitor budgets,
              and generate reports with ease.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;