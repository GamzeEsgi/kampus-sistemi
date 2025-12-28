import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { FaSearch, FaBook, FaStickyNote, FaLaptop, FaUser } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    loadProducts();
  }, [search, category, type]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (type) params.type = type;

      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'kitap': return <FaBook className="badge-icon" />;
      case 'not': return <FaStickyNote className="badge-icon" />;
      case 'ekipman': return <FaLaptop className="badge-icon" />;
      default: return null;
    }
  };

  return (
    <div className="container">
      <div className="search-container">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Ürün, not veya kitap ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Tüm Kategoriler</option>
          <option value="kitap">📚 Kitaplar</option>
          <option value="not">📝 Ders Notları</option>
          <option value="ekipman">💻 Ekipmanlar</option>
        </select>

        <select
          className="filter-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          <option value="satılık">💰 Satılık</option>
          <option value="ödünç">🤝 Ödünç</option>
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner">Yükleniyor...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <FaSearch className="empty-state-icon" />
          <h3>Sonuç Bulunamadı</h3>
          <p>Aradığınız kriterlere uygun ilan bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleProductClick(product._id)}
            >
              <div className="product-image-placeholder">
                {getCategoryIcon(product.category)}
              </div>

              <div className="product-content">
                <div className="product-badges">
                  <span className="badge badge-category">
                    {product.category === 'kitap' ? 'Kitap' :
                      product.category === 'not' ? 'Not' : 'Ekipman'}
                  </span>
                  <span className={`badge badge-type ${product.type}`}>
                    {product.type === 'satılık' ? 'Satılık' : 'Ödünç'}
                  </span>
                </div>

                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <div className="product-price">
                    {product.type === 'satılık' ? `${product.price} ₺` : 'Ücretsiz'}
                  </div>
                  <div className="product-author">
                    <FaUser size={12} /> {product.userName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

