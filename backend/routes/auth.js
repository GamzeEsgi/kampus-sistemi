const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT token oluşturma
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Kayıt ol
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.' });
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir e-posta adresi giriniz.' });
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor.' });
    }

    // Yeni kullanıcı oluştur
    const user = new User({ name, email, password });
    await user.save();

    // Token oluştur
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.' });
  }
});

// Giriş yap
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre gerekli.' });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Şifre kontrolü
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre.' });
    }

    // Token oluştur
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.' });
  }
});

// Kullanıcı bilgilerini getir
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Bir hata oluştu.' });
  }
});

module.exports = router;

