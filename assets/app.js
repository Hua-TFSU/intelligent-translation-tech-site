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
  agent: {
    title: "口语口译智能体设计与优化",
    kicker: "Coze / Agent Workflow / Interpreting Practice",
    asset: "assets/courseware/agent-interpreting-workflow.pptx",
    viewerAsset:
      "https://intelligent-translation-tech-site.onrender.com/assets/courseware/agent-interpreting-workflow.pptx?v=agent-20260525",
    outline: [
      "课程目标与多模态模型边界",
      "扣子平台与智能体工作流",
      "工作流的三种认知模型",
      "交替传译训练 SOP",
      "开始节点、知识库、TTS 与转写",
      "高效与低效工作流优化",
      "学生交付与复盘要求",
    ],
  },
  vibe: {
    title: "Vibe Coding 氛围编程入门",
    kicker: "AI IDE / Vibe Coding / Prototype Development",
    asset: "assets/courseware/vibe-coding-intro.pptx",
    viewerAsset:
      "https://intelligent-translation-tech-site.onrender.com/assets/courseware/vibe-coding-intro.pptx?v=vibe-20260525",
    outline: [
      "课程路径与课前准备",
      "工具矩阵：秒哒、Trae、Cursor、Codex",
      "Vibe Coding 反馈循环",
      "秒哒、Trae、Cursor、Codex 核查点",
      "OpenClaw / DuClaw 行动智能体实战",
      "迁移到翻译技术应用原型",
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
  resourceDeckLinks: document.querySelectorAll("[data-open-deck]"),
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
  const viewerAsset = deck.viewerAsset || deck.asset;
  const downloadAsset = deck.asset;
  els.title.textContent = deck.title;
  els.kicker.textContent = deck.kicker;
  els.frame.src = officeViewerUrl(viewerAsset);
  els.open.href = officeOpenUrl(viewerAsset);
  els.download.href = downloadAsset;
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

  els.resourceDeckLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setDeck(link.dataset.openDeck);
      document.querySelector("#courseware")?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", "#courseware");
    });
  });

  renderDeck();
}

init();
