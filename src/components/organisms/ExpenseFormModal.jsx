import React, { useState } from 'react';
import { Receipt } from 'lucide-react';
import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ReceiptUploadModal from '@/components/organisms/ReceiptUploadModal';
const ExpenseFormModal = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    handleSubmit,
    editingExpense,
    trips,
    categories,
    currencies
}) => {
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    
    const handleClose = () => {
        onClose();
        // Reset form data if closing without saving
        setFormData({
            tripId: '',
            amount: '',
            currency: 'USD',
            category: 'meals',
            merchant: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
            isReimbursable: true
        });
    };

    const handleReceiptData = (receiptData) => {
        // Pre-fill form with OCR data
        setFormData(prevData => ({
            ...prevData,
            merchant: receiptData.merchant || prevData.merchant,
            amount: receiptData.amount || prevData.amount,
            date: receiptData.date || prevData.date,
            category: receiptData.category || prevData.category,
            currency: receiptData.currency || prevData.currency,
            notes: receiptData.notes || prevData.notes
        }));
        setShowReceiptModal(false);
    };
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalHeader title={editingExpense ? 'Edit Expense' : 'Add New Expense'} onClose={handleClose} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Trip"
                    id="expense-trip-id"
                    type="select"
                    value={formData.tripId}
                    onChange={(e) => setFormData({ ...formData, tripId: e.target.value })}
                    required
                    options={[
                        { value: '', label: 'Select a trip', disabled: true },
                        ...trips.map(trip => ({ value: trip.id, label: trip.name }))
                    ]}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Amount"
                        id="expense-amount"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        required
                    />
                    <FormField
                        label="Currency"
                        id="expense-currency"
                        type="select"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        options={currencies.map(c => ({ value: c, label: c }))}
                    />
                </div>

                <FormField
                    label="Category"
                    id="expense-category"
                    type="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={categories.map(cat => ({ value: cat.id, label: cat.label }))}
                />

                <FormField
                    label="Merchant/Description"
                    id="expense-merchant"
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    placeholder="Restaurant, Hotel, etc."
                />

                <FormField
                    label="Date"
                    id="expense-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />

                <FormField
                    label="Notes"
                    id="expense-notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Optional notes..."
                />

                <FormField
                    label="This expense is reimbursable"
                    id="reimbursable"
                    type="checkbox"
                    checked={formData.isReimbursable}
                    onChange={(e) => setFormData({ ...formData, isReimbursable: e.target.checked })}
/>

                {/* Receipt Upload Button */}
                <div className="pt-2 pb-2 border-t border-surface-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReceiptModal(true)}
                        className="w-full"
                    >
                        <Receipt className="w-4 h-4 mr-2" />
                        Upload Receipt & Auto-Fill
                    </Button>
                </div>

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
                        {editingExpense ? 'Update Expense' : 'Add Expense'}
                    </Button>
                </div>
</form>

            {/* Receipt Upload Modal */}
            <ReceiptUploadModal
                isOpen={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                onConfirm={handleReceiptData}
                categories={categories}
                currencies={currencies}
            />
        </Modal>
    );
};

export default ExpenseFormModal;