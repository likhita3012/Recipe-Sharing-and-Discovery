// server/routes/userRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getSavedRecipes, saveRecipe, unsaveRecipe, getUploadedByUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id/saved-recipes', authMiddleware, getSavedRecipes);
router.post('/:id/saved-recipes', authMiddleware, saveRecipe);
router.delete('/:id/saved-recipes/:recipeId', authMiddleware, unsaveRecipe);

// uploaded recipes
router.get('/:id/uploaded-recipes', authMiddleware, getUploadedByUser);

export default router;
