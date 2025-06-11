import React from 'react';
import StatCard from '@/components/molecules/StatCard';
import Spinner from '@/components/atoms/Spinner';
import Text from '@/components/atoms/Text';

const DashboardStatsOverview = ({ activeTrips, totalBudget, totalSpent, budgetUtilization, formatCurrency, getBudgetStatus, loading }) => {
    const budgetStatus = getBudgetStatus(budgetUtilization);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-surface-200 rounded w-3/4 mb-4"></div>
                        <div className="h-2 bg-surface-200 rounded w-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Active Trips"
                value={activeTrips.length}
                description={`${activeTrips.length} active`}
                icon="MapPin"
                iconColor="text-primary"
                animationDelay={0}
            />
            <StatCard
                title="Total Budget"
                value={formatCurrency(totalBudget)}
                progressBar={{
                    percentage: budgetUtilization,
                    colorClass: budgetStatus.bgColor,
                    textColor: budgetStatus.color
                }}
                icon="Wallet"
                iconColor="text-secondary"
                animationDelay={0.1}
            />
            <StatCard
                title="Total Spent"
                value={formatCurrency(totalSpent)}
                description={`${formatCurrency(totalBudget - totalSpent)} remaining`}
                icon="Receipt"
                iconColor="text-accent"
                animationDelay={0.2}
            />
        </div>
    );
};

export default DashboardStatsOverview;