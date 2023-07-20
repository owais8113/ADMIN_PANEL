import React, { useEffect, useState } from 'react';
import { auth, fs } from '../Config';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAdminData(user.uid);
        fetchProducts();
      } else {
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
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const snapshot = await fs.collection('products').get();
      const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleDeleteProduct = async (productId) => {
    try {
      await fs.collection('products').doc(productId).delete();
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <>
    <div className='phaltu-container'>
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
    <div className="products-container">
      <h2 className="products-heading">Product List</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: {product.price} | Category:{product.category}</p>
            <img className="product-image" src={product.url} alt="" />
            <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default Products;
