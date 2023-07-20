
import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [adminName, setAdminName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true); // New state for loading

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in
        setUser(user);
        fetchAdminData(user.uid); // Fetch admin data here
      } else {
        // User is not logged in, redirect to login page
        // Replace "/login" with the appropriate route for your login page
        navigate('/signin');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchAdminData = async (uid) => {
    try {
      const doc = await fs.collection('admin').doc(uid).get();
      if (doc.exists) {
        const admin = doc.data();
        setAdminData(admin);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
    }
  };
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = async () => {
    try {
      // Sign out the user using Firebase Auth
      await auth.signOut();
  
      // Redirect to the login page
      navigate("/signin");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error and display appropriate message to the user
    }
  };
  return (
    <>
    <div>
    <div className="sidebar-container">
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </div>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="admin-profile">
            {adminData && (
              <>
                <div className="admin-image">
                  <img src={adminData.imageUrl} alt="Admin" />
                </div>
                <h3 className="admin-name">Hii, {adminData.name}</h3>
              </>
            )}          </div>
          <ul className="sidebar-links">
          <li>
            <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>
              Add Product
            </Link>
          </li>
          <li>
            <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
              Users
            </Link>
          </li>
          <li>
          </li>
            <li>
              <button onClick={handleLogout} className="logout-bttn">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    
      <div className="home-container">
        <div className="content">
          <h1 className="heading">Welcome to the Admin Panel</h1>
          <p className="description">Manage your Wesell website with ease</p>
          {adminName && 
           (
            <div className="admin-details">
              <h3 className="admin-name">Logged in as: {adminName}</h3>
              <p className="admin-role">Role: Admin</p>
            </div>
          )}
          <div className="animation-container">
            <div className="animation-box"></div>
            <div className="animation-circle"></div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;
