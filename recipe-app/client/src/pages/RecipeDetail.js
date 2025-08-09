import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, [id, user]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
      const payload = res.data.recipe ? res.data : { recipe: res.data }; // support both shapes
      setRecipe(payload.recipe || payload);
      setComments(res.data.comments || []);
      if (user) {
        // check saved
        const token = localStorage.getItem('token');
        const savedRes = await axios.get(`http://localhost:5000/api/users/${user.id}/saved-recipes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const savedIds = (savedRes.data || []).map(r => (r._id ? r._id : r.id));
        setIsSaved(savedIds.includes(id));
      } else {
        setIsSaved(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load recipe.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (isSaved) {
        await axios.delete(`http://localhost:5000/api/users/${user.id}/saved-recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(false);
      } else {
        await axios.post(`http://localhost:5000/api/users/${user.id}/saved-recipes`, { recipeId: id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update saved status.');
    }
  };

  const submitRating = async () => {
    if (!user) { navigate('/login'); return; }
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Select rating 1-5');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/recipes/${id}/rate`, { value: ratingValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRatingValue(0);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating');
    }
  };

  const submitComment = async () => {
    if (!user) { navigate('/login'); return; }
    if (!commentText.trim()) { alert('Comment empty'); return; }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/recipes/${id}/comments`, { text: commentText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText('');
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Failed to post comment');
    }
  };

  if (loading || !recipe) return <div className="detail-loading">Loading...</div>;

  return (
    <div className="recipe-detail-page">
      <div className="detail-header">
        <h1>{recipe.title}</h1>
        <div className="detail-actions">
          {user && user.id === (recipe.author && recipe.author._id ? recipe.author._id : recipe.author) && (
            <Link to={`/edit/${id}`} className="edit-link">Edit</Link>
          )}
          <button className="save-btn" onClick={handleSaveToggle}>
            {isSaved ? '💔 Unsave' : '❤️ Save'}
          </button>
        </div>
      </div>

      <div className="detail-top">
        <div className="detail-image">
          <img src={recipe.image || 'https://via.placeholder.com/800x400?text=No+Image'} alt={recipe.title} />
        </div>
        <div className="detail-meta">
          <p><strong>Author:</strong> {recipe.author?.username || 'Unknown'}</p>
          <p><strong>Category:</strong> {recipe.category || '—'}</p>
          <p><strong>Prep:</strong> {recipe.prepTime || 0} mins</p>
          <p><strong>Cook:</strong> {recipe.cookTime || 0} mins</p>
          <p><strong>Servings:</strong> {recipe.servings || 1}</p>
          <p><strong>Average Rating:</strong> {recipe.averageRating ? recipe.averageRating.toFixed(1) : 'No ratings'}</p>
          <p><strong>Comments:</strong> {recipe.commentsCount || comments.length || 0}</p>
        </div>
      </div>

      <section className="detail-section">
        <h3>Ingredients</h3>
        <ul>
          {(recipe.ingredients || []).map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      </section>

      <section className="detail-section">
        <h3>Instructions</h3>
        {Array.isArray(recipe.instructions)
          ? recipe.instructions.map((s, i) => <p key={i}>{s}</p>)
          : <p>{recipe.instructions}</p>}
      </section>

      <section className="detail-section">
        <h3>Rate this recipe</h3>
        <div className="rating-controls">
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`star-btn ${ratingValue >= n ? 'selected' : ''}`} onClick={() => setRatingValue(n)}>
              {n}★
            </button>
          ))}
          <button className="submit-btn" onClick={submitRating}>Submit Rating</button>
        </div>
      </section>

      <section className="detail-section comment-section">
        <h3>Comments</h3>
        {comments.length === 0 ? <p>No comments yet.</p> : (
          <ul className="comments-list">
            {comments.map(c => (
              <li key={c._id} className="comment-item">
                <strong>{c.author?.username || 'User'}</strong> <span className="comment-time">({new Date(c.createdAt).toLocaleString()})</span>
                <div>{c.text}</div>
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <div className="add-comment">
            <textarea placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
            <button onClick={submitComment}>Post Comment</button>
          </div>
        ) : (
          <p><Link to="/login">Login</Link> to post comments.</p>
        )}
      </section>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
    </div>
  );
};

export default RecipeDetail;
