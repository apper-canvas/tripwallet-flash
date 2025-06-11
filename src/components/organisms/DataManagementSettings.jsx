import React from 'react';
import SettingsSection from '@/components/organisms/SettingsSection';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const DataManagementSettings = ({ exportData, clearCache }) => {
    return (
        <SettingsSection title="Data Management" icon="Database" animationDelay={0.3}>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Export Data</Text>
                        <Text as="p" className="text-sm text-surface-500">Download a backup of all your data</Text>
                    </div>
                    <Button onClick={exportData} variant="secondary">
                        <ApperIcon name="Download" className="w-4 h-4" />
                        <span>Export</span>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <Text as="h4" className="font-medium text-surface-900">Clear Cache</Text>
                        <Text as="p" className="text-sm text-surface-500">Clear stored data to free up space</Text>
                    </div>
                    <Button onClick={clearCache} variant="outline">
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                        <span>Clear Cache</span>
                    </Button>
                </div>
            </div>
        </SettingsSection>
    );
};

export default DataManagementSettings;