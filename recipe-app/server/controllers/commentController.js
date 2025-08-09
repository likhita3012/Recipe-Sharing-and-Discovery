// server/controllers/commentController.js
import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';

export const getCommentsForRecipe = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id }).populate('author', 'username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

export const addCommentToRecipe = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const comment = new Comment({
      text,
      author: req.user._id,
      recipe: req.params.id,
    });
    await comment.save();
    await Recipe.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });

    const populated = await comment.populate('author', 'username');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};
