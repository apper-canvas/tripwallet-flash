import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { tripService } from '@/services'; // Keep services imports
import PageHeader from '@/components/molecules/PageHeader';
import TripList from '@/components/organisms/TripList';
import TripFormModal from '@/components/organisms/TripFormModal';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import Spinner from '@/components/atoms/Spinner';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD'
  });

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getAll();
      setTrips(data);
    } catch (err) {
      setError(err.message || 'Failed to load trips');
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate || !formData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const tripData = {
        ...formData,
        budget: parseFloat(formData.budget),
        spent: editingTrip?.spent || 0,
        status: editingTrip?.status || 'active'
      };

      if (editingTrip) {
        await tripService.update(editingTrip.id, tripData);
        toast.success('Trip updated successfully!');
      } else {
        await tripService.create(tripData);
        toast.success('Trip created successfully!');
      }

      setShowModal(false);
      setEditingTrip(null);
      setFormData({
        name: '', destination: '', startDate: '', endDate: '', budget: '', currency: 'USD'
      });
      loadTrips();
    } catch (error) {
      toast.error(editingTrip ? 'Failed to update trip' : 'Failed to create trip');
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate.split('T')[0],
      endDate: trip.endDate.split('T')[0],
      budget: trip.budget.toString(),
      currency: trip.currency
    });
    setShowModal(true);
  };

  const handleDelete = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await tripService.delete(tripId);
      toast.success('Trip deleted successfully!');
      loadTrips();
    } catch (error) {
      toast.error('Failed to delete trip');
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getBudgetStatus = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 90) return { status: 'danger', color: 'text-error', bgColor: 'bg-error' };
    if (percentage >= 75) return { status: 'warning', color: 'text-warning', bgColor: 'bg-warning' };
    return { status: 'good', color: 'text-success', bgColor: 'bg-success' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-white';
      case 'completed': return 'bg-surface-600 text-white';
      case 'cancelled': return 'bg-error text-white';
      default: return 'bg-surface-400 text-white';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-surface-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-5 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-surface-200 rounded w-full mb-2"></div>
              <div className="h-8 bg-surface-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadTrips} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Trips"
        subtitle={`${trips.length} total trips`}
        onAddClick={() => setShowModal(true)}
        addLabel="New Trip"
      />

      <TripList
        trips={trips}
        formatCurrency={formatCurrency}
        getBudgetStatus={getBudgetStatus}
        getStatusColor={getStatusColor}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onAddTripClick={() => setShowModal(true)}
      />

      <TripFormModal
        isOpen={showModal}
        onClose={() => {setShowModal(false); setEditingTrip(null);}}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingTrip={editingTrip}
        currencies={currencies}
      />
    </div>
  );
};

export default TripsPage;