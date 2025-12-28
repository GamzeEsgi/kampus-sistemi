import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AddProduct from './components/AddProduct';
import ProductDetail from './components/ProductDetail';
import Profile from './components/Profile';
import { isAuthenticated } from './utils/auth';
import './App.css';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

