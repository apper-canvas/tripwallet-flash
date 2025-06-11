import React from 'react';
import SettingsSection from '@/components/organisms/SettingsSection';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import Text from '@/components/atoms/Text';

const PreferencesSettings = ({ settings, setSettings }) => {
    return (
        <SettingsSection title="Preferences" icon="User" animationDelay={0.2}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Auto-save</Text>
                        <Text as="p" className="text-sm text-surface-500">Automatically save changes as you type</Text>
                    </div>
                    <ToggleSwitch
                        id="autoSave"
                        checked={settings.autoSave}
                        onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Dark Mode</Text>
                        <Text as="p" className="text-sm text-surface-500">Use dark theme (coming soon)</Text>
                    </div>
                    <ToggleSwitch
                        id="darkMode"
                        checked={settings.darkMode}
                        onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                        disabled // Disabled as per original component
                    />
                </div>
            </div>
        </SettingsSection>
    );
};

export default PreferencesSettings;