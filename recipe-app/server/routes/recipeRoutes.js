// server/routes/recipeRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe
} from '../controllers/recipeController.js';
import { getCommentsForRecipe, addCommentToRecipe } from '../controllers/commentController.js';

const router = express.Router();

// recipes
router.post('/', authMiddleware, createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

// ratings
router.post('/:id/rate', authMiddleware, rateRecipe);

// comments nested under recipe
router.get('/:id/comments', getCommentsForRecipe);
router.post('/:id/comments', authMiddleware, addCommentToRecipe);

export default router;
