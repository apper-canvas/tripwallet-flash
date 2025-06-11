import React from 'react';
import ExpenseListItem from '@/components/molecules/ExpenseListItem';
import EmptyState from '@/components/molecules/EmptyState';

const ExpenseTable = ({ expenses, trips, categories, formatCurrency, handleEdit, handleDelete, onAddExpenseClick, initialExpensesLength }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-surface-200">
                <h3 className="text-lg font-semibold text-surface-900">Expenses</h3>
            </div>
            {expenses.length === 0 ? (
                <EmptyState
                    icon="Receipt"
                    title="No expenses found"
                    message={initialExpensesLength === 0 ? 'Add your first expense to get started' : 'Try adjusting your filters'}
                    actionLabel="Add Expense"
                    onActionClick={onAddExpenseClick}
                />
            ) : (
                <div className="divide-y divide-surface-200">
                    {expenses.map((expense, index) => {
                        const category = categories.find(c => c.id === expense.category);
                        const trip = trips.find(t => t.id === expense.tripId);
                        
                        return (
                            <ExpenseListItem
                                key={expense.id}
                                expense={expense}
                                category={category}
                                trip={trip}
                                formatCurrency={formatCurrency}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                animationDelay={index * 0.05}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpenseTable;