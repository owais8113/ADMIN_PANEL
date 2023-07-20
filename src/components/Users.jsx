import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config';
import './style.css'
import img from '../assets/66ffcb56482c64bdf6b6010687938835.jpg'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';


const Users = () => {
    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true); // New state for loading
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
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


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = [];
                const snapshot = await fs.collection('users').get();
                snapshot.forEach((doc) => {
                    const user = doc.data();
                    usersData.push(user);
                });
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (<>
    <div className="">
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
        <div className="users-container">
            <h2 className="users-title">Users</h2>
            <ul className="users-list">
                {users.map((user, index) => (
                    <div key={user.email} className="users-item">
                        <div className="user-profile">
                            <img
                                src={img} // Replace with the path to your default profile image
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                        <div className="user-details">
                            <p className="text">
                                <a className="small-text">Name:</a> <span className="users-name">{user.Fullname}</span>
                            </p>
                            <p className="text">
                                <a className="small-text">Email:</a> <span className="users-email">{user.Email}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
        </div>
        </>
    );
};

export default Users;