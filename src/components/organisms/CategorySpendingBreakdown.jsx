import React from 'react';
import { motion } from 'framer-motion';
import CategoryBreakdownItem from '@/components/molecules/CategoryBreakdownItem';
import Text from '@/components/atoms/Text';

const CategorySpendingBreakdown = ({ expensesByCategory, categories, totalSpent, formatCurrency }) => {
    if (Object.keys(expensesByCategory).length === 0) {
        return null; // Don't render if no expenses
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
        >
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</Text>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map((category, index) => {
                    const amount = expensesByCategory[category.id] || 0;
                    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                    
                    return (
                        <CategoryBreakdownItem
                            key={category.id}
                            category={category}
                            amount={amount}
                            percentage={percentage}
                            formatCurrency={formatCurrency}
                            animationDelay={0.7 + index * 0.05}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
};

export default CategorySpendingBreakdown;