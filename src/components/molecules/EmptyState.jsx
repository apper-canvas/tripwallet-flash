import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const EmptyState = ({ icon, title, message, actionLabel, onActionClick, animationDelay = 0 }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: animationDelay }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <Text as="h3" className="mt-4 text-lg font-medium text-surface-900">{title}</Text>
            <Text as="p" className="mt-2 text-surface-500">{message}</Text>
            {onActionClick && actionLabel && (
                <Button onClick={onActionClick} className="mt-4">
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;