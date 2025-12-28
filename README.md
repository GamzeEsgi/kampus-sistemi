# 🎓 Kampüs Sistemi

Öğrenciler için ürün paylaşım platformu. Öğrenciler okul e-postası ile kayıt olup, kitap, not veya ekipman paylaşabilir, satabilir veya ödünç verebilir.

## Özellikler

- ✅ Okul e-postası ile kayıt ve giriş
- ✅ Ürün listeleme, arama ve filtreleme
- ✅ Ürün ekleme (kitap, not, ekipman)
- ✅ Satılık/Ödünç seçenekleri
- ✅ Ürün detay sayfası ve iletişim
- ✅ Profil sayfası (ürün yönetimi)
- ✅ Responsive tasarım

## Teknolojiler

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Veritabanı**: MongoDB
- **Authentication**: JWT

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel veya MongoDB Atlas)

### Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kampus-sistemi
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

Backend'i başlatın:

```bash
npm start
# veya geliştirme için
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
```

Frontend'i başlatın:

```bash
npm start
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

## Kullanım

1. **Kayıt Ol**: Okul e-postası ile kayıt olun (örn: `ornek@ogr.uni.edu`)
2. **Giriş Yap**: Kayıt olduğunuz bilgilerle giriş yapın
3. **Ürün Ekle**: Ana sayfadan "Ürün Ekle" butonuna tıklayarak ürün ekleyin
4. **Ürün Ara**: Ana sayfada arama ve filtreleme yapabilirsiniz
5. **İletişime Geç**: Ürün detay sayfasından satıcıyla iletişime geçin
6. **Profil**: Profil sayfasından kendi ürünlerinizi yönetin

## API Endpoints

### Auth
- `POST /api/auth/register` - Kayıt ol
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Kullanıcı bilgileri

### Products
- `GET /api/products` - Tüm ürünleri listele (query: search, category, type)
- `GET /api/products/:id` - Ürün detayı
- `POST /api/products` - Ürün ekle (auth gerekli)
- `PUT /api/products/:id` - Ürün güncelle (auth gerekli)
- `DELETE /api/products/:id` - Ürün sil (auth gerekli)
- `GET /api/products/user/my-products` - Kullanıcının ürünleri (auth gerekli)

## Notlar

- Ödeme sistemi yoktur, alışveriş yüz yüze yapılır
- Sadece giriş yapmış kullanıcılar ürün ekleyebilir
- Okul e-postası formatı kontrol edilir (@ogr.*.edu veya @*.edu)

## Lisans

Bu proje öğrenci projesi olarak geliştirilmiştir.

