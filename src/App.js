import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from "./components/Signin";
import Home from './components/Home'
import Signup from './components/Signup'
import AddProduct from './components/AddProducts';
import Main from './components/Main';
import Products from './components/Products'
import Users from './components/Users'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path='/' Component={Main} />
          <Route exact path='/signin' Component={Signin} />
          <Route exact path='/home' Component={Home} />
          <Route exact path='/signup' Component={Signup} />
          <Route exact path='/add' Component={AddProduct} />
          <Route exact path='/products' Component={Products} />
          <Route exact path='/users' Component={Users} />

        </Routes>

      </Router>
    </div>
  );
}

export default App;
