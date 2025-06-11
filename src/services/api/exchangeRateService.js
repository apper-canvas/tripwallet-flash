import exchangeRateData from '../mockData/exchangeRates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExchangeRateService {
  constructor() {
    this.data = [...exchangeRateData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getRate(from, to) {
    await delay(150);
    const rate = this.data.find(r => r.from === from && r.to === to);
    if (!rate) {
      // Return inverse rate if direct rate not found
      const inverseRate = this.data.find(r => r.from === to && r.to === from);
      if (inverseRate) {
        return {
          from,
          to,
          rate: 1 / inverseRate.rate,
          timestamp: inverseRate.timestamp
        };
      }
      throw new Error('Exchange rate not found');
    }
    return { ...rate };
  }

  async create(rateData) {
    await delay(300);
    const newRate = {
      ...rateData,
      timestamp: new Date().toISOString()
    };
    this.data.push(newRate);
    return { ...newRate };
  }

  async update(from, to, rate) {
    await delay(250);
    const index = this.data.findIndex(r => r.from === from && r.to === to);
    if (index === -1) {
      throw new Error('Exchange rate not found');
    }
    this.data[index] = {
      ...this.data[index],
      rate,
      timestamp: new Date().toISOString()
    };
    return { ...this.data[index] };
  }
}

export default new ExchangeRateService();