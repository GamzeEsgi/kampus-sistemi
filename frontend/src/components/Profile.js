import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { isAuthenticated, getUser } from '../utils/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadMyProducts();
  }, [navigate]);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getMyProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await productsAPI.delete(id);
      loadMyProducts();
    } catch (error) {
      alert('Ürün silinirken bir hata oluştu.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      type: product.type,
      price: product.price || '',
      contact: product.contact
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const submitData = {
        ...editFormData,
        price: editFormData.type === 'satılık' ? parseFloat(editFormData.price) : undefined
      };
      await productsAPI.update(id, submitData);
      setEditingProduct(null);
      loadMyProducts();
    } catch (error) {
      alert('Ürün güncellenirken bir hata oluştu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      kitap: '📚 Kitap',
      not: '📝 Not',
      ekipman: '💻 Ekipman'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="container">
      <div className="profile-header">
        <h2>Profilim</h2>
        <p>{user?.name} ({user?.email})</p>
      </div>

      <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Ürünlerim ({products.length})</h3>

      {loading ? (
        <div className="empty-state">
          <p>Yükleniyor...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>Henüz ürün eklemediniz</h3>
          <button className="btn" onClick={() => navigate('/add-product')} style={{ marginTop: '20px' }}>
            İlk Ürününüzü Ekleyin
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {editingProduct === product._id ? (
                <div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      style={{ marginBottom: '10px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditChange}
                      style={{ marginBottom: '10px', minHeight: '80px' }}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <select
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      style={{ marginBottom: '10px' }}
                    >
                      <option value="kitap">Kitap</option>
                      <option value="not">Not</option>
                      <option value="ekipman">Ekipman</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <select
                      name="type"
                      value={editFormData.type}
                      onChange={handleEditChange}
                      style={{ marginBottom: '10px' }}
                    >
                      <option value="satılık">Satılık</option>
                      <option value="ödünç">Ödünç</option>
                    </select>
                  </div>
                  {editFormData.type === 'satılık' && (
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleEditChange}
                        placeholder="Fiyat"
                        style={{ marginBottom: '10px' }}
                      />
                    </div>
                  )}
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      name="contact"
                      value={editFormData.contact}
                      onChange={handleEditChange}
                      style={{ marginBottom: '10px' }}
                    />
                  </div>
                  <div className="profile-actions">
                    <button
                      className="btn btn-small"
                      onClick={() => handleSaveEdit(product._id)}
                    >
                      Kaydet
                    </button>
                    <button
                      className="btn btn-small btn-secondary"
                      onClick={handleCancelEdit}
                    >
                      İptal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="product-category">{getCategoryLabel(product.category)}</div>
                  <div className={`product-type ${product.type}`}>
                    {product.type === 'satılık' ? '💰 Satılık' : '🤝 Ödünç'}
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  {product.type === 'satılık' && product.price && (
                    <div className="product-price">{product.price} ₺</div>
                  )}
                  <div className="profile-actions" style={{ marginTop: '15px' }}>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;

