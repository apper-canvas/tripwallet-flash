import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { tripService } from '../services';

const Trips = () => {
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
        name: '',
        destination: '',
        startDate: '',
        endDate: '',
        budget: '',
        currency: 'USD'
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
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load trips</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadTrips}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium"
        >
          Try Again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-surface-900">All Trips</h2>
          <p className="text-surface-600">{trips.length} total trips</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>New Trip</span>
        </motion.button>
      </div>

      {/* Trips Grid */}
      {trips.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No trips yet</h3>
          <p className="mt-2 text-surface-500">Create your first trip to start tracking expenses</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-medium"
          >
            Create Trip
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip, index) => {
            const spentPercentage = (trip.spent / trip.budget) * 100;
            const budgetStatus = getBudgetStatus(trip.spent, trip.budget);
            const isOverBudget = trip.spent > trip.budget;
            
            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-surface-900 truncate">{trip.name}</h3>
                    <p className="text-surface-600 truncate">{trip.destination}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(trip);
                        }}
                        className="p-1 text-surface-400 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                      >
                        <ApperIcon name="Edit2" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(trip.id);
                        }}
                        className="p-1 text-surface-400 hover:text-error hover:bg-error/10 rounded transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center space-x-2 text-sm text-surface-600 mb-4">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Budget Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600">Budget Progress</span>
                    <span className={`font-medium ${budgetStatus.color}`}>
                      {Math.round(spentPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${budgetStatus.bgColor}`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-surface-900">
                      {formatCurrency(trip.spent, trip.currency)}
                    </span>
                    <span className="text-sm text-surface-600">
                      of {formatCurrency(trip.budget, trip.currency)}
                    </span>
                  </div>
                  {isOverBudget && (
                    <div className="flex items-center space-x-1 text-error text-sm">
                      <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                      <span>Over budget by {formatCurrency(trip.spent - trip.budget, trip.currency)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trip Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowModal(false);
              setEditingTrip(null);
              setFormData({
                name: '',
                destination: '',
                startDate: '',
                endDate: '',
                budget: '',
                currency: 'USD'
              });
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900">
                  {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingTrip(null);
                    setFormData({
                      name: '',
                      destination: '',
                      startDate: '',
                      endDate: '',
                      budget: '',
                      currency: 'USD'
                    });
                  }}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Trip Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Business Trip to Tokyo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tokyo, Japan"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Budget *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="5000.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTrip(null);
                      setFormData({
                        name: '',
                        destination: '',
                        startDate: '',
                        endDate: '',
                        budget: '',
                        currency: 'USD'
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingTrip ? 'Update Trip' : 'Create Trip'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trips;