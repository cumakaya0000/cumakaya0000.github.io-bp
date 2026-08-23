/**
 * BP Rehberi - Gelişmiş Yerel Depolama Yöneticisi (storage.js)
 * V1.3: Son Görüntülenenler, Favoriler, Yoğunluk & Sistem Teması
 */

const NAMESPACES = {
  PROGRESS: 'bp_user_progress',
  QUIZ: 'bp_quiz_scores',
  BOOKMARKS: 'bp_bookmarks',
  NOTES: 'bp_notes',
  RECENTLY_VIEWED: 'bp_recently_viewed',
  LAST_VISITED: 'bp_last_visited',
  THEME: 'bp_theme_mode',
  DENSITY: 'bp_density',
  SIDEBAR_COLLAPSED: 'bp_sidebar_collapsed',
  ONBOARDED: 'bp_onboarded'
};

export const Storage = {
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error(`Storage read error [${key}]:`, e);
      return {};
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage write error [${key}]:`, e);
    }
  },

  /**
   * Ders konusu tamamlama
   */
  toggleLessonCompletion(courseId, lessonId) {
    const progress = this.get(NAMESPACES.PROGRESS);
    if (!progress[courseId]) {
      progress[courseId] = {};
    }
    progress[courseId][lessonId] = !progress[courseId][lessonId];
    this.set(NAMESPACES.PROGRESS, progress);
    return progress[courseId][lessonId];
  },

  isLessonCompleted(courseId, lessonId) {
    const progress = this.get(NAMESPACES.PROGRESS);
    return !!(progress[courseId] && progress[courseId][lessonId]);
  },

  getCourseProgress(courseId, totalLessons) {
    if (!totalLessons || totalLessons === 0) return { count: 0, percent: 0 };
    const progress = this.get(NAMESPACES.PROGRESS);
    const courseProg = progress[courseId] || {};
    const completedCount = Object.values(courseProg).filter(Boolean).length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    return { count: completedCount, percent };
  },

  getGlobalProgress(totalPlatformLessons) {
    if (!totalPlatformLessons || totalPlatformLessons === 0) return 0;
    const progress = this.get(NAMESPACES.PROGRESS);
    let totalCompleted = 0;
    Object.values(progress).forEach(courseObj => {
      totalCompleted += Object.values(courseObj).filter(Boolean).length;
    });
    return Math.round((totalCompleted / totalPlatformLessons) * 100);
  },

  /**
   * Favori (Bookmark) Yönetimi
   */
  toggleBookmark(courseId, lessonId) {
    const bookmarks = this.get(NAMESPACES.BOOKMARKS);
    const key = `${courseId}:${lessonId}`;
    bookmarks[key] = !bookmarks[key];
    this.set(NAMESPACES.BOOKMARKS, bookmarks);
    return bookmarks[key];
  },

  isBookmarked(courseId, lessonId) {
    const bookmarks = this.get(NAMESPACES.BOOKMARKS);
    return !!bookmarks[`${courseId}:${lessonId}`];
  },

  getAllBookmarks() {
    const bookmarks = this.get(NAMESPACES.BOOKMARKS);
    return Object.keys(bookmarks).filter(k => bookmarks[k]);
  },

  /**
   * Son Görüntülenen Konular (Recently Viewed - Max 8)
   */
  addRecentlyViewed(item) {
    let recent = this.get(NAMESPACES.RECENTLY_VIEWED);
    if (!Array.isArray(recent)) recent = [];
    
    // Aynı öğeyi çıkar
    recent = recent.filter(r => r.hash !== item.hash);
    recent.unshift(item); // En başa ekle
    if (recent.length > 8) recent = recent.slice(0, 8); // Max 8
    
    this.set(NAMESPACES.RECENTLY_VIEWED, recent);
  },

  getRecentlyViewed() {
    const recent = this.get(NAMESPACES.RECENTLY_VIEWED);
    return Array.isArray(recent) ? recent : [];
  },

  /**
   * Not Yönetimi
   */
  saveNote(courseId, lessonId, noteText) {
    const notes = this.get(NAMESPACES.NOTES);
    const key = `${courseId}:${lessonId}`;
    if (!noteText || noteText.trim() === '') {
      delete notes[key];
    } else {
      notes[key] = noteText.trim();
    }
    this.set(NAMESPACES.NOTES, notes);
  },

  getNote(courseId, lessonId) {
    const notes = this.get(NAMESPACES.NOTES);
    return notes[`${courseId}:${lessonId}`] || '';
  },

  /**
   * Quiz Skorları
   */
  saveQuizScore(quizId, score, totalQuestions) {
    const scores = this.get(NAMESPACES.QUIZ);
    scores[quizId] = {
      score,
      total: totalQuestions,
      percent: Math.round((score / totalQuestions) * 100),
      date: new Date().toISOString()
    };
    this.set(NAMESPACES.QUIZ, scores);
  },

  getQuizScore(quizId) {
    const scores = this.get(NAMESPACES.QUIZ);
    return scores[quizId] || null;
  },

  setLastVisited(hash) {
    this.set(NAMESPACES.LAST_VISITED, { hash, date: new Date().toISOString() });
  },

  getLastVisited() {
    return this.get(NAMESPACES.LAST_VISITED);
  },

  /**
   * Tema (Koyu / Açık / Sistem)
   */
  getThemeMode() {
    try {
      return localStorage.getItem(NAMESPACES.THEME) || 'system';
    } catch (e) {
      return 'system';
    }
  },

  setThemeMode(mode) {
    try {
      localStorage.setItem(NAMESPACES.THEME, mode);
    } catch (e) {
      console.error('Theme mode save error:', e);
    }
  },

  /**
   * Yoğunluk (Comfortable / Compact)
   */
  getDensity() {
    try {
      return localStorage.getItem(NAMESPACES.DENSITY) || 'comfortable';
    } catch (e) {
      return 'comfortable';
    }
  },

  setDensity(density) {
    try {
      localStorage.setItem(NAMESPACES.DENSITY, density);
    } catch (e) {
      console.error('Density save error:', e);
    }
  },

  /**
   * Sidebar Dar Mod (Compact Sidebar)
   */
  isSidebarCollapsed() {
    try {
      const val = localStorage.getItem(NAMESPACES.SIDEBAR_COLLAPSED);
      if (val === null) return false; // Default to OPEN (false)
      return val === 'true';
    } catch (e) {
      return false;
    }
  },

  setSidebarCollapsed(collapsed) {
    try {
      localStorage.setItem(NAMESPACES.SIDEBAR_COLLAPSED, collapsed ? 'true' : 'false');
    } catch (e) {
      console.error('Sidebar collapse save error:', e);
    }
  },

  isOnboarded() {
    try {
      return localStorage.getItem(NAMESPACES.ONBOARDED) === 'true';
    } catch (e) {
      return false;
    }
  },

  setOnboarded() {
    try {
      localStorage.setItem(NAMESPACES.ONBOARDED, 'true');
    } catch (e) {
      console.error('Onboarded save error:', e);
    }
  },

  exportData() {
    const dump = {
      version: '1.3.0',
      exportDate: new Date().toISOString(),
      progress: this.get(NAMESPACES.PROGRESS),
      quizzes: this.get(NAMESPACES.QUIZ),
      bookmarks: this.get(NAMESPACES.BOOKMARKS),
      notes: this.get(NAMESPACES.NOTES),
      recentlyViewed: this.getRecentlyViewed()
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bp_rehberi_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (data.progress) this.set(NAMESPACES.PROGRESS, data.progress);
      if (data.quizzes) this.set(NAMESPACES.QUIZ, data.quizzes);
      if (data.bookmarks) this.set(NAMESPACES.BOOKMARKS, data.bookmarks);
      if (data.notes) this.set(NAMESPACES.NOTES, data.notes);
      if (data.recentlyViewed) this.set(NAMESPACES.RECENTLY_VIEWED, data.recentlyViewed);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
      }
    },

  getCustomTopics(courseId) {
    const allCustom = this.get('bp_custom_topics');
    return allCustom[courseId] || null;
  },

  saveCustomTopics(courseId, topicsList) {
    const allCustom = this.get('bp_custom_topics');
    allCustom[courseId] = topicsList;
    this.set('bp_custom_topics', allCustom);
  },

  resetCustomTopics(courseId) {
    const allCustom = this.get('bp_custom_topics');
    delete allCustom[courseId];
    this.set('bp_custom_topics', allCustom);
  }
};