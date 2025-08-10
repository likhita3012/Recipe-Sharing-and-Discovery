import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Recipe Platform</Link>
        
      </div>
      <div className="header-right">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        {user && (
          <Link to="/create" className="nav-link">Create Recipe</Link>
        )}
        
        {user ? (
          <div
            className="dropdown"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="nav-link">My Account</span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <Link to="/edit-profile">Edit Profile</Link>
                <Link to="/my-recipes">My Recipes</Link>
                <span onClick={handleLogout}>Logout</span>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link">Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
