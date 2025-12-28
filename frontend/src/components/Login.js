import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Giriş Yap</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <div className="form-input-wrapper">
            <FaUser className="form-input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ornek@email.com"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <div className="form-input-wrapper">
            <FaLock className="form-input-icon" />
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="••••••"
            />
          </div>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
      <p className="link-text">
        Hesabınız yok mu? <Link to="/register">Kayıt olun</Link>
      </p>
    </div>
  );
};

export default Login;

