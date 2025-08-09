// server/models/Rating.js
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  value: { type: Number, required: true, min: 1, max: 5 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
