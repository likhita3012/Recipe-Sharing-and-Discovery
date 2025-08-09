import React from 'react';
import './NotFound.css';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="notfound-container">
    <h1>404</h1>
    <p>Page not found.</p>
    <Link to="/">Go to Home</Link>
  </div>
);

export default NotFound;
