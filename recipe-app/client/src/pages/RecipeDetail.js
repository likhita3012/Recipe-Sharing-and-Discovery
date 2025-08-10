import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);

        const commentsRes = await axios.get(`http://localhost:5000/api/recipes/${id}/comments`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleRatingSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { rating }, { withCredentials: true });
      alert('Rating submitted!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/recipes/${id}/comments`,
        { text: newComment },
        { withCredentials: true }
      );
      setComments([...comments, { text: newComment, author: { username: 'You' } }]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
      <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>

      {/* Dual Pane */}
      <div className="dual-pane">
        {/* Left Side */}
        <div className="left-pane">
          <img src={recipe.image} alt={recipe.title} className="recipe-img" />
          <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
          <p><strong>Cook Time:</strong> {recipe.cookTime} mins</p>
          <p><strong>Servings:</strong> {recipe.servings}</p>
          <p><strong>Average Rating:</strong> {recipe.averageRating || "No ratings yet"}</p>
        </div>

        {/* Right Side */}
        <div className="right-pane">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>

          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      </div>

      {/* Comments + Rating Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length > 0 ? comments.map((c, i) => (
          <p key={i}><strong>{c.author?.username || 'Anonymous'}:</strong> {c.text}</p>
        )) : <p>No comments yet.</p>}

        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Submit Comment</button>
      </div>

      <div className="rating-section">
        <h3>Rate this recipe</h3>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button onClick={handleRatingSubmit}>Submit Rating</button>
      </div>
    </div>
  );
};

export default RecipeDetail;
