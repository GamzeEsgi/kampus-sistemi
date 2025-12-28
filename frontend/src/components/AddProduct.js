import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { isAuthenticated } from '../utils/auth';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'kitap',
    type: 'satılık',
    price: '',
    contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        price: formData.type === 'satılık' ? parseFloat(formData.price) : undefined
      };

      await productsAPI.create(submitData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ürün eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 className="form-title">Yeni Ürün Ekle</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ürün Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Örn: Matematik Ders Notları"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Açıklama *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Ürün hakkında detaylı bilgi veriniz"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Kategori *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="kitap">Kitap</option>
              <option value="not">Not</option>
              <option value="ekipman">Ekipman</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="type">Durum *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="satılık">Satılık</option>
              <option value="ödünç">Ödünç</option>
            </select>
          </div>
          {formData.type === 'satılık' && (
            <div className="form-group">
              <label htmlFor="price">Fiyat (₺) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required={formData.type === 'satılık'}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="contact">İletişim Bilgisi *</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="E-posta veya telefon numarası"
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Ekleniyor...' : 'Ürünü Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

