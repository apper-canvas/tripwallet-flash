import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Spinner from '@/components/atoms/Spinner';
import GeneralSettings from '@/components/organisms/GeneralSettings';
import NotificationSettings from '@/components/organisms/NotificationSettings';
import PreferencesSettings from '@/components/organisms/PreferencesSettings';
import DataManagementSettings from '@/components/organisms/DataManagementSettings';
import AboutSettings from '@/components/organisms/AboutSettings';

const SettingsPage = () => {
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
    const savedSettings = localStorage.getItem('tripwallet-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      defaultCurrency: 'USD', autoSave: true, notifications: true, darkMode: false, receiptReminders: true, budgetAlerts: true, alertThreshold: 75
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const exportData = () => {
    const data = {
      settings, exportDate: new Date().toISOString(), version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tripwallet_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('Data exported successfully!');
  };

  const clearCache = () => {
    localStorage.removeItem('tripwallet-cache');
    toast.success('Cache cleared successfully!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <GeneralSettings settings={settings} setSettings={setSettings} currencies={currencies} />
      <NotificationSettings settings={settings} setSettings={setSettings} />
      <PreferencesSettings settings={settings} setSettings={setSettings} />
      <DataManagementSettings exportData={exportData} clearCache={clearCache} />
      <AboutSettings />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 px-6 py-3"
        >
          {loading ? (
            <>
              <Spinner />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 px-6 py-3"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;