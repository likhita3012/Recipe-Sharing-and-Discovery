import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
    fetchComments();
  }, [id]);

  // inside RecipeDetail component
const handleRatingSubmit = async () => {
  if (rating === 0) return alert("Please select a rating");

  try {
    await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { rating :selectedRating}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // fetch updated recipe with new average rating
    const updated = await axios.get(`http://localhost:5000/api/recipes/${id}`);
    setRecipe(updated.data);
    setRating(0);
    setHoverRating(0);
    alert("Rating submitted!");
  } catch (err) {
    console.error(err);
    alert("Error submitting rating");
  }
};

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/recipes/${id}/comments`,
        { text: comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!recipe) return <div className="loading">Loading...</div>;
  const renderStars = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= (hoverRating || rating) ? 'filled' : ''}`}
        onClick={() => setRating(i)}
        onMouseEnter={() => setHoverRating(i)}
        onMouseLeave={() => setHoverRating(0)}
      >
        ★
      </span>
    );
  }
  return stars;
};

  return (
    <div className="recipe-detail">
      <Link to="/" className="back-btn">← Back to Dashboard</Link>

      <div className="recipe-container">
        {/* Left Side */}
        <div className="recipe-left">
          <img src={recipe.image} alt={recipe.title} />
          <div className="recipe-meta">
            <p><strong>Prep Time:</strong> {recipe.prepTime || 'N/A'}</p>
            <p><strong>Cook Time:</strong> {recipe.cookTime || 'N/A'}</p>
            <p><strong>Servings:</strong> {recipe.servings || 'N/A'}</p>
            <p><strong>Average Rating:</strong> {recipe.averageRating?.toFixed(1) || 'No ratings'}</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="recipe-right">
          <h2>{recipe.title}</h2>
          <div className="ingredients">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients?.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>
          <div className="instructions">
            <h3>Instructions</h3>
            <p>{recipe.instructions}</p>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="rating-section">
      <h3>Rate this recipe</h3>
      <div className="stars">{renderStars()}</div>
      <button onClick={handleRatingSubmit}>Submit Rating</button>
          </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        {user && (
          <div className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
            />
            <button onClick={handleCommentSubmit}>Submit Comment</button>
          </div>
        )}

        <div className="comment-list">
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <div key={index} className="comment-item">
                <p className="comment-author">{c.author?.username || 'Anonymous'}:</p>
                <p>{c.text}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
