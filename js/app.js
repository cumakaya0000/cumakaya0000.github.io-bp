/**
 * BP Rehberi - Ana Başlatıcı Modül (app.js)
 * V2.0: Türkiye Geneli Çoklu Üniversite, Dinamik Sidebar Profil & Onboarding Akışı
 */
import { Router } from './router.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { SearchEngine } from './search.js';
import { Utils } from './utils.js';
import { UniversityService } from './university.js';

document.addEventListener('DOMContentLoaded', async () => {
  UI.init();
  initTheme();
  initDensity();
  initSidebarState();
  window.updateSidebarProfileUI = updateSidebarProfileUI;
  updateSidebarProfileUI();

  // ROTALAR
  Router.addRoute('home', () => UI.renderHomeView());
  Router.addRoute('dashboard', () => UI.renderHomeView());
  Router.addRoute('onboarding', () => UI.renderOnboardingView());
  Router.addRoute('universities', () => UI.renderUniversitiesView());
  Router.addRoute('curriculum', (universityId) => UI.renderCurriculumView(universityId));
  Router.addRoute('weekly-plan', (universityId) => UI.renderWeeklyPlanView(universityId));
  Router.addRoute('compare', () => UI.renderCompareView());
  Router.addRoute('cities', () => UI.renderCitiesView());
  Router.addRoute('exams', () => UI.renderExamsView());
  Router.addRoute('settings', () => UI.renderSettingsView());
  Router.addRoute('profile', () => UI.renderSettingsView());

  // MEVCUT ROTALAR (GERİYE DÖNÜK UYUMLULUK)
  Router.addRoute('courses', () => UI.renderCoursesView());
  Router.addRoute('course', (courseId) => UI.renderCourseDetailView(courseId));
  Router.addRoute('lesson', (courseId, lessonId) => UI.renderLessonView(courseId, lessonId));
  Router.addRoute('roadmap', () => UI.renderRoadmapView());
  Router.addRoute('lab', () => UI.renderLabView());
  Router.addRoute('projects', () => UI.renderProjectsView());
  Router.addRoute('quizzes', () => UI.renderQuizzesView());
  Router.addRoute('hardware-diag', () => UI.renderHardwareDiagView());
  Router.addRoute('city', () => UI.renderCityGuideView());
  Router.addRoute('learning-city-section', () => UI.renderCityGuideView());
  Router.addRoute('stats-section', () => UI.renderCityGuideView());
  Router.addRoute('university', () => UI.renderUniversityView());
  Router.addRoute('academic-section', () => UI.renderUniversityView());
  Router.addRoute('career', () => UI.renderCareerView());
  Router.addRoute('glossary', () => UI.renderGlossaryView());
  Router.addRoute('calendar', () => UI.renderCalendarView());
  Router.addRoute('bookmarks', () => UI.renderBookmarksView());
  Router.addRoute('print-summary', (courseId) => UI.renderPrintSummaryView(courseId));

  // MENÜLER VE İNTERAKTİVİTE
  initCollapsibleNav();
  initSearchEvents();
  initCommandPalette();
  initKeyboardShortcuts();
  initInfoModal();
  initZoomToggle();
  initReadingProgressBar();
  initMobileNavEvents();
  initSidebarCollapseToggle();
  checkOnboarding();

  Router.init();
  await Router.handleRoute();
});

/**
 * Sidebar Profil ve Üniversite Bilgilerini Dinamik Güncelleme
 */
export async function updateSidebarProfileUI() {
  const profile = Storage.getUserProfile();
  const isOnboarded = Storage.isOnboarded();

  // Kullanıcı üniversitesini seçip onaylamadığı sürece (<aside id="sidebar">) ve menü butonu tamamen gizli olmalıdır
  const sidebar = document.getElementById('sidebar');
  const headerToggleBtn = document.getElementById('sidebar-toggle-btn');
  const bottomNav = document.querySelector('.bottom-nav-bar');
  const headerChangeUniBtn = document.getElementById('btn-header-change-uni');

  if (!isOnboarded) {
    if (sidebar) sidebar.classList.add('hidden');
    if (headerToggleBtn) {
      headerToggleBtn.classList.add('hidden');
      headerToggleBtn.style.setProperty('display', 'none', 'important');
    }
    if (bottomNav) bottomNav.style.setProperty('display', 'none', 'important');
    if (headerChangeUniBtn) headerChangeUniBtn.style.display = 'none';
  } else {
    if (sidebar) sidebar.classList.remove('hidden');
    if (headerToggleBtn) {
      headerToggleBtn.classList.remove('hidden');
      headerToggleBtn.style.removeProperty('display');
    }
    if (bottomNav) bottomNav.style.removeProperty('display');
    if (headerChangeUniBtn) headerChangeUniBtn.style.display = 'inline-flex';
  }

  const uniNameEl = document.getElementById('sidebar-uni-name');
  const deptNameEl = document.getElementById('sidebar-dept-name');
  const avatarImgEl = document.getElementById('sidebar-avatar-img');
  const avatarContainer = document.getElementById('sidebar-avatar-container');
  const uniLinksContainer = document.getElementById('sidebar-uni-links');

  if (uniNameEl) uniNameEl.textContent = profile.university ? profile.university.toUpperCase() : 'ÜNİVERSİTENİ SEÇ';
  if (deptNameEl) deptNameEl.textContent = profile.department || 'Bilgisayar Programcılığı';

  if (profile.universityId) {
    const uni = await UniversityService.getUniversityById(profile.universityId);
    if (uni && uni.logo && avatarImgEl) {
      avatarImgEl.src = uni.logo;
      avatarImgEl.style.display = 'block';
    } else if (avatarContainer) {
      const initials = (profile.university || 'BP').split(' ').map(w => w[0]).join('').substring(0, 3);
      if (avatarImgEl) avatarImgEl.style.display = 'none';
      avatarContainer.setAttribute('data-initials', initials);
    }

    if (uniLinksContainer && uni) {
      const uniWebsite = uni.website || '#';
      const deptWebsite = uni.departmentUrl || uni.website || '#';
      const ubysWebsite = uni.ubysUrl || '#';

      uniLinksContainer.innerHTML = `
        <a href="${uniWebsite}" target="_blank" rel="noopener" class="sidebar-social-btn" title="${Utils.escapeHTML(uni.name)} Resmî İnternet Sitesi">
          <i data-lucide="school"></i>
          <span class="social-btn-label">Üniversite</span>
        </a>
        <a href="${deptWebsite}" target="_blank" rel="noopener" class="sidebar-social-btn" title="Resmî Bölüm Sayfası">
          <i data-lucide="globe"></i>
          <span class="social-btn-label">Bölüm</span>
        </a>
        <a href="${ubysWebsite}" target="_blank" rel="noopener" class="sidebar-social-btn" title="UBYS / OBS Girişi">
          <i data-lucide="graduation-cap"></i>
          <span class="social-btn-label">UBYS</span>
        </a>
      `;
      Utils.refreshLucideIcons();
    }
  } else {
    if (avatarImgEl) avatarImgEl.style.display = 'none';
    if (avatarContainer) avatarContainer.setAttribute('data-initials', 'BP');
  }
}

/**
 * Tema Yönetimi (Dark / Light / System)
 */
function initTheme() {
  const mode = Storage.getThemeMode();
  applyThemeMode(mode);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    updateThemeIcon(themeToggleBtn, mode);

    themeToggleBtn.addEventListener('click', () => {
      const activeMode = Storage.getThemeMode();
      const nextMode = activeMode === 'dark' ? 'light' : activeMode === 'light' ? 'system' : 'dark';
      Storage.setThemeMode(nextMode);
      applyThemeMode(nextMode);
      updateThemeIcon(themeToggleBtn, nextMode);
    });
  }
}

function applyThemeMode(mode) {
  let effectiveTheme = mode;
  if (mode === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', effectiveTheme);
}

function updateThemeIcon(btn, mode) {
  const icons = { dark: '🌙', light: '☀️', system: '💻' };
  const labels = { dark: 'Koyu', light: 'Açık', system: 'Sistem' };
  const icon = icons[mode] || '☀️';
  const label = labels[mode] || 'Açık';
  btn.innerHTML = `<span class="theme-btn-icon">${icon}</span><span class="theme-btn-label desktop-only">${label}</span>`;
  btn.setAttribute('title', `Tema: ${label}`);
}

function initDensity() {
  const density = Storage.getDensity();
  document.documentElement.setAttribute('data-density', density);
}

function updateSidebarToggleUI(isCollapsed) {
  const toggleBtn = document.getElementById('btn-toggle-compact-sidebar');
  if (toggleBtn) {
    const textSpan = toggleBtn.querySelector('.nav-text');
    if (textSpan) {
      textSpan.textContent = isCollapsed ? 'Menüyü Aç' : 'Menüyü Kapat';
    }
  }
}

function initSidebarState() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('collapsed');
      updateSidebarToggleUI(false);
    } else {
      sidebar.classList.remove('open');
    }
  }
}

function initSidebarCollapseToggle() {
  const toggleBtn = document.getElementById('btn-toggle-compact-sidebar');
  const headerToggleBtn = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-trigger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');

  if (!sidebar) return;

  const toggleSidebar = (e) => {
    if (e) e.stopPropagation();
    if (!Storage.isOnboarded()) {
      return; // Kullanıcı üniversitesini seçmediği sürece menü toggle pasiftir
    }
    if (window.innerWidth <= 1024) {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open', sidebar.classList.contains('open'));
    } else {
      sidebar.classList.toggle('collapsed');
      const isNowCollapsed = sidebar.classList.contains('collapsed');
      Storage.setSidebarCollapsed(isNowCollapsed);
      updateSidebarToggleUI(isNowCollapsed);
    }
  };

  if (toggleBtn) toggleBtn.onclick = toggleSidebar;
  if (headerToggleBtn) headerToggleBtn.onclick = toggleSidebar;
  if (mobileMenuBtn) mobileMenuBtn.onclick = toggleSidebar;

  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    };
  }

  sidebar.querySelectorAll('.nav-link, .nav-sub-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
      }
    });
  });
}

function initCollapsibleNav() {
  const sectionHeaders = document.querySelectorAll('.nav-section-header');
  sectionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-target');
      const body = document.getElementById(targetId);
      if (!body) return;

      const isExpanded = header.classList.contains('active');
      if (isExpanded) {
        header.classList.remove('active');
        body.classList.add('collapsed');
      } else {
        header.classList.add('active');
        body.classList.remove('collapsed');
      }
    });
  });
}

/**
 * COMMAND PALETTE (CTRL+K) VE GRUPLANDIRILMIŞ ARAMA
 */
function initCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const input = document.getElementById('cmd-input');
  const resultsBox = document.getElementById('cmd-results-list');
  const trigger = document.getElementById('cmd-palette-trigger');

  if (!modal || !input || !resultsBox) return;

  const openPalette = () => {
    modal.classList.remove('hidden');
    input.value = '';
    input.focus();
  };

  const closePalette = () => {
    modal.classList.add('hidden');
  };

  if (trigger) trigger.addEventListener('click', openPalette);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePalette();
  });

  input.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.trim().length < 2) {
      renderDefaultCmdActions(resultsBox);
      return;
    }

    const grouped = await SearchEngine.searchGrouped(query);
    if (!grouped || Object.values(grouped).every(arr => arr.length === 0)) {
      resultsBox.innerHTML = `<div class="search-no-result">Sonuç bulunamadı.</div>`;
      return;
    }

    let html = '';
    for (const [groupName, items] of Object.entries(grouped)) {
      if (items.length > 0) {
        html += `<div class="cmd-section-title">${groupName}</div>`;
        items.forEach(res => {
          html += `
            <a href="${res.hash}" class="cmd-item">
              <span class="cmd-item-title">${Utils.escapeHTML(res.title)}</span>
              <span class="cmd-item-sub">${Utils.escapeHTML(res.subtitle)}</span>
            </a>
          `;
        });
      }
    }

    resultsBox.innerHTML = html;
  });

  resultsBox.addEventListener('click', (e) => {
    if (e.target.closest('.cmd-item')) {
      closePalette();
    }
  });
}

function renderDefaultCmdActions(container) {
  container.innerHTML = `
    <div class="cmd-section-title">HIZLI AKSİYONLAR</div>
    <a href="#home" class="cmd-item"><span class="cmd-item-icon">🏠</span> Ana Sayfa</a>
    <a href="#universities" class="cmd-item"><span class="cmd-item-icon">🏛️</span> Üniversite Seçimi</a>
    <a href="#compare" class="cmd-item"><span class="cmd-item-icon">⚖️</span> Müfredat Karşılaştır</a>
    <a href="#weekly-plan" class="cmd-item"><span class="cmd-item-icon">📅</span> Haftalık Ders Planı</a>
    <a href="#exams" class="cmd-item"><span class="cmd-item-icon">📝</span> Sınav Sistemi</a>
    <a href="#courses" class="cmd-item"><span class="cmd-item-icon">📚</span> Derslere Git</a>
    <a href="#lab" class="cmd-item"><span class="cmd-item-icon">💻</span> Kod Laboratuvarı</a>
    <a href="#settings" class="cmd-item"><span class="cmd-item-icon">⚙️</span> Ayarlar</a>
  `;
}

function initInfoModal() {
  const infoModal = document.getElementById('site-info-modal');

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('#btn-open-info-modal, .breadcrumb-info-btn');
    if (openBtn && infoModal) {
      infoModal.classList.remove('hidden');
      return;
    }

    const closeBtn = e.target.closest('#btn-close-info-modal, #btn-confirm-info-modal');
    if (closeBtn && infoModal) {
      infoModal.classList.add('hidden');
      return;
    }

    if (e.target === infoModal) {
      infoModal.classList.add('hidden');
    }
  });
}

function initZoomToggle() {
  const zoomLevels = [
    { zoom: '90%', label: 'A', title: 'Varsayılan Metin Boyutu (A - %90)' },
    { zoom: '100%', label: 'A+', title: 'Büyütülmüş Metin (A+ - %100)' },
    { zoom: '110%', label: 'A++', title: 'Çok Büyük Metin (A++ - %110)' }
  ];

  let levelIndex = parseInt(Storage.get('site_zoom_level') || '0', 10);
  if (isNaN(levelIndex) || levelIndex < 0 || levelIndex >= zoomLevels.length) {
    levelIndex = 0;
  }

  const applyZoomLevel = (idx) => {
    const level = zoomLevels[idx];
    document.body.style.zoom = level.zoom;
    document.documentElement.style.zoom = level.zoom;

    document.querySelectorAll('.text-zoom-group').forEach(group => {
      group.querySelectorAll('.zoom-seg-btn').forEach(btn => {
        const btnIdx = parseInt(btn.getAttribute('data-zoom-idx'), 10);
        if (btnIdx === idx) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  };

  applyZoomLevel(levelIndex);

  document.addEventListener('click', (e) => {
    const segBtn = e.target.closest('.zoom-seg-btn');
    if (segBtn) {
      const idx = parseInt(segBtn.getAttribute('data-zoom-idx'), 10);
      if (!isNaN(idx) && idx >= 0 && idx < zoomLevels.length) {
        levelIndex = idx;
        Storage.set('site_zoom_level', levelIndex.toString());
        applyZoomLevel(levelIndex);
      }
    }
  });
}

function initKeyboardShortcuts() {
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const btnShortcuts = document.getElementById('btn-shortcuts-modal');
  const btnCloseShortcuts = document.getElementById('btn-close-shortcuts');

  if (btnShortcuts) {
    btnShortcuts.addEventListener('click', () => {
      shortcutsModal.classList.remove('hidden');
    });
  }

  if (btnCloseShortcuts) {
    btnCloseShortcuts.addEventListener('click', () => {
      shortcutsModal.classList.add('hidden');
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const cmdModal = document.getElementById('command-palette-modal');
      const cmdInput = document.getElementById('cmd-input');
      if (cmdModal && cmdInput) {
        cmdModal.classList.remove('hidden');
        cmdInput.focus();
      }
      return;
    }

    if (e.key === 'Escape') {
      document.querySelectorAll('.cmd-modal-overlay, .onboarding-overlay').forEach(m => m.classList.add('hidden'));
      const searchBox = document.getElementById('search-results-box');
      if (searchBox) searchBox.classList.add('hidden');
      return;
    }

    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    if (e.key === '?') {
      if (shortcutsModal) shortcutsModal.classList.toggle('hidden');
      return;
    }

    if (window.location.hash.startsWith('#lesson/')) {
      if (e.key.toLowerCase() === 'j') {
        const nextBtn = document.getElementById('btn-next-lesson');
        if (nextBtn) nextBtn.click();
      } else if (e.key.toLowerCase() === 'k') {
        const backBtn = document.querySelector('.btn-back');
        if (backBtn) backBtn.click();
      } else if (e.key.toLowerCase() === 'f') {
        const bookmarkBtn = document.getElementById('btn-toggle-bookmark');
        if (bookmarkBtn) bookmarkBtn.click();
      }
    }
  });
}

function initReadingProgressBar() {
  window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }

    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    progressBar.style.width = `${progress}%`;
  });
}

function initSearchEvents() {
  const searchInput = document.getElementById('global-search-input');
  const searchResultsBox = document.getElementById('search-results-box');

  if (!searchInput || !searchResultsBox) return;

  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.trim().length < 2) {
      searchResultsBox.classList.add('hidden');
      searchResultsBox.innerHTML = '';
      return;
    }

    const grouped = await SearchEngine.searchGrouped(query);
    if (!grouped || Object.values(grouped).every(arr => arr.length === 0)) {
      searchResultsBox.classList.remove('hidden');
      searchResultsBox.innerHTML = `<div class="search-no-result">🔍 Sonuç bulunamadı.</div>`;
      return;
    }

    let html = '';
    for (const [groupName, items] of Object.entries(grouped)) {
      if (items.length > 0) {
        html += `<div class="cmd-section-title">${groupName}</div>`;
        items.forEach(res => {
          html += `
            <a href="${res.hash}" class="search-result-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span class="res-badge">${res.icon || '📌'} ${res.badge}</span>
              </div>
              <div class="res-title">${Utils.escapeHTML(res.title)}</div>
              <div class="res-sub">${Utils.escapeHTML(res.subtitle)}</div>
            </a>
          `;
        });
      }
    }

    searchResultsBox.classList.remove('hidden');
    searchResultsBox.innerHTML = html;
  });

  searchResultsBox.addEventListener('click', (e) => {
    if (e.target.closest('.search-result-item')) {
      searchResultsBox.classList.add('hidden');
      searchInput.value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-search')) {
      searchResultsBox.classList.add('hidden');
    }
  });
}

function initMobileNavEvents() {
  // Handled by unified initSidebarCollapseToggle
}

function checkOnboarding() {
  if (!Storage.isOnboarded()) {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#home' || window.location.hash === '#dashboard') {
      Router.navigate('#onboarding');
    }
  }
}
