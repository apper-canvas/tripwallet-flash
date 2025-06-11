import React from 'react';
import SettingsSection from '@/components/organisms/SettingsSection';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import Text from '@/components/atoms/Text';

const NotificationSettings = ({ settings, setSettings }) => {
    return (
        <SettingsSection title="Notifications" icon="Bell" animationDelay={0.1}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Push Notifications</Text>
                        <Text as="p" className="text-sm text-surface-500">Receive notifications about your expenses</Text>
                    </div>
                    <ToggleSwitch
                        id="notifications"
                        checked={settings.notifications}
                        onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Budget Alerts</Text>
                        <Text as="p" className="text-sm text-surface-500">Get warned when approaching budget limits</Text>
                    </div>
                    <ToggleSwitch
                        id="budgetAlerts"
                        checked={settings.budgetAlerts}
                        onChange={(e) => setSettings({ ...settings, budgetAlerts: e.target.checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Receipt Reminders</Text>
                        <Text as="p" className="text-sm text-surface-500">Remind me to add receipts for expenses</Text>
                    </div>
                    <ToggleSwitch
                        id="receiptReminders"
                        checked={settings.receiptReminders}
                        onChange={(e) => setSettings({ ...settings, receiptReminders: e.target.checked })}
                    />
                </div>
            </div>
        </SettingsSection>
    );
};

export default NotificationSettings;