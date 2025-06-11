import React from 'react';
import FormField from '@/components/molecules/FormField';
import Text from '@/components/atoms/Text';

const ReportFilters = ({ filters, setFilters, trips, categories }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Report Filters</Text>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <FormField
                    label="Trip"
                    id="report-filter-trip"
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
                    id="report-filter-category"
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
                    id="report-filter-date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
                <FormField
                    label="To Date"
                    id="report-filter-date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
                <FormField
                    label="Options"
                    id="report-filter-reimbursable"
                    type="checkbox"
                    checked={filters.reimbursableOnly}
                    onChange={(e) => setFilters({ ...filters, reimbursableOnly: e.target.checked })}
                    className="h-10" // Adjust height to align with other inputs
                />
            </div>
        </div>
    );
};

export default ReportFilters;