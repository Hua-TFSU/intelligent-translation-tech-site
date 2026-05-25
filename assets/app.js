const PPTS = {
  cat: {
    title: "计算机辅助翻译软件 CAT 简介",
    kicker: "MemoQ / CAT / Translation Workflow",
    asset:
      "https://github.com/Hua-TFSU/intelligent-translation-tech-site/releases/download/courseware-v1/CAT.pptx?v=compressed-20260525",
    outline: [
      "课程导入与学习原则",
      "CAT 软件是什么",
      "常见翻译流程与项目准备",
      "翻译记忆库与术语库",
      "主流 CAT 工具与应用场景",
      "课堂实践与复盘",
    ],
  },
  trados: {
    title: "Trados 2022 从入门到进阶",
    kicker: "SDL Trados Studio 2022",
    asset:
      "https://github.com/Hua-TFSU/intelligent-translation-tech-site/releases/download/courseware-v1/Trados2022_.pptx",
    outline: [
      "学习目标与软件安装",
      "用户界面与功能模块",
      "支持文件类型与单文件翻译",
      "翻译记忆库创建与复用",
      "术语库、质量检查与报告",
      "复杂项目管理与真实交付",
    ],
  },
};

const state = {
  deck: localStorage.getItem("active-ppt-deck") || "cat",
};

const els = {
  navToggle: document.querySelector(".nav-toggle"),
  nav: document.querySelector(".site-nav"),
  tabs: document.querySelectorAll(".deck-tab"),
  title: document.querySelector("#viewer-title"),
  kicker: document.querySelector("#viewer-kicker"),
  frame: document.querySelector("#ppt-frame"),
  open: document.querySelector("#open-viewer"),
  download: document.querySelector("#download-ppt"),
  outlineTitle: document.querySelector("#outline-title"),
  outlineList: document.querySelector("#outline-list"),
};

function officeViewerUrl(assetUrl) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(assetUrl)}`;
}

function officeOpenUrl(assetUrl) {
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(assetUrl)}`;
}

function setDeck(deckId) {
  state.deck = deckId;
  localStorage.setItem("active-ppt-deck", deckId);
  renderDeck();
}

function renderDeck() {
  const deck = PPTS[state.deck] || PPTS.cat;
  els.title.textContent = deck.title;
  els.kicker.textContent = deck.kicker;
  els.frame.src = officeViewerUrl(deck.asset);
  els.open.href = officeOpenUrl(deck.asset);
  els.download.href = deck.asset;
  els.outlineTitle.textContent = `${deck.title}结构`;
  els.outlineList.innerHTML = "";

  deck.outline.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${String(index + 1).padStart(2, "0")} · ${item}`;
    els.outlineList.append(li);
  });

  els.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.deck === state.deck);
  });
}

function init() {
  els.tabs.forEach((button) => {
    button.addEventListener("click", () => setDeck(button.dataset.deck));
  });

  els.navToggle.addEventListener("click", () => {
    const open = els.nav.classList.toggle("open");
    els.navToggle.setAttribute("aria-expanded", String(open));
  });

  els.nav.addEventListener("click", () => {
    els.nav.classList.remove("open");
    els.navToggle.setAttribute("aria-expanded", "false");
  });

  renderDeck();
}

init();
