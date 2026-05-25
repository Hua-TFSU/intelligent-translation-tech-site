const state = {
  deckId: "cat",
  slideNumber: 1,
  filteredSlides: [],
  questions: JSON.parse(localStorage.getItem("translation-tech-questions") || "[]"),
};

const repoUrl = "https://github.com/Hua-TFSU/intelligent-translation-tech-site";
const releaseUrl = `${repoUrl}/releases/latest`;
const downloads = {
  cat: `${releaseUrl}/download/CAT.pptx`,
  trados: `${releaseUrl}/download/Trados2022_.pptx`,
};

const els = {
  navToggle: document.querySelector(".nav-toggle"),
  siteNav: document.querySelector(".site-nav"),
  deckCount: document.querySelector("#deck-count"),
  slideCount: document.querySelector("#slide-count"),
  deckTitle: document.querySelector("#deck-title"),
  deckKicker: document.querySelector("#deck-kicker"),
  slideSection: document.querySelector("#slide-section"),
  slideProgress: document.querySelector("#slide-progress"),
  slideTitle: document.querySelector("#slide-title"),
  slidePoints: document.querySelector("#slide-points"),
  slideRange: document.querySelector("#slide-range"),
  prevSlide: document.querySelector("#prev-slide"),
  nextSlide: document.querySelector("#next-slide"),
  slideSearch: document.querySelector("#slide-search"),
  sectionTabs: document.querySelector("#section-tabs"),
  resourceTabs: document.querySelectorAll(".resource-tab"),
  catDownload: document.querySelector("#cat-download"),
  tradosDownload: document.querySelector("#trados-download"),
  questionForm: document.querySelector("#question-form"),
  questionList: document.querySelector("#question-list"),
  clearQuestions: document.querySelector("#clear-questions"),
  discussionLink: document.querySelector("#discussion-link"),
};

function getDeck() {
  return window.COURSE_DECKS.find((deck) => deck.id === state.deckId) || window.COURSE_DECKS[0];
}

function normalize(text) {
  return `${text || ""}`.toLowerCase().replace(/\s+/g, "");
}

function getVisibleSlides() {
  const deck = getDeck();
  const query = normalize(els.slideSearch.value);
  if (!query) return deck.slides;
  return deck.slides.filter((slide) => {
    const haystack = normalize([slide.title, slide.section, ...slide.content].join(""));
    return haystack.includes(query);
  });
}

function setDeck(deckId) {
  state.deckId = deckId;
  state.slideNumber = Number(localStorage.getItem(`deck-progress-${deckId}`) || 1);
  els.slideSearch.value = "";
  renderDeck();
}

function setSlide(number) {
  const deck = getDeck();
  state.slideNumber = Math.min(Math.max(Number(number), 1), deck.slideCount);
  localStorage.setItem(`deck-progress-${deck.id}`, String(state.slideNumber));
  renderSlide();
}

function renderDeck() {
  const deck = getDeck();
  els.deckTitle.textContent = deck.title;
  els.deckKicker.textContent = `${deck.slideCount} pages · ${deck.subtitle}`;
  els.slideRange.min = "1";
  els.slideRange.max = String(deck.slideCount);
  els.resourceTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.deck === deck.id);
  });
  renderSectionTabs();
  setSlide(state.slideNumber);
}

function renderSectionTabs() {
  const deck = getDeck();
  els.sectionTabs.innerHTML = "";
  deck.sections.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = section.title;
    button.className = state.slideNumber >= section.start ? "active" : "";
    button.addEventListener("click", () => setSlide(section.start));
    els.sectionTabs.append(button);
  });
}

function renderSlide() {
  const deck = getDeck();
  state.filteredSlides = getVisibleSlides();
  const searchActive = Boolean(els.slideSearch.value.trim());
  const slide =
    (searchActive ? state.filteredSlides[0] : deck.slides.find((item) => item.number === state.slideNumber)) ||
    deck.slides[0];

  if (searchActive && slide) {
    state.slideNumber = slide.number;
  }

  els.slideRange.value = String(state.slideNumber);
  els.slideSection.textContent = slide.section;
  els.slideProgress.textContent = searchActive
    ? `搜索结果 ${state.filteredSlides.length} · 第 ${slide.number} / ${deck.slideCount} 页`
    : `第 ${slide.number} / ${deck.slideCount} 页`;
  els.slideTitle.textContent = cleanSlideTitle(slide.title, slide.content);
  els.slidePoints.innerHTML = "";

  const points = buildSlidePoints(slide);
  if (points.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "本页以图示或软件界面为主，可结合原始 PPT 查看。";
    els.slidePoints.append(item);
  } else {
    points.forEach((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      els.slidePoints.append(item);
    });
  }

  els.prevSlide.disabled = state.slideNumber <= 1;
  els.nextSlide.disabled = state.slideNumber >= deck.slideCount;
  renderSectionTabs();
}

function cleanSlideTitle(title, content) {
  const joined = [title, content[0]].filter(Boolean).join(" ");
  return joined
    .replace(/\s+([）),.，。])/g, "$1")
    .replace(/（\s+/g, "（")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildSlidePoints(slide) {
  const stopWords = new Set(["CAT", "Trados", "2022", "—", "-", "1", "2", "3", "4", "5", "6"]);
  const points = [];
  let buffer = "";

  slide.content.forEach((line) => {
    const text = line.trim();
    if (!text || stopWords.has(text)) return;
    if (text.length <= 4 && buffer.length < 18) {
      buffer = `${buffer}${text}`;
      return;
    }
    const merged = `${buffer}${text}`.replace(/\s+/g, " ").trim();
    buffer = "";
    if (merged && !points.includes(merged)) points.push(merged);
  });

  if (buffer && !points.includes(buffer)) points.push(buffer);
  return points.slice(0, 10);
}

function renderQuestions() {
  els.questionList.innerHTML = "";
  if (state.questions.length === 0) {
    const empty = document.createElement("div");
    empty.className = "question-item";
    empty.innerHTML = "<span>EMPTY</span><strong>暂无本地问题</strong><p>课堂问题会保存在当前浏览器，可用于课后整理和同步。</p>";
    els.questionList.append(empty);
    return;
  }

  state.questions.forEach((question) => {
    const item = document.createElement("article");
    item.className = "question-item";
    item.innerHTML = `
      <span>${escapeHtml(question.type)} · ${escapeHtml(question.date)}</span>
      <strong>${escapeHtml(question.title)}</strong>
      <p>${escapeHtml(question.body || "未填写补充说明。")}</p>
    `;
    els.questionList.append(item);
  });
}

function escapeHtml(value) {
  return `${value}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setupDownloads() {
  els.catDownload.href = downloads.cat;
  els.tradosDownload.href = downloads.trados;
  els.catDownload.classList.add("ready");
  els.tradosDownload.classList.add("ready");
  els.discussionLink.href = `${repoUrl}/discussions`;
}

function init() {
  if (!window.COURSE_DECKS?.length) return;
  const totalSlides = window.COURSE_DECKS.reduce((sum, deck) => sum + deck.slideCount, 0);
  els.deckCount.textContent = String(window.COURSE_DECKS.length);
  els.slideCount.textContent = String(totalSlides);
  setupDownloads();
  renderQuestions();
  renderDeck();

  els.resourceTabs.forEach((button) => button.addEventListener("click", () => setDeck(button.dataset.deck)));
  els.prevSlide.addEventListener("click", () => setSlide(state.slideNumber - 1));
  els.nextSlide.addEventListener("click", () => setSlide(state.slideNumber + 1));
  els.slideRange.addEventListener("input", (event) => setSlide(event.target.value));
  els.slideSearch.addEventListener("input", renderSlide);

  document.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (event.key === "ArrowLeft") setSlide(state.slideNumber - 1);
    if (event.key === "ArrowRight") setSlide(state.slideNumber + 1);
  });

  els.navToggle.addEventListener("click", () => {
    const isOpen = els.siteNav.classList.toggle("open");
    els.navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  els.siteNav.addEventListener("click", () => {
    els.siteNav.classList.remove("open");
    els.navToggle.setAttribute("aria-expanded", "false");
  });

  els.questionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(els.questionForm);
    const question = {
      title: form.get("title"),
      type: form.get("type"),
      body: form.get("body"),
      date: new Date().toLocaleDateString("zh-CN"),
    };
    state.questions = [question, ...state.questions].slice(0, 20);
    localStorage.setItem("translation-tech-questions", JSON.stringify(state.questions));
    els.questionForm.reset();
    renderQuestions();
  });

  els.clearQuestions.addEventListener("click", () => {
    state.questions = [];
    localStorage.removeItem("translation-tech-questions");
    renderQuestions();
  });
}

init();
