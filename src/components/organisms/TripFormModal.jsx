import React from 'react';
import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TripFormModal = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    handleSubmit,
    editingTrip,
    currencies
}) => {
    const handleClose = () => {
        onClose();
        // Reset form data if closing without saving (or saving is handled by handleSubmit)
        setFormData({
            name: '',
            destination: '',
            startDate: '',
            endDate: '',
            budget: '',
            currency: 'USD'
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalHeader title={editingTrip ? 'Edit Trip' : 'Create New Trip'} onClose={handleClose} />

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Trip Name"
                    id="trip-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Business Trip to Tokyo"
                    required
                />

                <FormField
                    label="Destination"
                    id="trip-destination"
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Tokyo, Japan"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Start Date"
                        id="trip-start-date"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                    />
                    <FormField
                        label="End Date"
                        id="trip-end-date"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Budget"
                        id="trip-budget"
                        type="number"
                        step="0.01"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="5000.00"
                        required
                    />
                    <FormField
                        label="Currency"
                        id="trip-currency"
                        type="select"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        options={currencies.map(c => ({ value: c, label: c }))}
                    />
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
                        {editingTrip ? 'Update Trip' : 'Create Trip'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TripFormModal;