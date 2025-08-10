import React from 'react';
import { Link } from 'react-router-dom';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img
        src={recipe.image || '/placeholder.jpg'}
        alt={recipe.title}
        className="recipe-image"
      />
      <h2>{recipe.title}</h2>
      <p><strong>Prep Time:</strong> {recipe.prepTime} mins</p>
      <p><strong>Cook Time:</strong> {recipe.cookTime} mins</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      <p><strong>Rating:</strong> {recipe.averageRating || 0} ⭐</p>
      <Link to={`/recipe/${recipe._id}`} className="view-details-btn">View Details</Link>
    </div>
  );
};

export default RecipeCard;
