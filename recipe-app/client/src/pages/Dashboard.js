import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes", err);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>All Recipes</h1>
        <Link to="/saved-recipes" className="saved-btn">Saved Recipes</Link>
      </div>

      <div className="recipe-grid">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p>No recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
