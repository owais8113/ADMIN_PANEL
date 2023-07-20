import React, { useEffect, useState } from 'react'
import './style.css'
// import Footer from './Footer';
import {storage,fs, auth} from '../Config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [category, setSelectedValue] = useState('');
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const getFileDisplayName = () => {
      if (selectedFile) {
          const fileName = selectedFile.name;
          if (fileName.length > 14) {
              return fileName.substring(0, 14) + '...';
            }
            return fileName;
        }
    return formSubmitted ? '' : ' ';
    
};


const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
const handleadd=(e)=>{
    e.preventDefault();
    // console.log(title)
    // console.log(selectedFile)
    const uploadTask = storage.ref(`product-images/${selectedFile.name}`).put(selectedFile);
    uploadTask.on('state_changed',snapshot=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        console.log(progress);
    },error=>setErrorMessage(error.message),()=>{
        storage.ref('product-images').child(selectedFile.name).getDownloadURL().then(url=>{
            fs.collection('products').add({
                title,
                description,
                price:Number(price),
          url,
          category
        }).then(()=>{
            setSuccessMsg('Product Added Successfully');
            setPrice('');
            setTitle('');
            setDescription('');
            setSelectedValue('')
            setFormSubmitted(true);
            document.getElementById('image').value='';
            // setSelectedFile('')
            setErrorMessage('');
            setTimeout(()=>{
                setSuccessMsg('');
            },1500)
        }).catch(error=>setErrorMessage(error.message));
    })
})
};
return (<>
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
    {/* <Footer/> */}
    <div className="a-container">
      <form className="a-form" >
      <h2 className="a-title">Add Product</h2>
      <hr />
      {successMsg && (
        <div className="success-message-container">
          <p className="success-message">{successMsg}</p>
        </div>
      )}
      {errorMessage && (
        <div className="error-message-container">
          <p className="error-message">{errorMessage}</p>
        </div>
      )}
        <div className="a-form-group">
          <label htmlFor="title">Title</label>
          <input 
          type="text"
          id="title" 
          placeholder='Enter Product Title'
          required
          value={title}
          onChange={(e)=>setTitle(e.target.value)} />
        </div>
        <div className="a-form-group">
          <label htmlFor="description">Description</label>
          <textarea 
          id="description" 
          placeholder='Enter Product Description'
          required
          value={description}
          onChange={(e)=>setDescription(e.target.value)}>
          
          </textarea>
        </div>
        <div className="a-form-group">
          <label htmlFor="price" className='alabel'>Price</label>
          <input 
          type="number" 
          id="price" 
          step="0.01" 
          required
          placeholder='Enter Product Price'
          value={price}
          onChange={(e)=>setPrice(e.target.value)}/>
        </div>
        <div className="a-form-group">
          <label htmlFor="image">Upload Product Image</label>
          <input
          type="file"
          id="image"
          className="img-btn"
          accept="image/*"
          required
          onChange={handleFileSelect}
          />
          <label htmlFor="image" className="custom-btn">
          <span className='ch-btn'>Choose File</span> {formSubmitted ? '' : getFileDisplayName()}
          </label>
        </div>
      <div>
      <label htmlFor="dropdown">Select Product Category:</label>
      <select id="dropdown" value={category} onChange={handleSelectChange}
      required>
        <option value="">-- Select --</option>
        <option value="Fashion">Fashion</option>
        <option value="Electronics">Electronics</option>
        <option value="Home & Furniture">Home & Furniture</option>
        <option value="Grocery">Grocery</option>
        <option value="Beauty">Beauty</option>
        <option value="Books">Books</option>
        <option value="Grooming">Grooming</option>
        <option value="Other">Other</option>
      </select>
      <p className='selected-option'>Selected Category: {category}</p>
      </div>
      <div className="btn-container">
        <button type="submit" className="a-submit-button"  onClick={handleadd}>
          Add Product
        </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default AddProduct;
