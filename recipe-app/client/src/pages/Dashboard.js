import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes", err);
        setError("Failed to load recipes. Please try again later."); // Set a user-friendly error message
      } finally {
        setLoading(false); // Ensure loading is set to false regardless of success or failure
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
        {loading ? (
          // Display a loading message or spinner while fetching data
          <p>Loading recipes...</p>
        ) : error ? (
          // Display an error message if the API call failed
          <p className="error-message">{error}</p>
        ) : recipes.length > 0 ? (
          // Display the recipes if the data was fetched successfully
          recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          // Display "No recipes" if no recipes were returned
          <p>No recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;