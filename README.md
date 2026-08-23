# 💻 BP Rehberi - Bilgisayar Programcılığı Öğrenme Rehberi

"Bilgisayar Programcılığı Rehberi" (BP Rehberi), Bilgisayar Programcılığı bölümü öğrencilerinin tüm dersleri, projeleri, quizleri ve öğrenme yollarını takip edebilecekleri, GitHub Pages uyumlu, tamamen istemci taraflı (vanilla HTML/CSS/JS + JSON + LocalStorage) açık kaynak eğitim ve rehberlik platformudur.

---

## 🌟 Özellikler (V1 Sürümü)

1. **📚 Odaklanmış 1. Yarıyıl Müfredatı**:
   - **Programlama Temelleri** (Değişkenler, döngüler, diziler, metotlar)
   - **Veri Tabanı I** (DBMS, tablolama, SQL CRUD, SELECT/WHERE/GROUP BY)
   - **Web Tasarımının Temelleri** (HTML5 Semantik, CSS3 Box Model, Flexbox, Grid, Responsive Design)
   - **Bilgisayar Donanımı** (CPU, RAM, SSD vs HDD, BIOS/UEFI, arıza teşhis senaryoları)

2. **📖 Standartlaştırılmış 11 Katmanlı Konu Anlatım Yapısı**:
   - 🎯 Bu konuda ne öğreneceksin?
   - 📖 Konu anlatımı
   - 💡 Gerçek hayat örneği
   - 💻 Kod / Görsel / Örnek
   - 🧠 Sistemin mantığı
   - ⚠️ Sık yapılan hatalar
   - 🎓 **Sınavda Bil** (Vize/Final) vs 🚀 **Gerçek Hayatta Bil** (Sektör)
   - 🛠 Uygulama / Pratik görev
   - 🧠 Etkileşimli konu quizi
   - ✅ Konu tamamlama & İlerleme kaydı

3. **💻 İki Bölümlü Kod Laboratuvarı**:
   - **🌐 Web Playground**: HTML/CSS/JS canlı önizlemeli (live iframe preview) kod alanı.
   - **🧪 C# & SQL Kod İnceleme**: Kod parçası + Beklenen Çıktı + "Sen de Dene" pratik görevler.

4. **🧠 Etkileşimli Quiz Motoru**:
   - Çoktan seçmeli sorular, anlık doğru/yanlış geri bildirimi ve detaylı çözüm açıklamaları.

5. **🛠 Proje Ağacı (Başlangıç 🟢, Orta 🟡, İleri 🔴)**:
   - Gerçek otomasyonlar, web ve mobil proje fikirleri, isterler ve örnek çıktılar.

6. **🔍 Global Instant Search**:
   - Tüm dersler, konular, kodlar ve projeler arasında anlık Türkçe arama.

7. **💾 Yerel İlerleme Takibi (LocalStorage)**:
   - Sunucusuz, üyeliksiz, tarayıcı hafızasında (`bp_user_progress`, `bp_quiz_scores`) kişisel ders tamamlama oranları ve quiz skorları.

---

## 📁 Proje Yapısı

```
BP-Rehberi/
│
├── index.html
├── style.css
├── README.md
│
├── js/
│   ├── app.js         # Ana uygulama ve modül başlatıcı
│   ├── router.js      # SPA hash tabanlı rotalandırıcı
│   ├── ui.js          # Arayüz ve sayfa şablonları
│   ├── storage.js     # İsim alanlı (namespaced) LocalStorage
│   ├── search.js      # Global arama indeksi ve motoru
│   ├── quiz.js        # Quiz değerlendirme motoru
│   ├── courses.js     # Veri çekme ve önbellek servisi
│   └── utils.js       # Yardımcı araçlar ve SVG ikonlar
│
├── data/
│   ├── courses.json   # 4 Yarıyıl ders kataloğu ve kategoriler
│   ├── projects.json  # Proje fikirleri ve kılavuzlar
│   │
│   ├── lessons/       # Ders konu anlatımları
│   │   ├── programming.json
│   │   ├── database.json
│   │   ├── web.json
│   │   └── hardware.json
│   │
│   └── quizzes/       # Ders quizleri ve açıklamaları
│       ├── programming.json
│       ├── database.json
│       ├── web.json
│       └── hardware.json
│
└── assets/
```

---

## 🚀 GitHub Pages Üzerinde Yayınlama

Bu proje tamamen istemci taraflı (vanilla HTML/CSS/JS) olduğu için hiçbir sunucu veya veritabanı kurulumu gerektirmez.

1. Proje reposunu GitHub hesabınıza pusu yapın:
   ```bash
   git add .
   git commit -m "BP Rehberi V1 hazır"
   git push origin main
   ```
2. Repository ayarlarında **Settings ➔ Pages** bölümüne gidin.
3. **Branch** olarak `main` veya `master` seçin ve kaydedin.
4. Birkaç dakika içinde siteniz `https://kullaniciadi.github.io/repo-adi` adresinde canlıya geçecektir!

---

## 📄 Lisans

Bu proje MIT Lisansı ile açık kaynak olarak sunulmaktadır. Bilgisayar Programcılığı öğrencileri ve eğitmenleri tarafından serbestçe kullanılabilir ve geliştirilebilir.
