import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const ReportBreakdowns = ({ summary, categories, formatCurrency }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm"
            >
                <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Spending by Category</Text>
                <div className="space-y-3">
                    {Object.entries(summary.categoryBreakdown).map(([categoryId, amount]) => {
                        const category = categories.find(c => c.id === categoryId);
                        const percentage = summary.totalAmount > 0 ? (amount / summary.totalAmount) * 100 : 0;
                        
                        return (
                            <div key={categoryId} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <Text as="span" className="text-surface-900 font-medium">
                                        {category?.label || categoryId}
                                    </Text>
                                </div>
                                <div className="text-right">
                                    <Text as="p" className="font-semibold text-surface-900">{formatCurrency(amount)}</Text>
                                    <Text as="p" className="text-sm text-surface-500">{Math.round(percentage)}%</Text>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm"
            >
                <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Spending by Trip</Text>
                <div className="space-y-3">
                    {Object.entries(summary.tripBreakdown).map(([tripName, amount]) => {
                        const percentage = summary.totalAmount > 0 ? (amount / summary.totalAmount) * 100 : 0;
                        
                        return (
                            <div key={tripName} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                                    <Text as="span" className="text-surface-900 font-medium truncate">{tripName}</Text>
                                </div>
                                <div className="text-right">
                                    <Text as="p" className="font-semibold text-surface-900">{formatCurrency(amount)}</Text>
                                    <Text as="p" className="text-sm text-surface-500">{Math.round(percentage)}%</Text>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default ReportBreakdowns;