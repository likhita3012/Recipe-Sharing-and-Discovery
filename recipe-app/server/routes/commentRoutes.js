import express from 'express';
import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all comments for a recipe
router.get('/:recipeId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId }).populate('author', 'username');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Add a comment
router.post('/:recipeId/comments', authMiddleware, async (req, res) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      author: req.user._id,
      recipe: req.params.recipeId,
    });

    await comment.save();

    // increment comment count in recipe
    await Recipe.findByIdAndUpdate(req.params.recipeId, { $inc: { commentsCount: 1 } });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

export default router;
