/**
 * BP Rehberi - Üniversite ve Müfredat Servisi (university.js)
 * Türkiye genelindeki üniversiteler, müfredatlar ve karşılaştırma mantığı.
 */

export const UniversityService = {
  universitiesData: null,
  curriculumsCache: {},

  /**
   * data/universities.json dosyasını yükler
   */
  async loadUniversities() {
    if (this.universitiesData) return this.universitiesData;
    try {
      const res = await fetch('./data/universities.json');
      if (!res.ok) throw new Error('universities.json yüklenemedi');
      const data = await res.json();
      this.universitiesData = data.universities || [];
      return this.universitiesData;
    } catch (err) {
      console.error('loadUniversities error:', err);
      return [];
    }
  },

  async getUniversityById(id) {
    const list = await this.loadUniversities();
    return list.find(u => u.id === id) || null;
  },

  /**
   * Belirli bir müfredatı data/curriculums/[curriculumId].json dosyasından yükler
   */
  async loadCurriculum(curriculumId) {
    if (!curriculumId) return null;
    if (this.curriculumsCache[curriculumId]) return this.curriculumsCache[curriculumId];

    try {
      const res = await fetch(`./data/curriculums/${curriculumId}.json`);
      if (!res.ok) throw new Error(`${curriculumId}.json yüklenemedi`);
      const data = await res.json();
      this.curriculumsCache[curriculumId] = data;
      return data;
    } catch (err) {
      console.warn(`loadCurriculum fallback for [${curriculumId}]:`, err);
      // Fallback for unverified or default Ardahan
      if (curriculumId === 'ardahan-bp') {
        const fallbackRes = await fetch('./data/curriculums/ardahan-bp.json');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          this.curriculumsCache[curriculumId] = fallbackData;
          return fallbackData;
        }
      }
      return null;
    }
  },

  async getCurriculumForUniversity(universityId) {
    const uni = await this.getUniversityById(universityId);
    if (!uni) return null;
    return await this.loadCurriculum(uni.curriculumId);
  },

  /**
   * Müfredat Karşılaştırma Analizörü
   */
  async compareCurriculums(curriculumIds = []) {
    if (!curriculumIds || curriculumIds.length === 0) return null;

    const curriculums = [];
    for (const cId of curriculumIds) {
      const curr = await this.loadCurriculum(cId);
      if (curr) curriculums.push(curr);
    }

    if (curriculums.length === 0) return null;

    // Her müfredat için istatistikleri topla
    const summary = curriculums.map(curr => {
      let totalCourses = 0;
      let totalAKTS = 0;
      let mandatoryCount = 0;
      let electiveCount = 0;
      const allCourseNames = [];

      (curr.semesters || []).forEach(sem => {
        (sem.courses || []).forEach(c => {
          totalCourses++;
          totalAKTS += c.akts || 0;
          if (c.type === 'Zorunlu') mandatoryCount++;
          else electiveCount++;
          allCourseNames.push(c.name);
        });
      });

      return {
        curriculumId: curr.curriculumId,
        universityName: curr.universityName,
        department: curr.department,
        totalCourses,
        totalAKTS,
        mandatoryCount,
        electiveCount,
        allCourseNames,
        metadata: curr.metadata || {}
      };
    });

    // Ortak ve Farklı Dersleri Hesapla
    const commonCourses = [];
    const uniqueCourses = {};

    if (summary.length > 1) {
      const firstNames = summary[0].allCourseNames;
      firstNames.forEach(cName => {
        const normalized = this.normalizeCourseName(cName);
        const isCommon = summary.every(s => s.allCourseNames.some(n => this.normalizeCourseName(n) === normalized));
        if (isCommon && !commonCourses.includes(cName)) {
          commonCourses.push(cName);
        }
      });

      summary.forEach(s => {
        uniqueCourses[s.curriculumId] = s.allCourseNames.filter(cName => {
          const normalized = this.normalizeCourseName(cName);
          return !summary.every(other => other.allCourseNames.some(n => this.normalizeCourseName(n) === normalized));
        });
      });
    }

    return {
      curriculums,
      summary,
      commonCourses,
      uniqueCourses
    };
  },

  normalizeCourseName(name) {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '')
      .replace(/i{1,3}$/g, '') // I, II, III eklerini normalize et
      .replace(/\d+/g, '');
  },

  /**
   * Türkiye Şehir Keşif Listesi
   */
  async getCitiesWithUniversities() {
    const list = await this.loadUniversities();
    const cityMap = {};

    list.forEach(uni => {
      const city = uni.city || 'Diğer';
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(uni);
    });

    return Object.keys(cityMap).sort().map(cityName => ({
      cityName,
      universities: cityMap[cityName]
    }));
  }
};
