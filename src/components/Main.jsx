import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fs } from '../Config';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Main = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const mainHeadingRef = useRef(null);
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const doc = await fs.collection('admin').doc(user.uid).get();
          if (doc.exists) {
            const userData = doc.data();
            setUser((prevUser) => ({ ...prevUser, displayName: userData.name }));
            setUserImage(userData.imageUrl); // Assuming image field name is 'image'
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    const animateHeading = () => {
      const text = mainHeadingRef.current.innerText;
      let currentIndex = 0;
      let animatedText = '';

      const typeEffect = setInterval(() => {
        animatedText += text[currentIndex];
        mainHeadingRef.current.innerText = animatedText;
        currentIndex++;

        if (currentIndex === text.length) {
          clearInterval(typeEffect);
        }
      }, 100);
    };

    animateHeading();
  }, []);

  return (
    <div className="main-container1">
        <div>
      <h1 ref={mainHeadingRef} className="main-heading1">
        WELCOME TO ADMIN PANEL
      </h1>

        </div>

      <div className="admin-panel-container1">
        <div className="center-container">
          <h2 className="website-name1">WESELL.COM</h2>
          {user ? (
            <div className="user-info1">
              {/* <div className="user-image-container">
                {userImage && <img className="user-image" src={userImage} alt="User" />}
              </div> */}
              <p className="user-name1">Hello {user.displayName}</p>
              <button className="logout-button1" onClick={handleLogout}>
                Logout
              </button>
              <button className="home-button1" onClick={handleHome}>
                Back to Main <FontAwesomeIcon icon={faArrowRight} className="icon" />
              </button>
            </div>
          ) : (
            <div>
              <Link to="/signin" className="login-button1">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
