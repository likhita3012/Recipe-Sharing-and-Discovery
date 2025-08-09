import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [uploaded, setUploaded] = useState([]);
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return; 
    }

    const fetchUserData = async () => {
      const Token = localStorage.getItem("token"); 
      if (!Token) {
        navigate('/login');
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${Token}` }
        };

        const uploadedRes = await axios.get(
          `http://localhost:5000/api/recipes?author=${user.id}`
        );
        setUploaded(uploadedRes.data);

        const savedRes = await axios.get(
          `http://localhost:5000/api/users/${user.id}/saved-recipes`,
          config
        );
        setSaved(savedRes.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data.');
      }
    };
    
    fetchUserData();
  }, [user, navigate]); 

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <h2>👤 {user.username}'s Dashboard</h2>

      <div className="dashboard-section">
        <h3>📤 Uploaded Recipes</h3>
        {uploaded.length === 0 ? (
          <p>No uploaded recipes yet.</p>
        ) : (
          <ul className="recipe-list">
            {uploaded.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dashboard-section">
        <h3>❤️ Saved Recipes</h3>
        {saved.length === 0 ? (
          <p>No saved recipes.</p>
        ) : (
          <ul className="recipe-list">
            {saved.map(recipe => (
              <li key={recipe._id}>
                <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
