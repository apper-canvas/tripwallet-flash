import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import Text from '@/components/atoms/Text';

const TripListItem = ({ trip, formatCurrency, getBudgetStatus, getStatusColor, onEdit, onDelete, animationDelay, whileHoverScale = 1.02 }) => {
    const spentPercentage = (trip.spent / trip.budget) * 100;
    const budgetStatus = getBudgetStatus(trip.spent, trip.budget);
    const isOverBudget = trip.spent > trip.budget;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            whileHover={{ scale: whileHoverScale }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <Text as="h3" className="font-semibold text-surface-900 truncate">{trip.name}</Text>
                    <Text as="p" className="text-surface-600 truncate">{trip.destination}</Text>
                </div>
                <div className="flex items-center space-x-2">
                    <Text as="span" className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                    </Text>
                    {(onEdit || onDelete) && (
                        <div className="flex space-x-1">
                            {onEdit && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
                                    className="p-1 text-surface-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                >
                                    <ApperIcon name="Edit2" className="w-4 h-4" />
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
                                    className="p-1 text-surface-400 hover:text-error hover:bg-error/10 rounded transition-colors"
                                >
                                    <ApperIcon name="Trash2" className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center space-x-2 text-sm text-surface-600 mb-4">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <Text as="span">
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </Text>
            </div>

            {/* Budget Progress */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <Text as="span" className="text-surface-600">Budget Progress</Text>
                    <Text as="span" className={`font-medium ${budgetStatus.color}`}>
                        {Math.round(spentPercentage)}%
                    </Text>
                </div>
                <ProgressBar percentage={spentPercentage} colorClass={budgetStatus.bgColor} />
                <div className="flex items-center justify-between">
                    <Text as="span" className="text-sm font-medium text-surface-900">
                        {formatCurrency(trip.spent, trip.currency)}
                    </Text>
                    <Text as="span" className="text-sm text-surface-600">
                        of {formatCurrency(trip.budget, trip.currency)}
                    </Text>
                </div>
                {isOverBudget && (
                    <div className="flex items-center space-x-1 text-error text-sm">
                        <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                        <Text as="span">Over budget by {formatCurrency(trip.spent - trip.budget, trip.currency)}</Text>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TripListItem;