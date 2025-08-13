import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 5 }
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  prepTime: { type: String },
  cookTime: { type: String },
  servings: { type: Number },
  ingredients: { type: String, required: true },
  instructions: { type: String, required: true },
  image: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: [ratingSchema], // 👈 important
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
