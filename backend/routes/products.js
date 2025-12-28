const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Tüm ürünleri getir (arama ve filtreleme ile)
router.get('/', async (req, res) => {
  try {
    const { search, category, type } = req.query;
    let query = {};

    // Arama
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Kategori filtresi
    if (category && ['kitap', 'not', 'ekipman'].includes(category)) {
      query.category = category;
    }

    // Tip filtresi (satılık/ödünç)
    if (type && ['satılık', 'ödünç'].includes(type)) {
      query.type = type;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json(products);
  } catch (error) {
    console.error('Ürün listesi hatası:', error);
    res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu.' });
  }
});

// Tek ürün getir
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Ürün detay hatası:', error);
    res.status(500).json({ message: 'Ürün getirilirken bir hata oluştu.' });
  }
});

// Ürün ekle (sadece giriş yapmış kullanıcılar)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, type, price, contact } = req.body;

    // Validasyon
    if (!name || !description || !category || !type || !contact) {
      return res.status(400).json({ message: 'Tüm zorunlu alanları doldurun.' });
    }

    if (!['kitap', 'not', 'ekipman'].includes(category)) {
      return res.status(400).json({ message: 'Geçersiz kategori.' });
    }

    if (!['satılık', 'ödünç'].includes(type)) {
      return res.status(400).json({ message: 'Geçersiz tip.' });
    }

    if (type === 'satılık' && (!price || price < 0)) {
      return res.status(400).json({ message: 'Satılık ürünler için geçerli bir fiyat giriniz.' });
    }

    const product = new Product({
      name,
      description,
      category,
      type,
      price: type === 'satılık' ? price : undefined,
      contact,
      userId: req.user._id,
      userName: req.user.name
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu.' });
  }
});

// Ürün güncelle (sadece sahibi)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Sadece ürün sahibi güncelleyebilir
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu ürünü güncelleme yetkiniz yok.' });
    }

    const { name, description, category, type, price, contact } = req.body;

    if (name) product.name = name;
    if (description) product.description = description;
    if (category && ['kitap', 'not', 'ekipman'].includes(category)) product.category = category;
    if (type && ['satılık', 'ödünç'].includes(type)) {
      product.type = type;
      if (type === 'satılık' && price !== undefined) {
        product.price = price;
      } else if (type === 'ödünç') {
        product.price = undefined;
      }
    }
    if (price !== undefined && product.type === 'satılık') product.price = price;
    if (contact) product.contact = contact;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ message: 'Ürün güncellenirken bir hata oluştu.' });
  }
});

// Ürün sil (sadece sahibi)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı.' });
    }

    // Sadece ürün sahibi silebilir
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bu ürünü silme yetkiniz yok.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ürün başarıyla silindi.' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ message: 'Ürün silinirken bir hata oluştu.' });
  }
});

// Kullanıcının ürünlerini getir
router.get('/user/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json(products);
  } catch (error) {
    console.error('Kullanıcı ürünleri hatası:', error);
    res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu.' });
  }
});

module.exports = router;

