import tripData from '../mockData/trips.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TripService {
  constructor() {
    this.data = [...tripData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const trip = this.data.find(t => t.id === id);
    if (!trip) {
      throw new Error('Trip not found');
    }
    return { ...trip };
  }

  async create(tripData) {
    await delay(300);
    const newTrip = {
      ...tripData,
      id: Date.now().toString(),
      spent: 0,
      status: 'active'
    };
    this.data.push(newTrip);
    return { ...newTrip };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Trip not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Trip not found');
    }
    this.data.splice(index, 1);
    return true;
  }
}

export default new TripService();