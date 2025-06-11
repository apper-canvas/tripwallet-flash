import React from 'react';
import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { motion } from 'framer-motion';

const QuickAddExpenseFormModal = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    handleSubmit,
    activeTrips,
    categories,
    currencies
}) => {
    const handleClose = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalHeader title="Quick Add Expense" onClose={handleClose} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Trip"
                    id="quick-trip-id"
                    type="select"
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    required
                    options={[
                        { value: '', label: 'Select a trip', disabled: true },
                        ...activeTrips.map(trip => ({ value: trip.id, label: trip.name }))
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Amount"
                        id="quick-amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                    />
                    <FormField
                        label="Currency"
                        id="quick-currency"
                        type="select"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        options={currencies.map(c => ({ value: c, label: c }))}
                    />
                </div>

                <FormField
                    label="Category"
                    id="quick-category"
                    type="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={categories.map(cat => ({ value: cat.id, label: cat.label }))}
                />

                <FormField
                    label="Merchant"
                    id="quick-merchant"
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    placeholder="Restaurant, Hotel, etc."
                />

                <FormField
                    label="Notes"
                    id="quick-notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes..."
                />

                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        Add Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default QuickAddExpenseFormModal;