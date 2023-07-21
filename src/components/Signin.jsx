import React, { useState } from 'react';
import './style.css';
import { Link, useHistory, useNavigate } from 'react-router-dom';
import { auth,fs } from '../Config'; // Update the path to your config.js file

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityKey, setSecurityKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in with Firebase Auth
      await auth.signInWithEmailAndPassword(email, password);

      // Get the current user's document from Firestore
      const user = await fs.collection('admin').doc(auth.currentUser.uid).get();

      // Check if the security key matches
      if (user.exists && user.data().securityKey === securityKey) {
        // Clear the form and state values
        setEmail('');
        setPassword('');
        setSecurityKey('');
        setErrorMessage('');

        // Redirect to the desired page after successful login
        // Replace "/dashboard" with the appropriate route for your admin panel
        navigate('/home');
      } else {
        setErrorMessage('Invalid email, password, or security key');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid email, password, or security key');
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
        <input
          type="password"
          placeholder="Security Key"
          value={securityKey}
          onChange={(e) => setSecurityKey(e.target.value)}
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
