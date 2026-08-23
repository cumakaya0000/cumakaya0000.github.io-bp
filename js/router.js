/**
 * BP Rehberi - Rotaya Göre Sayfa Yönlendirici (router.js)
 */
import { Storage } from './storage.js';
import { Utils } from './utils.js';

export const Router = {
  routes: {},
  currentHash: '',

  addRoute(pathPattern, handler) {
    this.routes[pathPattern] = handler;
  },

  async handleRoute() {
    let hash = window.location.hash || '#home';
    if (hash === '#') hash = '#home';

    this.currentHash = hash;
    Storage.setLastVisited(hash);

    // Aktif sidebar ve mobil bottom nav linklerini vurgula
    this.updateActiveNavLinks(hash);

    const parts = hash.substring(1).split('/');
    const routeName = parts[0] || 'home';

    if (routeName === 'home' && this.routes['home']) {
      await this.routes['home']();
    } else if (routeName === 'courses' && this.routes['courses']) {
      await this.routes['courses']();
    } else if (routeName === 'course' && parts[1] && this.routes['course']) {
      await this.routes['course'](parts[1], parts[2]);
    } else if (routeName === 'lesson' && parts[1] && parts[2] && this.routes['lesson']) {
      await this.routes['lesson'](parts[1], parts[2]);
    } else if (routeName === 'roadmap' && this.routes['roadmap']) {
      await this.routes['roadmap']();
    } else if (routeName === 'lab' && this.routes['lab']) {
      await this.routes['lab']();
    } else if (routeName === 'projects' && this.routes['projects']) {
      await this.routes['projects']();
    } else if (routeName === 'quizzes' && this.routes['quizzes']) {
      await this.routes['quizzes']();
    } else if (routeName === 'hardware-diag' && this.routes['hardware-diag']) {
      await this.routes['hardware-diag']();
    } else if (routeName === 'city' && this.routes['city']) {
      await this.routes['city']();
    } else if (routeName === 'university' && this.routes['university']) {
      await this.routes['university']();
    } else if (routeName === 'career' && this.routes['career']) {
      await this.routes['career']();
    } else if (routeName === 'glossary' && this.routes['glossary']) {
      await this.routes['glossary']();
    } else if (routeName === 'calendar' && this.routes['calendar']) {
      await this.routes['calendar']();
    } else if (routeName === 'bookmarks' && this.routes['bookmarks']) {
      await this.routes['bookmarks']();
    } else if (routeName === 'print-summary' && parts[1] && this.routes['print-summary']) {
      await this.routes['print-summary'](parts[1]);
    } else {
      if (this.routes['home']) await this.routes['home']();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    Utils.refreshLucideIcons();
  },

  updateActiveNavLinks(hash) {
    const links = document.querySelectorAll('.nav-link, .bottom-nav-item');
    links.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && (hash === href || (href !== '#home' && href !== '#' && hash.startsWith(href + '/')))) {
        link.classList.add('active');
      }
    });
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
  }
};
