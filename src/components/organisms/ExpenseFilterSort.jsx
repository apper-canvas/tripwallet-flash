import React from 'react';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ExpenseFilterSort = ({ filters, setFilters, sortBy, setSortBy, sortOrder, setSortOrder, trips, categories }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                    label="Trip"
                    id="filter-trip"
                    type="select"
                    value={filters.tripId}
                    onChange={(e) => setFilters({ ...filters, tripId: e.target.value })}
                    options={[
                        { value: '', label: 'All trips' },
                        ...trips.map(trip => ({ value: trip.id, label: trip.name }))
                    ]}
                />
                <FormField
                    label="Category"
                    id="filter-category"
                    type="select"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    options={[
                        { value: '', label: 'All categories' },
                        ...categories.map(category => ({ value: category.id, label: category.label }))
                    ]}
                />
                <FormField
                    label="From Date"
                    id="filter-date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
                <FormField
                    label="To Date"
                    id="filter-date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
            </div>
            <div className="flex items-center justify-end mt-4 pt-4 border-t border-surface-200">
                <Text as="label" htmlFor="sort-by" className="block text-sm font-medium text-surface-700 mr-2">Sort by:</Text>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-surface-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="merchant">Merchant</option>
                    <option value="category">Category</option>
                </select>
                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors ml-2"
                >
                    <ApperIcon 
                        name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
                        className="w-4 h-4 text-surface-600" 
                    />
                </button>
            </div>
        </div>
    );
};

export default ExpenseFilterSort;