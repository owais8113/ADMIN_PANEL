import React, { useState } from 'react';
import './style.css';
import { Link, useHistory, useNavigate } from 'react-router-dom';
import { auth } from '../Config'; // Update the path to your config.js file

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with Firebase Auth
      await auth.signInWithEmailAndPassword(email, password);

      // Clear the form and state values
      setEmail('');
      setPassword('');
      setErrorMessage('');

      // Redirect to the desired page after successful login
      // Replace "/dashboard" with the appropriate route for your admin panel
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid email or password');
    }
  };

  return (
    <div className="main-container">
      <h1 className="main-heading">WELCOME ADMIN</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="label">Admin Login Page</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="login-text">
          New User?{' '}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>{' '}
        </p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Signin;
