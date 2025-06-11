import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load data</h3>
            <p className="text-surface-600 mb-4">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="primary">
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorMessage;