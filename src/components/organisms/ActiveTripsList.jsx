import React from 'react';
import { motion } from 'framer-motion';
import TripListItem from '@/components/molecules/TripListItem';
import EmptyState from '@/components/molecules/EmptyState';
import Text from '@/components/atoms/Text';

const ActiveTripsList = ({ activeTrips, formatCurrency, getBudgetStatus }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm"
        >
            <div className="p-6 border-b border-surface-200">
                <Text as="h3" className="text-lg font-semibold text-surface-900">Active Trips</Text>
            </div>
            
            {activeTrips.length === 0 ? (
                <EmptyState
                    icon="MapPin"
                    title="No active trips"
                    message="Create a trip to start tracking expenses"
                    actionLabel="Create Trip"
                    onActionClick={() => alert('Navigate to Create Trip page (functionality to be implemented)')} // Placeholder
                />
            ) : (
                <div className="divide-y divide-surface-200">
                    {activeTrips.slice(0, 3).map((trip, index) => (
                        <TripListItem
                            key={trip.id}
                            trip={trip}
                            formatCurrency={formatCurrency}
                            getBudgetStatus={getBudgetStatus}
                            // getStatusColor not needed here as TripListItem uses it internally with prop getBudgetStatus
                            animationDelay={0.4 + index * 0.1}
                            whileHoverScale={1.005} // Slightly less hover scale for list items
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ActiveTripsList;