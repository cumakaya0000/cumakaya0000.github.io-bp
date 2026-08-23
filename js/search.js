/**
 * BP Rehberi - Gelişmiş & Türkçe Uyumlu Arama Motoru (search.js)
 * V2.0: Türkçe Karakter Normalizasyonu, Alaka Düzeyi Skoru ve Tüm Bölüm İndeksi
 */
import { CourseService } from './courses.js';

function normalizeTR(str) {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase('tr')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i');
}

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
        icon: '📚',
        type: 'course',
        title: c.title,
        subtitle: `${c.code || ''} • ${c.semester || 1}. Yarıyıl`,
        content: `${c.summary || ''} ${c.title}`,
        hash: `#course/${c.id}`,
        badge: c.v1_active ? 'Ders' : 'Müfredat'
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
            icon: '📌',
            type: 'lesson',
            title: l.title,
            subtitle: `${c.title} ➔ Konu #${l.order}`,
            content: `${l.title} ${l.goal || ''} ${l.summaryHTML || ''} ${l.content || ''}`,
            hash: `#lesson/${c.id}/${l.id}`,
            badge: 'Konu Anlatımı'
          });
        });
      }
    }

    // 3. Terimleri (Glossary) indeksle
    try {
      const glossary = await CourseService.loadGlossary();
      glossary.forEach(g => {
        index.push({
          group: 'TERİMLER',
          icon: '📖',
          type: 'glossary',
          title: g.term,
          subtitle: `Sözlük • ${g.category}`,
          content: `${g.term} ${g.definition} ${g.category}`,
          hash: `#glossary`,
          badge: g.category
        });
      });
    } catch (e) {}

    // 4. Projeleri indeksle
    try {
      const projects = await CourseService.loadProjects();
      projects.forEach(p => {
        index.push({
          group: 'PROJELER',
          icon: '💡',
          type: 'project',
          title: p.title,
          subtitle: `Proje • ${p.levelTitle} (${p.category})`,
          content: `${p.title} ${p.summary} ${(p.tech || []).join(' ')}`,
          hash: `#projects`,
          badge: p.levelTitle
        });
      });
    } catch (e) {}

    // 5. Quizleri indeksle
    for (const c of activeCourses) {
      try {
        const quizzesData = await CourseService.loadCourseQuizzes(c.id);
        if (quizzesData && quizzesData.quizzes) {
          quizzesData.quizzes.forEach(q => {
            index.push({
              group: 'QUIZLER',
              icon: '🧠',
              type: 'quiz',
              title: q.title,
              subtitle: `${c.title} • ${q.questions.length} Soru`,
              content: `${q.title} ${(q.questions || []).map(ques => ques.question).join(' ')}`,
              hash: `#quizzes`,
              badge: 'Sınav Testi'
            });
          });
        }
      } catch (e) {}
    }

    // 6. Özel Sayfalar (Staj, Kariyer, Şehir, Donanım, Lab)
    const staticPages = [
      {
        group: 'REHBER & STAJ',
        icon: '💼',
        title: '30 İş Günü Zorunlu Yaz Stajı Rehberi',
        subtitle: 'Staj başvuru adımları, staj defteri şablonu ve sözleşmeler',
        content: 'staj yaz stajı 30 iş günü staj defteri staj başvuru formu sözleşme sgk danışman',
        hash: '#career',
        badge: 'Staj Rehberi'
      },
      {
        group: 'REHBER & STAJ',
        icon: '💻',
        title: 'Kod Laboratuvarı Live Sandbox',
        subtitle: 'HTML, CSS, JS, C#, SQL canlı kod derleyicisi',
        content: 'kod laboratuvarı lab canlı sandbox html css javascript c# sql python compiler derleyici',
        hash: '#lab',
        badge: 'Kod Lab'
      },
      {
        group: 'REHBER & STAJ',
        icon: '🏛️',
        title: 'Ardahan MYO Donanım & Laboratuvar Altyapısı',
        subtitle: 'Bölüm lab olanakları, dgs geçiş ve donanım rehberi',
        content: 'donanım lab laboratuvar kapasitesi dgs lisans geçiş ram cpu ssd arıza',
        hash: '#hardware-diag',
        badge: 'Donanım'
      },
      {
        group: 'REHBER & STAJ',
        icon: '🚌',
        title: 'Ardahan Öğrenci Şehir & Ulaşım Rehberi',
        subtitle: 'Kampüs dolmuşları, yurtlar, otogar, hastane ve günlük ihtiyaçlar',
        content: 'şehir rehberi ulaşım kyk yurt dolmuş otogar kars havalimanı taksi hastane market',
        hash: '#city',
        badge: 'Şehir'
      },
      {
        group: 'REHBER & STAJ',
        icon: '🎓',
        title: 'Üniversite ve Akademik Prosedürler',
        subtitle: 'UBYS ders kayıt, devam zorunluluğu, not oranları ve yönetmelik',
        content: 'üniversite ubys ders kayıt mazeret sınavı kayıt dondurma devam zorunluluğu agno not',
        hash: '#university',
        badge: 'Akademik'
      }
    ];

    index.push(...staticPages);

    this.searchIndex = index;
    this.isIndexed = true;
  },

  async searchGrouped(query) {
    if (!query || query.trim().length < 2) return null;
    await this.buildIndex();

    const rawQ = query.trim();
    const qNorm = normalizeTR(rawQ);

    // Alaka Skoru Hesaplama
    const scoredMatches = [];

    this.searchIndex.forEach(item => {
      const titleNorm = normalizeTR(item.title);
      const contentNorm = normalizeTR(item.content);
      const subNorm = normalizeTR(item.subtitle);

      let score = 0;

      if (titleNorm === qNorm) score += 100;
      else if (titleNorm.startsWith(qNorm)) score += 80;
      else if (titleNorm.includes(qNorm)) score += 50;

      if (subNorm.includes(qNorm)) score += 30;
      if (contentNorm.includes(qNorm)) score += 15;

      if (score > 0) {
        scoredMatches.push({ ...item, score });
      }
    });

    // Skora göre sırala
    scoredMatches.sort((a, b) => b.score - a.score);

    const grouped = {
      DERSLER: scoredMatches.filter(m => m.group === 'DERSLER').slice(0, 3),
      KONULAR: scoredMatches.filter(m => m.group === 'KONULAR').slice(0, 5),
      TERİMLER: scoredMatches.filter(m => m.group === 'TERİMLER').slice(0, 3),
      PROJELER: scoredMatches.filter(m => m.group === 'PROJELER').slice(0, 3),
      QUIZLER: scoredMatches.filter(m => m.group === 'QUIZLER').slice(0, 3),
      'REHBER & STAJ': scoredMatches.filter(m => m.group === 'REHBER & STAJ').slice(0, 3)
    };

    return grouped;
  }
};
