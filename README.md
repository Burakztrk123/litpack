# 🌊 Litpack Deprem Sensör İzleme Sistemi

Modern ve kullanıcı dostu bir arayüze sahip, gerçek zamanlı sismik aktivite izleme sistemi.

## 🌟 Özellikler

### 📊 Gerçek Zamanlı Veri İzleme
- X, Y, Z eksenlerinde hareket verilerini anlık görüntüleme
- Tahmini şiddet hesaplama ve gösterimi
- Neon efektli dijital saat
- Sensör bağlantı durumu göstergesi (kırmızı/yeşil)

### 📈 Veri Görselleştirme
- İnteraktif grafikler
- Eksen bazlı hareket analizi
- Geçmiş veri görüntüleme

### ⚙️ Ayarlar ve Özelleştirme
- Hassasiyet ayarları
- Örnekleme hızı kontrolü
- Alarm eşik değerleri

### 🎨 Modern Tasarım
- Koyu tema
- Responsive tasarım
- Neon efektli göstergeler
- Kullanıcı dostu arayüz

## 🛠️ Teknolojiler

- HTML5
- CSS3 (Modern özellikler ve animasyonlar)
- JavaScript (Vanilla JS)
- Font Awesome ikonları
- Google Fonts (Poppins)

## 📱 Ekran Görüntüleri

### Ana Panel
- Sensör durumu göstergesi
- Gerçek zamanlı saat
- Hareket verileri

### Grafikler
- X, Y, Z ekseni grafikleri
- Şiddet analizi

## 🚀 Kurulum

1. Projeyi klonlayın:
\`\`\`bash
git clone [repo-url]
\`\`\`

2. Proje dizinine gidin:
\`\`\`bash
cd litpack
\`\`\`

3. Web sunucusu başlatın (örnek: Python ile):
\`\`\`bash
python -m http.server 8000
\`\`\`

4. Tarayıcıda açın:
\`\`\`
http://localhost:8000
\`\`\`

## 🔌 Arduino Bağlantısı

### Sensör Durumu
- 🔴 Kırmızı: Bağlantı yok
- 🟢 Yeşil: Bağlı ve veri alınıyor

### Bağlantı Fonksiyonu
\`\`\`javascript
// Sensör bağlandığında:
updateSensorStatus(true);

// Bağlantı koptuğunda:
updateSensorStatus(false);
\`\`\`

## 📝 Yapılacaklar

- [ ] Backend entegrasyonu
- [ ] Veri kayıt sistemi
- [ ] Alarm sistemi
- [ ] Email bildirimler
- [ ] Mobil uygulama

## 🌐 Canlı Demo

Projeyi canlı olarak görüntülemek için:
[https://litpack-earthquake.windsurf.build](https://litpack-earthquake.windsurf.build)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Katkıda Bulunanlar

- Litpack Ekibi

---

⭐️ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
