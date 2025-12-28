import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuthToken, setUser } from '../utils/auth';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      setAuthToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Kayıt Ol</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad Soyad</label>
          <div className="form-input-wrapper">
            <FaUser className="form-input-icon" />
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Adınız ve soyadınız"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <div className="form-input-wrapper">
            <FaEnvelope className="form-input-icon" />
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
              placeholder="En az 6 karakter"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Şifre Tekrar</label>
          <div className="form-input-wrapper">
            <FaLock className="form-input-icon" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Şifrenizi tekrar girin"
            />
          </div>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
      <p className="link-text">
        Zaten hesabınız var mı? <Link to="/login">Giriş yapın</Link>
      </p>
    </div>
  );
};

export default Register;

