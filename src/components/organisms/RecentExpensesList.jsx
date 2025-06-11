import React from 'react';
import { motion } from 'framer-motion';
import ExpenseListItem from '@/components/molecules/ExpenseListItem';
import EmptyState from '@/components/molecules/EmptyState';
import Text from '@/components/atoms/Text';

const RecentExpensesList = ({ recentExpenses, trips, categories, formatCurrency }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm"
        >
            <div className="p-6 border-b border-surface-200">
                <Text as="h3" className="text-lg font-semibold text-surface-900">Recent Expenses</Text>
            </div>
            
            {recentExpenses.length === 0 ? (
                <EmptyState
                    icon="Receipt"
                    title="No expenses yet"
                    message="Add your first expense to get started"
                    actionLabel="Add Expense"
                    onActionClick={() => alert('Navigate to Add Expense (functionality to be implemented)')} // Placeholder
                />
            ) : (
                <div className="divide-y divide-surface-200">
                    {recentExpenses.map((expense, index) => {
                        const category = categories.find(c => c.id === expense.category);
                        const trip = trips.find(t => t.id === expense.tripId);
                        
                        return (
                            <ExpenseListItem
                                key={expense.id}
                                expense={expense}
                                category={category}
                                trip={trip}
                                formatCurrency={formatCurrency}
                                animationDelay={0.5 + index * 0.05}
                            />
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default RecentExpensesList;