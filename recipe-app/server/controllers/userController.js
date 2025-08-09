// server/controllers/userController.js
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'savedRecipes',
      populate: { path: 'author', select: 'username' }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedRecipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved recipes' });
  }
};

export const saveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { recipeId } = req.body;
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      await user.save();
    }
    res.json({ message: 'Recipe saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save recipe' });
  }
};

export const unsaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedRecipes = user.savedRecipes.filter(r => r.toString() !== req.params.recipeId);
    await user.save();
    res.json({ message: 'Recipe unsaved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unsave recipe' });
  }
};

// Get uploaded recipes by user
export const getUploadedByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user recipes' });
  }
};
