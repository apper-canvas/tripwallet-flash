import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const CategoryBreakdownItem = ({ category, amount, percentage, formatCurrency, animationDelay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animationDelay }}
            className="text-center"
        >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2 ${category.color}`}>
                <ApperIcon name={category.icon} className="w-8 h-8" />
            </div>
            <Text as="p" className="text-sm font-medium text-surface-900">{category.label}</Text>
            <Text as="p" className="text-lg font-bold text-surface-900">{formatCurrency(amount)}</Text>
            <Text as="p" className="text-xs text-surface-500">{Math.round(percentage)}%</Text>
        </motion.div>
    );
};

export default CategoryBreakdownItem;