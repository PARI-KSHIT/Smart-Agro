import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema({
  commodity: { type: String, required: true },
  modal_price: { type: String, required: true },
  market: { type: String, required: true },
  state: { type: String, required: true },
  arrival_date: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

// For indexing and unique identification (if possible, though market data is usually snapshots)
marketSchema.index({ commodity: 1, market: 1, state: 1, arrival_date: 1 }, { unique: true });

export const Market = mongoose.model('Market', marketSchema);
