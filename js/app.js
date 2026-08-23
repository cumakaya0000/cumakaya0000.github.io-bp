/**
 * BP Rehberi - Ana Başlatıcı Modül (app.js)
 * V1.3: Command Palette (Ctrl+K), Keyboard Shortcuts, Reading Progress, Collapsible Sidebar & Mobile Bottom Nav
 */
import { Router } from './router.js';
import { UI } from './ui.js';
import { Storage } from './storage.js';
import { SearchEngine } from './search.js';
import { Utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  UI.init();
  initTheme();
  initDensity();
  initSidebarState();

  // Rotalar
  Router.addRoute('home', () => UI.renderHomeView());
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

  // Menüler ve İnteraktivite
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
  const labels = { dark: '🌙 Koyu', light: '☀️ Açık', system: '💻 Sistem' };
  btn.innerHTML = `<span>${labels[mode] || 'Aydınlık'}</span>`;
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
    // Masaüstü ekranlarda menüyü VARSAYILAN OLARAK AÇIK tut
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

  const dropdownBtns = document.querySelectorAll('.dropdown-arrow-btn');
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdownItem = btn.closest('.nav-dropdown-item');
      if (!dropdownItem) return;

      dropdownItem.classList.toggle('open');
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
    <a href="#courses" class="cmd-item"><span class="cmd-item-icon">📚</span> Derslere Git</a>
    <a href="#lab" class="cmd-item"><span class="cmd-item-icon">💻</span> Kod Laboratuvarı</a>
    <a href="#quizzes" class="cmd-item"><span class="cmd-item-icon">🧠</span> Quizler</a>
    <a href="#bookmarks" class="cmd-item"><span class="cmd-item-icon">⭐</span> Favorilerim</a>
    <a href="#glossary" class="cmd-item"><span class="cmd-item-icon">📖</span> Terimler Sözlüğü</a>
    <a href="#calendar" class="cmd-item"><span class="cmd-item-icon">📅</span> Çalışma Takvimi</a>
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

/**
 * SAYFA ÖLÇEĞİ VE METİN BÜYÜTME (A 90% ➔ A+ 100% ➔ A++ 110%)
 */
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

  // Varsayılan %90 (A) açılış
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

/**
 * KLAVYE KISAYOLLARI (J, K, F, ?, ESC, Ctrl+K)
 */
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
    // Ctrl + K veya Cmd + K
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

    // ESC (Tüm Modalları Kapat)
    if (e.key === 'Escape') {
      document.querySelectorAll('.cmd-modal-overlay, .onboarding-modal-overlay').forEach(m => m.classList.add('hidden'));
      const searchBox = document.getElementById('search-results-box');
      if (searchBox) searchBox.classList.add('hidden');
      return;
    }

    // İnput veya Textarea içindeyken kısayolları çalıştırma
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    // Kısayol: ? (Kısayol Modalı Aç)
    if (e.key === '?') {
      if (shortcutsModal) shortcutsModal.classList.toggle('hidden');
      return;
    }

    // Ders İçi Kısayollar (J: Sonraki, K: Önceki, F: Favorile)
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

/**
 * DERS KONUSU OKUMA İLERLEME ÇUBUĞU (READING PROGRESS BAR)
 */
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
  if (Storage.isOnboarded()) return;

  const modal = document.createElement('div');
  modal.className = 'onboarding-modal-overlay';
  modal.innerHTML = `
    <div class="onboarding-modal">
      <div class="onboarding-step" id="onboard-step-1">
        <h2>👋 BP Rehberine Hoş Geldin!</h2>
        <p>Bilgisayar Programcılığı dersleri, projeleri, quizleri ve sınav notları için hazırlanan özel eğitim platformundasın.</p>
        <button class="btn btn-primary" id="btn-onboard-next-1">Devam Et ➔</button>
      </div>

      <div class="onboarding-step hidden" id="onboard-step-2">
        <h2>📚 Dersler ve 11 Standart Katman</h2>
        <p>Her ders konusunda anlatım, gerçek hayat örneği, kodlar, mantığı, <strong>Sınavda Bil</strong> vs <strong>Sektörde Bil</strong> ipuçları bulunur.</p>
        <button class="btn btn-primary" id="btn-onboard-next-2">Devam Et ➔</button>
      </div>

      <div class="onboarding-step hidden" id="onboard-step-3">
        <h2>💾 İlerleme Kaydı ve Yedekleme</h2>
        <p>Tamamladığın konular tarayıcına kaydedilir. İlerlemeyi kaybetmemek için Ana Sayfa'daki <strong>"Yedeği İndir"</strong> butonunu kullanabilirsin.</p>
        <button class="btn btn-success" id="btn-onboard-finish">Öğrenmeye Başla! 🚀</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const step1 = modal.querySelector('#onboard-step-1');
  const step2 = modal.querySelector('#onboard-step-2');
  const step3 = modal.querySelector('#onboard-step-3');

  modal.querySelector('#btn-onboard-next-1').onclick = () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
  };

  modal.querySelector('#btn-onboard-next-2').onclick = () => {
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
  };

  modal.querySelector('#btn-onboard-finish').onclick = () => {
    Storage.setOnboarded();
    modal.remove();
  };
}
