import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, fs } from "../Config"; // Update the path to your config.js file
import "./style.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          const doc = await fs.collection("admin").doc(user.uid).get();
          if (doc.exists) {
            const admin = doc.data();
            setAdminData(admin);
          }
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    if (auth.currentUser) {
      fetchAdminData();
    }
  }, []);

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
    <div className="sidebar">
      <div className="admin-profile">
        {adminData && (
          <>
            <div className="admin-image">
              <img src={adminData.imageUrl} alt="Admin" />
            </div>
            <h3 className="admin-name">Hii, {adminData.name}</h3>
          </>
        )}
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/add">Add Product</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/settings" >Settings</Link>
        </li>
        {/* Add more sidebar links here */}
        <li>
          <button onClick={handleLogout} className="login-button">Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
