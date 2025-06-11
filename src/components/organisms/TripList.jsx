import React from 'react';
import TripListItem from '@/components/molecules/TripListItem';
import EmptyState from '@/components/molecules/EmptyState';

const TripList = ({ trips, formatCurrency, getBudgetStatus, getStatusColor, handleEdit, handleDelete, onAddTripClick }) => {
    return (
        <>
            {trips.length === 0 ? (
                <EmptyState
                    icon="MapPin"
                    title="No trips yet"
                    message="Create your first trip to start tracking expenses"
                    actionLabel="Create Trip"
                    onActionClick={onAddTripClick}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip, index) => (
                        <TripListItem
                            key={trip.id}
                            trip={trip}
                            formatCurrency={formatCurrency}
                            getBudgetStatus={getBudgetStatus}
                            getStatusColor={getStatusColor}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            animationDelay={index * 0.1}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default TripList;