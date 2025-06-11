import React from 'react';
import { motion } from 'framer-motion';
import ExpenseListItem from '@/components/molecules/ExpenseListItem';
import Text from '@/components/atoms/Text';
import { format } from 'date-fns'; // Retain date-fns as it's already imported in Reports.jsx

const ReportExpensePreview = ({ expenses, trips, categories, formatCurrency }) => {
    if (expenses.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm"
        >
            <div className="p-6 border-b border-surface-200">
                <Text as="h3" className="text-lg font-semibold text-surface-900">Expense Details</Text>
                <Text as="p" className="text-surface-600">{expenses.length} expenses in report</Text>
            </div>
            <div className="divide-y divide-surface-200 max-h-96 overflow-y-auto">
                {expenses.slice(0, 10).map((expense, index) => {
                    const trip = trips.find(t => t.id === expense.tripId);
                    const category = categories.find(c => c.id === expense.category);
                    
                    return (
                        <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.05 }}
                            className="p-4 hover:bg-surface-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <Text as="p" className="font-medium text-surface-900 truncate">
                                            {expense.merchant || category?.label || 'Expense'}
                                        </Text>
                                        {expense.isReimbursable && (
                                            <Text as="span" className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-medium">
                                                Reimbursable
                                            </Text>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-surface-600">
                                        <Text as="span">{trip?.name || 'Unknown Trip'}</Text>
                                        <Text as="span">•</Text>
                                        <Text as="span">{format(new Date(expense.date), 'MMM dd, yyyy')}</Text>
                                        <Text as="span">•</Text>
                                        <Text as="span">{category?.label || expense.category}</Text>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Text as="p" className="font-semibold text-surface-900">
                                        {formatCurrency(expense.amount, expense.currency)}
                                    </Text>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                {expenses.length > 10 && (
                    <div className="p-4 text-center text-surface-500">
                        And {expenses.length - 10} more expenses...
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ReportExpensePreview;