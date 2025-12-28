import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Ürün bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      kitap: '📚 Kitap',
      not: '📝 Not',
      ekipman: '💻 Ekipman'
    };
    return labels[cat] || cat;
  };

  const handleContact = () => {
    if (product.contact.includes('@')) {
      window.location.href = `mailto:${product.contact}`;
    } else {
      window.location.href = `tel:${product.contact}`;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>{error || 'Ürün bulunamadı'}</h3>
          <button className="btn" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Geri
      </button>
      <div className="product-detail">
        <div className="product-detail-header">
          <div>
            <h1 className="product-detail-title">{product.name}</h1>
            <div className="product-detail-meta">
              <span className="product-category">{getCategoryLabel(product.category)}</span>
              <span className={`product-type ${product.type}`}>
                {product.type === 'satılık' ? '💰 Satılık' : '🤝 Ödünç'}
              </span>
            </div>
          </div>
        </div>

        <div className="product-detail-description">{product.description}</div>

        <div className="product-detail-info">
          <div className="info-row">
            <span className="info-label">Kategori:</span>
            <span className="info-value">{getCategoryLabel(product.category)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Durum:</span>
            <span className="info-value">
              {product.type === 'satılık' ? 'Satılık' : 'Ödünç Verilebilir'}
            </span>
          </div>
          {product.type === 'satılık' && product.price && (
            <div className="info-row">
              <span className="info-label">Fiyat:</span>
              <span className="info-value" style={{ color: '#27ae60', fontWeight: '600' }}>
                {product.price} ₺
              </span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">Ekleyen:</span>
            <span className="info-value">{product.userName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Eklenme Tarihi:</span>
            <span className="info-value">
              {new Date(product.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>

        <button className="contact-btn" onClick={handleContact}>
          📧 İletişime Geç
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;

