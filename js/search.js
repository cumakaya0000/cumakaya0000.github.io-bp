/**
 * BP Rehberi - Gruplandırılmış Arama Motoru (search.js)
 * V1.3: DERSLER, KONULAR, PROJELER, QUIZLER grupları
 */
import { CourseService } from './courses.js';

export const SearchEngine = {
  searchIndex: [],
  isIndexed: false,

  async buildIndex() {
    if (this.isIndexed) return;
    const index = [];

    const coursesInfo = await CourseService.loadCourses();

    // 1. Dersleri indeksle
    coursesInfo.courses.forEach(c => {
      index.push({
        group: 'DERSLER',
        type: 'course',
        title: c.title,
        subtitle: `${c.code} • ${c.semester}. Yarıyıl`,
        content: c.description,
        hash: `#course/${c.id}`,
        badge: c.v1_active ? 'Aktif Ders' : 'Gelecek Sürüm'
      });
    });

    // 2. Konuları indeksle
    const activeCourses = coursesInfo.courses.filter(c => c.v1_active);
    for (const c of activeCourses) {
      const lessonsData = await CourseService.loadCourseLessons(c.id);
      if (lessonsData && lessonsData.lessons) {
        lessonsData.lessons.forEach(l => {
          index.push({
            group: 'KONULAR',
            type: 'lesson',
            title: l.title,
            subtitle: `${c.title} ➔ Konu #${l.order}`,
            content: `${l.goal} ${l.content} ${l.codeSnippet || ''} ${l.examTips || ''} ${l.industryTips || ''}`,
            hash: `#lesson/${c.id}/${l.id}`,
            badge: 'Konu Anlatımı'
          });
        });
      }
    }

    // 3. Projeleri indeksle
    const projects = await CourseService.loadProjects();
    projects.forEach(p => {
      index.push({
        group: 'PROJELER',
        type: 'project',
        title: p.title,
        subtitle: `Proje • ${p.levelTitle} (${p.category})`,
        content: `${p.summary} ${p.tech.join(' ')}`,
        hash: `#projects`,
        badge: p.levelTitle
      });
    });

    // 4. Quizleri indeksle
    for (const c of activeCourses) {
      const quizzesData = await CourseService.loadCourseQuizzes(c.id);
      if (quizzesData && quizzesData.quizzes) {
        quizzesData.quizzes.forEach(q => {
          index.push({
            group: 'QUIZLER',
            type: 'quiz',
            title: q.title,
            subtitle: `${c.title} • ${q.questions.length} Soru`,
            content: q.title,
            hash: `#quizzes`,
            badge: 'Quiz'
          });
        });
      }
    }

    this.searchIndex = index;
    this.isIndexed = true;
  },

  async searchGrouped(query) {
    if (!query || query.trim().length < 2) return null;
    await this.buildIndex();

    const q = query.trim().toLowerCase();

    const matches = this.searchIndex.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const contentMatch = item.content.toLowerCase().includes(q);
      const subMatch = item.subtitle.toLowerCase().includes(q);
      return titleMatch || contentMatch || subMatch;
    });

    const grouped = {
      DERSLER: matches.filter(m => m.group === 'DERSLER').slice(0, 3),
      KONULAR: matches.filter(m => m.group === 'KONULAR').slice(0, 5),
      PROJELER: matches.filter(m => m.group === 'PROJELER').slice(0, 3),
      QUIZLER: matches.filter(m => m.group === 'QUIZLER').slice(0, 3)
    };

    return grouped;
  }
};
