import { Storage } from './storage.js';
/**
 * BP Rehberi - Veri Servisi (courses.js)
 */

export const CourseService = {
  coursesData: null,
  projectsData: null,
  glossaryData: null,
  lessonsCache: {},
  quizzesCache: {},

  /**
   * courses.json dosyasını yükler
   */
  async loadCourses() {
    if (this.coursesData) return this.coursesData;
    try {
      const res = await fetch('./data/courses.json');
      if (!res.ok) throw new Error('courses.json yüklenemedi');
      this.coursesData = await res.json();
      return this.coursesData;
    } catch (err) {
      console.error('loadCourses error:', err);
      return { categories: {}, semesters: [], courses: [] };
    }
  },

  /**
   * projects.json dosyasını yükler
   */
  async loadProjects() {
    if (this.projectsData) return this.projectsData;
    try {
      const res = await fetch('./data/projects.json');
      if (!res.ok) throw new Error('projects.json yüklenemedi');
      this.projectsData = await res.json();
      return this.projectsData;
    } catch (err) {
      console.error('loadProjects error:', err);
      return [];
    }
  },

  /**
   * glossary.json dosyasını yükler
   */
  async loadGlossary() {
    if (this.glossaryData) return this.glossaryData;
    try {
      const res = await fetch('./data/glossary.json');
      if (!res.ok) throw new Error('glossary.json yüklenemedi');
      this.glossaryData = await res.json();
      return this.glossaryData;
    } catch (err) {
      console.error('loadGlossary error:', err);
      return [];
    }
  },

  /**
   * Belirli bir dersin detaylı konularını (lessons/xxx.json) yükler
   */
  async loadCourseLessons(courseId) {
    if (this.lessonsCache[courseId]) return this.lessonsCache[courseId];
    const coursesInfo = await this.loadCourses();
    const course = coursesInfo.courses.find(c => c.id === courseId);
    if (!course) return null;

    // Check if user has saved custom topics in localStorage
    const customTopics = Storage.getCustomTopics(courseId);
    if (customTopics && customTopics.length > 0) {
      const customData = {
        courseId: course.id,
        title: course.title,
        description: course.summary || (course.title + ' ders müfredatı.'),
        lessons: customTopics.map((top, idx) => ({
          id: top.id || `custom-konu-${idx + 1}`,
          order: idx + 1,
          title: top.title,
          goal: `${course.title} dersi kapsamında ${top.title} konusunun anlatımı.`,
          content: `<h3>${top.title}</h3><p><strong>${course.title}</strong> dersinin <em>${top.title}</em> konusuna hoş geldiniz.</p>`,
          summaryHTML: `<ul><li><strong>Özet:</strong> ${top.title} temel kavramları.</li></ul>`,
          quiz: [
            {
              question: `${top.title} konusunun temel amacı nedir?`,
              options: ["Konunun ana mantığını kavramak", "Ezber yapmak", "Boş bırakmak", "Hiçbiri"],
              answer: 0,
              explanation: "Konu öğreniminde ana mantığı kavramak önemlidir."
            }
          ]
        }))
      };
      this.lessonsCache[courseId] = customData;
      return customData;
    }

    if (course.dataFile) {
      try {
        const res = await fetch(`./data/lessons/${course.dataFile}`);
        if (res.ok) {
          const data = await res.json();
          this.lessonsCache[courseId] = data;
          return data;
        }
      } catch (err) {
        console.warn(`loadCourseLessons file load fallback for [${courseId}]`);
      }
    }

    const topics = (course.topics && course.topics.length) ? course.topics : [
      course.title + ' Temel Kavramlar',
      course.title + ' Uygulama ve Örnekler',
      course.title + ' Sınav Öncesi Özet'
    ];

    const generatedData = {
      courseId: course.id,
      title: course.title,
      description: course.summary || (course.title + ' ders müfredatı ve konu içeriği.'),
      lessons: topics.map((top, idx) => ({
        id: `konu-${idx + 1}`,
        order: idx + 1,
        title: top,
        goal: `${course.title} dersi kapsamında ${top} konusunun anlatımı ve öğrenim hedefleri.`,
        content: `<h3>${top}</h3><p><strong>${course.title}</strong> dersinin <em>${top}</em> konusuna hoş geldiniz. Bu bölümde konunun temel teorisi, kodlama örnekleri ve sınav soruları yer almaktadır.</p>`,
        summaryHTML: `<ul><li><strong>Özet:</strong> ${top} temel kavramları.</li><li><strong>Sınav İpucu:</strong> Vize ve final için önemli noktalar.</li></ul>`,
        quiz: [
          {
            question: `${top} konusunun temel amacı nedir?`,
            options: ["Konunun ana mantığını kavramak", "Ezber yapmak", "Boş bırakmak", "Hiçbiri"],
            answer: 0,
            explanation: "Konu öğreniminde ana mantığı kavramak en önemli adımdır."
          }
        ]
      }))
    };

    this.lessonsCache[courseId] = generatedData;
    return generatedData;
  },

  /**
   * Belirli bir dersin quizlerini (quizzes/xxx.json) yükler
   */
  async loadCourseQuizzes(courseId) {
    if (this.quizzesCache[courseId]) return this.quizzesCache[courseId];
    const coursesInfo = await this.loadCourses();
    const course = coursesInfo.courses.find(c => c.id === courseId);
    if (!course || !course.dataFile) return null;

    try {
      const res = await fetch(`./data/quizzes/${course.dataFile}`);
      if (!res.ok) throw new Error(`${course.dataFile} quiz yüklenemedi`);
      const data = await res.json();
      this.quizzesCache[courseId] = data;
      return data;
    } catch (err) {
      console.error(`loadCourseQuizzes error [${courseId}]:`, err);
      return null;
    }
  },

  /**
   * Tüm V1 aktif derslerinin toplam konu sayısını döner
   */
  async getTotalV1LessonsCount() {
    const coursesInfo = await this.loadCourses();
    const v1Active = coursesInfo.courses.filter(c => c.v1_active);
    let count = 0;
    for (const c of v1Active) {
      const lessonsData = await this.loadCourseLessons(c.id);
      if (lessonsData && lessonsData.lessons) {
        count += lessonsData.lessons.length;
      }
    }
    return count;
  }
};
