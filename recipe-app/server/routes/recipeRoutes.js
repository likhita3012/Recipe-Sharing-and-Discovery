import express from 'express';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe
} from '../controllers/recipeController.js';

import { getCommentsForRecipe, addCommentToRecipe } from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// recipes
router.post('/', authMiddleware, createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

// ratings
router.post('/:id/rate', authMiddleware, rateRecipe);


// comments
router.get('/:id/comments', getCommentsForRecipe);
router.post('/:id/comments', authMiddleware, addCommentToRecipe);

export default router;
