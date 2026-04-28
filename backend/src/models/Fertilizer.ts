import mongoose from 'mongoose';

const fertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number },
  usageInstructions: { type: String, required: true },
  quantity: { type: String, required: true },
  frequency: { type: String, required: true },
  benefits: [{ type: String }],
  suitableCrops: [{ type: String }]
});

export const Fertilizer = mongoose.models.Fertilizer || mongoose.model('Fertilizer', fertilizerSchema);
