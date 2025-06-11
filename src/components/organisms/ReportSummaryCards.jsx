import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const ReportSummaryCards = ({ summary, formatCurrency, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-surface-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
                title="Total Expenses"
                value={summary.expenseCount}
                icon="Receipt"
                iconColor="text-primary"
                animationDelay={0}
            />
            <StatCard
                title="Total Amount"
                value={formatCurrency(summary.totalAmount)}
                icon="DollarSign"
                iconColor="text-secondary"
                animationDelay={0.1}
            />
            <StatCard
                title="Reimbursable"
                value={formatCurrency(summary.reimbursableAmount)}
                description={`${summary.reimbursableCount} expenses`}
                icon="CheckCircle"
                iconColor="text-accent"
                animationDelay={0.2}
            />
            <StatCard
                title="Personal"
                value={formatCurrency(summary.totalAmount - summary.reimbursableAmount)}
                description={`${summary.expenseCount - summary.reimbursableCount} expenses`}
                icon="User"
                iconColor="text-warning"
                animationDelay={0.3}
            />
        </div>
    );
};

export default ReportSummaryCards;