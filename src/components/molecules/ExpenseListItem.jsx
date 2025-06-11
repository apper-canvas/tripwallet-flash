import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ExpenseListItem = ({ expense, category, trip, formatCurrency, onEdit, onDelete, animationDelay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="p-4 hover:bg-surface-50 transition-colors"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color || 'bg-gray-100 text-gray-700'}`}>
                        <ApperIcon name={category?.icon || 'Receipt'} className="w-5 h-5" />
                    </div>
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
                            <Text as="span">{new Date(expense.date).toLocaleDateString()}</Text>
                            {category?.label && (
                                <>
                                    <Text as="span">•</Text>
                                    <Text as="span">{category?.label}</Text>
                                </>
                            )}
                        </div>
                        {expense.notes && (
                            <Text as="p" className="text-sm text-surface-500 mt-1 truncate">{expense.notes}</Text>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <Text as="p" className="font-semibold text-surface-900">
                            {formatCurrency(expense.amount, expense.currency)}
                        </Text>
                        {expense.currency !== 'USD' && expense.convertedAmount !== expense.amount && (
                            <Text as="p" className="text-sm text-surface-500">
                                {formatCurrency(expense.convertedAmount, 'USD')}
                            </Text>
                        )}
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex space-x-1">
                            {onEdit && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(expense); }}
                                    className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <ApperIcon name="Edit2" className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
                                    className="p-2 text-surface-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                >
                                    <ApperIcon name="Trash2" className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ExpenseListItem;