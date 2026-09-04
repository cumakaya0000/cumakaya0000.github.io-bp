/**
 * BP Rehberi - Arayüz ve Sayfa Şablonları Motoru (ui.js)
 * V2.0: Bütünsel BP Öğrenci Rehberi Ana Sayfası (11 Adımlı Mimari)
 */
import { CourseService } from './courses.js';
import { Storage } from './storage.js';
import { Utils } from './utils.js';
import { QuizEngine } from './quiz.js';
import { UniversityService } from './university.js';

export const UI = {
  appContainer: null,
  heroSliderTimer: null,

  init() {
    this.appContainer = document.getElementById('app-content');
  },

  /**
   * V2.0: BÜTÜNLEŞİK DASHBOARD GÖRÜNÜMÜ (#dashboard / #home)
   */
  async renderDashboardView() {
    this.renderSkeleton(this.appContainer);

    const user = Storage.getUserProfile();
    const uni = await UniversityService.getUniversityById(user.universityId);
    const curr = await UniversityService.getCurriculumForUniversity(user.universityId);
    const stats = Storage.getExamStats();
    const recent = Storage.getRecentlyViewed();
    const coursesInfo = await CourseService.loadCourses();

    const totalLessons = await CourseService.getTotalV1LessonsCount();
    const globalProgressPercent = Storage.getGlobalProgress(totalLessons, user.universityId);

    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Dashboard', hash: '#dashboard' }]);

    const lastItem = recent.length > 0 ? recent[0] : null;

    let html = `
      ${breadcrumbHTML}
      <div class="dashboard-page-container">
        <!-- KARŞILAMA VE PROFİL BANNER -->
        <div class="dashboard-welcome-banner">
          <div class="dashboard-user-info">
            <h1>Merhaba, ${Utils.escapeHTML(user.name || 'Bilgisayar Programcısı')} 👋</h1>
            <p>
              <i data-lucide="building-2" style="width:20px; height:20px; color:var(--accent-primary);"></i>
              <strong>${Utils.escapeHTML(user.university || 'Ardahan Üniversitesi')}</strong> — ${Utils.escapeHTML(user.department || 'Bilgisayar Programcılığı')} (${user.semester || 1}. Yarıyıl)
            </p>
          </div>
          <div class="dashboard-banner-actions" style="display:flex; gap:10px; flex-wrap:wrap;">
            <a href="#universities" class="btn btn-outline btn-sm"><i data-lucide="refresh-cw"></i> Üniversite Değiştir</a>
            <a href="#weekly-plan" class="btn btn-primary btn-sm"><i data-lucide="calendar"></i> Haftalık Plan</a>
            <a href="#compare" class="btn btn-secondary btn-sm"><i data-lucide="git-compare"></i> Müfredat Karşılaştır</a>
          </div>
        </div>

        <!-- İSTATİSTİK VE İLERLEME KARTLARI -->
        <div class="dashboard-stats-grid">
          <div class="dash-stat-card">
            <div class="dash-stat-icon"><i data-lucide="bar-chart-2"></i></div>
            <div class="dash-stat-info">
              <h3>%${globalProgressPercent}</h3>
              <p>Genel Müfredat İlerlemesi</p>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="dash-stat-icon"><i data-lucide="file-check"></i></div>
            <div class="dash-stat-info">
              <h3>${stats.totalSolved} Sınav</h3>
              <p>Başarı Oranı: %${stats.overallSuccessRate}</p>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="dash-stat-icon"><i data-lucide="award"></i></div>
            <div class="dash-stat-info">
              <h3>${Utils.escapeHTML(stats.strongestCourse)}</h3>
              <p>En Güçlü Ders</p>
            </div>
          </div>

          <div class="dash-stat-card">
            <div class="dash-stat-icon"><i data-lucide="compass"></i></div>
            <div class="dash-stat-info">
              <h3>${curr ? (curr.semesters || []).reduce((acc, s) => acc + (s.courses || []).length, 0) : 12} Ders</h3>
              <p>Aktif Müfredat Ders Sayısı</p>
            </div>
          </div>
        </div>

        <!-- KALDIĞIN YERDEN DEVAM ET & HIZLI ERİŞİM -->
        <div class="dashboard-content-grid" style="display:grid; grid-template-columns: 2fr 1fr; gap:24px; margin-bottom:28px;">
          <div class="dash-left-col">
            ${lastItem ? `
              <div class="card glass-card" style="padding:24px; margin-bottom:24px; border-left: 4px solid var(--accent-primary);">
                <h3 style="margin-top:0; font-size:1.15rem; display:flex; align-items:center; gap:10px;">
                  <i data-lucide="play-circle" style="color:var(--accent-primary);"></i> Kaldığın Yerden Devam Et
                </h3>
                <p style="color:var(--text-secondary); margin:8px 0;"><strong>${Utils.escapeHTML(lastItem.title)}</strong></p>
                <a href="${lastItem.hash}" class="btn btn-primary btn-sm" style="display:inline-flex; align-items:center; gap:8px;">
                  Derse Git →
                </a>
              </div>
            ` : ''}

            <!-- HIZLI AKSİYON KARTLARI -->
            <h3 style="margin-bottom:16px; font-size:1.2rem;">🚀 Hızlı Öğrenme Araçları</h3>
            <div class="quick-cards-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
              <a href="#curriculum" class="card glass-card hover-lift" style="padding:20px; text-decoration:none; color:inherit;">
                <div style="font-size:1.5rem; margin-bottom:8px;">📚</div>
                <h4 style="margin:0 0 4px 0; color:var(--text-primary);">Müfredatım</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Dönemlik ders yapısı & AKTS</p>
              </a>

              <a href="#weekly-plan" class="card glass-card hover-lift" style="padding:20px; text-decoration:none; color:inherit;">
                <div style="font-size:1.5rem; margin-bottom:8px;">📅</div>
                <h4 style="margin:0 0 4px 0; color:var(--text-primary);">Haftalık Plan</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">1-14 hafta konu çizelgesi</p>
              </a>

              <a href="#exams" class="card glass-card hover-lift" style="padding:20px; text-decoration:none; color:inherit;">
                <div style="font-size:1.5rem; margin-bottom:8px;">📝</div>
                <h4 style="margin:0 0 4px 0; color:var(--text-primary);">Sınav Sistemi</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Quiz, Vize & Final denemeleri</p>
              </a>

              <a href="#compare" class="card glass-card hover-lift" style="padding:20px; text-decoration:none; color:inherit;">
                <div style="font-size:1.5rem; margin-bottom:8px;">⚖️</div>
                <h4 style="margin:0 0 4px 0; color:var(--text-primary);">Müfredat Karşılaştır</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Diğer üniversiteler ile kıyasla</p>
              </a>
            </div>
          </div>

          <!-- ENTEGRE ESKİ HOME SAĞ SÜTUN (DUYURULAR & REHBER İPUÇLARI) -->
          <div class="dash-right-col">
            <div class="card glass-card" style="padding:20px; margin-bottom:20px;">
              <h4 style="margin-top:0; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
                <i data-lucide="sparkles" style="color:var(--color-warning);"></i> Rehber İpucu
              </h4>
              <p style="font-size:0.9rem; color:var(--text-secondary); line-height:1.5;">
                Bilgisayar Programcılığı 2 yıllık süreci hızla geçer. Derslerin yanı sıra <strong>Kod Laboratuvarı</strong> ve <strong>Proje Havuzu</strong> sayfalarından pratik yapmayı unutma!
              </p>
            </div>

            <div class="card glass-card" style="padding:20px;">
              <h4 style="margin-top:0; font-size:1.05rem; display:flex; align-items:center; gap:8px;">
                <i data-lucide="calendar" style="color:var(--accent-primary);"></i> Yaklaşan Sınavlar
              </h4>
              <ul style="padding-left:18px; margin:10px 0 0 0; font-size:0.88rem; color:var(--text-secondary);">
                <li>Vize Dönemi Hatırlatıcısı</li>
                <li>Final & Bütünleme Denemeleri</li>
                <li>Staj Değerlendirme Takvimi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;
  },

  /**
   * V2.0: ONBOARDING / KARŞILAMA EKRANI (#onboarding)
   */
  async renderOnboardingView() {
    this.renderSkeleton(this.appContainer);

    const universities = await UniversityService.loadUniversities();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Karşılama & Üniversite Seçimi', hash: '#onboarding' }
    ]);

    const cities = Array.from(new Set(universities.map(u => u.city))).sort();
    let cityOptions = cities.map(c => `<option value="${c}">${Utils.escapeHTML(c)}</option>`).join('');

    let html = `
      ${breadcrumbHTML}
      <div class="onboarding-landing-container" style="max-width: 1200px; margin: 0 auto; padding: 20px 0;">
        <!-- HERO KARŞILAMA BANNER -->
        <div class="card glass-card" style="padding: 36px; text-align: center; margin-bottom: 32px; background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(16, 185, 129, 0.12)); border: 1px solid var(--border-color);">
          <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">
            Merhaba Bilgisayar Programcısı 👋
          </h1>
          <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 760px; margin: 0 auto; line-height: 1.6;">
            Türkiye genelindeki Bilgisayar Programcılığı dersleri, müfredatı, sınavları ve öğrenme yoluna erişmek için <strong>lütfen kendi üniversiteni seç:</strong>
          </p>
        </div>

        <!-- ARAMA VE FİLTRELEME BAR -->
        <div class="uni-filter-bar" style="margin-bottom: 28px;">
          <div class="uni-search-box">
            <i data-lucide="search"></i>
            <input type="text" id="onboard-uni-search" placeholder="Üniversite veya şehir ara..." autocomplete="off">
          </div>

          <div class="uni-filter-group">
            <select id="onboard-city-select" class="onboarding-select" style="min-width: 150px;">
              <option value="">Tüm Şehirler</option>
              ${cityOptions}
            </select>

            <div class="type-filter-buttons" style="display: flex; gap: 6px;">
              <button class="btn btn-sm btn-primary active-type" data-type="all">Tümü</button>
              <button class="btn btn-sm btn-outline" data-type="devlet">Devlet</button>
              <button class="btn btn-sm btn-outline" data-type="vakif">Vakıf</button>
            </div>
          </div>
        </div>

        <!-- ÜNİVERSİTE LOGO & KARTLARI GRİDİ -->
        <div class="uni-cards-grid" id="onboard-uni-cards-container">
          <!-- Dinamik Render -->
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    const searchInput = document.getElementById('onboard-uni-search');
    const citySelect = document.getElementById('onboard-city-select');
    const container = document.getElementById('onboard-uni-cards-container');
    let selectedType = 'all';

    const filterAndRender = () => {
      const query = (searchInput.value || '').toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const selectedCity = citySelect.value;

      const filtered = universities.filter(u => {
        const normName = u.name.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
        const normCity = u.city.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

        const matchesQuery = !query || normName.includes(query) || normCity.includes(query);
        const matchesCity = !selectedCity || u.city === selectedCity;
        const matchesType = selectedType === 'all' || u.type === selectedType;

        return matchesQuery && matchesCity && matchesType;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Arama kriterlerine uygun üniversite bulunamadı.</div>`;
        return;
      }

      let cardsHTML = filtered.map(u => {
        const initials = u.name.split(' ').map(w => w[0]).join('').substring(0, 3);

        return `
          <div class="uni-card" style="cursor:pointer;" data-uni-id="${u.id}">
            <div>
              <div class="uni-card-header">
                ${u.logo ? `<img src="${u.logo}" alt="${Utils.escapeHTML(u.name)}" style="width:60px; height:60px; object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div class="uni-avatar-fallback" style="width:60px; height:60px; font-size:1.3rem; display:none;">${initials}</div>` : `<div class="uni-avatar-fallback" style="width:60px; height:60px; font-size:1.3rem;">${initials}</div>`}
                <div class="uni-card-title">
                  <h3 style="font-size:1.15rem; font-weight:700;">${Utils.escapeHTML(u.name)}</h3>
                  <p style="font-size:0.9rem; color:var(--text-muted); margin-top:2px;">📍 ${Utils.escapeHTML(u.city)}</p>
                </div>
              </div>

              <div class="uni-card-badges">
                <span class="uni-badge ${u.type}">${u.type === 'devlet' ? '🏛️ Devlet' : '🎓 Vakıf'}</span>
                <span class="uni-badge">💻 Bilgisayar Programcılığı</span>
              </div>
            </div>

            <button class="btn btn-primary btn-sm btn-choose-uni" data-uni-id="${u.id}" style="width:100%; margin-top:16px; font-weight:600; display:flex; justify-content:center; align-items:center; gap:8px;">
              🏛️ Üniversiteyi Seç ➔
            </button>
          </div>
        `;
      }).join('');

      container.innerHTML = cardsHTML;

      // Click handler for card or button
      container.querySelectorAll('.uni-card').forEach(card => {
        card.onclick = async () => {
          const uId = card.getAttribute('data-uni-id');
          const targetUni = universities.find(u => u.id === uId);
          if (targetUni) {
            Storage.setUserProfile({
              universityId: targetUni.id,
              university: targetUni.name,
              department: 'Bilgisayar Programcılığı'
            });
            Storage.setOnboarded();

            if (typeof window.updateSidebarProfileUI === 'function') {
              await window.updateSidebarProfileUI();
            }
            window.location.hash = '#dashboard';
          }
        };
      });
    };

    searchInput.oninput = filterAndRender;
    citySelect.onchange = filterAndRender;

    document.querySelectorAll('.type-filter-buttons button').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.type-filter-buttons button').forEach(b => {
          b.classList.remove('btn-primary', 'active-type');
          b.classList.add('btn-outline');
        });
        btn.classList.add('btn-primary', 'active-type');
        btn.classList.remove('btn-outline');
        selectedType = btn.getAttribute('data-type');
        filterAndRender();
      };
    });

    filterAndRender();
  },

  /**
   * V2.0: ÜNİVERSİTE SEÇİM EKRANI (#universities)
   */
  async renderUniversitiesView() {
    this.renderSkeleton(this.appContainer);

    const universities = await UniversityService.loadUniversities();
    const currentUser = Storage.getUserProfile();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Üniversite Seçimi', hash: '#universities' }
    ]);

    // Şehir listesi al
    const cities = Array.from(new Set(universities.map(u => u.city))).sort();
    let cityOptions = cities.map(c => `<option value="${c}">${Utils.escapeHTML(c)}</option>`).join('');

    let html = `
      ${breadcrumbHTML}
      <div class="universities-page-container">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:8px;">🏛️ Türkiye Bilgisayar Programcılığı Üniversiteleri</h1>
          <p style="color:var(--text-secondary);">Üniversiteni seçerek ilgili bölümün müfredatını, ders planını ve sınavlarını aktif hale getirebilirsin.</p>
        </div>

        <!-- ARAMA VE FİLTRE BAR BAR -->
        <div class="uni-filter-bar">
          <div class="uni-search-box">
            <i data-lucide="search"></i>
            <input type="text" id="uni-search-input" placeholder="Üniversite veya şehir ara... (Örn: Ardahan, Erzurum, Ege)" autocomplete="off">
          </div>

          <div class="uni-filter-group">
            <select id="uni-city-select" class="onboarding-select" style="min-width:160px;">
              <option value="">Tüm Şehirler</option>
              ${cityOptions}
            </select>

            <div class="type-filter-buttons" style="display:flex; gap:6px;">
              <button class="btn btn-sm btn-primary active-type" data-type="all">Tüm</button>
              <button class="btn btn-sm btn-outline" data-type="devlet">Devlet</button>
              <button class="btn btn-sm btn-outline" data-type="vakif">Vakıf</button>
            </div>
          </div>
        </div>

        <!-- ÜNİVERSİTE KARTLARI GRİDİ -->
        <div class="uni-cards-grid" id="uni-cards-container">
          <!-- Dinamik Render -->
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    const searchInput = document.getElementById('uni-search-input');
    const citySelect = document.getElementById('uni-city-select');
    const container = document.getElementById('uni-cards-container');
    let selectedType = 'all';

    const filterAndRender = () => {
      const query = (searchInput.value || '').toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const selectedCity = citySelect.value;

      const filtered = universities.filter(u => {
        const normName = u.name.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
        const normCity = u.city.toLowerCase().replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

        const matchesQuery = !query || normName.includes(query) || normCity.includes(query);
        const matchesCity = !selectedCity || u.city === selectedCity;
        const matchesType = selectedType === 'all' || u.type === selectedType;

        return matchesQuery && matchesCity && matchesType;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">Arama kriterlerine uygun üniversite bulunamadı.</div>`;
        return;
      }

      // Aktif olanı üstte tut
      filtered.sort((a, b) => (a.id === currentUser.universityId ? -1 : b.id === currentUser.universityId ? 1 : 0));

      let cardsHTML = filtered.map(u => {
        const isActive = u.id === currentUser.universityId;
        const initials = u.name.split(' ').map(w => w[0]).join('').substring(0, 3);

        return `
          <div class="uni-card ${isActive ? 'active-uni' : ''}">
            <div>
              <div class="uni-card-header">
                ${u.logo ? `<img src="${u.logo}" alt="${Utils.escapeHTML(u.name)}" style="width:54px; height:54px; object-fit:contain;">` : `<div class="uni-avatar-fallback">${initials}</div>`}
                <div class="uni-card-title">
                  <h3>${Utils.escapeHTML(u.name)}</h3>
                  <p>📍 ${Utils.escapeHTML(u.city)}</p>
                </div>
              </div>

              <div class="uni-card-badges">
                <span class="uni-badge ${u.type}">${u.type === 'devlet' ? '🏛️ Devlet' : '🎓 Vakıf'}</span>
                <span class="uni-badge">💻 Bilgisayar Programcılığı</span>
                ${isActive ? `<span class="uni-badge" style="background:var(--color-success); color:#fff;">✓ Aktif Seçim</span>` : ''}
              </div>
            </div>

            <button class="btn ${isActive ? 'btn-success' : 'btn-primary'} btn-sm btn-select-uni" data-uni-id="${u.id}" style="width:100%; margin-top:16px;">
              ${isActive ? '✓ Aktif Üniversiteniz' : 'Müfredatı Seç & Yükle ➔'}
            </button>
          </div>
        `;
      }).join('');

      container.innerHTML = cardsHTML;

      // Click handler
      container.querySelectorAll('.btn-select-uni').forEach(btn => {
        btn.onclick = async () => {
          const uId = btn.getAttribute('data-uni-id');
          const targetUni = universities.find(u => u.id === uId);
          if (targetUni) {
            Storage.setUserProfile({
              universityId: targetUni.id,
              university: targetUni.name
            });
            Storage.setOnboarded();
            if (typeof window.updateSidebarProfileUI === 'function') {
              await window.updateSidebarProfileUI();
            }
            window.location.hash = '#dashboard';
          }
        };
      });
    };

    searchInput.oninput = filterAndRender;
    citySelect.onchange = filterAndRender;

    document.querySelectorAll('.type-filter-buttons button').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.type-filter-buttons button').forEach(b => {
          b.classList.remove('btn-primary', 'active-type');
          b.classList.add('btn-outline');
        });
        btn.classList.add('btn-primary', 'active-type');
        btn.classList.remove('btn-outline');
        selectedType = btn.getAttribute('data-type');
        filterAndRender();
      };
    });

    filterAndRender();
  },

  /**
   * V2.0: TÜRKİYE GENELİ MÜFREDAT EKRANI (#curriculum)
   */
  async renderCurriculumView(universityId) {
    this.renderSkeleton(this.appContainer);

    const user = Storage.getUserProfile();
    const activeUniId = universityId || user.universityId || 'ardahan-universitesi';
    const curr = await UniversityService.getCurriculumForUniversity(activeUniId);

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Müfredat', hash: '#curriculum' }
    ]);

    if (!curr) {
      this.appContainer.innerHTML = `
        ${breadcrumbHTML}
        <div class="card glass-card" style="padding:40px; text-align:center;">
          <h2>Müfredat Verisi Yüklenemedi</h2>
          <p style="color:var(--text-secondary);">Seçilen üniversite için henüz resmi müfredat yüklenmemiş olabilir.</p>
          <a href="#universities" class="btn btn-primary" style="margin-top:16px;">Farklı Üniversite Seç</a>
        </div>
      `;
      return;
    }

    const meta = curr.metadata || {};
    const isVerified = meta.verified === true;

    let html = `
      ${breadcrumbHTML}
      <div class="curriculum-page-container">
        <div class="page-header-box" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:24px;">
          <div>
            <h1 style="font-size:1.75rem; margin-bottom:6px;">📚 ${Utils.escapeHTML(curr.universityName)} Müfredatı</h1>
            <p style="color:var(--text-secondary); margin:0;">${Utils.escapeHTML(curr.department)} — Toplam AKTS: ${curr.totalCredits || 120}</p>
          </div>

          <!-- DOĞRULAMA METADATA ETİKETİ -->
          <div>
            ${isVerified ? `
              <span class="uni-badge" style="background:rgba(16,185,129,0.15); color:var(--color-success); border-color:var(--color-success); font-size:0.85rem; padding:6px 14px;">
                ✓ Doğrulanmış Müfredat (${Utils.escapeHTML(meta.source || 'Resmi Kaynak')})
              </span>
            ` : `
              <span class="uni-badge" style="background:rgba(245,158,11,0.15); color:var(--color-warning); border-color:var(--color-warning); font-size:0.85rem; padding:6px 14px;">
                ⚠️ Veri doğrulama bekliyor
              </span>
            `}
          </div>
        </div>

        <!-- DÖNEM DERSLERİ -->
        <div class="semesters-container" style="display:flex; flex-direction:column; gap:28px;">
    `;

    (curr.semesters || []).forEach(sem => {
      html += `
        <div class="card glass-card" style="padding:24px;">
          <h2 style="font-size:1.25rem; margin-top:0; margin-bottom:16px; color:var(--accent-primary); border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            ${Utils.escapeHTML(sem.title)}
          </h2>

          <div class="courses-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
      `;

      (sem.courses || []).forEach(c => {
        html += `
          <div class="course-mini-card" style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:10px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:0.75rem; font-weight:700; color:var(--accent-primary); background:rgba(59,130,246,0.12); padding:2px 8px; border-radius:4px;">${Utils.escapeHTML(c.code)}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${c.type} • T+U: ${c.tu || '3+1'}</span>
              </div>
              <h4 style="margin:0 0 6px 0; font-size:1.05rem; color:var(--text-primary);">${Utils.escapeHTML(c.name)}</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 12px 0;">${Utils.escapeHTML(c.description || '')}</p>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; font-weight:600; color:var(--text-muted); border-top:1px dashed var(--border-color); padding-top:10px;">
              <span>AKTS: ${c.akts}</span>
              <a href="#weekly-plan" class="btn btn-outline btn-sm" style="font-size:0.75rem;">Haftalık Plan ➔</a>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;
  },

  /**
   * V2.0: HAFTALIK DERS PLANISI (#weekly-plan)
   */
  async renderWeeklyPlanView(universityId) {
    this.renderSkeleton(this.appContainer);

    const user = Storage.getUserProfile();
    const activeUniId = universityId || user.universityId || 'ardahan-universitesi';
    const curr = await UniversityService.getCurriculumForUniversity(activeUniId);

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Haftalık Ders Planı', hash: '#weekly-plan' }
    ]);

    if (!curr) {
      this.appContainer.innerHTML = `${breadcrumbHTML}<div class="card glass-card" style="padding:30px;">Haftalık ders planı bulunamadı.</div>`;
      return;
    }

    // Haftalık planı olan ilk dersi bul
    let activeCourse = null;
    (curr.semesters || []).forEach(s => {
      (s.courses || []).forEach(c => {
        if (!activeCourse && c.weeklyPlan && c.weeklyPlan.length > 0) {
          activeCourse = c;
        }
      });
    });

    if (!activeCourse && curr.semesters && curr.semesters[0] && curr.semesters[0].courses[0]) {
      activeCourse = curr.semesters[0].courses[0];
    }

    const weeklyPlan = (activeCourse && activeCourse.weeklyPlan) ? activeCourse.weeklyPlan : [
      { week: 1, topic: "Algoritma ve Akış Şemalarına Giriş", goal: "Problem çözme yaklaşımı" },
      { week: 2, topic: "Değişkenler ve Veri Tipleri", goal: "Bellek kullanımı ve temel veri türleri" },
      { week: 3, topic: "Koşul Yapıları (if-else)", goal: "Karar mekanizmaları oluşturma" },
      { week: 4, topic: "Döngüler (for, while)", goal: "Tekrarlı kod yapıları" },
      { week: 5, topic: "Diziler (Arrays)", goal: "Çoklu veri depolama" },
      { week: 6, topic: "Fonksiyonlar ve Metotlar", goal: "Modüler kodlama" },
      { week: 7, topic: "Sınav Öncesi Tekrar", goal: "Örnek soru çözümü" },
      { week: 8, topic: "Ara Sınav / Vize", goal: "Değerlendirme" },
      { week: 9, topic: "Veritabanı Entegrasyonu", goal: "SQL sorguları ile veriye erişim" },
      { week: 10, topic: "Nesne Yönelimli Mantık", goal: "Class ve Object kavramları" },
      { week: 11, topic: "Web Arayüz Tasarımı", goal: "HTML/CSS uygulamaları" },
      { week: 12, topic: "Hata Yönetimi", goal: "Try-Catch yapıları" },
      { week: 13, topic: "Proje Geliştirme", goal: "Uygulamalı çalışma" },
      { week: 14, topic: "Genel Dönem Değerlendirmesi", goal: "Final hazırlığı" }
    ];

    let html = `
      ${breadcrumbHTML}
      <div class="weekly-plan-page">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:6px;">📅 1-14 Hafta İlerleme Planı</h1>
          <p style="color:var(--text-secondary); margin:0;">${Utils.escapeHTML(user.university || curr.universityName || 'Bilgisayar Programcılığı')} — ${Utils.escapeHTML(activeCourse ? activeCourse.name : 'Ders Planı')}</p>
        </div>

        <div class="weekly-timeline">
    `;

    weeklyPlan.forEach(w => {
      const weekNumStr = w.week < 10 ? `0${w.week}` : `${w.week}`;
      const isCompleted = Storage.isLessonCompleted(activeCourse ? activeCourse.id : 'genel', `week_${w.week}`, activeUniId);

      html += `
        <div class="weekly-card" style="${isCompleted ? 'border-color:var(--color-success); background:rgba(16,185,129,0.03);' : ''}">
          <div class="weekly-badge">${weekNumStr} Hafta</div>

          <div class="weekly-content">
            <h4>${Utils.escapeHTML(w.topic)}</h4>
            <p>🎯 Target: ${Utils.escapeHTML(w.goal)}</p>
          </div>

          <div style="display:flex; align-items:center; gap:12px;">
            <a href="#exams" class="btn btn-outline btn-sm">Mini Quiz</a>
            <label style="display:flex; align-items:center; gap:6px; font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" class="weekly-check" data-course-id="${activeCourse ? activeCourse.id : 'genel'}" data-week="${w.week}" ${isCompleted ? 'checked' : ''}>
              ${isCompleted ? 'Tamamlandı' : 'Tamamla'}
            </label>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    this.appContainer.querySelectorAll('.weekly-check').forEach(chk => {
      chk.onchange = () => {
        const cId = chk.getAttribute('data-course-id');
        const wNum = chk.getAttribute('data-week');
        Storage.toggleLessonCompletion(cId, `week_${wNum}`, activeUniId);
        this.renderWeeklyPlanView(activeUniId);
      };
    });
  },

  /**
   * V2.0: MÜFREDAT KARŞILAŞTIRMA EKRANI (#compare)
   */
  async renderCompareView() {
    this.renderSkeleton(this.appContainer);

    const universities = await UniversityService.loadUniversities();
    const currentUser = Storage.getUserProfile();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Müfredat Karşılaştır', hash: '#compare' }
    ]);

    // Varsayılan olarak mevcut üniversite + Atatürk Üniversitesi seçilsin
    const defaultIds = [currentUser.universityId || 'ardahan-universitesi', 'ataturk-universitesi'];
    const compData = await UniversityService.compareCurriculums(defaultIds);

    let uniCheckboxesHTML = universities.map(u => {
      const isChecked = defaultIds.includes(u.curriculumId);
      return `
        <label style="display:inline-flex; align-items:center; gap:6px; background:var(--bg-input); padding:6px 12px; border-radius:8px; border:1px solid var(--border-color); font-size:0.85rem; cursor:pointer;">
          <input type="checkbox" class="comp-uni-check" value="${u.curriculumId}" ${isChecked ? 'checked' : ''}>
          ${Utils.escapeHTML(u.name)}
        </label>
      `;
    }).join('');

    let html = `
      ${breadcrumbHTML}
      <div class="compare-page-container">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:6px;">⚖️ Üniversite Müfredat Karşılaştırma</h1>
          <p style="color:var(--text-secondary); margin:0;">İki veya daha fazla üniversiteyi seçerek ders çeşitliliği, AKTS ve zorunlu/seçmeli oranlarını kıyaslayabilirsin.</p>
        </div>

        <!-- ÜNİVERSİTE SEÇİCİ -->
        <div class="card glass-card" style="padding:20px; margin-bottom:24px;">
          <h4 style="margin-top:0; margin-bottom:12px;">Karşılaştırılacak Üniversiteleri Seç:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${uniCheckboxesHTML}
          </div>
        </div>

        <div id="compare-results-box">
          ${this.renderCompareTablesHTML(compData)}
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    this.appContainer.querySelectorAll('.comp-uni-check').forEach(chk => {
      chk.onchange = async () => {
        const checkedVals = Array.from(this.appContainer.querySelectorAll('.comp-uni-check:checked')).map(c => c.value);
        const newCompData = await UniversityService.compareCurriculums(checkedVals);
        document.getElementById('compare-results-box').innerHTML = this.renderCompareTablesHTML(newCompData);
      };
    });
  },

  renderCompareTablesHTML(compData) {
    if (!compData || !compData.summary || compData.summary.length === 0) {
      return `<div class="card glass-card" style="padding:30px; text-align:center;">Karşılaştırmak için en az 1 üniversite seçmelisin.</div>`;
    }

    let html = `
      <div class="compare-container">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Metrik / Üniversite</th>
              ${compData.summary.map(s => `<th>${Utils.escapeHTML(s.universityName)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Toplam Ders Sayısı</strong></td>
              ${compData.summary.map(s => `<td>${s.totalCourses} Ders</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Toplam AKTS Yükü</strong></td>
              ${compData.summary.map(s => `<td>${s.totalAKTS} AKTS</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Zorunlu / Seçmeli Oranı</strong></td>
              ${compData.summary.map(s => `<td>${s.mandatoryCount} Zorunlu / ${s.electiveCount} Seçmeli</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Doğrulama Durumu</strong></td>
              ${compData.summary.map(s => `<td>${s.metadata.verified ? '✓ Doğrulanmış' : '⚠️ Veri Doğrulama Bekliyor'}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ORTAK DERSLER HAVUZU -->
      <div class="card glass-card" style="padding:24px; margin-top:28px;">
        <h3 style="margin-top:0; margin-bottom:12px; font-size:1.2rem; color:var(--accent-primary);">
          🤝 Ortak Türkiye Müfredat Dersleri
        </h3>
        ${compData.commonCourses.length > 0 ? `
          <ul style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap:10px; padding:0; list-style:none;">
            ${compData.commonCourses.map(cName => `<li style="background:var(--bg-input); padding:8px 14px; border-radius:8px; border:1px solid var(--border-color);">✔ ${Utils.escapeHTML(cName)}</li>`).join('')}
          </ul>
        ` : `
          <p style="color:var(--text-muted); margin:0;">Bu ders için yeterli üniversite verisi bulunamadı.</p>
        `}
      </div>
    `;

    return html;
  },

  /**
   * V2.0: TÜRKİYE BP ŞEHİR HARİTASI / KEŞİF (#cities)
   */
  async renderCitiesView() {
    this.renderSkeleton(this.appContainer);

    const cityGroups = await UniversityService.getCitiesWithUniversities();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Şehir Rehberi', hash: '#cities' }
    ]);

    let html = `
      ${breadcrumbHTML}
      <div class="cities-page-container">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:6px;">🗺️ Türkiye Bilgisayar Programcılığı Haritası</h1>
          <p style="color:var(--text-secondary); margin:0;">Türkiye ➔ Şehir ➔ Üniversite ➔ Bilgisayar Programcılığı hiyerarşisi.</p>
        </div>

        <div class="cities-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap:20px;">
    `;

    cityGroups.forEach(group => {
      html += `
        <div class="card glass-card" style="padding:20px;">
          <h3 style="margin-top:0; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
            📍 ${Utils.escapeHTML(group.cityName)}
          </h3>
          <ul style="padding-left:0; list-style:none; margin:12px 0 0 0; display:flex; flex-direction:column; gap:8px;">
            ${group.universities.map(u => `
              <li style="background:var(--bg-input); padding:8px 12px; border-radius:8px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.9rem; font-weight:600;">${Utils.escapeHTML(u.name)}</span>
                <a href="#curriculum/${u.id}" class="btn btn-outline btn-sm" style="font-size:0.75rem;">Müfredat</a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;
  },

  /**
   * V2.0: GENİŞLETİLMİŞ SINAV SİSTEMİ (#exams)
   */
  async renderExamsView() {
    this.renderSkeleton(this.appContainer);

    const stats = Storage.getExamStats();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Sınav Sistemi', hash: '#exams' }
    ]);

    let html = `
      ${breadcrumbHTML}
      <div class="exams-page-container">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:6px;">📝 Genişletilmiş BP Sınav Sistemi</h1>
          <p style="color:var(--text-secondary); margin:0;">Quiz, Kısa Sınav, Vize, Final, Bütünleme ve Deneme Sınavları ile kendini test et.</p>
        </div>

        <!-- İSTATİSTİK ÖZET PANELİ -->
        <div class="exam-stats-panel">
          <h3 style="margin-top:0; margin-bottom:16px;">📊 Sınav İstatistiklerim</h3>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:16px;">
            <div><span style="color:var(--text-muted); font-size:0.85rem;">Çözülen Sınav</span><h2 style="margin:4px 0 0 0;">${stats.totalSolved}</h2></div>
            <div><span style="color:var(--text-muted); font-size:0.85rem;">Başarı Yüzdesi</span><h2 style="margin:4px 0 0 0; color:var(--color-success);">%${stats.overallSuccessRate}</h2></div>
            <div><span style="color:var(--text-muted); font-size:0.85rem;">En Güçlü Ders</span><h2 style="margin:4px 0 0 0; font-size:1.2rem;">${Utils.escapeHTML(stats.strongestCourse)}</h2></div>
            <div><span style="color:var(--text-muted); font-size:0.85rem;">Toplam Soru</span><h2 style="margin:4px 0 0 0;">${stats.totalQuestions} (${stats.totalCorrect} D / ${stats.totalWrong} Y)</h2></div>
          </div>
        </div>

        <!-- SINAV FİLTRE TABLARI -->
        <div class="exam-filter-bar">
          <button class="btn btn-sm btn-primary active-exam-filter" data-type="all">Tüm Sınavlar</button>
          <button class="btn btn-sm btn-outline" data-type="Quiz">Quiz</button>
          <button class="btn btn-sm btn-outline" data-type="Kısa Sınav">Kısa Sınav</button>
          <button class="btn btn-sm btn-outline" data-type="Vize">Vize</button>
          <button class="btn btn-sm btn-outline" data-type="Final">Final</button>
          <button class="btn btn-sm btn-outline" data-type="Bütünleme">Bütünleme</button>
          <button class="btn btn-sm btn-outline" data-type="Deneme">Deneme Sınavı</button>
        </div>

        <!-- SINAV KARTLARI GRİDİ -->
        <div class="exam-grid">
          <div class="exam-card">
            <div>
              <span class="uni-badge" style="background:rgba(59,130,246,0.12); color:var(--accent-primary);">Vize Simülatörü</span>
              <h3 style="margin:12px 0 8px 0;">Programlama Temelleri Vize Sınavı</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">20 Soru • 30 Dakika • C# & Algoritma</p>
            </div>
            <button class="btn btn-primary btn-sm btn-start-exam" data-exam-title="Programlama Temelleri Vize" data-exam-type="Vize" style="margin-top:16px;">Sınavı Başlat ➔</button>
          </div>

          <div class="exam-card">
            <div>
              <span class="uni-badge" style="background:rgba(16,185,129,0.12); color:var(--color-success);">Quiz</span>
              <h3 style="margin:12px 0 8px 0;">Veri Tabanı SQL Sorgu Quizi</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">10 Soru • 15 Dakika • SELECT & JOIN</p>
            </div>
            <button class="btn btn-primary btn-sm btn-start-exam" data-exam-title="SQL Sorgu Quizi" data-exam-type="Quiz" style="margin-top:16px;">Sınavı Başlat ➔</button>
          </div>

          <div class="exam-card">
            <div>
              <span class="uni-badge" style="background:rgba(245,158,11,0.12); color:var(--color-warning);">Final</span>
              <h3 style="margin:12px 0 8px 0;">Web Tasarımı Final Denemesi</h3>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">25 Soru • 40 Dakika • HTML/CSS/Flexbox</p>
            </div>
            <button class="btn btn-primary btn-sm btn-start-exam" data-exam-title="Web Tasarımı Final Denemesi" data-exam-type="Final" style="margin-top:16px;">Sınavı Başlat ➔</button>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    this.appContainer.querySelectorAll('.btn-start-exam').forEach(btn => {
      btn.onclick = () => {
        const title = btn.getAttribute('data-exam-title');
        const type = btn.getAttribute('data-exam-type');
        this.runSimulatedExam(title, type);
      };
    });
  },

  runSimulatedExam(title, type) {
    const questions = [
      { q: "C# dilinde tam sayı saklamak için hangi veri tipi kullanılır?", options: ["string", "int", "bool", "float"], ans: 1 },
      { q: "SQL'de tablodan veri çekmek için hangi komut kullanılır?", options: ["UPDATE", "INSERT", "SELECT", "DELETE"], ans: 2 },
      { q: "HTML'de en büyük başlık etiket hangisidir?", options: ["<h6>", "<head>", "<h1>", "<header>"], ans: 2 },
      { q: "CSS'de esnek kutu düzeni sağlayan özellik hangisidir?", options: ["display: flex", "position: absolute", "float: left", "margin: auto"], ans: 0 },
      { q: "Veritabanında benzersiz kimlik belirten anahtara ne ad verilir?", options: ["Foreign Key", "Primary Key", "Index", "Trigger"], ans: 1 }
    ];

    let currentQ = 0;
    let score = 0;

    const renderQuestionModal = () => {
      const q = questions[currentQ];
      const modal = document.createElement('div');
      modal.className = 'onboarding-overlay';

      const progressPercent = Math.round(((currentQ + 1) / questions.length) * 100);

      modal.innerHTML = `
        <div class="quiz-modal-card">
          <button class="quiz-close-btn" id="btn-close-quiz-modal" title="Kapat">&times;</button>

          <div style="display:flex; justify-content:space-between; align-items:center; padding-right:32px;">
            <span class="uni-badge" style="font-weight:600;">${type} — ${Utils.escapeHTML(title)}</span>
            <span style="font-weight:700; font-size:0.9rem; color:var(--text-secondary);">Soru ${currentQ + 1} / ${questions.length}</span>
          </div>

          <div class="quiz-progress-track">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>

          <h3 style="margin-top:0; margin-bottom:20px; color:var(--text-primary); font-size:1.15rem; line-height:1.5;">${q.q}</h3>

          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:10px;">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-idx="${idx}">
                <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span>${Utils.escapeHTML(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#btn-close-quiz-modal');
      if (closeBtn) {
        closeBtn.onclick = () => modal.remove();
      }

      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };

      modal.querySelectorAll('.quiz-option-btn').forEach(optBtn => {
        optBtn.onclick = (e) => {
          e.stopPropagation();
          const chosenIdx = parseInt(optBtn.getAttribute('data-idx'), 10);
          if (chosenIdx === q.ans) score++;
          modal.remove();

          if (currentQ + 1 < questions.length) {
            currentQ++;
            renderQuestionModal();
          } else {
            Storage.saveExamResult({
              examType: type,
              courseName: title,
              totalQuestions: questions.length,
              correctCount: score,
              wrongCount: questions.length - score
            });
            renderResultModal();
          }
        };
      });
    };

    const renderResultModal = () => {
      const resultModal = document.createElement('div');
      resultModal.className = 'onboarding-overlay';
      const percent = Math.round((score / questions.length) * 100);
      const isSuccess = percent >= 60;

      resultModal.innerHTML = `
        <div class="quiz-modal-card" style="text-align:center;">
          <div style="font-size:3rem; margin-bottom:12px;">${isSuccess ? '🎉' : '📚'}</div>
          <h2 style="margin:0 0 8px 0; color:var(--text-primary); font-size:1.5rem;">Sınav Tamamlandı!</h2>
          <p style="color:var(--text-secondary); margin-bottom:20px;">${Utils.escapeHTML(title)} — ${type}</p>

          <div style="background:var(--bg-secondary); padding:20px; border-radius:14px; border:1px solid var(--border-color); margin-bottom:24px;">
            <div style="font-size:2.2rem; font-weight:800; color:var(--accent-primary); margin-bottom:4px;">%${percent}</div>
            <div style="font-size:0.9rem; color:var(--text-muted); font-weight:600;">Başarı Oranı</div>
            <div style="display:flex; justify-content:center; gap:20px; margin-top:16px; font-weight:600; font-size:0.95rem;">
              <span style="color:#10b981;">✓ ${score} Doğru</span>
              <span style="color:#ef4444;">✗ ${questions.length - score} Yanlış</span>
            </div>
          </div>

          <button class="btn btn-primary btn-md" id="btn-finish-quiz-modal" style="width:100%;">
            Tamam
          </button>
        </div>
      `;

      document.body.appendChild(resultModal);

      resultModal.querySelector('#btn-finish-quiz-modal').onclick = () => {
        resultModal.remove();
        this.renderExamsView();
      };
    };

    renderQuestionModal();
  },

  /**
   * V2.0: AYARLAR EKRANI (#settings)
   */
  async renderSettingsView() {
    this.renderSkeleton(this.appContainer);

    const user = Storage.getUserProfile();
    const universities = await UniversityService.loadUniversities();

    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Dashboard', hash: '#dashboard' },
      { title: 'Ayarlar', hash: '#settings' }
    ]);

    let uniOptionsHTML = universities.map(u => `
      <option value="${u.id}" ${u.id === user.universityId ? 'selected' : ''}>${Utils.escapeHTML(u.name)} (${Utils.escapeHTML(u.city)})</option>
    `).join('');

    let html = `
      ${breadcrumbHTML}
      <div class="settings-page-container">
        <div class="page-header-box" style="margin-bottom:24px;">
          <h1 style="font-size:1.75rem; margin-bottom:6px;">⚙️ Profil ve Uygulama Ayarları</h1>
          <p style="color:var(--text-secondary); margin:0;">Kullanıcı bilgilerinizi düzenleyebilir, tema tercihinizi ve verilerinizi yönetebilirsiniz.</p>
        </div>

        <div class="settings-grid">
          <!-- PROFİL DÜZENLEME KARTI -->
          <div class="settings-card">
            <h3>👤 Kullanıcı Profili</h3>
            <form id="settings-profile-form">
              <div class="onboarding-form-group">
                <label>Ad / Kullanıcı Adı</label>
                <input type="text" id="set-name" class="onboarding-input" value="${Utils.escapeHTML(user.name || '')}">
              </div>

              <div class="onboarding-form-group">
                <label>Aktif Üniversite</label>
                <select id="set-uni" class="onboarding-select">
                  ${uniOptionsHTML}
                </select>
              </div>

              <div class="onboarding-form-group">
                <label>Sınıf / Yarıyıl</label>
                <select id="set-semester" class="onboarding-select">
                  <option value="1" ${user.semester == 1 ? 'selected' : ''}>1. Yarıyıl (Güz)</option>
                  <option value="2" ${user.semester == 2 ? 'selected' : ''}>2. Yarıyıl (Bahar)</option>
                  <option value="3" ${user.semester == 3 ? 'selected' : ''}>3. Yarıyıl (Güz)</option>
                  <option value="4" ${user.semester == 4 ? 'selected' : ''}>4. Yarıyıl (Bahar)</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary" style="width:100%;">Değişiklikleri Kaydet</button>
            </form>
          </div>

          <!-- YEDEKLEME VE VERİ YÖNETİMİ -->
          <div class="settings-card">
            <h3>💾 Veri Yönetimi ve İlerleme</h3>
            <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:20px;">
              Tüm öğrenme ilerlemenizi JSON olarak bilgisayarınıza indirebilir veya sıfırlayabilirsiniz. Üniversite değiştirdiğinizde verileriniz kaybolmaz.
            </p>

            <div style="display:flex; flex-direction:column; gap:12px;">
              <button class="btn btn-outline" id="btn-export-backup">📥 Yedeği İndir (JSON)</button>
              <button class="btn btn-danger" id="btn-reset-data">🗑️ Verileri Sıfırla</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;

    const profileForm = document.getElementById('settings-profile-form');
    if (profileForm) {
      profileForm.onsubmit = async (e) => {
        e.preventDefault();
        const newName = document.getElementById('set-name').value.trim() || 'Öğrenci';
        const newUniId = document.getElementById('set-uni').value;
        const newSem = parseInt(document.getElementById('set-semester').value, 10) || 1;

        const uniObj = await UniversityService.getUniversityById(newUniId);

        Storage.setUserProfile({
          name: newName,
          universityId: newUniId,
          university: uniObj ? uniObj.name : 'Ardahan Üniversitesi',
          semester: newSem
        });
        Storage.setOnboarded();

        if (typeof window.updateSidebarProfileUI === 'function') {
          await window.updateSidebarProfileUI();
        }
        alert('Profil bilgileri başarıyla güncellendi!');
        window.location.hash = '#dashboard';
      };
    }

    const exportBtn = document.getElementById('btn-export-backup');
    if (exportBtn) exportBtn.onclick = () => Storage.exportData();

    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.onclick = async () => {
        if (confirm('Tüm öğrenme ilerlemeniz, üniversite seçiminiz ve tüm kayıtlarınız sıfırlanacak. Devam etmek istiyor musunuz?')) {
          localStorage.clear();
          if (typeof window.updateSidebarProfileUI === 'function') {
            await window.updateSidebarProfileUI();
          }
          window.location.hash = '#onboarding';
        }
      };
    }
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
    html += `</ol>`;
    html += `</nav>`;
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
    const user = Storage.getUserProfile();
    const uniName = user.university || 'Ardahan Üniversitesi';
    return `
      <section class="home-guide-hero compact-hero full-screen-section" id="hero-section">
        <div class="hero-card-container">

          <h1 class="hero-main-title">${Utils.escapeHTML(uniName)} Bilgisayar Programcılığı Rehberi</h1>

          <div class="hero-body-content">
            <p class="hero-welcome-lead">
              ${Utils.escapeHTML(uniName)} Bilgisayar Programcılığı bölümüne hoş geldin, ${Utils.escapeHTML(user.name || 'Öğrenci')} 👋<br>
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
            <a href="#universities" class="btn btn-outline btn-md">
              Üniversite Değiştir 🔄
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
    const user = Storage.getUserProfile();
    const uniName = user.university || 'Ardahan Üniversitesi';
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
                ${Utils.escapeHTML(uniName)} bünyesinde yürütülen 2 yıllık (4 yarıyıl) mesleki yükseköğretim programıdır. Mezunlar YÖK onaylı diplomayla <strong>"Bilgisayar Programcılığı Teknikeri"</strong> unvanı kazanır.
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

  async renderCurriculumPreview(coursesInfo) {
    const user = Storage.getUserProfile();
    const curr = await UniversityService.getCurriculumForUniversity(user.universityId);

    let semesterCourses = null;
    if (curr && curr.semesters && curr.semesters.length > 0) {
      semesterCourses = {};
      curr.semesters.forEach(sem => {
        semesterCourses[sem.id.toString()] = (sem.courses || []).map(c => ({
          id: c.id || c.code,
          code: c.code,
          title: c.name,
          akts: c.akts,
          type: c.type,
          desc: c.description || (c.name + ' dersi müfredatı.')
        }));
      });
    }

    if (!semesterCourses) {
      semesterCourses = {
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
    }

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
            <p>Ardahan Üniversitesi Yenisey Kampüsü yaşamı, GSB KYK ve özel öğrenci yurt imkânları, dolmuş ve otogar ulaşım güzergâhları, bilgisayar laboratuvarı imkânları, iklim şartları ve şehirde günlük öğrenci hayatı hakkında merak ettiğin tüm detaylı rehber:</p>
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

      <!-- DESKTOP YARIYIL FİLTRELEME TABLARI -->
      <div class="filter-tabs desktop-only">
        <button class="filter-btn active" data-filter="all">Tüm Dersler</button>
        <button class="filter-btn" data-filter="sem-1">1. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-2">2. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-3">3. Yarıyıl</button>
        <button class="filter-btn" data-filter="sem-4">4. Yarıyıl</button>
      </div>

      <!-- MOBİL ÖZEL AÇILIR MENÜ (CUSTOM DROPDOWN MENU) -->
      <div class="custom-dropdown-container mobile-only" id="semester-dropdown-container">
        <button class="custom-dropdown-trigger" id="semester-dropdown-trigger" type="button" aria-expanded="false">
          <div class="trigger-label-group">
            <i data-lucide="filter" class="trigger-icon"></i>
            <span class="trigger-title">Yarıyıl Seç / Filtrele:</span>
            <strong class="trigger-selected-text" id="selected-semester-text">📚 Tüm Dersler</strong>
          </div>
          <i data-lucide="chevron-down" class="dropdown-chevron"></i>
        </button>

        <div class="custom-dropdown-menu" id="semester-dropdown-menu">
          <button class="dropdown-option active" data-filter="all" data-label="📚 Tüm Dersler">
            <span class="opt-icon">📚</span>
            <span class="opt-text">Tüm Dersler <small>(Hepsini Göster)</small></span>
            <i data-lucide="check" class="opt-check"></i>
          </button>
          <button class="dropdown-option" data-filter="sem-1" data-label="1️⃣ 1. Yarıyıl">
            <span class="opt-icon">1️⃣</span>
            <span class="opt-text">1. Yarıyıl <small>(Güz Dönemi - 1. Yıl)</small></span>
            <i data-lucide="check" class="opt-check"></i>
          </button>
          <button class="dropdown-option" data-filter="sem-2" data-label="2️⃣ 2. Yarıyıl">
            <span class="opt-icon">2️⃣</span>
            <span class="opt-text">2. Yarıyıl <small>(Bahar Dönemi - 1. Yıl)</small></span>
            <i data-lucide="check" class="opt-check"></i>
          </button>
          <button class="dropdown-option" data-filter="sem-3" data-label="3️⃣ 3. Yarıyıl">
            <span class="opt-icon">3️⃣</span>
            <span class="opt-text">3. Yarıyıl <small>(Güz Dönemi - 2. Yıl)</small></span>
            <i data-lucide="check" class="opt-check"></i>
          </button>
          <button class="dropdown-option" data-filter="sem-4" data-label="4️⃣ 4. Yarıyıl">
            <span class="opt-icon">4️⃣</span>
            <span class="opt-text">4. Yarıyıl <small>(Bahar Dönemi - 2. Yıl)</small></span>
            <i data-lucide="check" class="opt-check"></i>
          </button>
        </div>
      </div>

      <div class="courses-grid" id="catalog-grid">
    `;

    for (const c of coursesInfo.courses) {
      const cat = coursesInfo.categories[c.category] || { badge: 'secondary', title: 'Genel' };

      html += `
        <div class="course-card collapsible-course-card" data-sem="sem-${c.semester}">
          <div class="course-card-header-trigger" role="button" tabindex="0">
            <div class="course-card-main-info">
              <div class="course-icon">${Utils.getIconSVG(c.icon || 'book-open')}</div>
              <div class="course-title-group">
                <h3 class="course-title">${Utils.escapeHTML(c.title)}</h3>
                <div class="course-badges-inline">
                  <span class="badge badge-${cat.badge}">${c.code}</span>
                  <span class="badge badge-outline">${c.semester}. Yarıyıl</span>
                </div>
              </div>
            </div>
            <i data-lucide="chevron-down" class="course-card-chevron"></i>
          </div>

          <div class="course-card-collapsible-body">
            <div class="course-card-meta">
              <div class="meta-item"><strong>Kredi:</strong> ${c.akts || 3} AKTS (${c.credits || c.akts || 3} Kredi)</div>
              <div class="meta-item"><strong>Dersi Veren:</strong> ${Utils.escapeHTML(c.instructor || 'Öğr. Gör. (TBMYO Akademik Kadro)')}</div>
            </div>

            <div class="card-btn-group" style="margin-top:16px;">
              <a href="#course/${c.id}" class="btn btn-primary" style="width:100%; justify-content:center;">Derse Git ➔</a>
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;
    this.appContainer.innerHTML = html;

    const desktopBtns = this.appContainer.querySelectorAll('.filter-btn');
    const dropdownContainer = this.appContainer.querySelector('#semester-dropdown-container');
    const dropdownTrigger = this.appContainer.querySelector('#semester-dropdown-trigger');
    const selectedText = this.appContainer.querySelector('#selected-semester-text');
    const dropdownOptions = this.appContainer.querySelectorAll('.dropdown-option');
    const cards = this.appContainer.querySelectorAll('#catalog-grid .course-card');

    const applyCourseFilter = (filterVal) => {
      desktopBtns.forEach(b => {
        if (b.getAttribute('data-filter') === filterVal) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      dropdownOptions.forEach(o => {
        if (o.getAttribute('data-filter') === filterVal) {
          o.classList.add('active');
          if (selectedText) {
            selectedText.textContent = o.getAttribute('data-label');
          }
        } else {
          o.classList.remove('active');
        }
      });

      cards.forEach(card => {
        if (filterVal === 'all' || card.getAttribute('data-sem') === filterVal) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    desktopBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterVal = e.currentTarget.getAttribute('data-filter');
        applyCourseFilter(filterVal);
      });
    });

    if (dropdownTrigger && dropdownContainer) {
      dropdownTrigger.onclick = (e) => {
        e.stopPropagation();
        dropdownContainer.classList.toggle('open');
        const isOpen = dropdownContainer.classList.contains('open');
        dropdownTrigger.setAttribute('aria-expanded', isOpen);
      };

      document.onclick = (e) => {
        if (!dropdownContainer.contains(e.target)) {
          dropdownContainer.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
        }
      };

      dropdownOptions.forEach(opt => {
        opt.onclick = (e) => {
          e.stopPropagation();
          const filterVal = opt.getAttribute('data-filter');
          applyCourseFilter(filterVal);
          dropdownContainer.classList.remove('open');
          dropdownTrigger.setAttribute('aria-expanded', 'false');
        };
      });
    }

    // Mobil genişlikte (<= 768px) kartı aç/kapat dinleyicisi
    this.appContainer.querySelectorAll('.course-card-header-trigger').forEach(trigger => {
      trigger.onclick = (e) => {
        if (window.innerWidth <= 768) {
          const card = trigger.closest('.collapsible-course-card');
          if (card) {
            card.classList.toggle('open');
          }
        }
      };
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
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Quizler', hash: '#quizzes' }
    ]);

    // Quiz paketlerini yükleme
    let quizPackages = [];
    const quizMap = {};

    try {
      const [prog, db, web, hw] = await Promise.all([
        fetch('./data/quizzes/programming.json').then(r => r.json()).catch(() => ({ quizzes: [] })),
        fetch('./data/quizzes/database.json').then(r => r.json()).catch(() => ({ quizzes: [] })),
        fetch('./data/quizzes/web.json').then(r => r.json()).catch(() => ({ quizzes: [] })),
        fetch('./data/quizzes/hardware.json').then(r => r.json()).catch(() => ({ quizzes: [] }))
      ]);

      quizPackages = [
        { category: 'programlama', title: 'Programlama Temelleri (C#)', badge: 'primary', quizzes: prog.quizzes || [] },
        { category: 'veritabani', title: 'Veritabanı Yönetimi (SQL)', badge: 'info', quizzes: db.quizzes || [] },
        { category: 'web', title: 'Web Tasarımı & JS', badge: 'success', quizzes: web.quizzes || [] },
        { category: 'donanim', title: 'Donanım & Sistem', badge: 'warning', quizzes: hw.quizzes || [] }
      ];

      quizPackages.forEach(pkg => {
        pkg.quizzes.forEach(q => {
          quizMap[q.id] = q;
        });
      });
    } catch (e) {
      console.error('Quiz loading error:', e);
    }

    // İstatistik hesaplamaları
    let totalQuizzes = 0;
    let completedQuizzes = 0;
    let totalPercent = 0;

    quizPackages.forEach(pkg => {
      pkg.quizzes.forEach(q => {
        totalQuizzes++;
        const score = Storage.getQuizScore(q.id);
        if (score) {
          completedQuizzes++;
          totalPercent += score.percent;
        }
      });
    });

    const avgScore = completedQuizzes > 0 ? Math.round(totalPercent / completedQuizzes) : 0;

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>🧠 Bilgisayar Programcılığı Etkileşimli Quizler</h1>
        <p>Vize ve Final sınavlarına hazırlık için ders bazlı testler, anında yanıt kontrolleri ve detaylı soru çözümleri.</p>
      </div>

      <!-- İSTATİSTİK ŞERİDİ -->
      <div class="grid grid-3" style="gap: 16px; margin-bottom: 24px;">
        <div class="card" style="background:var(--bg-card); padding:16px; border-radius:12px; border:1px solid var(--border-color); display:flex; align-items:center; gap:16px;">
          <div style="font-size:2rem;">📚</div>
          <div>
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-primary);">${totalQuizzes} Quiz</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Toplam Mevcut Test</div>
          </div>
        </div>

        <div class="card" style="background:var(--bg-card); padding:16px; border-radius:12px; border:1px solid var(--border-color); display:flex; align-items:center; gap:16px;">
          <div style="font-size:2rem;">✅</div>
          <div>
            <div style="font-size:1.4rem; font-weight:800; color:#10b981;">${completedQuizzes} / ${totalQuizzes}</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Tamamlanan Test</div>
          </div>
        </div>

        <div class="card" style="background:var(--bg-card); padding:16px; border-radius:12px; border:1px solid var(--border-color); display:flex; align-items:center; gap:16px;">
          <div style="font-size:2rem;">🎯</div>
          <div>
            <div style="font-size:1.4rem; font-weight:800; color:#3b82f6;">%${avgScore}</div>
            <div style="font-size:0.85rem; color:var(--text-secondary);">Ortalama Başarı Oranı</div>
          </div>
        </div>
      </div>

      <!-- AKTİF QUIZ ÇALIŞTIRMA ALANI -->
      <div id="quiz-mount-wrapper" class="hidden" style="margin-bottom: 30px; background:var(--bg-card); padding:20px; border-radius:12px; border:2px solid var(--accent-primary);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="margin:0; display:flex; align-items:center; gap:8px;">📝 Aktif Sınav Testi</h3>
          <button id="btn-close-active-quiz" class="btn btn-outline btn-sm">✕ Testi Kapat</button>
        </div>
        <div id="quiz-mount-point"></div>
      </div>

      <!-- FİLTRE TABLARI -->
      <div class="lab-tabs" id="quiz-category-tabs" style="margin-bottom: 20px;">
        <button class="lab-tab-btn active" data-cat="all">🌟 Tüm Quizler (${totalQuizzes})</button>
        <button class="lab-tab-btn" data-cat="programlama">🔷 Programlama (C#)</button>
        <button class="lab-tab-btn" data-cat="veritabani">🗄️ Veritabanı (SQL)</button>
        <button class="lab-tab-btn" data-cat="web">🌐 Web Tasarımı</button>
        <button class="lab-tab-btn" data-cat="donanim">💻 Donanım & Sistem</button>
      </div>

      <!-- QUIZ KARTLARI LİSTESİ -->
      <div class="grid grid-2" id="quizzes-grid" style="gap: 16px;">
        ${quizPackages.map(pkg => pkg.quizzes.map(q => {
          const score = Storage.getQuizScore(q.id);
          return `
            <div class="card quiz-card-item" data-cat="${pkg.category}" style="background:var(--bg-card); padding:18px; border-radius:12px; border:1px solid var(--border-color); display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                  <span class="badge badge-${pkg.badge}">${Utils.escapeHTML(pkg.title)}</span>
                  ${score ? `<span class="badge badge-success">Skor: %${score.percent}</span>` : `<span class="badge badge-outline">${q.questions.length} Soru</span>`}
                </div>
                <h3 style="margin:0 0 8px 0; font-size:1.1rem; color:var(--text-primary);">${Utils.escapeHTML(q.title)}</h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 16px 0;">Vize ve final sınavı öncesi kendinizi test edin.</p>
              </div>
              <div>
                <button class="btn btn-primary btn-sm start-quiz-btn" data-quiz-id="${q.id}" style="width:100%;">
                  🚀 Quize Başla (${q.questions.length} Soru)
                </button>
              </div>
            </div>
          `;
        }).join('')).join('')}
      </div>
    `;

    this.appContainer.innerHTML = html;

    // Etkileşimler
    const mountWrapper = document.getElementById('quiz-mount-wrapper');
    const mountPoint = document.getElementById('quiz-mount-point');
    const closeBtn = document.getElementById('btn-close-active-quiz');

    if (closeBtn && mountWrapper) {
      closeBtn.onclick = () => {
        mountWrapper.classList.add('hidden');
        mountPoint.innerHTML = '';
      };
    }

    // Tab switcher
    document.querySelectorAll('#quiz-category-tabs .lab-tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#quiz-category-tabs .lab-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-cat');
        document.querySelectorAll('.quiz-card-item').forEach(card => {
          if (cat === 'all' || card.getAttribute('data-cat') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      };
    });

    // Quiz başlatma butonu dinleyicileri
    document.querySelectorAll('.start-quiz-btn').forEach(btn => {
      btn.onclick = () => {
        const quizId = btn.getAttribute('data-quiz-id');
        const quizData = quizMap[quizId];
        if (quizData) {
          mountWrapper.classList.remove('hidden');
          QuizEngine.renderQuizCard(quizData, mountPoint);
          mountWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    });
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

    const user = Storage.getUserProfile();
    const uni = await UniversityService.getUniversityById(user.universityId) || {
      name: 'Ardahan Üniversitesi',
      city: 'Ardahan',
      type: 'devlet',
      website: 'https://www.ardahan.edu.tr',
      ubysUrl: 'https://ubys.ardahan.edu.tr'
    };

    const breadcrumbHTML = this.renderBreadcrumb([{ title: 'Ana Sayfa', hash: '#home' }, { title: 'Üniversitem', hash: '#university' }]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header" style="margin-bottom:24px;">
        <h1 style="font-size:1.75rem; margin-bottom:6px;">🏛️ ${Utils.escapeHTML(uni.name)} Bilgisayar Programcılığı</h1>
        <p style="color:var(--text-secondary); margin:0;">${Utils.escapeHTML(uni.city)} / ${uni.type === 'devlet' ? 'Devlet Üniversitesi' : 'Vakıf Üniversitesi'} — Kurumsal ve Akademik Bilgiler</p>
      </div>

      <div class="university-page-grid">
        <!-- 1. AKADEMİK BİRİM VE KURUM BİLGİLERİ -->
        <div class="uni-section-card">
          <h3>Kurumsal Bilgiler ve Akademik Birim</h3>
          <div class="uni-info-list">
            <div class="uni-info-item">
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
        <h1>🏔️ Ardahan Öğrenci Şehir & Kampüs Yaşam Rehberi</h1>
        <p>Ardahan Üniversitesi Bilgisayar Programcılığı öğrencileri için yerleşke imkânları, KYK ve özel yurtlar, ulaşım güzergâhları, iklim ve şehir hayatı kılavuzu.</p>
      </div>

      <div class="city-guide-grid">

        <!-- 0. KAMPÜS İMKÂNLARI VE BÖLÜM BİNASI -->
        <div class="city-section-card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:20px;">
          <h3 style="margin-top:0; color:var(--accent-primary); display:flex; align-items:center; gap:8px;">
            <span>🏛️</span> Yenisey Yerleşkesi & Akademik İmkânlar
          </h3>
          <p>Ardahan Üniversitesi ana yerleşkesi olan <strong>Yenisey Kampüsü</strong>, Ardahan-Kars karayolu 4. km üzerinde yer almaktadır. Bilgisayar Programcılığı eğitiminin verildiği <strong>Ardahan Teknik Bilimler MYO</strong> bu kampüs içerisindedir.</p>
          <div class="grid grid-3" style="gap:12px; margin-top:14px;">
            <div style="background:var(--bg-input); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
              <h4 style="margin:0 0 6px 0; font-size:0.95rem;">💻 Bilgisayar Laboratuvarları</h4>
              <p style="margin:0; font-size:0.825rem; color:var(--text-secondary);">40+1 kişilik 2 adet masaüstü lab ve 25+1 kişilik dizüstü lab ile 100 Mbps fiber internet altyapısı.</p>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
              <h4 style="margin:0 0 6px 0; font-size:0.95rem;">📚 Hoca Ahmet Yesevi Kütüphanesi</h4>
              <p style="margin:0; font-size:0.825rem; color:var(--text-secondary);">Sınav dönemlerinde 7/24 açık olan sessiz çalışma salonları, veritabanı erişimi ve çorba ikramı.</p>
            </div>
            <div style="background:var(--bg-input); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
              <h4 style="margin:0 0 6px 0; font-size:0.95rem;">☕ Öğrenci Yaşam Merkezi & Spor</h4>
              <p style="margin:0; font-size:0.825rem; color:var(--text-secondary);">Merkezi yemekhane, yarı olimpik kapalı yüzme havuzu, kapalı spor salonu, halı saha ve kafeteryalar.</p>
            </div>
          </div>
        </div>

        <!-- 1. ULAŞIM VE GÜZERGÂHLAR -->
        <div class="city-section-card">
          <h3>🚌 Ulaşım ve Güzergâh Rehberi</h3>
          <div class="transport-routes-grid">
            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Dolmuş Hatları</span>
                <h4>Şehir Merkezi ➔ Yenisey Kampüsü</h4>
                <p>Şehir merkezinden (Kongre Caddesi & Otogar) her 10-15 dakikada bir hareket eden <strong>Kampüs Dolmuşları</strong> ile 10-15 dakikada üniversiteye ulaşabilirsiniz.</p>
              </div>
              <a href="https://maps.app.goo.gl/85kDHUSRVygXArv7A" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Kampüs) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Otogar Ulaşımı</span>
                <h4>Ardahan Şehirlerarası Otogarı</h4>
                <p>Otogardan kampüse ve şehir merkezine halk dolmuşları ve ticari taksiler kesintisiz hizmet vermektedir. Kampüse mesafesi yaklaşık 5 km'dir.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Şehirlerarası+Otobüs+Terminali" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Otogar) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Havalimanı</span>
                <h4>Kars Harakani Havalimanı ➔ Ardahan</h4>
                <p>Ardahan'a en yakın havalimanı Kars'tadır (yaklaşık 85 km). Uçak iniş saatlerine göre havalimanından Ardahan otogara doğrudan seyahat servisleri kalkmaktadır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Kars+Harakani+Havalimanı" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Havalimanı) ➔
              </a>
            </div>

            <div class="route-card">
              <div class="route-body">
                <span class="route-badge">Otobüs & Taksi</span>
                <h4>Şehirlerarası Ulaşım ve Taksi Durakları</h4>
                <p>Büyük şehirlere (İstanbul, Ankara, Erzurum, Trabzon vb.) otobüs seferleri mevcuttur. Kampüs nizamiye çıkışında ve şehir merkezinde 24 saat taksi hizmet vermektedir.</p>
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
                <h4>GSB KYK Öğrenci Yurtları</h4>
                <p>Yenisey Kampüsü içerisinde ve şehir merkezinde Kredi ve Yurtlar Kurumu'na (GSB) bağlı Nuri Vatan KYK Yurdu ve Ardahan Kız Yurdu yer almaktadır. Yemek, 24 saat sıcak su, etüt salonları ve Wi-Fi mevcuttur.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+KYK+Öğrenci+Yurdu" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (KYK) ➔
              </a>
            </div>

            <div class="house-card">
              <div class="house-body">
                <h4>Özel Yurtlar ve Apartlar</h4>
                <p>Şehir merkezinde (Kongre Cad. ve İnönü Cad. çevresi) ve kampüse yakın güzergâhlarda tek veya çok kişilik özel öğrenci apartları ve yurt seçenekleri bulunmaktadır.</p>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=Ardahan+Özel+Öğrenci+Yurtları+ve+Apartlar" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                📍 Haritada Göster (Özel Yurt) ➔
              </a>
            </div>

            <div class="house-card">
              <div class="house-body">
                <h4>Ev Kiralarken Dikkat Edilmesi Gerekenler</h4>
                <p>Kiralık ev ararken <strong>ısıtma sistemine (merkezi sistem / doğalgaz kombi)</strong>, binanın dış cephe ısı yalıtımına (ısı yalıtımsız binalarda kışın ısınma gideri yüksek olur) ve dolmuş durağına yakınlığına dikkat edilmelidir.</p>
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
  },

  async renderLabView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Kod Laboratuvarı', hash: '#lab' }
    ]);

    const initialCode = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 16px; margin: 0; }
    h2 { color: #38bdf8; font-size: 1.25rem; margin-top: 0; }
    p { font-size: 0.95rem; line-height: 1.5; color: #cbd5e1; word-break: break-word; }
    .card { background: #1e293b; padding: 16px; border-radius: 10px; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 100%; word-break: break-word; }
    button { background: #0284c7; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; width: 100%; max-width: 250px; transition: background 0.2s; min-height: 44px; }
    button:hover { background: #0369a1; }
    @media (max-width: 480px) {
      body { padding: 10px; }
      .card { padding: 12px; }
      button { width: 100%; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚡ BP Kod Laboratuvarı Live Sandbox</h2>
    <p>Burada HTML, CSS ve JavaScript kodlarınızı anlık olarak deneyebilirsiniz.</p>
    <button onclick="mesajVer()">Tıkla ve Selam Al!</button>
    <div id="output" style="margin-top:15px; font-weight:bold; color:#4ade80; word-break:break-word;"></div>
  </div>

  <script>
    function mesajVer() {
      document.getElementById('output').innerText = "🚀 Tebrikler! Kodunuz başarıyla çalıştı.";
    }
  </script>
</body>
</html>`;

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>💻 Kod Laboratuvarı & Canlı Kod Alanı</h1>
        <p>C#, SQL, JavaScript, Python ve HTML/CSS kodlarınızı canlı olarak test edin, örnek şablonları çalıştırın ve pratik yapın.</p>
      </div>

      <!-- KATEGORİ VE DİL SEÇİM TABLARI -->
      <div class="lab-tabs" id="lab-language-tabs">
        <button class="lab-tab-btn active" data-lang="html">🌐 HTML / CSS / JS (Live Sandbox)</button>
        <button class="lab-tab-btn" data-lang="js">⚡ JavaScript Console</button>
        <button class="lab-tab-btn" data-lang="csharp">🔷 C# Programlama</button>
        <button class="lab-tab-btn" data-lang="sql">🗄️ SQL Veritabanı</button>
        <button class="lab-tab-btn" data-lang="python">🐍 Python</button>
      </div>

      <div class="lab-workspace-grid">
        <!-- KOD EDİTÖR KARTI -->
        <div class="card" style="background:var(--bg-card); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
            <h3 style="margin:0; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
              <span>📝</span> Kod Editörü
            </h3>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button id="btn-run-code" class="btn btn-primary btn-sm">▶️ Çalıştır</button>
              <button id="btn-reset-code" class="btn btn-outline btn-sm">🔄 Sıfırla</button>
              <button id="btn-copy-code" class="btn btn-outline btn-sm">📋 Kopyala</button>
            </div>
          </div>
          <textarea id="lab-code-input" rows="22" style="width:100%; font-family: Consolas, monospace, 'Fira Code'; font-size: 0.95rem; line-height:1.5; padding: 14px; border-radius: 8px; background: var(--bg-input, #0f172a); color: var(--text-primary, #f8fafc); border: 1px solid var(--border-color); resize: vertical; min-height: 520px;" spellcheck="false">${initialCode}</textarea>
        </div>

        <!-- ÇIKTI VE EKRAN KARTI -->
        <div class="card" style="background:var(--bg-card); padding:16px; border-radius:12px; border:1px solid var(--border-color); display:flex; flex-direction:column;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
              <span>🖥️</span> Çıktı Ekranı / Konsol
            </h3>
            <div style="display:flex; align-items:center; gap:8px;">
              <button id="btn-clear-console" class="btn btn-outline btn-sm" title="Konsol Çıktısını Temizle">🧹 Temizle</button>
              <span class="badge badge-success" id="lab-status-badge">Hazır</span>
            </div>
          </div>
          <div id="lab-preview-container" style="flex:1; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid var(--border-color); min-height: 520px;">
            <iframe id="lab-preview-iframe" style="width:100%; height:100%; min-height:520px; border:none;"></iframe>
          </div>
          <div id="lab-console-output" class="hidden" style="flex:1; background:#090d16; color:#38bdf8; font-family:Consolas, 'Fira Code', monospace; font-size: 1.05rem; line-height: 1.6; padding:18px; border-radius:8px; overflow-y:auto; border:2px solid var(--accent-primary); min-height:520px; white-space:pre-wrap; box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);"></div>
        </div>
      </div>

      <!-- ÖRNEK ŞABLONLAR VE HIZLI KOD KARTLARI -->
      <section class="section-block">
        <h3 style="margin-bottom:16px;">📚 Hazır Kod Örnekleri & Sınav Şablonları</h3>
        <div class="grid grid-3" style="gap:16px;">
          <div class="card" style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color);">
            <h4>🔷 C# İki Sayının Toplamı ve Koşul</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Kullanıcıdan alınan verilerin if-else kontrolü ve ekrana yazdırılması.</p>
            <button class="btn btn-outline btn-sm load-template-btn" data-type="csharp-1" style="margin-top:10px;">Şablonu Yükle</button>
          </div>

          <div class="card" style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color);">
            <h4>🗄️ SQL SELECT & JOIN Sorgusu</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Öğrenciler ve Dersler tablolarının INNER JOIN ile birleştirilmesi.</p>
            <button class="btn btn-outline btn-sm load-template-btn" data-type="sql-1" style="margin-top:10px;">Şablonu Yükle</button>
          </div>

          <div class="card" style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color);">
            <h4>⚡ JS Array & Map / Filter</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Öğrenci notları dizisinde geçen öğrencileri filtreleme örneği.</p>
            <button class="btn btn-outline btn-sm load-template-btn" data-type="js-1" style="margin-top:10px;">Şablonu Yükle</button>
          </div>
        </div>
      </section>
    `;

    this.appContainer.innerHTML = html;

    // Etkileşim Kurulumu
    const codeInput = document.getElementById('lab-code-input');
    const iframe = document.getElementById('lab-preview-iframe');
    const consoleOutput = document.getElementById('lab-console-output');
    const previewContainer = document.getElementById('lab-preview-container');
    const runBtn = document.getElementById('btn-run-code');
    const resetBtn = document.getElementById('btn-reset-code');
    const copyBtn = document.getElementById('btn-copy-code');
    const clearConsoleBtn = document.getElementById('btn-clear-console');
    const statusBadge = document.getElementById('lab-status-badge');

    if (clearConsoleBtn && consoleOutput) {
      clearConsoleBtn.onclick = () => {
        consoleOutput.textContent = '🧹 Konsol temizlendi.';
      };
    }

    let currentLang = 'html';

    const templates = {
      html: initialCode,
      js: `// JavaScript Console Test
const ogrenciler = [
  { ad: "Ahmet", not: 75 },
  { ad: "Ayşe", not: 90 },
  { ad: "Mehmet", not: 45 },
  { ad: "Fatma", not: 82 }
];

console.log("=== TÜM ÖĞRENCİLER ===");
console.table(ogrenciler);

const gecenler = ogrenciler.filter(o => o.not >= 50);
console.log("\\n=== DERSTEN GEÇEN ÖĞRENCİLER ===");
gecenler.forEach(o => console.log(\`✅ \${o.ad}: \${o.not}\`));`,

      csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("=== C# DERSİ SINAV HAZIRLIK ÖRNEĞİ ===");
        int vize = 60;
        int final = 75;
        double ortalama = (vize * 0.4) + (final * 0.6);
        
        Console.WriteLine($"Vize Notu: {vize}");
        Console.WriteLine($"Final Notu: {final}");
        Console.WriteLine($"Hesaplanan Ortalama: {ortalama}");
        
        if (ortalama >= 50 && final >= 50) {
            Console.WriteLine("Sonuç: ✅ DERSTEN BAŞARILI İLE GEÇTİNİZ!");
        } else {
            Console.WriteLine("Sonuç: ❌ KALDINIZ (Bütünleme Sınavına Girmeniz Gerekir)");
        }
    }
}`,

      sql: `-- SQL Veritabanı Sorgu Simülasyonu
-- 1. Ogrenciler Tablosunu Oluştur
CREATE TABLE Ogrenciler (
    OgrenciID INT PRIMARY KEY,
    AdSoyad VARCHAR(50),
    Bolum VARCHAR(50)
);

-- 2. Veri Ekle
INSERT INTO Ogrenciler VALUES (1, 'Ahmet Yılmaz', 'Bilgisayar Programcılığı');
INSERT INTO Ogrenciler VALUES (2, 'Zeynep Kaya', 'Bilgisayar Programcılığı');

-- 3. Sorgula
SELECT * FROM Ogrenciler WHERE Bolum = 'Bilgisayar Programcılığı';`,

      python: `# Python Temel Örnek
def harf_notu_hesapla(vize, final):
    ort = (vize * 0.4) + (final * 0.6)
    print(f"Dönem Ortalaması: {ort}")
    
    if ort >= 90:
        return "AA"
    elif ort >= 80:
        return "BA"
    elif ort >= 70:
        return "BB"
    elif ort >= 50:
        return "CC"
    else:
        return "FF"

not_sonucu = harf_notu_hesapla(75, 85)
print(f"Harf Notunuz: {not_sonucu}")`
    };

    const updateView = () => {
      const code = codeInput.value;
      if (currentLang === 'html') {
        previewContainer.style.display = 'block';
        consoleOutput.classList.add('hidden');
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        if (statusBadge) statusBadge.textContent = 'Canlı Önizleme Aktif';
      } else {
        previewContainer.style.display = 'none';
        consoleOutput.classList.remove('hidden');
        if (currentLang === 'js') {
          let logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ')),
            table: (data) => logs.push(JSON.stringify(data, null, 2)),
            error: (...args) => logs.push('❌ ERROR: ' + args.join(' ')),
            warn: (...args) => logs.push('⚠️ WARN: ' + args.join(' '))
          };
          try {
            const run = new Function('console', code);
            run(customConsole);
            consoleOutput.textContent = logs.join('\n') || '(Konsol çıktısı boş)';
            if (statusBadge) statusBadge.textContent = 'Çalıştırıldı';
          } catch (err) {
            consoleOutput.textContent = '❌ Hata: ' + err.message;
            if (statusBadge) statusBadge.textContent = 'Hata';
          }
        } else {
          // Simüle edilmiş derleyici çıktısı (C#, SQL, Python)
          consoleOutput.textContent = `[Simülasyon Çıktısı - ${currentLang.toUpperCase()}]\n----------------------------------------\n`;
          if (currentLang === 'csharp') {
            consoleOutput.textContent += `=== C# DERSİ SINAV HAZIRLIK ÖRNEĞİ ===\nVize Notu: 60\nFinal Notu: 75\nHesaplanan Ortalama: 69\nSonuç: ✅ DERSTEN BAŞARILI İLE GEÇTİNİZ!`;
          } else if (currentLang === 'sql') {
            consoleOutput.textContent += `OgrenciID | AdSoyad        | Bolum\n----------+----------------+-----------------------\n1         | Ahmet Yılmaz   | Bilgisayar Programcılığı\n2         | Zeynep Kaya    | Bilgisayar Programcılığı\n\n(2 satır etkilendi)`;
          } else if (currentLang === 'python') {
            consoleOutput.textContent += `Dönem Ortalaması: 81.0\nHarf Notunuz: BA`;
          }
          if (statusBadge) statusBadge.textContent = 'Simüle Edildi';
        }
      }
    };

    updateView();

    runBtn.onclick = updateView;

    resetBtn.onclick = () => {
      codeInput.value = templates[currentLang] || '';
      updateView();
    };

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(codeInput.value);
      copyBtn.textContent = '✅ Kopyalandı!';
      setTimeout(() => copyBtn.textContent = '📋 Kopyala', 2000);
    };

    document.querySelectorAll('#lab-language-tabs .lab-tab-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#lab-language-tabs .lab-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLang = btn.getAttribute('data-lang');
        codeInput.value = templates[currentLang] || '';
        updateView();
      };
    });

    document.querySelectorAll('.load-template-btn').forEach(btn => {
      btn.onclick = () => {
        const type = btn.getAttribute('data-type');
        if (type === 'csharp-1') {
          currentLang = 'csharp';
          const tBtn = document.querySelector('#lab-language-tabs [data-lang="csharp"]');
          if (tBtn) tBtn.click();
        } else if (type === 'sql-1') {
          currentLang = 'sql';
          const tBtn = document.querySelector('#lab-language-tabs [data-lang="sql"]');
          if (tBtn) tBtn.click();
        } else if (type === 'js-1') {
          currentLang = 'js';
          const tBtn = document.querySelector('#lab-language-tabs [data-lang="js"]');
          if (tBtn) tBtn.click();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    });
  },

  async renderGlossaryView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Terimler Sözlüğü', hash: '#glossary' }
    ]);
    const terms = await CourseService.loadGlossary();

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>📖 Bilgisayar Programcılığı Terimler Sözlüğü</h1>
        <p>Yazılım, donanım, veritabanı ve web teknolojileri terimlerinin açıklamaları.</p>
      </div>

      <div style="margin-bottom: 24px;">
        <input type="text" id="glossary-search-input" placeholder="Terim ara (örn: Algoritma, SQL, CRUD, API)..." style="width:100%; max-width:500px; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-input); color:var(--text-primary);">
      </div>

      <div class="grid grid-2" id="glossary-grid" style="gap: 16px;">
        ${terms.map(t => `
          <div class="card glossary-card" style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <h3 style="margin:0; font-size:1.1rem; color:var(--accent-primary);">${Utils.escapeHTML(t.term)}</h3>
              <span class="badge badge-info">${Utils.escapeHTML(t.category)}</span>
            </div>
            <p style="margin:0; font-size:0.9rem; color:var(--text-secondary);">${Utils.escapeHTML(t.definition)}</p>
          </div>
        `).join('')}
      </div>
    `;

    this.appContainer.innerHTML = html;

    const input = document.getElementById('glossary-search-input');
    if (input) {
      input.oninput = (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.glossary-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          card.style.display = text.includes(query) ? 'block' : 'none';
        });
      };
    }
  },

  async renderBookmarksView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Favorilerim', hash: '#bookmarks' }
    ]);

    const bookmarkKeys = Storage.getAllBookmarks();
    const coursesInfo = await CourseService.loadCourses();

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>⭐ Favori Ders Konularım</h1>
        <p>Daha sonra tekrar etmek üzere kaydettiğiniz ders konuları ve rehber sayfaları.</p>
      </div>
    `;

    if (bookmarkKeys.length === 0) {
      html += `
        <div class="card text-center" style="background:var(--bg-card); padding:40px; border-radius:12px; border:1px solid var(--border-color);">
          <div style="font-size:3rem; margin-bottom:12px;">⭐</div>
          <h3>Henüz favori konu eklemediniz</h3>
          <p style="color:var(--text-secondary);">Ders konularını incelerken sağ üstteki yıldız veya F kısayolu ile konuları favorilerinize ekleyebilirsiniz.</p>
          <a href="#courses" class="btn btn-primary" style="margin-top:16px;">📚 Derslere Göz At</a>
        </div>
      `;
    } else {
      html += `<div class="grid grid-2" style="gap:16px;">`;
      for (const key of bookmarkKeys) {
        const [courseId, lessonId] = key.split(':');
        const course = coursesInfo.courses.find(c => c.id === courseId);
        const courseTitle = course ? course.title : courseId;

        html += `
          <div class="card" style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <span class="badge badge-primary">${Utils.escapeHTML(courseTitle)}</span>
              <h4 style="margin:8px 0 0 0;">${Utils.escapeHTML(lessonId || courseTitle)}</h4>
            </div>
            <div style="display:flex; gap:8px;">
              <a href="#lesson/${courseId}/${lessonId}" class="btn btn-primary btn-sm">Derse Git ➔</a>
            </div>
          </div>
        `;
      }
      html += `</div>`;
    }

    this.appContainer.innerHTML = html;
  },

  async renderCalendarView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Çalışma Takvimi', hash: '#calendar' }
    ]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>📅 Akademik Çalışma Takvimi & Sınav Tarihleri</h1>
        <p>Bilgisayar Programcılığı ders çalışma programı, sınav haftaları ve staj başvuru takvimi.</p>
      </div>

      <div class="grid grid-2" style="gap:20px; margin-bottom:30px;">
        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <h3>📌 Önemli Akademik Tarihler</h3>
          <ul class="styled-list" style="margin-top:12px;">
            <li><strong>Güz Dönemi Vize Sınavları:</strong> Kasım ayı 2. ve 3. haftası</li>
            <li><strong>Güz Dönemi Final Sınavları:</strong> Ocak ayı 1. ve 2. haftası</li>
            <li><strong>Bütünleme Sınavları:</strong> Ocak ayı son haftası</li>
            <li><strong>Bahar Dönemi Vize Sınavları:</strong> Nisan ayı 2. ve 3. haftası</li>
            <li><strong>Bahar Dönemi Final Sınavları:</strong> Haziran ayı 1. ve 2. haftası</li>
            <li><strong>30 İş Günü Zorunlu Yaz Stajı Başvurusu:</strong> Nisan - Mayıs ayları</li>
          </ul>
        </div>

        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <h3>💡 Önerilen Haftalık Çalışma Programı</h3>
          <ul class="styled-list" style="margin-top:12px;">
            <li><strong>Pazartesi:</strong> C# Programlama & Döngüler (Laboratuvar Pratiği)</li>
            <li><strong>Salı:</strong> Veritabanı Tasarımı & SQL Query Alıştırmaları</li>
            <li><strong>Çarşamba:</strong> Web Tasarımı (HTML5 / CSS Flexbox & JS)</li>
            <li><strong>Perşembe:</strong> Matematik & Algoritma Geliştirme</li>
            <li><strong>Cuma:</strong> Quiz & Kod Laboratuvarı Pratiği</li>
            <li><strong>Hafta Sonu:</strong> Mini Proje Geliştirme ve Özet Tekrarı</li>
          </ul>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;
  },

  async renderRoadmapView() {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Yol Haritası', hash: '#roadmap' }
    ]);

    let html = `
      ${breadcrumbHTML}
      <div class="page-header">
        <h1>🚀 Bilgisayar Programcılığı Öğrenme Yol Haritası</h1>
        <p>2 Yıllık Ön Lisans eğitimi boyunca adım adım yazılım ve kariyer gelişim haritası.</p>
      </div>

      <div class="roadmap-grid" style="display:flex; flex-direction:column; gap:20px;">
        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <span class="badge badge-primary">1. YARIYIL (GÜZ)</span>
          <h3 style="margin-top:8px;">Temeller ve Algoritmik Düşünce</h3>
          <p style="color:var(--text-secondary);">Programlamaya Giriş, C# Syntax, Matematik, Bilgisayar Donanımı ve Ofis Yazılımları.</p>
        </div>

        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <span class="badge badge-primary">2. YARIYIL (BAHAR)</span>
          <h3 style="margin-top:8px;">Veritabanı & Nesne Yönelimli Programlama</h3>
          <p style="color:var(--text-secondary);">SQL Veritabanı Yönetimi, C# OOP (Nesne Yönelim), HTML/CSS Web Temelleri.</p>
        </div>

        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <span class="badge badge-primary">3. YARIYIL (GÜZ)</span>
          <h3 style="margin-top:8px;">İleri Web & Backend Geliştirme</h3>
          <p style="color:var(--text-secondary);">ASP.NET Core / Modern Web Frameworks, JavaScript, Ağ ve Sistem Yönetimi.</p>
        </div>

        <div class="card" style="background:var(--bg-card); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
          <span class="badge badge-success">4. YARIYIL (BAHAR) & STAJ</span>
          <h3 style="margin-top:8px;">Bitirme Projesi & 30 İş Günü Zorunlu Staj</h3>
          <p style="color:var(--text-secondary);">Bitirme Projesi teslimi, DGS hazırlığı ve sektörde staj uygulaması.</p>
        </div>
      </div>
    `;

    this.appContainer.innerHTML = html;
  },

  async renderPrintSummaryView(courseId) {
    this.renderSkeleton(this.appContainer);
    const breadcrumbHTML = this.renderBreadcrumb([
      { title: 'Ana Sayfa', hash: '#home' },
      { title: 'Ders Özeti', hash: '#print-summary' }
    ]);

    const coursesInfo = await CourseService.loadCourses();
    const course = coursesInfo.courses.find(c => c.id === courseId) || coursesInfo.courses[0];
    const lessonsData = course ? await CourseService.loadCourseLessons(course.id) : null;

    let html = `
      ${breadcrumbHTML}
      <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1>🖨️ ${Utils.escapeHTML(course ? course.title : 'Ders')} - Yazdırılabilir Sınav Özet Kartı</h1>
          <p>Sınav öncesi hızlı tekrar ve yazdırılabilir özet notları.</p>
        </div>
        <button onclick="window.print()" class="btn btn-primary">🖨️ Yazdır / PDF İndir</button>
      </div>

      <div class="card" style="background:var(--bg-card); padding:24px; border-radius:12px; border:1px solid var(--border-color); margin-top:20px;">
        <h3>${Utils.escapeHTML(course ? course.title : '')} Konu Özetleri</h3>
        ${lessonsData && lessonsData.lessons ? lessonsData.lessons.map(l => `
          <div style="margin-top:16px; padding-bottom:16px; border-bottom:1px solid var(--border-color);">
            <h4>📌 ${Utils.escapeHTML(l.title)}</h4>
            <div>${l.summaryHTML || l.goal}</div>
          </div>
        `).join('') : '<p>Özet bulunamadı.</p>'}
      </div>
    `;

    this.appContainer.innerHTML = html;
  }
};