/**
 * BP Rehberi - Quiz Motoru (quiz.js)
 */
import { Storage } from './storage.js';
import { Utils } from './utils.js';

export const QuizEngine = {
  activeQuiz: null,
  userAnswers: {},

  /**
   * Bir quizi render eder
   */
  renderQuizCard(quiz, containerEl) {
    this.activeQuiz = quiz;
    this.userAnswers = {};

    const savedScore = Storage.getQuizScore(quiz.id);

    let html = `
      <div class="quiz-card" id="quiz-block-${quiz.id}">
        <div class="quiz-header">
          <div class="quiz-title-box">
            ${Utils.getIconSVG('brain', 'icon-primary')}
            <h3>${Utils.escapeHTML(quiz.title)}</h3>
          </div>
          ${savedScore ? `<span class="badge badge-success">Son Skor: %${savedScore.percent}</span>` : ''}
        </div>
        <div class="quiz-body">
    `;

    quiz.questions.forEach((q, qIndex) => {
      html += `
        <div class="quiz-question-item" data-qindex="${qIndex}">
          <p class="question-text"><strong>Soru ${qIndex + 1}:</strong> ${Utils.escapeHTML(q.question)}</p>
          <div class="options-list">
      `;

      q.options.forEach((opt, optIndex) => {
        html += `
          <label class="option-item" data-qindex="${qIndex}" data-optindex="${optIndex}">
            <input type="radio" name="quiz-${quiz.id}-q${qIndex}" value="${optIndex}">
            <span class="option-label">${Utils.escapeHTML(opt)}</span>
          </label>
        `;
      });

      html += `
          </div>
          <div class="question-explanation hidden" id="exp-${quiz.id}-${qIndex}"></div>
        </div>
      `;
    });

    html += `
        </div>
        <div class="quiz-footer">
          <button class="btn btn-primary" id="btn-submit-quiz-${quiz.id}">
            ${Utils.getIconSVG('check-circle')} Cevapları Kontrol Et
          </button>
          <div class="quiz-score-result hidden" id="result-${quiz.id}"></div>
        </div>
      </div>
    `;

    containerEl.innerHTML = html;

    // Radio seçimi event dinleyicileri
    const radios = containerEl.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const qIdx = e.target.name.split('-q')[1];
        this.userAnswers[qIdx] = parseInt(e.target.value, 10);
      });
    });

    // Gönder butonu event
    const submitBtn = document.getElementById(`btn-submit-quiz-${quiz.id}`);
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.evaluateQuiz(quiz, containerEl));
    }
  },

  /**
   * Quiz cevaplarını değerlendirir ve sonuçları gösterir
   */
  evaluateQuiz(quiz, containerEl) {
    let correctCount = 0;
    const totalCount = quiz.questions.length;

    quiz.questions.forEach((q, qIndex) => {
      const userAns = this.userAnswers[qIndex];
      const options = containerEl.querySelectorAll(`[data-qindex="${qIndex}"].option-item`);
      const expBox = document.getElementById(`exp-${quiz.id}-${qIndex}`);

      options.forEach((optEl, optIndex) => {
        optEl.classList.remove('opt-correct', 'opt-wrong');
        const input = optEl.querySelector('input');
        input.disabled = true;

        if (optIndex === q.answer) {
          optEl.classList.add('opt-correct');
        }
        if (userAns !== undefined && userAns === optIndex && userAns !== q.answer) {
          optEl.classList.add('opt-wrong');
        }
      });

      if (userAns === q.answer) {
        correctCount++;
      }

      // Açıklamayı göster
      if (expBox) {
        expBox.classList.remove('hidden');
        expBox.innerHTML = `<strong>💡 Çözüm Açıklaması:</strong> ${Utils.escapeHTML(q.explanation)}`;
      }
    });

    // Skor kaydetme
    Storage.saveQuizScore(quiz.id, correctCount, totalCount);

    const resultBox = document.getElementById(`result-${quiz.id}`);
    if (resultBox) {
      const percent = Math.round((correctCount / totalCount) * 100);
      resultBox.classList.remove('hidden');
      resultBox.className = `quiz-score-result ${percent >= 70 ? 'score-pass' : 'score-fail'}`;
      resultBox.innerHTML = `
        <span>Sonuç: <strong>${correctCount} / ${totalCount}</strong> doğru (%${percent})</span>
      `;
    }

    Utils.showToast(`Quiz Tamamlandı! Puanınız: %${Math.round((correctCount / totalCount) * 100)}`, 'success');
  }
};
