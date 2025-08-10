import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    image: ''
  });

  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snack',
    'Beverage'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a recipe.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('Recipe created successfully!');
        navigate('/');
      } else {
        alert('Error creating recipe.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="create-recipe-container">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit} className="create-recipe-form">
        
        <label>Recipe Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <label>Ingredients:</label>
        <textarea
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          required
        />

        <label>Instructions:</label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          required
        />

        <label>Prep Time (minutes):</label>
        <input
          type="number"
          name="prepTime"
          value={formData.prepTime}
          onChange={handleChange}
          required
        />

        <label>Cook Time (minutes):</label>
        <input
          type="number"
          name="cookTime"
          value={formData.cookTime}
          onChange={handleChange}
          required
        />

        <label>Servings:</label>
        <input
          type="number"
          name="servings"
          value={formData.servings}
          onChange={handleChange}
          required
        />

        <label>Upload Image:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <button type="submit" className="submit-btn">Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateRecipe;
