/**
 * BP Rehberi - Arayüz ve Sayfa Şablonları Motoru (ui.js)
 * V2.0: Bütünsel BP Öğrenci Rehberi Ana Sayfası (11 Adımlı Mimari)
 */
import { CourseService } from './courses.js';
import { Storage } from './storage.js';
import { Utils } from './utils.js';
import { QuizEngine } from './quiz.js';

export const UI = {
  appContainer: null,
  heroSliderTimer: null,

  init() {
    this.appContainer = document.getElementById('app-content');
  },

  /**
   * Breadcrumb (Gezinti Yolu) Render Etme
   */
  renderBreadcrumb(items) {
    let html = `<nav class="breadcrumb-nav" aria-label="Gezinti Yolu"><ol class="breadcrumb-list">`;
    items.forEach((item, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast) {
        html += `<li class="breadcrumb-item active" aria-current="page">${Utils.escapeHTML(item.title)}</li>`;
      } else {
        html += `<li class="breadcrumb-item"><a href="${item.hash}">${Utils.escapeHTML(item.title)}</a> <span class="bc-sep">➔</span></li>`;
      }
    });
    html += `</ol></nav>`;
    return html;
  },

  /**
   * Skeleton Loading Gösterici
   */
  renderSkeleton(container) {
    container.innerHTML = `
      <div class="skeleton-container">
        <div class="skeleton-line lg"></div>
        <div class="skeleton-line md"></div>
        <div class="skeleton-grid">
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
          <div class="skeleton-card"></div>
        </div>
      </div>
    `;
  },

  /**
   * Kod bloklarına kopyalama butonu ekler
   */
  attachCodeCopyButtons(container) {
    const codeBlocks = container.querySelectorAll('pre');
    codeBlocks.forEach(pre => {
      if (pre.querySelector('.copy-btn')) return;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = `📋 Kopyala`;

      copyBtn.addEventListener('click', () => {
        const codeText = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = `✅ Kopyalandı!`;
          setTimeout(() => { copyBtn.innerHTML = `📋 Kopyala`; }, 2000);
        });
      });

      pre.style.position = 'relative';
      pre.appendChild(copyBtn);
    });
  },

  /**
   * 1. ANA SAYFA GÖRÜNÜMÜ (11 ADIMLI BÜTÜN  /**
   * 1. ANA SAYFA GÖRÜNÜMÜ (BÖLÜM KONTROL PANELİ MİMARİSİ 🎓)
   */
  async renderHomeView() {
    this.renderSkeleton(this.appContainer);

    const coursesInfo = await CourseService.loadCourses();
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }]);

    const heroHTML = this.renderHomeHero();
    const outlineHTML = this.renderHomeOutline();
    const statsHTML = this.renderHomeStats();
    const curriculumHTML = await this.renderCurriculumPreview(coursesInfo);
    const learningCityHTML = this.renderLearningAndCity();
    const careerPathsHTML = this.renderCareerPaths();
    const academicInfoHTML = this.renderAcademicInfo();

    let html = `
      ${breadcrumbHTML}
      <div class="home-page-layout-grid">
        <div class="home-main-col">
          ${heroHTML}
          ${statsHTML}
          ${curriculumHTML}
          ${learningCityHTML}
          ${careerPathsHTML}
          ${academicInfoHTML}
        </div>

        <div class="home-sidebar-col">
          <div class="sticky-home-outline-wrapper">
            ${outlineHTML}
          </div>
        </div>
      </div>


    `;

    this.appContainer.innerHTML = html;
    this.attachHomeEventListeners();
  },

  /**
   * 🦸 1. HERO ALANI (İlk Viewport'a Sığan Kompakt Rehber Hero)
   */
  renderHomeHero() {
    return `
      <section class="home-guide-hero compact-hero full-screen-section" id="hero-section">
        <div class="hero-card-container">


          <h1 class="hero-main-title">Bilgisayar Programcılığı Rehberi</h1>

          <div class="hero-body-content">
            <p class="hero-welcome-lead">
              Ardahan Üniversitesi Bilgisayar Programcılığı bölümüne hoş geldin. 👋<br>
              Bu web sitesi, 2 yıllık eğitim sürecinde ihtiyaç duyacağın ders içerikleri, öğrenme yolları, sınav ve staj süreçleri için hazırlanmış kapsamlı bir rehber olabilmesi için yapıldı.
            </p>
            <p class="hero-welcome-detail">
              Programlama, veritabanı, web geliştirme, ağ & donanım ve mobil programlama gibi alanlarda kendini geliştirirken, bölüm hayatındaki önemli süreçleri de tek bir yerden takip edebilirsin.
            </p>
          </div>

          <div class="hero-actions">
            <a href="#courses" class="btn btn-primary btn-md">
              Dersleri Keşfet →
            </a>
            <a href="#roadmap" class="btn btn-secondary btn-md">
              Öğrenme Yolları
            </a>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * 📊 2. BİLGİ ŞERİDİ (4 Ana İstatistik Strip)
   */
    /**
   * 📌 REHBER KONULARI VE SAYFA İÇERİĞİ KARTI (OUTLINE CARD)
   */
  renderHomeOutline() {
    return `
      <div class="outline-card home-outline-card" id="home-sticky-outline">
        <div class="hoc-header">
          <h4>SAYFA KONULARI & İÇERİK</h4>
        </div>
        <ul class="outline-topics-list">
          <li class="outline-item active">
            <a href="#hero-section">
              <span class="ot-status">●</span>
              <span class="ot-title">Geleceğin Yazılımcısı</span>
            </a>
          </li>
          <li class="outline-item">
            <a href="#stats-section">
              <span class="ot-status">○</span>
              <span class="ot-title">Bölüm Genel Bakışı</span>
            </a>
          </li>
          <li class="outline-item">
            <a href="#curriculum-section">
              <span class="ot-status">○</span>
              <span class="ot-title">Dönemlik Ders Müfredatı</span>
            </a>
          </li>
          <li class="outline-item">
            <a href="#learning-city-section">
              <span class="ot-status">○</span>
              <span class="ot-title">Kaynaklar ve Şehir Rehberi</span>
            </a>
          </li>
          <li class="outline-item">
            <a href="#career-section">
              <span class="ot-status">○</span>
              <span class="ot-title">Kariyer Olanakları ve DGS</span>
            </a>
          </li>
          <li class="outline-item">
            <a href="#academic-section">
              <span class="ot-status">○</span>
              <span class="ot-title">Akademik Bilgiler ve Mevzuat</span>
            </a>
          </li>
        </ul>
      </div>
    `;
  },

  renderHomeStats() {
    return `
      <section class="home-stats-strip-section full-screen-section" id="stats-section">
        <div class="section-header text-center" style="margin-bottom: 24px;">
          <h2>Bölüm Genel Bakışı</h2>
          <p>Bilgisayar Programcılığı programının eğitim süresi, kredi yapısı, uygulama modeli ve lisans geçiş olanakları:</p>
        </div>

        <div class="stats-strip-bar">
          <div class="ssb-item">
            <span class="ssb-value">2 YIL</span>
            <span class="ssb-label">Ön Lisans Eğitimi</span>
          </div>
          <div class="ssb-divider"></div>
          <div class="ssb-item">
            <span class="ssb-value">120 AKTS</span>
            <span class="ssb-label">Mezuniyet Kredisi</span>
          </div>
          <div class="ssb-divider"></div>
          <div class="ssb-item">
            <span class="ssb-value">4 DÖNEM</span>
            <span class="ssb-label">Uygulamalı Ders Planı</span>
          </div>
          <div class="ssb-divider"></div>
          <div class="ssb-item">
            <span class="ssb-value">DGS</span>
            <span class="ssb-label">Mühendislik & Lisans İmkânı</span>
          </div>
        </div>

        <!-- DETAYLI İSTATİSTİK SLİDER KARTLARI -->
        <div class="stats-slider-wrapper" style="margin-top: 24px;">
          <div class="stats-slider-track" id="stats-slider-track">
            <div class="sdg-card slider-card">
              <div class="sdg-header">
                <h4>2 Yıllık Örgün Ön Lisans Eğitimi</h4>
              </div>
              <p class="sdg-desc">
                Ardahan Üniversitesi Teknik Bilimler MYO bünyesinde yürütülen 2 yıllık (4 yarıyıl) mesleki yükseköğretim programıdır. Mezunlar YÖK onaylı diplomayla <strong>"Bilgisayar Programcılığı Teknikeri"</strong> unvanı kazanır.
              </p>
              <div class="sdg-badge-list">
                <span class="sdg-badge">Ön Lisans Diploması</span>
                <span class="sdg-badge">Yazılım Teknikeri</span>
              </div>
            </div>

            <div class="sdg-card slider-card">
              <div class="sdg-header">
                <h4>120 AKTS Mezuniyet Kredisi</h4>
              </div>
              <p class="sdg-desc">
                Mezuniyet için zorunlu ve seçmeli derslerden toplam 120 Avrupa Kredi Transfer Sistemi (AKTS) tamamlanır. Müfredat 93 AKTS zorunlu ders, 27 AKTS mesleki/sosyal seçmeli ve 5 AKTS stajdan oluşur.
              </p>
              <div class="sdg-badge-list">
                <span class="sdg-badge">93 AKTS Zorunlu</span>
                <span class="sdg-badge">27 AKTS Seçmeli</span>
              </div>
            </div>

            <div class="sdg-card slider-card">
              <div class="sdg-header">
                <h4>4 Dönemlik Uygulamalı Eğitim</h4>
              </div>
              <p class="sdg-desc">
                Yazılım laboratuvarlarında pratik odaklı ders modeli uygulanır. C# programlama, SQL veritabanı tasarımı, modern web teknolojileri (HTML/CSS/JS/ASP.NET) ve 30 iş günü zorunlu yaz stajını kapsar.
              </p>
              <div class="sdg-badge-list">
                <span class="sdg-badge">Laboratuvar Dersi</span>
                <span class="sdg-badge">30 Gün Staj</span>
              </div>
            </div>

            <div class="sdg-card slider-card">
              <div class="sdg-header">
                <h4>DGS ile Mühendislik & Lisans Geçişi</h4>
              </div>
              <p class="sdg-desc">
                Mezunlar Dikey Geçiş Sınavı (DGS) ile 4 yıllık fakültelere dikey geçiş yapabilir. Başlıca bölümler: Bilgisayar Mühendisliği, Yazılım Mühendisliği, Yönetim Bilişim Sistemleri (YBS) ve İstatistik.
              </p>
              <div class="sdg-badge-list">
                <span class="sdg-badge">Bilgisayar Mühendisliği</span>
                <span class="sdg-badge">YBS</span>
              </div>
            </div>
          </div>

          <!-- SLİDER KONTROL BUTONLARI VE NOKTALAR -->
          <div class="stats-slider-controls">
            <button class="slider-arrow-btn" id="stats-prev-btn" aria-label="Önceki Kart">❮</button>
            <div class="stats-slider-dots" id="stats-slider-dots">
              <span class="slider-dot active" data-index="0"></span>
              <span class="slider-dot" data-index="1"></span>
              <span class="slider-dot" data-index="2"></span>
              <span class="slider-dot" data-index="3"></span>
            </div>
            <button class="slider-arrow-btn" id="stats-next-btn" aria-label="Sonraki Kart">❯</button>
          </div>
        </div>
      </section>
    `;
  },

renderCurriculumPreview(coursesInfo) {
    const semesterCourses = {
      "1": [
            {
                  "id": "programlama-temelleri",
                  "code": "BT103",
                  "title": "Programlama Temelleri",
                  "akts": 6,
                  "type": "Zorunlu",
                  "desc": "Algoritmik düşünme, değişkenler, koşullar, döngüler ve fonksiyonlar."
            },
            {
                  "id": "veri-tabani-1",
                  "code": "BT105",
                  "title": "Veri Tabanı I",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "İlişkisel veritabanı tasarımı, SQL sorguları, SELECT, INSERT, UPDATE, DELETE."
            },
            {
                  "id": "web-tasariminin-temelleri",
                  "code": "BT101",
                  "title": "Web Tasarımın Temelleri",
                  "akts": 4,
                  "type": "Zorunlu",
                  "desc": "HTML5 semantik yapısı, CSS3 grid/flexbox ve modern web arayüz tasarımı."
            },
            {
                  "id": "matematik-1",
                  "code": "TB101",
                  "title": "Matematik I",
                  "akts": 4,
                  "type": "Zorunlu",
                  "desc": "Temel matematiksel kavramlar, fonksiyonlar, küme teorisi ve mantık."
            },
            {
                  "id": "bilgisayar-donanimi",
                  "code": "BT107",
                  "title": "Bilgisayar Donanımı",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "İşlemci, RAM, anakart, depolama birimleri ve donanım altyapısı mantığı."
            },
            {
                  "id": "ataturk-ilke-inkilap-1",
                  "code": "ATA101.2",
                  "title": "Atatürk İlkeleri ve İnkılap Tarihi I",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Cumhuriyet tarihi, milli mücadele ve inkılap ilkeleri."
            },
            {
                  "id": "turk-dili-1",
                  "code": "TRKÇ101.2",
                  "title": "Türk Dili I",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Dil bilgisi, anlatım türleri ve akademik yazım kuralları."
            },
            {
                  "id": "yabanci-dil-1",
                  "code": "YAB101.2",
                  "title": "Yabancı Dil I",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Temel İngilizce gramer ve okuma-yazma becerileri."
            },
            {
                  "id": "universite-kulturu",
                  "code": "TB111",
                  "title": "Üniversite Kültürü",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Üniversite yaşamına uyum, akademik kültür ve etik."
            }
      ],
      "2": [
            {
                  "id": "nesne-tabanli-programlama",
                  "code": "BT104",
                  "title": "Nesne Tabanlı Programlama",
                  "akts": 6,
                  "type": "Zorunlu",
                  "desc": "C# ile OOP, sınıflar, nesneler, kalıtım, kapsülleme ve polimorfizm."
            },
            {
                  "id": "veri-tabani-2",
                  "code": "BT106",
                  "title": "Veri Tabanı II",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "Gelişmiş SQL, JOIN işlemleri, View, Stored Procedure ve Trigger mantığı."
            },
            {
                  "id": "yaz-staji",
                  "code": "YZS102",
                  "title": "Zorunlu Yaz Stajı (30 İş Günü)",
                  "akts": 5,
                  "type": "Zorunlu Staj",
                  "desc": "Sektördeki firmalarda 30 gün boyunca yapılan mesleki uygulama stajı."
            },
            {
                  "id": "web-projesi-yonetimi",
                  "code": "BT102",
                  "title": "Web Projesi Yönetimi",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "JavaScript temelleri, DOM manipülasyonu ve duyarlı web geliştirme."
            },
            {
                  "id": "ag-temelleri",
                  "code": "BT108",
                  "title": "Ağ Temelleri",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "Ağ protokolleri, IP adresleme, OSI modeli ve ağ cihazları."
            },
            {
                  "id": "is-sagligi-ve-guvenligi",
                  "code": "TB102",
                  "title": "İş Sağlığı ve Güvenliği",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "İş güvenliği mevzuatı, risk analizi ve acil durum yönetimi."
            },
            {
                  "id": "ataturk-ilke-inkilap-2",
                  "code": "ATA102.2",
                  "title": "Atatürk İlkeleri ve İnkılap Tarihi II",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Yakın dönem Türkiye tarihi ve Türkiye Cumhuriyeti yapısı."
            },
            {
                  "id": "turk-dili-2",
                  "code": "TRKÇ102.2",
                  "title": "Türk Dili II",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Sözlü anlatım, topluluk önünde konuşma ve raporlama."
            },
            {
                  "id": "yabanci-dil-2",
                  "code": "YAB102.2",
                  "title": "Yabancı Dil II",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Gelişmiş İngilizce iletişim ve mesleki terimler."
            }
      ],
      "3": [
            {
                  "id": "gorsel-programlama-1",
                  "code": "BT201",
                  "title": "Görsel Programlama I",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "C# Windows Forms ve .NET ile masaüstü otomasyon yazılımları."
            },
            {
                  "id": "internet-programciligi-1",
                  "code": "BT203",
                  "title": "İnternet Programcılığı I",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "ASP.NET Core ve Backend API mimarilerine giriş."
            },
            {
                  "id": "yazilim-kurulum-ve-yonetimi",
                  "code": "BT205",
                  "title": "Yazılım Kurulum ve Yönetimi",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "İşletim sistemi ve yazılım kurulumları, konfigürasyon yönetimi."
            },
            {
                  "id": "ofis-yazilimlari",
                  "code": "BT207",
                  "title": "Ofis Yazılımları",
                  "akts": 3,
                  "type": "Zorunlu",
                  "desc": "Gelişmiş Excel, Word ve verimlilik araçları kullanımı."
            },
            {
                  "id": "elektronik-devre-ve-elemanlari",
                  "code": "BT209",
                  "title": "Elektronik Devre ve Elemanları",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Temel devre elemanları, direnç, kondansatör, diyot ve lojik devreler."
            },
            {
                  "id": "bilisim-hukuku-ve-etigi",
                  "code": "BT211",
                  "title": "Bilişim Hukuku ve Etiği",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Siber suçlar, KVKK, lisanslama, telif hakları ve bilişim etiği."
            },
            {
                  "id": "acik-kaynak-isletim-sistemleri",
                  "code": "BT213",
                  "title": "Açık Kaynak İşletim Sistemleri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Linux temelleri, bash komut satırı ve sistem yönetimi."
            },
            {
                  "id": "veritabani-yonetimi",
                  "code": "BT215",
                  "title": "Veritabanı Yönetimi",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "SQL Server yönetimi, yedekleme, yetkilendirme ve performans optimizasyonu."
            },
            {
                  "id": "gomulu-sistemler",
                  "code": "BT217",
                  "title": "Gömülü Sistemler",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Microcontroller, Arduino, sensörler ve IoT projelendirme."
            },
            {
                  "id": "kalite-yonetim-sistemleri",
                  "code": "TB201",
                  "title": "Kalite Yönetim Sistemleri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "ISO 9001 kalite standartları, süreç yönetimi ve kalite güvence."
            },
            {
                  "id": "gonulluluk-calismalari",
                  "code": "GNÇ",
                  "title": "Gönüllülük Çalışmaları",
                  "akts": 4,
                  "type": "Seçmeli",
                  "desc": "Toplumsal duyarlılık ve sivil toplum projelerinde aktif görev alma."
            },
            {
                  "id": "rusca-1",
                  "code": "SKS201",
                  "title": "Rusça I",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Temel Rusça alfabesi, tanışma ve günlük iletişim kalıpları."
            }
      ],
      "4": [
            {
                  "id": "gorsel-programlama-2",
                  "code": "BT202",
                  "title": "Görsel Programlama II",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "Gelişmiş masaüstü mimarisi, katmanlı mimari (N-Tier) ve veritabanı bağlama."
            },
            {
                  "id": "internet-programciligi-2",
                  "code": "BT204",
                  "title": "İnternet Programcılığı II",
                  "akts": 5,
                  "type": "Zorunlu",
                  "desc": "Full-stack web geliştirme, Entity Framework Core ve REST API."
            },
            {
                  "id": "mobil-programlama",
                  "code": "BT206",
                  "title": "Mobil Programlama",
                  "akts": 4,
                  "type": "Zorunlu",
                  "desc": "Mobil uygulama geliştirme prensipleri ve arayüz tasarımları."
            },
            {
                  "id": "grafik-ve-animasyon",
                  "code": "BT208",
                  "title": "Grafik ve Animasyon",
                  "akts": 2,
                  "type": "Zorunlu",
                  "desc": "Vektörel grafik tasarımı, UI/UX animasyonları ve görsel içerik üretimi."
            },
            {
                  "id": "robotige-giris",
                  "code": "BT210",
                  "title": "Robotiğe Giriş",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Otonom robotik sistemler, sensör okuma ve motor kontrolü."
            },
            {
                  "id": "sistem-analizi-ve-tasarimi",
                  "code": "BT212",
                  "title": "Sistem Analizi ve Tasarımı",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Yazılım yaşam döngüsü (SDLC), UML diyagramları ve gereksinim analizi."
            },
            {
                  "id": "sunucu-isletim-sistemleri",
                  "code": "BT214",
                  "title": "Sunucu İşletim Sistemleri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Windows Server & Linux Server kurulumu, Active Directory ve DNS/DHCP."
            },
            {
                  "id": "yazilim-mimarileri",
                  "code": "BT216",
                  "title": "Yazılım Mimarileri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Tasarım kalıpları (Design Patterns), Microservices ve clean architecture."
            },
            {
                  "id": "arastirma-yontem-ve-teknikleri",
                  "code": "BT218",
                  "title": "Araştırma Yöntem ve Teknikleri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Akademik ve teknik araştırma raporlama metodolojisi."
            },
            {
                  "id": "rusca-2",
                  "code": "SKS202",
                  "title": "Rusça II",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Gelişmiş Rusça dil bilgisi ve mesleki terimler."
            },
            {
                  "id": "resim",
                  "code": "SKS204",
                  "title": "Resim",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Görsel sanatlar, desen ve renk teorisi."
            },
            {
                  "id": "iletisim-becerileri",
                  "code": "SKS206",
                  "title": "İletişim Becerileri",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Etkili sunum teknikleri, beden dili ve kurumsal iletişim."
            },
            {
                  "id": "girisimcilik",
                  "code": "SKS212",
                  "title": "Girişimcilik",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "İş fikri geliştirme, fizibilite ve startup ekosistemi."
            },
            {
                  "id": "topluma-hizmet-uygulamalari",
                  "code": "SKS210",
                  "title": "Topluma Hizmet Uygulamaları",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Toplumsal fayda odaklı sosyal sorumluluk projeleri."
            },
            {
                  "id": "isaret-dili",
                  "code": "SKS207",
                  "title": "İşaret Dili",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "Türk işaret dili alfabe ve temel iletişim becerileri."
            },
            {
                  "id": "kariyer-planlama",
                  "code": "KRY-999",
                  "title": "Kariyer Planlama",
                  "akts": 2,
                  "type": "Seçmeli",
                  "desc": "Özgeçmiş hazırlama, mülakat teknikleri ve kariyer haritası."
            },
            {
                  "id": "universite-ortak-secmeli",
                  "code": "OSD001",
                  "title": "Üniversite Ortak Seçmeli Havuzu",
                  "akts": 3,
                  "type": "Seçmeli",
                  "desc": "İlk Yardım, Ekoloji, E-Ticaret, Dijital Okuryazarlık vb. ortak dersler."
            }
      ]
};

    let html = `
      <section class="section-block full-screen-section" id="curriculum-section">
        <div class="section-header text-center">
          <h2>Dönemlere Göre Ders Müfredatı</h2>
          <p>Bölümde geçireceğin 4 yarıyılın derslerini ve kazanacağın becerileri keşfet:</p>
        </div>

        <div class="official-curriculum-container">
          <div class="sem-tabs-header">
            <button class="sem-tab-btn active" data-target="sem1-card-panel">1. Yarıyıl (Güz)</button>
            <button class="sem-tab-btn" data-target="sem2-card-panel">2. Yarıyıl (Bahar)</button>
            <button class="sem-tab-btn" data-target="sem3-card-panel">3. Yarıyıl (Güz)</button>
            <button class="sem-tab-btn" data-target="sem4-card-panel">4. Yarıyıl (Bahar)</button>
          </div>
    `;

    for (let sem = 1; sem <= 4; sem++) {
      const list = semesterCourses[sem];
      html += `
        <div class="sem-tab-panel ${sem === 1 ? 'active' : ''}" id="sem${sem}-card-panel" style="${sem === 1 ? '' : 'display:none;'}">
          <div class="curriculum-preview-cards-grid">
      `;

      list.forEach(item => {
        html += `
          <div class="cpc-card">
            <div class="cpc-header">
              <span class="badge badge-primary">${item.code}</span>
              <span class="badge badge-outline">${item.akts} AKTS · ${item.type}</span>
            </div>
            <h3 class="cpc-title">${item.title}</h3>
            <p class="cpc-desc">${item.desc}</p>
            <div class="cpc-footer">
              <a href="#course/${item.id}" class="btn btn-sm btn-primary">Derse Git ➔</a>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </section>
    `;

    return html;
  },

  /**
   * 🧑💻 5. KODLAMAYA BAŞLA & ARDAHAN REHBERİ İKİLİ ÇAĞRI BLOĞU
   */
  renderLearningAndCity() {
    return `
      <section class="section-block full-screen-section" id="learning-city-section">
        <div class="dual-feature-callout-grid">


          <div class="dfc-card city-callout">
            <div class="dfc-icon">🗺️</div>
            <h3>Ardahan'da Öğrenci Hayatı</h3>
            <p>Üniversite yerleşkesi, yurtlar, ulaşım imkânları ve şehir içi yaşam hakkında merak ettiklerin:</p>
            <a href="#city" class="btn btn-primary btn-md">
              Şehir & Öğrenci Rehberi →
            </a>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * 🚀 6. MEZUN OLUNCA NELER YAPABİLİRSİN? (KARİYER & SEKTÖR)
   */
  renderCareerPaths() {
    return `
      <section class="section-block full-screen-section" id="career-section">
        <div class="section-header text-center">
          <h2>Kariyer Olanakları ve Sektör Rolleri</h2>
          <p>2 yılın sonunda yönelebileceğin başlıca sektör alanları ve kariyer fırsatları:</p>
        </div>

        <div class="career-cards-grid">
          <div class="cc-card">
            <div class="cc-icon">💻</div>
            <h4>Yazılım Geliştirici</h4>
            <p>C# ve .NET ekosistemiyle masaüstü ve iş otomasyon yazılımları geliştirme.</p>
            <span class="cc-skill-tag">C# • OOP • SQL</span>
          </div>

          <div class="cc-card">
            <div class="cc-icon">🌐</div>
            <h4>Web Geliştirici</h4>
            <p>Frontend arayüzler ve Backend API servisleri oluşturma.</p>
            <span class="cc-skill-tag">HTML/CSS • JS • ASP.NET</span>
          </div>

          <div class="cc-card">
            <div class="cc-icon">📱</div>
            <h4>Mobil Uygulama</h4>
            <p>Android ve iOS platformları için kullanıcı dostu mobil çözümler sunma.</p>
            <span class="cc-skill-tag">Mobil UI • API Integrations</span>
          </div>

          <div class="cc-card">
            <div class="cc-icon">🗄️</div>
            <h4>Veri Tabanı Uzmanı</h4>
            <p>SQL Server ve veritabanı yönetimi, sorgu optimizasyonu ve mimari.</p>
            <span class="cc-skill-tag">T-SQL • Indexing • Schema</span>
          </div>

          <div class="cc-card">
            <div class="cc-icon">📡</div>
            <h4>Sistem & Ağ Uzmanı</h4>
            <p>Kurumsal ağ altyapıları, sunucu kurulumu ve bilgi işlem sorumlusu.</p>
            <span class="cc-skill-tag">Network • Linux/Win Server</span>
          </div>

          <div class="cc-card highlight-cc">
            <div class="cc-icon">🎓</div>
            <h4>DGS Lisans Geçişi</h4>
            <p>Mühendislik (Yazılım, Bilgisayar, YBS vb.) fakültelerine dikey geçiş imkânı.</p>
            <span class="cc-skill-tag">Lisans Diploması • Mühendislik</span>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * 📌 7. AKADEMİK DETAYLAR & RESMÎ BİLGİLER (ACCORDION)
   */
  renderAcademicInfo() {
    return `
      <section class="section-block full-screen-section" id="academic-section">
        <div class="academic-accordion-card">
          <div class="aac-header">
            <span class="badge badge-primary aac-badge">AKADEMİK BİLGİLER VE MEVZUAT</span>
            <h3>Bilgisayar Programcılığı Bölüm Tanıtımı & Mevzuat</h3>
            <p>YÖK tanımı, laboratuvar kapasitesi, DGS lisans geçiş bölümleri ve kurumsal iletişim detayları:</p>
          </div>

          <div class="aac-items-list">
            <details class="aac-item" open>
              <summary>
                <span class="aac-summary-title">🏛️ Bölüm Tarihçesi ve Laboratuvar İmkânları</span>
                <span class="aac-chevron">▼</span>
              </summary>
              <div class="aac-content">
                <div class="aac-info-box">
                  <p>Bilgisayar Programcılığı Programı 2009-2010 eğitim-öğretim yılında Ardahan MYO bünyesinde kurulmuş, 2011-2012'den itibaren <strong>Ardahan Teknik Bilimler Meslek Yüksekokulu</strong> bünyesinde eğitim-öğretime devam etmektedir.</p>
                  <div class="aac-feature-tags">
                    <span class="aac-tag">💻 40+1 Kişilik 2 Adet Masaüstü Lab</span>
                    <span class="aac-tag">💻 25+1 Kişilik 1 Adet Dizüstü (Laptop) Lab</span>
                    <span class="aac-tag">🖥️ 48+1 Kişilik İBF Bilgisayar Lab</span>
                    <span class="aac-tag">🚀 Bilişim Kulübü</span>
                  </div>
                </div>
              </div>
            </details>

            <details class="aac-item">
              <summary>
                <span class="aac-summary-title">🎓 DGS ile Geçilebilen Lisans Bölümleri (Tam Liste)</span>
                <span class="aac-chevron">▼</span>
              </summary>
              <div class="aac-content">
                <p style="margin-bottom: 8px;">Mezunlar Dikey Geçiş Sınavı (DGS) puanına göre aşağıdaki 4 yıllık fakülte bölümlerine dikey geçiş yapabilirler:</p>
                <div class="aac-dgs-grid">
                  <span class="dgs-chip">💻 Bilgisayar Mühendisliği</span>
                  <span class="dgs-chip">⚡ Yazılım Mühendisliği</span>
                  <span class="dgs-chip">📊 Yönetim Bilişim Sistemleri (YBS)</span>
                  <span class="dgs-chip">🌐 Bilişim Sistemleri Mühendisliği</span>
                  <span class="dgs-chip">🖥️ Bilgi Teknolojileri</span>
                  <span class="dgs-chip">🔬 Bilgisayar Bilimleri</span>
                  <span class="dgs-chip">👨‍🏫 Bilgisayar ve Öğretim Teknolojileri Öğretmenliği (BÖTE)</span>
                  <span class="dgs-chip">📐 İstatistik ve Bilgisayar Bilimleri</span>
                  <span class="dgs-chip">🚀 Uzay Mühendisliği</span>
                  <span class="dgs-chip">🌤️ Meteoroloji Mühendisliği</span>
                  <span class="dgs-chip">🧪 Fizik & Uygulamalı Matematik</span>
                </div>
              </div>
            </details>

            <details class="aac-item">
              <summary>
                <span class="aac-summary-title">📝 Sınav, Ölçme ve Geçme Yönetmeliği</span>
                <span class="aac-chevron">▼</span>
              </summary>
              <div class="aac-content">
                <div class="aac-formula-card">
                  <div class="aac-formula-badge">
                    <span>Ardahan Üniversitesi Önlisans ve Lisans Eğitim-Öğretim Yönetmeliği</span>
                  </div>
                  <div class="aac-formula-expression">
                    <span class="formula-part vize">%40 Ara Sınav (Vize)</span>
                    <span class="formula-plus">+</span>
                    <span class="formula-part final">%60 Dönem Sonu (Final)</span>
                  </div>
                  <p class="aac-note">⚠️ Başarı Notu için GANO minimum 2.00 / 4.00 ve dönem sonu final sınavı baraj notunun geçilmesi gerekmektedir.</p>
                </div>
              </div>
            </details>

            <details class="aac-item">
              <summary>
                <span class="aac-summary-title">💼 Zorunlu Yaz Stajı ve Mezuniyet Şartları (30 İş Günü)</span>
                <span class="aac-chevron">▼</span>
              </summary>
              <div class="aac-content">
                <div class="aac-staj-grid">
                  <div class="aac-staj-stat">
                    <span class="staj-val">30 İŞ GÜNÜ</span>
                    <span class="staj-lbl">6 Hafta Zorunlu Staj</span>
                  </div>
                  <div class="aac-staj-stat">
                    <span class="staj-val">120 AKTS</span>
                    <span class="staj-lbl">Toplam Mezuniyet Kredisi</span>
                  </div>
                  <div class="aac-staj-desc">
                    <p>Program mezunları bilgisayar firmalarının teknik servislerinde, KOBİ'lerde bilgi işlem sorumlusu, yazılım firmalarında programcı/geliştirici, ağ (network) ve web tasarımı yapan kurumlarda teknik uzman olarak çalışabilirler.</p>
                  </div>
                </div>
              </div>
            </details>

            <details class="aac-item">
              <summary>
                <span class="aac-summary-title">📍 İletişim & Kampüs Ulaşım Bilgileri</span>
                <span class="aac-chevron">▼</span>
              </summary>
              <div class="aac-content">
                <div class="aac-contact-box">
                  <p><strong>Adres:</strong> Ardahan Üniversitesi Yenisey Kampüsü Teknik Bilimler MYO PK: 75002 Merkez / Ardahan</p>
                  <p><strong>Santral:</strong> +90 (478) 211 75 75 | <strong>Kurumsal E-posta:</strong> <a href="mailto:tbmyo@ardahan.edu.tr">tbmyo@ardahan.edu.tr</a></p>
                  <p><strong>KEP Adresi:</strong> ardahanuni@hs01.kep.tr</p>
                </div>
              </div>
            </details>
          </div>

          <div class="aac-footer-actions">
            <a href="https://tby.ardahan.edu.tr/uploads/u23/f200/0d44ad5acdc74037b77e1f4675b4fda7.pdf" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              📄 Resmî Öğretim Planı (PDF) ➔
            </a>
            <a href="https://tby.ardahan.edu.tr/sayfa/bolum-danismanlari-7294-23-c7abc9ff-b8d2-42f4-8c2f-1fe759a2be90" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              👨‍🏫 Bölüm Danışmanları Listesi ➔
            </a>
            <a href="https://tby.ardahan.edu.tr/Contact" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              📍 İletişim Sayfası ➔
            </a>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Ana Sayfa Dinleyicilerini Bağlar
   */
    attachHomeEventListeners() {
    // 📊 Stats Horizontal Slider Dinleyicileri
    const statsTrack = document.getElementById('stats-slider-track');
    const statsPrevBtn = document.getElementById('stats-prev-btn');
    const statsNextBtn = document.getElementById('stats-next-btn');
    const statsDotsContainer = document.getElementById('stats-slider-dots');

    if (statsTrack) {
      const cards = statsTrack.querySelectorAll('.slider-card');
      const dots = statsDotsContainer ? statsDotsContainer.querySelectorAll('.slider-dot') : [];

      const updateActiveDot = (index) => {
        dots.forEach((dot, i) => {
          if (i === index) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      };

      if (statsPrevBtn) {
        statsPrevBtn.addEventListener('click', () => {
          const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
          statsTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
      }

      if (statsNextBtn) {
        statsNextBtn.addEventListener('click', () => {
          const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
          statsTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          if (cards[index]) {
            const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
            statsTrack.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
            updateActiveDot(index);
          }
        });
      });

      statsTrack.addEventListener('scroll', () => {
        const scrollPos = statsTrack.scrollLeft;
        const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 300;
        const currentIndex = Math.round(scrollPos / cardWidth);
        updateActiveDot(currentIndex);
      });
    }

    // 📌 Sticky Sayfa İçi Konu Başlıkları Dinleyicisi
    const stickyOutline = document.getElementById('home-sticky-outline');
    if (stickyOutline) {
      const outlineLinks = stickyOutline.querySelectorAll('.outline-item a');
      outlineLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetHash = link.getAttribute('href');
          if (targetHash && targetHash.startsWith('#')) {
            const targetId = targetHash.substring(1);
            const targetSec = document.getElementById(targetId);
            if (targetSec) {
              targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }

          outlineLinks.forEach(l => {
            l.parentElement.classList.remove('active');
            const statusSpan = l.querySelector('.ot-status');
            if (statusSpan) statusSpan.textContent = '○';
          });
          link.parentElement.classList.add('active');
          const currentStatus = link.querySelector('.ot-status');
          if (currentStatus) currentStatus.textContent = '●';
        });
      });

      // Scroll Spy: Sayfa kaydırıldıkça aktif bölümü güncelleme
      const sectionIds = ['hero-section', 'stats-section', 'curriculum-section', 'learning-city-section', 'career-section', 'academic-section'];
      const observerOptions = { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            outlineLinks.forEach(l => {
              const href = l.getAttribute('href');
              if (href === `#${id}`) {
                l.parentElement.classList.add('active');
                const status = l.querySelector('.ot-status');
                if (status) status.textContent = '●';
              } else {
                l.parentElement.classList.remove('active');
                const status = l.querySelector('.ot-status');
                if (status) status.textContent = '○';
              }
            });
          }
        });
      }, observerOptions);

      sectionIds.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) observer.observe(sec);
      });
    }
    // 🎓 Hero Segmented Tab Geçişleri Dinleyicisi
    const heroTabBtns = this.appContainer.querySelectorAll('.hero-tab-btn');
    const heroTabContents = this.appContainer.querySelectorAll('.hero-tab-content');

    heroTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        heroTabBtns.forEach(b => b.classList.remove('active'));
        heroTabContents.forEach(c => {
          c.classList.remove('active');
          c.style.display = 'none';
        });

        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');
        const targetId = targetBtn.getAttribute('data-target');
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
          targetContent.style.display = 'block';
        }
      });
    });

    // Yarıyıl Tab Geçişleri Dinleyicileri
    const semTabBtns = this.appContainer.querySelectorAll('.sem-tab-btn');
    const semPanels = this.appContainer.querySelectorAll('.sem-tab-panel');

    semTabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        semTabBtns.forEach(b => b.classList.remove('active'));
        semPanels.forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });

        e.target.classList.add('active');
        const targetId = e.target.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.style.display = 'block';
        }
      });
    });

    const exportBtn = document.getElementById('btn-export-data');
    const importBtn = document.getElementById('btn-import-data');

    if (exportBtn) exportBtn.addEventListener('click', () => Storage.exportData());
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const success = Storage.importData(evt.target.result);
            if (success) {
              Utils.showToast('İlerlemeniz başarıyla içe aktarıldı!', 'success');
              this.renderHomeView();
            } else {
              Utils.showToast('Hatalı yedek dosyası!', 'danger');
            }
          };
          reader.readAsText(file);
        };
        fileInput.click();
      });
    }
  },

async renderCoursesView() {
    this.renderSkeleton(this.appContainer);
    const coursesInfo = await CourseService.loadCourses();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Dersler Kataloğu', hash: '#courses' }
    ]);

    let html = `
      ${breadcrumbHTML}

      <div class="page-header">
        <h1>📚 Müfredat Ders Kataloğu</h1>
        <p>Bilgisayar Programcılığı 2 yıllık (4 yarıyıl) tüm ders müfredatı ve kategorileri.</p>
      </div>

      <div class="filter-tabs">
        <button class="filter-btn active" data-filter="all">Tüm Dersler</button>
        <button class="filter-btn" data-filter="sem-1">1. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-2">2. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-3">3. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-4">4. Yarıyıl</button>
      </div>

      <div class="courses-grid" id="catalog-grid">
    `;

    for (const c of coursesInfo.courses) {
      const cat = coursesInfo.categories[c.category] || { badge: 'secondary', title: 'Genel' };

      html += `
        <div class="course-card" data-sem="sem-${c.semester}">
          <div class="course-card-header">
            <div class="course-icon">${Utils.getIconSVG(c.icon || 'book-open')}</div>
            <div>
              <span class="badge badge-${cat.badge}">${c.code}</span>
              <span class="badge badge-outline">${c.semester}. Yarıyıl</span>
            </div>
          </div>
          <h3 class="course-title">${Utils.escapeHTML(c.title)}</h3>
          <div class="course-card-meta">
            <div class="meta-item"><strong>Kredi:</strong> ${c.akts || 3} AKTS (${c.credits || c.akts || 3} Kredi)</div>
            <div class="meta-item"><strong>Dersi Veren:</strong> ${Utils.escapeHTML(c.instructor || 'Öğr. Gör. (TBMYO Akademik Kadro)')}</div>
          </div>

          <div class="card-btn-group" style="margin-top:16px;">
            <a href="#course/${c.id}" class="btn btn-primary" style="width:100%; justify-content:center;">Derse Git ➔</a>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    this.appContainer.innerHTML = html;

    const filterBtns = this.appContainer.querySelectorAll('.filter-btn');
    const cards = this.appContainer.querySelectorAll('#catalog-grid .course-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.getAttribute('data-filter');
        cards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-sem') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  },

  /**
   * 3. DERS DETAY GÖRÜNÜMÜ (#course/:courseId)
   */
  async renderCourseDetailView(courseId, targetLessonId = null) {
    this.renderSkeleton(this.appContainer);

    const coursesInfo = await CourseService.loadCourses();
    const course = coursesInfo.courses.find(c => c.id === courseId);
    if (!course) {
      this.appContainer.innerHTML = `<div class="alert alert-danger">Ders bulunamadı!</div>`;
      return;
    }

    const lessonsData = await CourseService.loadCourseLessons(courseId);
    if (!lessonsData || !lessonsData.lessons || lessonsData.lessons.length === 0) {
      this.appContainer.innerHTML = `<div class="alert alert-warning">Bu ders için henüz içerik eklenmemiş.</div>`;
      return;
    }

    const lessons = lessonsData.lessons;
    let lessonIndex = targetLessonId ? lessons.findIndex(l => l.id === targetLessonId) : 0;
    if (lessonIndex === -1) lessonIndex = 0;
    const lesson = lessons[lessonIndex];

    Storage.addRecentlyViewed({
      title: lesson.title,
      courseTitle: course.title,
      hash: `#lesson/${courseId}/${lesson.id}`
    });

    const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

    const quizzesData = await CourseService.loadCourseQuizzes(courseId);
    const quiz = quizzesData && quizzesData.quizzes ? quizzesData.quizzes.find(q => q.id === lesson.quizId) : null;
    const isCompleted = Storage.isLessonCompleted(courseId, lesson.id);
    const isBookmarked = Storage.isBookmarked(courseId, lesson.id);
    const userNote = Storage.getNote(courseId, lesson.id);

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Dersler', hash: '#courses' },
      { title: course.title, hash: `#course/${courseId}` },
      { title: lesson.title, hash: `#lesson/${courseId}/${lesson.id}` }
    ]);

    let html = `
      <div id="reading-progress-bar" class="reading-progress-bar" style="width: 0%"></div>

      ${breadcrumbHTML}

      <!-- 1. DERS BAŞLIK KÜNYESİ -->
      <div class="course-detail-header" style="margin-bottom:16px;">
        <div class="detail-top-nav">
          <a href="#courses" class="btn-back">← Ders Kataloğuna Dön</a>
        </div>
        <div class="detail-title-box">
          <div class="course-icon lg">${Utils.getIconSVG(course.icon)}</div>
          <div>
            <span class="badge badge-primary">${course.code} • ${course.credits || course.akts || 3} Kredi / ${course.ects || course.akts || 3} AKTS</span>
            <h1>${Utils.escapeHTML(course.title)}</h1>
          </div>
        </div>
      </div>

      <!-- 2. KONU SIRALAMASI VE ZAMAN ÇİZELGESİ BAR -->
      <div class="course-timeline-wrapper" style="margin-bottom:24px;">
        <div class="timeline-bar-header">
          <div style="display:flex; align-items:center; gap:10px;">
            <h3>📍 Konu Sıralaması ve Öğrenim Çizelgesi</h3>
            <span class="tb-count">${lessons.length} Konu Adımı</span>
          </div>
          <div class="tb-actions">
            <button class="btn btn-outline btn-sm" id="btn-toggle-topic-editor">
              ✏️ Çizelgeyi Düzenle (Ekle / Çıkar / Sırala)
            </button>
          </div>
        </div>

        <!-- 🛠️ İNTERAKTİF KONU DÜZENLEME VE SIRALAMA PANELİ -->
        <div class="topic-editor-panel hidden" id="topic-editor-panel">
          <div class="te-header">
            <h4>✏️ Konu Başlıklarını Düzenle ve Sırala</h4>
            <p>Ders çizelgesine yeni konu ekleyebilir, sırasını değiştirebilir veya silebilirsiniz.</p>
          </div>
          
          <div class="te-add-box">
            <input type="text" id="new-topic-input" class="form-input" placeholder="Yeni Konu Başlığı Giriniz (Örn: İleri Düzey Algoritmalar)..." />
            <button class="btn btn-primary btn-sm" id="btn-add-topic">➕ Konu Ekle</button>
          </div>

          <div class="te-list" id="te-topics-list">
            ${lessons.map((l, idx) => `
              <div class="te-item" data-idx="${idx}">
                <span class="te-num">${idx + 1}</span>
                <span class="te-title">${Utils.escapeHTML(l.title)}</span>
                <div class="te-item-btns">
                  <button class="btn btn-outline btn-sm btn-move-up" data-idx="${idx}" title="Yukarı / Sola Taşı">⬅️</button>
                  <button class="btn btn-outline btn-sm btn-move-down" data-idx="${idx}" title="Aşağı / Sağa Taşı">➡️</button>
                  <button class="btn btn-danger btn-sm btn-delete-topic" data-idx="${idx}" title="Konuyu Sil">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="te-footer">
            <button class="btn btn-success btn-sm" id="btn-save-topics">💾 Çizelgeyi Kaydet</button>
            <button class="btn btn-outline btn-sm" id="btn-reset-topics">🔄 Varsayılan Müfredata Dön</button>
          </div>
        </div>

        <div class="topic-timeline-container">
          <div class="topic-line-bar"></div>
          <div class="topic-steps-scroll">
            ${lessons.map((l, idx) => {
              const isCurrent = l.id === lesson.id;
              const isDone = Storage.isLessonCompleted(courseId, l.id);
              return `
                <div class="topic-step-item ${isCurrent ? 'current-step' : ''} ${isDone ? 'done-step' : ''}">
                  <a href="#lesson/${courseId}/${l.id}" class="topic-step-link">
                    <span class="step-circle">${idx + 1}</span>
                    <span class="step-label">${Utils.escapeHTML(l.title)}</span>
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 3. DİREKT ÇİZELGENİN ALTINDAKİ AKTİF KONU DETAY ALANI -->
      <div class="lesson-layout-grid">
        <div class="lesson-view-container">
          <div class="lesson-view-nav">
            <span class="badge badge-primary">Konu #${lesson.order} / ${lessons.length}</span>
            <div class="lesson-nav-actions">
              <button class="btn btn-outline" id="btn-toggle-bookmark">
                ${isBookmarked ? '⭐ Favorilerden Çıkar' : '☆ Favorilere Ekle'}
              </button>
              <button class="btn ${isCompleted ? 'btn-success' : 'btn-outline'}" id="btn-toggle-complete">
                ${Utils.getIconSVG('check-circle')} ${isCompleted ? 'Tamamlandı' : 'Tamamlandı İşaretle'}
              </button>
            </div>
          </div>

          <div class="lesson-header-box">
            <h1>${Utils.escapeHTML(lesson.title)}</h1>
          </div>

          ${lesson.goal ? `
            <div class="content-block block-goal" id="sec-goal">
              <div class="block-header">🎯 Bu Konuda Ne Öğreneceksin?</div>
              <p>${Utils.escapeHTML(lesson.goal)}</p>
            </div>
          ` : ''}

          ${lesson.content ? `
            <div class="content-block block-content" id="sec-content">
              <div class="block-header">📖 Konu Anlatımı</div>
              ${lesson.content}
            </div>
          ` : ''}

          ${lesson.realWorld ? `
            <div class="content-block block-realworld" id="sec-realworld">
              <div class="block-header">💡 Gerçek Hayat Örneği</div>
              <p>${Utils.escapeHTML(lesson.realWorld)}</p>
            </div>
          ` : ''}

          ${lesson.codeSnippet ? `
            <div class="w3-example-box" id="sec-code">
              <div class="w3-example-header">
                <span>💻 Örnek Uygulama & Kod Yapısı</span>
              </div>
              <div class="w3-example-body">
                <pre><code>${Utils.escapeHTML(lesson.codeSnippet)}</code></pre>
              </div>
              <div class="w3-example-footer">
                <a href="#lab" class="btn btn-success btn-sm w3-try-btn">
                  Canlı Kod Lab'da Çalıştır (Try it Yourself ❯)
                </a>
                <button class="copy-btn btn btn-outline btn-sm">📋 Kopyala</button>
              </div>
            </div>
          ` : ''}

          ${lesson.codeLogic ? `
            <div class="content-block block-logic" id="sec-logic">
              <div class="block-header">🧠 Kodun ve Sistemin Mantığı</div>
              <p>${lesson.codeLogic}</p>
            </div>
          ` : ''}

          ${lesson.commonMistakes && lesson.commonMistakes.length ? `
            <div class="content-block block-mistakes" id="sec-mistakes">
              <div class="block-header">⚠️ Sık Yapılan Hatalar ve Tuzaklar</div>
              <ul>
                ${lesson.commonMistakes.map(m => `<li>${Utils.escapeHTML(m)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          ${(lesson.examTip || lesson.industryTip) ? `
            <div class="dual-tips-grid">
              ${lesson.examTip ? `
                <div class="tip-card tip-exam">
                  <div class="tip-header">🎓 Sınavda Bil (Vize / Final)</div>
                  <p>${Utils.escapeHTML(lesson.examTip)}</p>
                </div>
              ` : ''}
              ${lesson.industryTip ? `
                <div class="tip-card tip-industry">
                  <div class="tip-header">🚀 Gerçek Hayatta Bil (Sektör)</div>
                  <p>${Utils.escapeHTML(lesson.industryTip)}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="content-block block-personal-note">
            <div class="block-header">📝 Bu Konu Hakkında Özel Notun (Yerel Kayıt)</div>
            <textarea id="personal-note-input" class="note-textarea" placeholder="Buraya kendin için hatırlatıcı notlar yazabilirsin...">${Utils.escapeHTML(userNote)}</textarea>
            <button class="btn btn-sm btn-primary" id="btn-save-note" style="margin-top:8px;">💾 Notu Kaydet</button>
          </div>

          ${lesson.exercise ? `
            <div class="content-block block-exercise" id="sec-exercise">
              <div class="block-header">🛠 Sen de Uygula (Pratik Görev)</div>
              <p>${lesson.exercise}</p>
            </div>
          ` : ''}

          <!-- W3SCHOOLS STYLE EXERCISE & QUIZ BOX -->
          <div class="w3-exercise-box">
            <div class="w3-exercise-header">
              <span class="w3-ex-icon">📝</span>
              <h3>Kendini Test Et (Test Yourself with Exercises)</h3>
            </div>
            <p>Bu konuda öğrendiklerini pekiştirmek için aşağıdaki örnek soruları çöz:</p>
            <div id="quiz-mount-point">
              <!-- Quiz Component Mount -->
            </div>
          </div>

          <div class="lesson-bottom-bar">
            <button class="btn btn-outline btn-sm" id="btn-report-issue">
              💬 Bu İçerikte Hata Bildir
            </button>

            <div class="next-prev-buttons">
              ${prevLesson ? `
                <a href="#lesson/${courseId}/${prevLesson.id}" class="btn btn-outline">
                  ← Önceki Konu: ${Utils.escapeHTML(prevLesson.title)}
                </a>
              ` : '<span></span>'}

              ${nextLesson ? `
                <a href="#lesson/${courseId}/${nextLesson.id}" class="btn btn-primary" id="btn-next-lesson">
                  Sonraki Konu: ${Utils.escapeHTML(nextLesson.title)} ➔
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <aside class="sticky-lesson-outline">
          <div class="outline-card">
            <h4>📌 DERS KONULARI</h4>
            <ul class="outline-topics-list">
              ${lessons.map((l, idx) => {
                const isCurrent = l.id === lesson.id;
                const isDone = Storage.isLessonCompleted(courseId, l.id);
                return `
                  <li class="outline-item ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}">
                    <a href="#lesson/${courseId}/${l.id}">
                      <span class="ot-status">${isDone ? '✓' : (isCurrent ? '●' : '○')}</span>
                      <span class="ot-title">${Utils.escapeHTML(l.title)}</span>
                    </a>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </aside>
      </div>
    `;

    this.appContainer.innerHTML = html;
    this.initLessonInteractions(courseId, lesson.id, lessons, quiz);
  },

  initLessonInteractions(courseId, lessonId, lessons, quiz = null) {
    // Smooth scroll to active step when loaded
    const currentStepEl = document.querySelector('.topic-step-item.current-step');
    if (currentStepEl) {
      currentStepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // 1. Reading progress bar
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      window.onscroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
      };
    }

    // 2. Quiz Mount
    const quizMountPoint = document.getElementById('quiz-mount-point');
    if (quizMountPoint && quiz) {
      QuizEngine.renderQuizCard(quiz, quizMountPoint);
    }

    // 3. Bookmark Toggle
    const btnBookmark = document.getElementById('btn-toggle-bookmark');
    if (btnBookmark) {
      btnBookmark.onclick = () => {
        const isFav = Storage.toggleBookmark(courseId, lessonId);
        btnBookmark.textContent = isFav ? '⭐ Favorilerden Çıkar' : '☆ Favorilere Ekle';
      };
    }

    // 4. Complete Toggle
    const btnComplete = document.getElementById('btn-toggle-complete');
    if (btnComplete) {
      btnComplete.onclick = () => {
        const isDone = Storage.toggleLessonComplete(courseId, lessonId);
        btnComplete.className = `btn ${isDone ? 'btn-success' : 'btn-outline'}`;
        btnComplete.innerHTML = `${Utils.getIconSVG('check-circle')} ${isDone ? 'Tamamlandı' : 'Tamamlandı İşaretle'}`;
      };
    }

    // 5. Save Note
    const btnSaveNote = document.getElementById('btn-save-note');
    const noteInput = document.getElementById('personal-note-input');
    if (btnSaveNote && noteInput) {
      btnSaveNote.onclick = () => {
        Storage.saveNote(courseId, lessonId, noteInput.value);
        alert('Notunuz başarıyla kaydedildi!');
      };
    }

    // 2.5 Topic Editor Interactions
    const btnToggleEditor = document.getElementById('btn-toggle-topic-editor');
    const editorPanel = document.getElementById('topic-editor-panel');
    if (btnToggleEditor && editorPanel) {
      btnToggleEditor.onclick = () => {
        editorPanel.classList.toggle('hidden');
      };

      let currentTopics = lessons.map(l => ({ id: l.id, title: l.title }));

      const renderEditorList = () => {
        const listEl = document.getElementById('te-topics-list');
        if (!listEl) return;
        listEl.innerHTML = currentTopics.map((t, idx) => `
          <div class="te-item" data-idx="${idx}">
            <span class="te-num">${idx + 1}</span>
            <span class="te-title">${Utils.escapeHTML(t.title)}</span>
            <div class="te-item-btns">
              <button class="btn btn-outline btn-sm btn-move-up" data-idx="${idx}" title="Sola Taşı">⬅️</button>
              <button class="btn btn-outline btn-sm btn-move-down" data-idx="${idx}" title="Sağa Taşı">➡️</button>
              <button class="btn btn-danger btn-sm btn-delete-topic" data-idx="${idx}" title="Sil">🗑️</button>
            </div>
          </div>
        `).join('');
        bindEditorEvents();
      };

      const bindEditorEvents = () => {
        const upBtns = editorPanel.querySelectorAll('.btn-move-up');
        const downBtns = editorPanel.querySelectorAll('.btn-move-down');
        const delBtns = editorPanel.querySelectorAll('.btn-delete-topic');

        upBtns.forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (idx > 0) {
              const temp = currentTopics[idx];
              currentTopics[idx] = currentTopics[idx - 1];
              currentTopics[idx - 1] = temp;
              renderEditorList();
            }
          };
        });

        downBtns.forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (idx < currentTopics.length - 1) {
              const temp = currentTopics[idx];
              currentTopics[idx] = currentTopics[idx + 1];
              currentTopics[idx + 1] = temp;
              renderEditorList();
            }
          };
        });

        delBtns.forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.getAttribute('data-idx'), 10);
            if (currentTopics.length <= 1) {
              alert('En az 1 konu kalmalıdır!');
              return;
            }
            currentTopics.splice(idx, 1);
            renderEditorList();
          };
        });
      };

      bindEditorEvents();

      const btnAddTopic = document.getElementById('btn-add-topic');
      const newTopicInput = document.getElementById('new-topic-input');
      if (btnAddTopic && newTopicInput) {
        btnAddTopic.onclick = () => {
          const val = newTopicInput.value.trim();
          if (!val) return;
          const newId = 'custom-' + Date.now();
          currentTopics.push({ id: newId, title: val });
          newTopicInput.value = '';
          renderEditorList();
        };
      }

      const btnSaveTopics = document.getElementById('btn-save-topics');
      if (btnSaveTopics) {
        btnSaveTopics.onclick = () => {
          Storage.saveCustomTopics(courseId, currentTopics);
          delete CourseService.lessonsCache[courseId];
          alert('Konu çizelgesi başarıyla kaydedildi!');
          window.location.reload();
        };
      }

      const btnResetTopics = document.getElementById('btn-reset-topics');
      if (btnResetTopics) {
        btnResetTopics.onclick = () => {
          if (confirm('Varsayılan müfredat konu sıralamasına dönmek istediğinize emin misiniz?')) {
            Storage.resetCustomTopics(courseId);
            delete CourseService.lessonsCache[courseId];
            window.location.reload();
          }
        };
      }
    }

    // 6. Copy Code Buttons
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      btn.onclick = (e) => {
        const codeEl = e.target.previousElementSibling;
        if (codeEl) {
          navigator.clipboard.writeText(codeEl.textContent);
          btn.textContent = '✓ Kopyalandı!';
          setTimeout(() => { btn.textContent = '📋 Kopyala'; }, 2000);
        }
      };
    });
  },

  async renderLessonView(courseId, lessonId) {
    return this.renderCourseDetailView(courseId, lessonId);
  },

  async renderProjectsView() {
    this.renderSkeleton(this.appContainer);
    const projects = await CourseService.loadProjects();
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Projeler', hash: '#projects' }]);

    let html = `${breadcrumbHTML}<div class="page-header"><h1>🛠 Proje Ağacı ve Rehberi</h1></div><div class="projects-grid">`;
    projects.forEach(p => {
      html += `
        <div class="project-card">
          <span class="badge badge-${p.levelBadge}">${p.levelTitle}</span>
          <h3>${Utils.escapeHTML(p.title)}</h3>
          <p>${Utils.escapeHTML(p.summary)}</p>
        </div>
      `;
    });
    html += `</div>`;
    this.appContainer.innerHTML = html;
  },

  async renderQuizzesView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Quizler', hash: '#quizzes' }]);
    let html = `${breadcrumbHTML}<div class="page-header"><h1>🧠 Etkileşimli Quizler</h1></div>`;
    this.appContainer.innerHTML = html;
  },

  async renderHardwareDiagView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Teknik Bilimler & Donanım', hash: '#hardware-diag' }
    ]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>🏛️ Ardahan Teknik Bilimler MYO & Sistem Donanım Rehberi</h1>
        <p>Bilgisayar Programcılığı Programı resmî bölüm künyesi, laboratuvar olanakları ve donanım altyapısı.</p>
      </div>

      <!-- 🏛️ RESMÎ BÖLÜM KÜNYESİ VE OLANAKLARI -->
      <section class="section-block">
        <div class="official-dept-card">
          <div class="odc-header text-center">
            <span class="badge badge-primary" style="margin-bottom:8px;">🏛️ ARDAHAN ÜNİVERSİTESİ</span>
            <h2>Teknik Bilimler MYO - Bilgisayar Programcılığı</h2>
            <p>2009'dan günümüze bilişim sektörüne uzman yazılımcı ve bilgisayar teknikerleri yetiştiren resmî program bilgileri:</p>
          </div>

          <div class="odc-grid">
            <div class="odc-box">
              <h4>🏛️ Kuruluş & Tarihçe</h4>
              <p>2009-2010 eğitim-öğretim yılında Ardahan MYO bünyesinde kurulmuş, 2011-2012'den itibaren <strong>Ardahan Teknik Bilimler MYO</strong> bünyesinde eğitim vermektedir.</p>
            </div>

            <div class="odc-box">
              <h4>🎓 Derece & Yeterlilik</h4>
              <p>Mezunlara <strong>Bilgisayar Programcılığı Ön Lisans Diploması</strong> verilir (TÇYY 5. Düzey / Tam Zamanlı). 120 AKTS, en az 2.00 AGNO ve <strong>6 hafta (30 iş günü) zorunlu yaz stajı</strong> tamamlanmalıdır.</p>
            </div>

            <div class="odc-box">
              <h4>💻 Bölüm Laboratuvar Olanakları</h4>
              <p>Yüksekokul bünyesinde <strong>2 adet 40+1 kişilik</strong> masaüstü labı, <strong>25+1 kişilik</strong> laptop labı, İFB bünyesinde <strong>48+1 kişilik</strong> lab ve <strong>Bilişim Kulübü</strong> imkânı sunulur.</p>
            </div>

            <div class="odc-box">
              <h4>🎓 DGS Lisans Geçiş Olanağı</h4>
              <p>Mezunlar DGS sınavı ile <strong>Bilgisayar, Yazılım, Bilişim Sistemleri Mühendislikleri</strong>, YBS, Bilgisayar Bilimleri ve BÖTE lisans bölümlerine dikey geçiş yapabilir.</p>
            </div>
          </div>

          <div class="odc-footer-actions text-center" style="margin-top:20px;">
            <a href="https://tby.ardahan.edu.tr/uploads/u23/f200/0d44ad5acdc74037b77e1f4675b4fda7.pdf" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
              📄 Resmî Öğretim Planı (PDF) ➔
            </a>
            <a href="https://tby.ardahan.edu.tr/sayfa/bolum-danismanlari-7294-23-c7abc9ff-b8d2-42f4-8c2f-1fe759a2be90" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="margin-left:8px;">
              👨‍🏫 Bölüm Danışmanları Listesi ➔
            </a>
          </div>
        </div>
      </section>
    `;
    this.appContainer.innerHTML = html;
  },

  async renderCareerView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Kariyer & Staj', hash: '#career' }]);
    
    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>Staj ve Kariyer Rehberi</h1>
        <p>Bilgisayar Programcılığı zorunlu yaz stajı süreci, başvuru belgeleri, iş akış şeması ve mezuniyet sonrası kariyer olanakları.</p>
      </div>

      <div class="career-page-grid">
        <!-- 1. ADIM ADIM STAJ REHBERİ -->
        <div class="career-section-card highlight-card">
          <h3>Staj Süreci ve Uygulama Adımları (30 İş Günü)</h3>
          <p>Öğrencilerin mezuniyet öncesinde yapmaları gereken 30 iş günlük (6 hafta) zorunlu yaz stajının başvuru ve uygulama adımları:</p>

          <div class="staj-steps-timeline">
            <!-- ADIM 1 -->
            <div class="staj-step-item">
              <div class="step-badge">ADIM 1</div>
              <div class="step-content">
                <h4>Staj Yeri Tespiti ve Kurum Onayı</h4>
                <p>Bünyesinde Bilgi İşlem, Yazılım Geliştirme, Web Tasarımı, Veritabanı veya Ağ Altyapısı birimi bulunan kurum ve şirketler tercih edilmelidir.</p>
              </div>
            </div>

            <!-- ADIM 2 -->
            <div class="staj-step-item">
              <div class="step-badge">ADIM 2</div>
              <div class="step-content">
                <h4>Başvuru Formu ve İş Yeri Sözleşmesi Doldurma</h4>
                <p>Üniversitenin resmî staj otomasyon sistemi üzerinden Staj Kabul Başvuru Formu ile İş Yeri Staj Sözleşmesi doldurularak çıktı alınır ve kurum yetkilisine onaylatılır.</p>
                <div class="step-action-row">
                  <a href="https://ardahan.edu.tr/staj" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                    Staj Başvuru Formu ve Sözleşmesi (ardahan.edu.tr/staj)
                  </a>
                </div>
              </div>
            </div>

            <!-- ADIM 3 -->
            <div class="staj-step-item">
              <div class="step-badge">ADIM 3</div>
              <div class="step-content">
                <h4>Danışman Onayı ve SGK İşlemleri</h4>
                <p>Onaylanan belgeler belirlenen tarihlerde Program Danışmanına teslim edilir. Öğrencinin staj sigortası (SGK) üniversite tarafından başlatılır.</p>
                <div class="step-action-row">
                  <a href="https://tby.ardahan.edu.tr/Files/ckFiles/tby-ardahan-edu-tr/staj/2025_2026_Yaz_Donemi_Staj_Bilgileri.pdf" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Staj İlanı ve Duyuru Metni (PDF)
                  </a>
                </div>
              </div>
            </div>

            <!-- ADIM 4 -->
            <div class="staj-step-item">
              <div class="step-badge">ADIM 4</div>
              <div class="step-content">
                <h4>30 İş Günü Saha Uygulaması ve Defter Doldurma</h4>
                <p>Staj süresince gerçekleştirilen teknik çalışmalar günlük olarak staj defterine işlenir ve kurumundaki sorumlu uzmana imzalatılır.</p>
                <div class="step-action-row">
                  <a href="https://tby.ardahan.edu.tr/Files/ckFiles/tby-ardahan-edu-tr/staj/tbmyo_staj_defteri.docx" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Staj Defteri Şablonu (.docx)
                  </a>
                  <a href="https://tby.ardahan.edu.tr/Files/ckFiles/tby-ardahan-edu-tr/staj/Bilgisayar%20Programc%C4%B1l%C4%B1%C4%9F%C4%B1%20Program%C4%B1%20Staj%20Dosyas%C4%B1%20%C3%96rne%C4%9Fi.pdf" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Doldurulmuş Örnek Staj Defteri (PDF)
                  </a>
                </div>
              </div>
            </div>

            <!-- ADIM 5 -->
            <div class="staj-step-item">
              <div class="step-badge">ADIM 5</div>
              <div class="step-content">
                <h4>Staj Defteri ve Değerlendirme Formu Teslimi</h4>
                <p>Staj dönemi sonunda hazırlanan staj defteri ile kapalı/mühürlü zarftaki Öğrenci Staj Değerlendirme Formu Program Danışmanına teslim edilir.</p>
                <div class="step-action-row">
                  <a href="https://tby.ardahan.edu.tr/Files/ckFiles/tby-ardahan-edu-tr/staj/ogrenci_staj_degerlendirme_formu.pdf" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Öğrenci Staj Değerlendirme Formu (PDF)
                  </a>
                  <a href="https://ardahan.edu.tr/dosyalar/icerik/tbmyo/staj_uygulama_esaslari/bilgisayar_staj_uygulama_esaslari.docx" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                    Staj Uygulama Esasları Yönergesi (.docx)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. BİLGİSAYAR PROGRAMCILIĞI STAJ İŞ AKIŞ ŞEMASI GÖRSELİ -->
        <div class="career-section-card staj-flow-card">
          <h3>Staj İş Akış Şeması</h3>
          <p>Staj başvurusundan teslim aşamasına kadar izlenen resmî süreç adımları:</p>
          <div class="staj-flow-img-wrapper" style="margin-top:16px; text-align:center;">
            <img src="stajisakis.jpg" alt="Staj İş Akış Şeması" class="staj-flow-img" style="max-width:100%; height:auto; border-radius:8px; border:1px solid var(--border-color); box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          </div>
        </div>

        <!-- 3. İSTİHDAM VE UNVANLAR -->
        <div class="career-section-card">
          <h3>Mezunların Çalışma Alanları</h3>
          <p>Bilgisayar Programcılığı programı mezunları aşağıdaki alanlarda tekniker ve yazılımcı olarak görev yapabilirler:</p>
          <ul class="styled-list">
            <li><strong>Yazılım Sektörü:</strong> Yazılım Geliştirici, Web / Mobil / Veritabanı Uzmanı.</li>
            <li><strong>Teknik Servis ve Donanım:</strong> Bilgisayar firmalarında Donanım ve Sistem Destek Elemanı.</li>
            <li><strong>Kurumsal Bilgi İşlem:</strong> Kamu ve özel sektör kuruluşlarında Bilgi İşlem Görevlisi.</li>
            <li><strong>Ağ ve Sunucu Yönetimi:</strong> Ağ Kurulum ve Sistem Bakım Elemanı.</li>
          </ul>
        </div>

        <!-- 4. DGS LİSANS GEÇİŞİ -->
        <div class="career-section-card">
          <h3>DGS ile Geçiş Yapılabilen Lisans Programları</h3>
          <p>Ön lisans mezunları Dikey Geçiş Sınavı (DGS) ile aşağıdaki 4 yıllık lisans ve mühendislik programlarına geçiş yapabilirler:</p>
          <div class="dgs-chips-grid">
            <span class="badge badge-primary">Bilgisayar Mühendisliği</span>
            <span class="badge badge-primary">Yazılım Mühendisliği</span>
            <span class="badge badge-primary">Bilişim Sistemleri Mühendisliği</span>
            <span class="badge badge-info">Yönetim Bilişim Sistemleri (YBS)</span>
            <span class="badge badge-info">Bilgi Teknolojileri</span>
            <span class="badge badge-info">Bilişim Sistemleri ve Teknolojileri</span>
            <span class="badge badge-secondary">Bilgisayar Bilimleri</span>
            <span class="badge badge-secondary">İstatistik ve Bilgisayar Bilimleri</span>
            <span class="badge badge-secondary">Bilgisayar ve Öğretim Teknolojileri Öğretmenliği (BÖTE)</span>
            <span class="badge badge-outline">Uygulamalı Matematik ve Bilgisayar</span>
            <span class="badge badge-outline">Uzay Mühendisliği</span>
            <span class="badge badge-outline">Meteoroloji Mühendisliği</span>
          </div>
        </div>

        <!-- 5. BÖLÜM OLANAKLARI -->
        <div class="career-section-card">
          <h3>Bölüm Laboratuvarları ve İmkanları</h3>
          <p>Teknik Bilimler MYO bünyesindeki uygulama altyapısı:</p>
          <ul class="styled-list">
            <li><strong>Bilgisayar Laboratuvarları:</strong> 40+1 kapasiteli 2 adet masaüstü labı, 25+1 kapasiteli dizüstü bilgisayar labı.</li>
            <li><strong>Fakülte Ortak Labı:</strong> İnsani Bilimler ve Edebiyat Fakültesi binasında 48+1 kapasiteli bilgisayar labı.</li>
            <li><strong>Bilişim Kulübü:</strong> Öğrenci etkinlikleri ve teknik gelişim atölyeleri.</li>
          </ul>
        </div>
      </div>
    `;
    this.appContainer.innerHTML = html;
  },

  async renderUniversityView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Üniversite', hash: '#university' }]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>Üniversite ve Akademik Bilgiler</h1>
        <p>Ardahan Üniversitesi, Teknik Bilimler MYO, Öğrenci İşleri ve akademik yönetmelik rehberi.</p>
      </div>

      <div class="university-page-grid">
        <!-- 1. AKADEMİK BİRİM VE KURUM BİLGİLERİ -->
        <div class="uni-section-card">
          <h3>Kurumsal Bilgiler ve Akademik Birim</h3>
          <div class="uni-info-list">
            <div class="uni-info-item">
              <strong>Ardahan Üniversitesi:</strong> 2008 yılında kurulan, Yenisey Kampüsü'nde modern eğitim tesisleriyle hizmet veren devlet üniversitesidir.
            </div>
            <div class="uni-info-item">
              <strong>Fakülte / Yüksekokul:</strong> Teknik Bilimler Meslek Yüksekokulu (TBMYO).
            </div>
            <div class="uni-info-item">
              <strong>Bağlı Bölüm:</strong> Bilgisayar Teknolojileri Bölümü — Bilgisayar Programcılığı Programı.
            </div>
            <div class="uni-info-item">
              <strong>Akademik Personel ve Danışmanlık:</strong> Her öğrenciye dönem başında ders seçimi, muafiyet ve akademik süreçlerde rehberlik eden bir Program Danışmanı atanır. Öğrenci belgesi, transkript ve resmi işlemler TBMYO Öğrenci İşleri Bürosu ve UBYS sistemi üzerinden yürütülür.
            </div>
          </div>
        </div>

        <!-- 2. ÖĞRENCİNİN BİLMESİ GEREKENLER (PROSEDÜRLER) -->
        <div class="uni-section-card">
          <h3>Öğrencinin Bilmesi Gereken Resmî Süreçler</h3>
          <div class="procedures-grid">
            <div class="proc-card">
              <h4>Ders Kayıt ve Ekle-Bırak (UBYS)</h4>
              <p>Her yarıyıl başında ilan edilen tarihlerde UBYS üzerinden ders seçimi yapılır ve danışman onayına gönderilir. Dönemin ilk haftasında ders ekleme/bırakma hakkı bulunur.</p>
              <div style="margin-top:10px;">
                <a href="https://ubys.ardahan.edu.tr/" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                  UBYS Giriş Portalı (ubys.ardahan.edu.tr)
                </a>
              </div>
            </div>
            <div class="proc-card">
              <h4>Mazeret ve Tek Ders Sınavı</h4>
              <p>Sağlık raporu veya haklı mazereti olan öğrenciler 5 iş günü içinde dilekçe vererek mazeret sınavına girebilir. Mezuniyet aşamasında tek dersi kalanlar için Tek Ders Sınavı düzenlenir.</p>
            </div>
            <div class="proc-card">
              <h4>Akademik İzin ve Kayıt Dondurma</h4>
              <p>Haklı ve geçerli nedenlerle öğrenimine ara vermek isteyen öğrenciler, yarıyıl başlangıcından itibaren 15 gün içinde dilekçe vererek 1 veya 2 yarıyıl kayıt dondurabilir.</p>
            </div>
            <div class="proc-card">
              <h4>Transkript ve Öğrenci Belgesi</h4>
              <p>İmzalı ve karekodlu öğrenci belgesi ile transkript (not dökümü) e-Devlet kapısı veya UBYS otomasyonu üzerinden anında ücretsiz olarak alınabilir.</p>
            </div>
            <div class="proc-card">
              <h4>Mezuniyet İşlemleri</h4>
              <p>120 AKTS kredisini, en az 2.00 AGNO ortalamasını ve 30 iş günü zorunlu stajını tamamlayan öğrenciler ilişik kesme belgesini onaylatarak diplomasını teslim alır.</p>
            </div>
          </div>
        </div>

        <!-- 3. ÜNİVERSİTE OLANAKLARI VE DİJİTAL HİZMETLER -->
        <div class="uni-section-card">
          <h3>Üniversite Olanakları ve Bilişim Hizmetleri</h3>
          <p>Ardahan Üniversitesi öğrencilerine sunulan resmî kampüs imkânları ve dijital servisler:</p>

          <div class="procedures-grid">
            <div class="proc-card">
              <h4>Ücretsiz Kampüs İnterneti (ARU-WIFI & eduroam)</h4>
              <p>Yenisey Kampüsü genelinde kesintisiz kablosuz internet sunulmaktadır. UBYS şifreniz ile Wi-Fi aktivasyonu yapıp <strong>ARU-WIFI</strong> ve uluslararası <strong>eduroam</strong> ağlarına ücretsiz bağlanabilirsiniz.</p>
              <div style="margin-top:10px;">
                <a href="https://kayit.ardahan.edu.tr/" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                  Wi-Fi Kayıt & Aktivasyon (kayit.ardahan.edu.tr)
                </a>
              </div>
            </div>

            <div class="proc-card">
              <h4>Kurumsal E-Posta (.edu.tr Mail) Girişi</h4>
              <p>Tüm öğrencilere <code>ogrencino@ardahan.edu.tr</code> uzantılı e-posta adresi tanımlanır. Bu mail adresi ile <strong>GitHub Student Developer Pack, JetBrains, Microsoft 365</strong> lisansları ücretsiz alınabilir.</p>
              <div style="margin-top:10px;">
                <a href="https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=4765445b-32c6-49b0-83e6-1d93765276ca&redirect_uri=https%3A%2F%2Fwww.microsoft365.com%2Flandingv2&response_type=code%20id_token&scope=openid%20profile%20https%3A%2F%2Fwww.office.com%2Fv2%2FOfficeHome.All&response_mode=form_post&nonce=639230753191203206.OTQ3ZDc2ZTgtZDcwMC00NTdhLWExOWUtYjllNDlmNjVjODgwYmI4OTNhYmYtY2JjMi00ODA4LThhYTItZWFmMTVmNzk1OWNl&ui_locales=tr-TR&mkt=tr-TR&client-request-id=feede350-8886-4f84-99ee-b5e70f6a62e0&siwa=1&siwg=1&state=DAEgQa30cn8JkINaw4jrS-pI6hcvJ9UCL8GfdHPOYEKFgf-YCxBL5nPZvJtr37uFRMro_ueIC1K8T18bmbRFZs0olisXJShVDaKx8KBcmRP7HVi3eddjTBv80_ugdV-OIdzpuDXSU3kPm1cUws4tPTac_j2zHtYhcajVHiLwmrBE1qzHoUZ8hcANDmMSYhVbhGzbpU0xqiEfltJp-i5qF4Z8bdiHifZJTX9TGUASB8vnfuH1UczLNH7KLEONib62JMsUKkOlyWG4Z0AqZcMwzfz4o-rpq7_7X3-gKnRTmCutszejfRBR97Q5FylywzIlloMkI6AzLv58HGMmy8zkHrmvy5YIb-CWJ8MkZiTxuIK_qkQ5I5fyqJvuAXjEgAr6rxQTVnFAe_a6B8hw6wU_BfwdCPNJ-_uv5yWR29kOQxLGUVz1q4xHgYbHaM3s7a-c0Th2mGFR7TzglYctTy4E9w&x-client-SKU=ID_NET8_0&x-client-ver=8.16.0.0" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                  Microsoft 365 / Öğrenci E-Posta Girişi
                </a>
              </div>
            </div>

            <div class="proc-card">
              <h4>Merkez Kütüphane ve Veri Tabanları</h4>
              <p>Sessiz çalışma salonları, grup çalışma odaları ile ULAKBİM, IEEE, ScienceDirect gibi ulusal ve uluslararası akademik veri tabanlarına kampüs içi/dışı ücretsiz erişim imkânı sağlanmaktadır.</p>
            </div>

            <div class="proc-card">
              <h4>Yemekhane ve Kartlı Geçiş</h4>
              <p>Kampüs ana yemekhanesinde her gün hijyenik 4 kap sıcak öğle ve akşam yemeği uygun öğrenci fiyatlarıyla sunulur. Akıllı öğrenci kartı veya online bakiye yükleme ile faydalanılır.</p>
            </div>

            <div class="proc-card">
              <h4>Spor Tesisleri ve Öğrenci Kulüpleri</h4>
              <p>Kapalı spor salonu, tırmanma duvarı, açık saha ve fitness merkezinin yanı sıra Bilişim Kulübü dahil öğrenci topluluk faaliyetleri desteklenmektedir.</p>
            </div>
          </div>
        </div>

        <!-- 4. YÖNETMELİKLER — "BUNU BİLMEN ÖNEMLİ" ÖZET KARTLARI -->
        <div class="uni-section-card highlight-card">
          <h3>Bunu Bilmen Önemli (Yönetmelik Özetleri)</h3>
          <p>Uzun resmî mevzuat belgeleri yerine bilmeniz gereken temel kurallar özeti:</p>

          <div class="important-rules-grid">
            <div class="rule-summary-card">
              <span class="rule-tag">Devam Zorunluluğu</span>
              <h4>Derslere Katılım Şartı</h4>
              <p>Teorik derslerin <strong>%70'ine</strong>, laboratuvar ve uygulama derslerinin <strong>%80'ine</strong> devam etmek zorunludur. Devamsızlıktan kalan öğrenciler finale giremez.</p>
            </div>

            <div class="rule-summary-card">
              <span class="rule-tag">Sınav Sistemi</span>
              <h4>Not Etki Oranları</h4>
              <p>Ders başarı notu hesaplanırken vize sınavının <strong>%40'ı</strong> ve yarıyıl sonu (final/bütünleme) sınavının <strong>%60'ı</strong> alınır. Finalden en az 50 alma şartı bulunur.</p>
            </div>

            <div class="rule-summary-card">
              <span class="rule-tag">AGNO ve Başarı</span>
              <h4>Genel Not Ortalaması</h4>
              <p>Dönem sonu AGNO'su <strong>2.00 ve üzeri</strong> olan öğrenciler başarılı sayılır. AGNO 2.00'ın altına düşerse öğrenci koşullu geçer dersleri tekrar alabilir.</p>
            </div>

            <div class="rule-summary-card">
              <span class="rule-tag">Mezuniyet Şartı</span>
              <h4>Ön Lisans Diploması</h4>
              <p>Toplam <strong>120 AKTS</strong> ders kredisini başarmak, AGNO'yu en az <strong>2.00</strong> yapmak ve <strong>30 iş günü zorunlu yaz stajını</strong> tamamlamak şarttır.</p>
            </div>

            <div class="rule-summary-card">
              <span class="rule-tag">Disiplin Kuralları</span>
              <h4>Öğrenci Yükümlülükleri</h4>
              <p>Sınavlarda kopya çekmek, akademik intihal yapmak ve kampus huzurunu bozmak disiplin soruşturması sebebidir. Öğrencilerin itiraz ve savunma hakları saklıdır.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    this.appContainer.innerHTML = html;
  },

  async renderCityGuideView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Şehir Rehberi', hash: '#city' }]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>Ardahan Öğrenci Hayatta Kalma Rehberi</h1>
        <p>Ardahan Üniversitesi'ne yeni gelen öğrenciler için şehir yaşamı, ulaşım, barınma, günlük ihtiyaçlar ve sağlık kılavuzu.</p>
      </div>

      <div class="city-guide-grid">

        <!-- 1. ULAŞIM VE GÜZERGÂHLAR -->
        <div class="city-section-card">
          <h3>🚌 Ulaşım ve Güzergâh Rehberi</h3>
          <div class="transport-routes-grid">
            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Dolmuş Hatları</span>
                <h4>Şehir Merkezi ➔ Yenisey Kampüsü</h4>
                <p>Şehir merkezinden ve Otogar durağından her 10-15 dakikada bir hareket eden <strong>Kampüs Dolmuşları</strong> ile 10-15 dakikada üniversiteye ulaşabilirsiniz.</p>
              </div>
              <a href="https://maps.app.goo.gl/85kDHUSRVygXArv7A" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Kampüs) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Otogar Ulaşımı</span>
                <h4>Ardahan Şehirlerarası Otogarı</h4>
                <p>Otogardan kampüse ve şehir merkezine halk dolmuşları ve ticari taksiler kesintisiz hizmet vermektedir.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Şehirlerarası+Otobüs+Terminali" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Otogar) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Havalimanı</span>
                <h4>Kars Harakani Havalimanı ➔ Ardahan</h4>
                <p>Ardahan'a en yakın havalimanı Kars'tadır (yaklaşık 90 km). Uçak iniş saatlerine göre havalimanından Ardahan otogara doğrudan seyahat servisleri kalkmaktadır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Kars+Harakani+Havalimanı" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Havalimanı) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Otobüs & Taksi</span>
                <h4>Şehirlerarası Ulaşım ve Taksi Durakları</h4>
                <p>Büyük şehirlere otobüs seferleri mevcuttur. Kampüs nizamiye çıkışında ve şehir merkezinde 24 saat taksi durakları hizmet vermektedir.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Taksi+Durakları" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Taksi) ➔
              </a>
            </div>
          </div>
        </div>

        <!-- 2. BARINMA REHBERİ -->
        <div class="city-section-card">
          <h3>🏠 Barınma Rehberi (Yurtlar ve Ev Kiralama)</h3>
          <p class="muted-note">Önemli: Kira fiyatları ve yurt ücretleri dönemsel olarak değiştiğinden tercih öncesinde resmî kurumlar üzerinden <strong>güncel fiyatları kontrol etmeniz</strong> önerilir.</p>
          
          <div class="housing-grid">
            <div class="house-card">
              <div class="house-body">
                <h4>KYK Öğrenci Yurtları</h4>
                <p>Kampüs içerisinde ve şehir merkezinde Kredi ve Yurtlar Kurumu'na (GSB) bağlı kız ve erkek öğrenci yurtları yer almaktadır. Yemek, internet ve güvenlik imkânları mevcuttur.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+KYK+Öğrenci+Yurdu" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (KYK) ➔
              </a>
            </div>

            <div class="house-card">
              <div class="house-body">
                <h4>Özel Yurtlar ve Apartlar</h4>
                <p>Şehir merkezinde ve kampüse yakın güzergâhlarda tek veya çok kişilik özel öğrenci apartları ve yurt seçenekleri bulunmaktadır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Özel+Öğrenci+Yurtları+ve+Apartlar" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Özel Yurt) ➔
              </a>
            </div>

            <div class="house-card">
              <div class="house-body">
                <h4>Ev Kiralarken Dikkat Edilmesi Gerekenler</h4>
                <p>Kiralık ev ararken <strong>ısıtma sistemine (merkezi sistem / kombi)</strong>, binanın ısı yalıtımına, yakıt aidat giderlerine ve dolmuş durağına yakınlığına dikkat edilmelidir.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Kongre+Caddesi" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Şehir Merkezi) ➔
              </a>
            </div>
          </div>
        </div>

        <!-- 3. GÜNLÜK İHTİYAÇLAR -->
        <div class="city-section-card">
          <h3>🛒 Günlük İhtiyaçlar ve Şehir Rehberi</h3>
          <div class="daily-needs-grid">
            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">🛒</span>
                <div>
                  <h4>Marketler ve Alışveriş</h4>
                  <p>Şehir merkezinde tüm zincir marketler (A101, BİM, Şok, Migros) ve yerel gıda pazarları mevcuttur.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Marketler" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>

            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">🏧</span>
                <div>
                  <h4>Bankalar ve ATM'ler</h4>
                  <p>Yenisey Kampüsü içinde Ziraat Bankası, Halkbank ve VakıfBank ATM'leri bulunur. Şehir merkezinde tüm banka şubeleri yer alır.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Bankalar+ve+ATMler" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>

            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">🖨️</span>
                <div>
                  <h4>Kırtasiye ve Fotokopi</h4>
                  <p>Kampüs içi kantinlerde ve şehir merkezinde ders notları için fotokopi ve çıktı alma noktaları mevcuttur.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Kırtasiye" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>

            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">💻</span>
                <div>
                  <h4>Telefon & Bilgisayar Servisleri</h4>
                  <p>Yazılım ve donanım donatım ihtiyaçları için şehir merkezinde teknik servisler ve telefon satıcıları hizmet vermektedir.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Bilgisayar+ve+Telefon+Servisleri" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>

            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">🍲</span>
                <div>
                  <h4>Yemek ve Kafeler</h4>
                  <p>Kongre Caddesi üzerindeki restoranlarda yöresel lezzetler (Ardahan Kaşarı, Cağ Kebabı, Mantı) ve öğrenci kafeleri yer alır.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Kongre+Caddesi+Restoran+ve+Kafeler" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>

            <div class="need-box">
              <div class="need-content">
                <span class="need-icon">📦</span>
                <div>
                  <h4>Kargo Şubeleri</h4>
                  <p>Trendyol, PTT Kargo, Aras, Yurtiçi ve MNG Kargo şubeleri kampüse kargo teslimatı yapmaktadır.</p>
                </div>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Kargo+Şubeleri" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster ➔
              </a>
            </div>
          </div>
        </div>

        <!-- 4. SAĞLIK HİZMETLERİ -->
        <div class="city-section-card">
          <h3>🏥 Sağlık Hizmetleri</h3>
          <div class="health-grid">
            <div class="health-card">
              <div class="health-body">
                <h4>Ardahan Devlet Hastanesi</h4>
                <p>Şehir merkezinde tam teşekküllü hizmet veren devlet hastanesi ve Acil Servis ünitesi bulunmaktadır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Devlet+Hastanesi" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Hastane) ➔
              </a>
            </div>

            <div class="health-card">
              <div class="health-body">
                <h4>Aile Sağlığı Merkezleri ve Eczaneler</h4>
                <p>Öğrenciler ikametgâhlarını taşıyarak Aile Hekimliği hizmetlerinden faydalanabilirler. Şehir merkezinde nöbetçi eczaneler 24 saat açıktır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Eczaneleri" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Eczaneler) ➔
              </a>
            </div>

            <div class="health-card">
              <div class="health-body">
                <h4>Kampüs İçi Sağlık / Mediko</h4>
                <p>Yenisey Kampüsü Sağlık, Kültür ve Spor Daire Başkanlığı (SKS) bünyesinde öğrencilere yönelik revir ve ilk yardım birimi hizmet vermektedir.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Üniversitesi+SKS" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Mediko) ➔
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    this.appContainer.innerHTML = html;
  }
};