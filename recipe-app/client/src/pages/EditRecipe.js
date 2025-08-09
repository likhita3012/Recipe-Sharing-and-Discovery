import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './EditRecipe.css';

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        const recipe = res.data.recipe || res.data; // support either shape
        setForm({
          title: recipe.title || '',
          ingredients: (recipe.ingredients || []).join(', '),
          instructions: Array.isArray(recipe.instructions) ? recipe.instructions.join('\n') : (recipe.instructions || ''),
          image: recipe.image || '',
          category: recipe.category || '',
          prepTime: recipe.prepTime || '',
          cookTime: recipe.cookTime || '',
          servings: recipe.servings || ''
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load recipe for editing.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Login required');
        navigate('/login');
        return;
      }
      const payload = {
        title: form.title,
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
        image: form.image,
        category: form.category,
        prepTime: Number(form.prepTime) || 0,
        cookTime: Number(form.cookTime) || 0,
        servings: Number(form.servings) || 1
      };
      await axios.put(`http://localhost:5000/api/recipes/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Recipe updated');
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to update recipe');
    }
  };

  if (loading) return <div className="edit-loading">Loading...</div>;

  return (
    <div className="edit-recipe-container">
      <h2>Edit Recipe</h2>
      <form className="edit-recipe-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (comma separated)" required />
        <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instructions (one per line)" required />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {form.image && <img className="edit-preview" src={form.image} alt="preview" />}
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        <input name="prepTime" value={form.prepTime} onChange={handleChange} placeholder="Prep time (mins)" type="number" />
        <input name="cookTime" value={form.cookTime} onChange={handleChange} placeholder="Cook time (mins)" type="number" />
        <input name="servings" value={form.servings} onChange={handleChange} placeholder="Servings" type="number" />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRecipe;
