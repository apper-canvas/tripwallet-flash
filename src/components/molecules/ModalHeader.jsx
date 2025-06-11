import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ModalHeader = ({ title, onClose }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <Text as="h3" className="text-lg font-semibold text-surface-900">
                {title}
            </Text>
            <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
            >
                <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
            </button>
        </div>
    );
};

export default ModalHeader;