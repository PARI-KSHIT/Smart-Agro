import mongoose from 'mongoose';

const diseaseHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  diseaseName: { type: String, required: true },
  description: { type: String, required: true },
  recommendedFertilizer: { type: String, required: true },
  preventionTips: { type: String, required: true },
  analyzedAt: { type: Date, default: Date.now }
});

export const DiseaseHistory = mongoose.models.DiseaseHistory || mongoose.model('DiseaseHistory', diseaseHistorySchema);
