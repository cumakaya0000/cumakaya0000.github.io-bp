/**
 * BP Rehberi - Gelişmiş Yerel Depolama Yöneticisi (storage.js)
 * V2.0: Türkiye Geneli Kullanıcı Profili, Üniversite Namespace'li İlerleme & Gelişmiş Sınav Depolama
 */

const NAMESPACES = {
  USER: 'bp_user',
  PROGRESS: 'bp_user_progress',
  QUIZ: 'bp_quiz_scores',
  EXAM_RESULTS: 'bp_exam_results',
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
   * KULLANICI PROFİLİ YÖNETİMİ
   */
  getUserProfile() {
    const defaultProfile = {
      name: 'Öğrenci',
      universityId: '',
      university: '',
      department: 'Bilgisayar Programcılığı',
      semester: 1,
      isGuest: false
    };

    try {
      const data = localStorage.getItem(NAMESPACES.USER);
      if (!data) return defaultProfile;
      const parsed = JSON.parse(data);
      return { ...defaultProfile, ...parsed };
    } catch (e) {
      return defaultProfile;
    }
  },

  setUserProfile(profile) {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, ...profile, isGuest: false };
      localStorage.setItem(NAMESPACES.USER, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('setUserProfile error:', e);
      return null;
    }
  },

  setGuestMode() {
    try {
      const current = this.getUserProfile();
      const updated = { ...current, isGuest: true };
      localStorage.setItem(NAMESPACES.USER, JSON.stringify(updated));
    } catch (e) {
      console.error('setGuestMode error:', e);
    }
  },

  isGuest() {
    const profile = this.getUserProfile();
    return !!profile.isGuest;
  },

  /**
   * NAMESPACE BAZLI DERS İLERLEMESİ (Üniversite Değiştiğinde İlerleme Silinmez)
   */
  getProgressKey(universityId) {
    const uniId = universityId || this.getUserProfile().universityId || 'ardahan-universitesi';
    return `bp_progress_${uniId}`;
  },

  toggleLessonCompletion(courseId, lessonId, universityId) {
    const key = this.getProgressKey(universityId);
    const progress = this.get(key);
    if (!progress[courseId]) {
      progress[courseId] = {};
    }
    progress[courseId][lessonId] = !progress[courseId][lessonId];
    this.set(key, progress);

    // Geriye dönük varsayılan progress key'i de güncelle (global progress tracking için)
    const globalProgress = this.get(NAMESPACES.PROGRESS);
    if (!globalProgress[courseId]) globalProgress[courseId] = {};
    globalProgress[courseId][lessonId] = progress[courseId][lessonId];
    this.set(NAMESPACES.PROGRESS, globalProgress);

    return progress[courseId][lessonId];
  },

  isLessonCompleted(courseId, lessonId, universityId) {
    const key = this.getProgressKey(universityId);
    const progress = this.get(key);
    if (progress[courseId] && progress[courseId][lessonId] !== undefined) {
      return !!progress[courseId][lessonId];
    }
    const globalProgress = this.get(NAMESPACES.PROGRESS);
    return !!(globalProgress[courseId] && globalProgress[courseId][lessonId]);
  },

  getCourseProgress(courseId, totalLessons, universityId) {
    if (!totalLessons || totalLessons === 0) return { count: 0, percent: 0 };
    const key = this.getProgressKey(universityId);
    const progress = this.get(key);
    const courseProg = progress[courseId] || (this.get(NAMESPACES.PROGRESS)[courseId] || {});
    const completedCount = Object.values(courseProg).filter(Boolean).length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    return { count: completedCount, percent };
  },

  getGlobalProgress(totalPlatformLessons, universityId) {
    if (!totalPlatformLessons || totalPlatformLessons === 0) return 0;
    const key = this.getProgressKey(universityId);
    const progress = this.get(key);
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
    
    recent = recent.filter(r => r.hash !== item.hash);
    recent.unshift(item);
    if (recent.length > 8) recent = recent.slice(0, 8);
    
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
   * Quiz ve Genişletilmiş Sınav Skorları
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

  saveExamResult(examResult) {
    let results = this.get(NAMESPACES.EXAM_RESULTS);
    if (!Array.isArray(results)) results = [];

    const record = {
      id: `exam_${Date.now()}`,
      examType: examResult.examType || 'Quiz',
      courseId: examResult.courseId || 'Genel',
      courseName: examResult.courseName || 'Genel BP Sınavı',
      totalQuestions: examResult.totalQuestions || 0,
      correctCount: examResult.correctCount || 0,
      wrongCount: examResult.wrongCount || 0,
      emptyCount: examResult.emptyCount || 0,
      scorePercent: Math.round(((examResult.correctCount || 0) / (examResult.totalQuestions || 1)) * 100),
      date: new Date().toISOString()
    };

    results.unshift(record);
    if (results.length > 50) results = results.slice(0, 50);
    this.set(NAMESPACES.EXAM_RESULTS, results);
    return record;
  },

  getExamResults() {
    const results = this.get(NAMESPACES.EXAM_RESULTS);
    return Array.isArray(results) ? results : [];
  },

  getExamStats() {
    const results = this.getExamResults();
    if (results.length === 0) {
      return {
        totalSolved: 0,
        overallSuccessRate: 0,
        strongestCourse: '-',
        weakestCourse: '-',
        totalQuestions: 0,
        totalCorrect: 0,
        totalWrong: 0
      };
    }

    let totalSolved = results.length;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    const coursePerformance = {};

    results.forEach(res => {
      totalQuestions += res.totalQuestions || 0;
      totalCorrect += res.correctCount || 0;
      totalWrong += res.wrongCount || 0;

      if (res.courseName) {
        if (!coursePerformance[res.courseName]) {
          coursePerformance[res.courseName] = { correct: 0, total: 0 };
        }
        coursePerformance[res.courseName].correct += res.correctCount || 0;
        coursePerformance[res.courseName].total += res.totalQuestions || 0;
      }
    });

    const overallSuccessRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    let strongestCourse = '-';
    let maxRate = -1;
    let weakestCourse = '-';
    let minRate = 101;

    Object.entries(coursePerformance).forEach(([cName, data]) => {
      if (data.total > 0) {
        const rate = (data.correct / data.total) * 100;
        if (rate > maxRate) {
          maxRate = rate;
          strongestCourse = cName;
        }
        if (rate < minRate) {
          minRate = rate;
          weakestCourse = cName;
        }
      }
    });

    return {
      totalSolved,
      overallSuccessRate,
      strongestCourse,
      weakestCourse,
      totalQuestions,
      totalCorrect,
      totalWrong
    };
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
      return localStorage.getItem(NAMESPACES.THEME) || 'light';
    } catch (e) {
      return 'light';
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
      if (val === null) return false;
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
      const profile = this.getUserProfile();
      const hasUni = profile && profile.universityId && profile.universityId.trim() !== '';
      return hasUni && localStorage.getItem(NAMESPACES.ONBOARDED) === 'true';
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
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      user: this.getUserProfile(),
      progress: this.get(NAMESPACES.PROGRESS),
      quizzes: this.get(NAMESPACES.QUIZ),
      examResults: this.getExamResults(),
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
      if (data.user) this.setUserProfile(data.user);
      if (data.progress) this.set(NAMESPACES.PROGRESS, data.progress);
      if (data.quizzes) this.set(NAMESPACES.QUIZ, data.quizzes);
      if (data.examResults) this.set(NAMESPACES.EXAM_RESULTS, data.examResults);
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