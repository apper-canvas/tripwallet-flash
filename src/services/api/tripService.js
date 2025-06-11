const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TripService {
  constructor() {
    this.trips = [
      {
        id: '1',
        name: 'Business Trip to NYC',
        destination: 'New York, NY',
        startDate: '2024-01-15',
        endDate: '2024-01-18',
        status: 'active',
        budget: 2500,
        totalExpenses: 1847.50,
        createdAt: '2024-01-10T10:00:00Z'
      },
      {
        id: '2',
        name: 'Conference in San Francisco',
        destination: 'San Francisco, CA',
        startDate: '2024-02-05',
        endDate: '2024-02-08',
        status: 'planned',
        budget: 3000,
        totalExpenses: 0,
        createdAt: '2024-01-20T14:30:00Z'
      }
    ];
  }

  async getAllTrips() {
    await delay(300);
    return [...this.trips];
  }

  async getTripById(id) {
    await delay(200);
    const trip = this.trips.find(t => t.id === id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return { ...trip };
  }

  async createTrip(tripData) {
    await delay(500);
    
    if (!tripData.name || !tripData.destination) {
      throw new Error('Trip name and destination are required');
    }

    const newTrip = {
      id: Date.now().toString(),
      name: tripData.name,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      status: tripData.status || 'planned',
      budget: tripData.budget || 0,
      totalExpenses: 0,
      createdAt: new Date().toISOString()
    };

    this.trips.push(newTrip);
    return { ...newTrip };
  }

  async updateTrip(id, updateData) {
    await delay(400);
    
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      throw new Error('Trip not found');
    }

    this.trips[tripIndex] = {
      ...this.trips[tripIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return { ...this.trips[tripIndex] };
  }

  async deleteTrip(id) {
    await delay(300);
    
    const tripIndex = this.trips.findIndex(t => t.id === id);
    if (tripIndex === -1) {
      throw new Error('Trip not found');
    }

    this.trips.splice(tripIndex, 1);
    return true;
  }

  async updateTripExpenses(tripId, totalExpenses) {
    await delay(200);
    
    const trip = this.trips.find(t => t.id === tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    trip.totalExpenses = totalExpenses;
    trip.updatedAt = new Date().toISOString();
    
    return { ...trip };
  }
}

export default new TripService();