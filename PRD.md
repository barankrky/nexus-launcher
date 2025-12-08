# Nexus Launcher - Product Requirements Document (PRD)

## 1. Proje Özeti

**Proje Adı:** Nexus Launcher  
**Versiyon:** 1.0.0  
**Tarih:** 2024  
**Proje Tipi:** Desktop Oyun Launcher Uygulaması

### 1.1 Vizyon
Nexus Launcher, belirli WordPress oyun bloglarından içerikleri toplayarak kullanıcılara Epic Games Launcher benzeri modern bir oyun kütüphanesi deneyimi sunmayı hedefler.

### 1.2 Hedef Kitle
- PC oyuncuları
- Alternatif oyun kaynaklarını tek bir platformda yönetmek isteyen kullanıcılar

## 2. Teknoloji Stack

### Frontend
- **Electron** - Desktop uygulama framework
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **React Router** - Navigation

### Backend/Data
- **WordPress REST API** - Veri kaynağı
- **Cuimp** - cURL impersonate library (Browser simulation)
- **Node.js** - Backend runtime

## 3. Temel Özellikler

### 3.1 Ana Sayfa (Home)
- Son eklenen oyunların grid görünümü
- Oyun kartları:
  - Oyun görseli/kapak resmi
  - Oyun adı
  - Kısa açıklama
  - İndirme butonu
- Dinamik içerik yükleme (pagination/infinite scroll)

### 3.2 Kütüphane (Library)
- İndirilen oyunların listesi
- İndirme yönetimi:
  - İndirme başlat/duraklat/devam ettir
  - İndirme ilerlemesi göstergesi
  - İndirme hızı bilgisi
- Oyun kartı detayları:
  - Oyun görselleri
  - Kurulum durumu
  - Oyun boyutu

### 3.3 Navigation Bar
- Logo/Uygulama adı
- Menü öğeleri:
  - Ana Sayfa
  - Kütüphane
  - İndirimler (v2.0)
  - Ayarlar
- Kullanıcı profil alanı (opsiyonel)

### 3.4 Ayarlar (Settings)
- İndirme klasörü seçimi
- Eşzamanlı indirme sayısı
- Tema ayarları (ileride light tema eklenebilir)
- Kaynak site yönetimi
- Cache temizleme

## 4. UI/UX Tasarım Prensipleri

### 4.1 Tema
- **Dark Theme:** Koyu siyah (#000000) ve gri tonları (#1a1a1a, #2a2a2a)
- **Accent Color:** Mavi veya mor tonları hover/active durumlar için

### 4.2 Görsel Efektler
- Hover'da hafif glow efekti
- Smooth transitions (200-300ms)
- Card depth (box-shadow kullanımı)
- Gradient overlays
- Backdrop blur efektleri

### 4.3 Layout
```
+------------------+
|   Navigation     |
+------------------+
|                  |
|    Content       |
|     Area         |
|                  |
+------------------+
```

## 5. API Entegrasyonu

### 5.1 WordPress REST API
```javascript
// Örnek endpoint yapısı
GET /wp-json/wp/v2/posts
GET /wp-json/wp/v2/media
```

### 5.2 Data Parsing
- Post başlıklarından oyun adı çıkarma
- Featured image'dan oyun görseli alma
- Post içeriğinden download linkleri parse etme
- Meta data extraction

## 6. Proje Yapısı

```
nexus-launcher/
├── electron/
│   ├── main.js
│   └── preload.js
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   ├── GameCard/
│   │   └── DownloadManager/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Library/
│   │   └── Settings/
│   ├── services/
│   │   ├── wordpress-api.js
│   │   └── download-manager.js
│   ├── utils/
│   └── App.jsx
├── package.json
└── tailwind.config.js
```

## 7. MVP Özellikleri (v1.0)

### Faz 1 - Temel Altyapı
- [ ] Electron + React + Vite kurulumu
- [ ] Tailwind CSS entegrasyonu
- [ ] Dark tema implementasyonu
- [ ] Navigation bar ve routing

### Faz 2 - Veri Entegrasyonu
- [ ] WordPress REST API bağlantısı
- [ ] Cuimp library entegrasyonu
- [ ] Post parsing logic
- [ ] Görsel ve link extraction

### Faz 3 - Core Features
- [ ] Ana sayfa oyun listesi
- [ ] Oyun detay görünümü
- [ ] Basit indirme fonksiyonu
- [ ] Kütüphane sayfası

### Faz 4 - İndirme Yönetimi
- [ ] İndirme kuyruğu
- [ ] Pause/Resume fonksiyonları
- [ ] Progress tracking
- [ ] Local storage yönetimi

## 8. Gelecek Özellikler (v2.0+)
- İndirimler sayfası
- Oyun kategorileri/filtreleme
- Arama fonksiyonu
- Çoklu dil desteği
- Otomatik güncelleme sistemi
- Cloud save sync (opsiyonel)

## 9. Teknik Gereksinimler

### Sistem Gereksinimleri
- **OS:** Windows 10/11, macOS 10.14+, Linux
- **RAM:** Minimum 4GB
- **Disk:** 500MB uygulama + oyunlar için alan

### Performans Hedefleri
- Uygulama başlangıç: <3 saniye
- Sayfa geçişleri: <500ms
- API response cache süresi: 5 dakika

## 10. Başlangıç Komutları

```bash
# Proje kurulumu
npm create electron-vite@latest nexus-launcher -- --template react

# Tailwind kurulumu
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Ek paketler
npm install axios react-router-dom cuimp
```

## 11. Notlar
- Basit ve kullanıcı dostu arayüz öncelikli
- Performans optimizasyonu iteratif olarak yapılacak
- WordPress site listesi config dosyasından yönetilebilir olmalı
- Error handling ve fallback görüntüleri unutulmamalı

---

**Durum:** Geliştirme Aşaması  
**Öncelik:** Yüksek  
**Tahmini Süre:** 4-6 hafta (MVP)