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
    alert('Error creatinggggggggggggggggggggggggggggggggggggg recipe:', error);
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
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Remove any previous rating from this user
    recipe.ratings = recipe.ratings.filter(r => r.user.toString() !== userId.toString());

    // Add the new rating
    recipe.ratings.push({ user: userId, value: rating });

    await recipe.save();

    res.json({ message: 'Rating submitted successfully', recipe });
  } catch (err) {
    console.error('Error in rateRecipe:', err);
    res.status(500).json({ message: 'Error submitting rating' });
  }
};
