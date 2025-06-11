import React from 'react';
import SettingsSection from '@/components/organisms/SettingsSection';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const GeneralSettings = ({ settings, setSettings, currencies }) => {
    const currencyOptions = currencies.map(currency => ({
        value: currency.code,
        label: `${currency.symbol} ${currency.name} (${currency.code})`
    }));

    return (
        <SettingsSection title="General Settings" icon="Settings">
            <div className="space-y-6">
                <FormField
                    label="Default Currency"
                    id="defaultCurrency"
                    type="select"
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="md:w-64"
                    options={currencyOptions}
                >
                    <Text as="p" className="text-sm text-surface-500 mt-1">
                        This will be the default currency for new trips and expenses
                    </Text>
                </FormField>

                <div>
                    <Text as="label" htmlFor="alertThreshold" className="block text-sm font-medium text-surface-700 mb-2">
                        Budget Alert Threshold
                    </Text>
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            id="alertThreshold"
                            min="50"
                            max="100"
                            step="5"
                            value={settings.alertThreshold}
                            onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) })}
                            className="flex-1 max-w-xs"
                        />
                        <Text as="span" className="text-sm font-medium text-surface-900 bg-surface-100 px-3 py-1 rounded-lg">
                            {settings.alertThreshold}%
                        </Text>
                    </div>
                    <Text as="p" className="text-sm text-surface-500 mt-1">
                        Get notified when you've spent this percentage of your budget
                    </Text>
                </div>
            </div>
        </SettingsSection>
    );
};

export default GeneralSettings;