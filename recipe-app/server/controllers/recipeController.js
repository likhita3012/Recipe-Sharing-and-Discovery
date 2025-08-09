// server/controllers/recipeController.js
import Recipe from '../models/Recipe.js';
import Rating from '../models/Rating.js';
import Comment from '../models/Comment.js';

// Create recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, image, category, prepTime, cookTime, servings } = req.body;
    if (!title) return res.status(400).json({ message: 'Title required' });

    const ing = Array.isArray(ingredients) ? ingredients : (ingredients ? String(ingredients).split(',').map(i => i.trim()) : []);
    const instr = Array.isArray(instructions) ? instructions : (instructions ? String(instructions).split('\n').map(s => s.trim()) : []);

    const recipe = new Recipe({
      title,
      description,
      ingredients: ing,
      instructions: instr,
      image,
      category,
      prepTime,
      cookTime,
      servings,
      author: req.user._id,
    });

    const saved = await recipe.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create recipe', error: err.message });
  }
};

// Get recipes (with optional search/filter)
export const getRecipes = async (req, res) => {
  try {
    const { keyword, category, author } = req.query;
    const query = {};
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (author) query.author = author;

    const recipes = await Recipe.find(query).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

// Get a single recipe, plus comments and whether saved optionally
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const comments = await Comment.find({ recipe: recipe._id }).populate('author', 'username').sort({ createdAt: -1 });
    res.json({ recipe, comments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe' });
  }
};

// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    const updates = req.body;
    if (updates.ingredients && !Array.isArray(updates.ingredients)) {
      updates.ingredients = String(updates.ingredients).split(',').map(i => i.trim());
    }
    if (updates.instructions && !Array.isArray(updates.instructions)) {
      updates.instructions = String(updates.instructions).split('\n').map(s => s.trim());
    }

    Object.assign(recipe, updates, { updatedAt: new Date() });
    const updated = await recipe.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recipe' });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe' });
  }
};

// Submit or update rating
export const rateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { value } = req.body;
    if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Invalid rating' });

    let rating = await Rating.findOne({ recipe: recipeId, author: req.user._id });
    if (rating) {
      rating.value = value;
      await rating.save();
    } else {
      rating = new Rating({ value, recipe: recipeId, author: req.user._id });
      await rating.save();
      await Recipe.findByIdAndUpdate(recipeId, { $inc: { ratingCount: 1 } });
    }

    // Recompute average
    const ratings = await Rating.find({ recipe: recipeId });
    const avg = ratings.reduce((a, r) => a + r.value, 0) / ratings.length;
    await Recipe.findByIdAndUpdate(recipeId, { averageRating: avg });

    res.json({ message: 'Rating submitted', averageRating: avg });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};
