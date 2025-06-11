import React from 'react';
import SettingsSection from '@/components/organisms/SettingsSection';
import Text from '@/components/atoms/Text';

const AboutSettings = () => {
    return (
        <SettingsSection title="About TripWallet AI" icon="Info" animationDelay={0.4}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <Text as="span" className="font-medium text-surface-700">Version:</Text>
                        <Text as="span" className="ml-2 text-surface-600">1.0.0</Text>
                    </div>
                    <div>
                        <Text as="span" className="font-medium text-surface-700">Last Updated:</Text>
                        <Text as="span" className="ml-2 text-surface-600">December 2024</Text>
                    </div>
                    <div>
                        <Text as="span" className="font-medium text-surface-700">Build:</Text>
                        <Text as="span" className="ml-2 text-surface-600">2024.12.001</Text>
                    </div>
                    <div>
                        <Text as="span" className="font-medium text-surface-700">Platform:</Text>
                        <Text as="span" className="ml-2 text-surface-600">Web Application</Text>
                    </div>
                </div>

                <div className="pt-4 border-t border-surface-200">
                    <Text as="p" className="text-sm text-surface-600 leading-relaxed">
                        TripWallet AI is your intelligent travel expense companion, designed to simplify expense tracking
                        and budget management for business travelers and vacation planners. Track expenses, monitor budgets,
                        and generate reports with ease.
                    </Text>
                </div>
            </div>
        </SettingsSection>
    );
};

export default AboutSettings;