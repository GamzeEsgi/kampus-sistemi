import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { FaGraduationCap, FaHome, FaPlusCircle, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <FaGraduationCap size={28} />
          <span>Kampüs</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">
            <FaHome /> Ana Sayfa
          </Link>
          {user ? (
            <>
              <Link to="/add-product" className="nav-link">
                <FaPlusCircle /> Ürün Ekle
              </Link>
              <Link to="/profile" className="nav-link">
                <FaUser /> Profilim
              </Link>
              <button onClick={handleLogout} className="nav-btn-outline">
                <FaSignOutAlt /> Çıkış
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FaSignInAlt /> Giriş
              </Link>
              <Link to="/register" className="nav-btn">
                <FaUserPlus /> Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

