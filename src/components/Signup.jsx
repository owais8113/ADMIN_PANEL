import React, { useState } from 'react';
import './style.css';
import { Link, useHistory, useNavigate } from 'react-router-dom';
import { fs, auth, storage } from '../Config'; // Update the path to your config.js file
const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // const history = useHistory();
  const navigate = useNavigate();

const handleImageUpload = (event) => {
const file = event.target.files[0];
setSelectedImage(file);
};

const handleSignup = async (e) => {
e.preventDefault();

if (password !== confirmPassword) {
  setPasswordMatchError(true);
  return;
}

try {
  // Create a new admin user in Firebase Auth
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;

  // Upload the selected image to Firebase Storage
  const imageRef = storage.ref().child(`admin/${user.uid}`);
  await imageRef.put(selectedImage);

  // Get the download URL of the uploaded image
  const imageUrl = await imageRef.getDownloadURL();

  // Store the admin details in the "admin" collection in Firestore
  await fs.collection('admin').doc(user.uid).set({
    name,
    email,
    phone,
    imageUrl,
  });

  // Clear the form and state values
  setName('');
  setEmail('');
  setPhone('');
  setPassword('');
  setConfirmPassword('');
  setSelectedImage(null);
  setPasswordMatchError(false);
  setSuccessMessage('Signup successful!');

  // Redirect to the login page
  navigate('/');
} catch (error) {
  console.error('Error signing up:', error);
  setErrorMessage('Signup failed. Please try again.');
}

  };

  return (
    <div className="main-container">
        <h1 className="main-heading">WELCOME ADMIN </h1>
      
        <form className="login-form" onSubmit={handleSignup}>
    <h2 className="signup-heading">Sign Up</h2>
    <input
      type="text"
      placeholder="Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="input-field"
      required
    />
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="input-field"
      required
    />
    <input
      type="tel"
      placeholder="Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
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
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className={`input-field ${passwordMatchError ? 'error' : ''}`}
      required
    />
    <label>
      Image:
      <input type="file" accept="image/*" onChange={handleImageUpload} required />
    </label>
    <br />
    {passwordMatchError && (
      <p className="password-match-error">Password and Confirm Password must match</p>
    )}
    {successMessage && <p className="success-message">{successMessage}</p>}
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    <button type="submit" className="login-button">
      Sign Up
    </button>
    <p className="login-text">
      New User?{' '}
      <Link to="/" className="signup-link">
        Login
      </Link>{' '}
    </p>
  </form>
</div>
  );
};

export default SignupPage;
