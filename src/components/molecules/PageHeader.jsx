import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PageHeader = ({ title, subtitle, onAddClick, addLabel, addIcon = 'Plus' }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <Text as="h2" className="text-xl font-semibold text-surface-900">{title}</Text>
                {subtitle && <Text as="p" className="text-surface-600">{subtitle}</Text>}
            </div>
            {onAddClick && addLabel && (
                <Button onClick={onAddClick} variant="primary">
                    <ApperIcon name={addIcon} className="w-4 h-4" />
                    <span>{addLabel}</span>
                </Button>
            )}
        </div>
    );
};

export default PageHeader;