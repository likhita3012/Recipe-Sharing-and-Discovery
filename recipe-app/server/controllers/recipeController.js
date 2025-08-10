import Recipe from '../models/Recipe.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, category, prepTime, cookTime, servings, image } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      category,
      prepTime,
      cookTime,
      servings,
      image,
      author: req.user._id
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};


export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update recipe
export const updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete recipe
export const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

// Rate a recipe
export const rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user has already rated
    const existingRatingIndex = recipe.ratings.findIndex(r => r.user.toString() === req.user._id.toString());

    if (existingRatingIndex > -1) {
      recipe.ratings[existingRatingIndex].rating = rating; // Update rating
    } else {
      recipe.ratings.push({ user: req.user._id, rating }); // Add new rating
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error rating recipe', error: error.message });
  }
};
