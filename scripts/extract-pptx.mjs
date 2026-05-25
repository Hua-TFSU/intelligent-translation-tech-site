import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const decks = [
  {
    id: "cat",
    file: "计算机辅助翻译软件CAT简介.pptx",
    title: "计算机辅助翻译软件 CAT 简介",
    subtitle: "认识 CAT 的核心理念、工作流程与职业价值",
    downloadName: "计算机辅助翻译软件CAT简介.pptx",
    sections: [
      { title: "课程导入", start: 1 },
      { title: "CAT 基础概念", start: 2 },
      { title: "翻译流程与项目准备", start: 8 },
      { title: "翻译记忆库与术语库", start: 18 },
      { title: "主流工具与应用场景", start: 36 },
      { title: "课堂实践与总结", start: 58 },
    ],
  },
  {
    id: "trados",
    file: "Trados2022_从入门到进阶.pptx",
    title: "SDL Trados Studio 2022 从入门到进阶",
    subtitle: "从界面、项目、翻译记忆库到复杂项目交付",
    downloadName: "Trados2022_从入门到进阶.pptx",
    sections: [
      { title: "学习目标与安装", start: 1 },
      { title: "界面概览", start: 5 },
      { title: "功能模块", start: 14 },
      { title: "单文件翻译", start: 31 },
      { title: "翻译记忆库", start: 52 },
      { title: "术语库与质量检查", start: 76 },
      { title: "项目管理进阶", start: 105 },
      { title: "真实项目与课程设计", start: 138 },
    ],
  },
];

function decodeXml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}

function slideCount(file) {
  const listing = execFileSync("zipinfo", ["-1", file], { encoding: "utf8" });
  return Math.max(
    ...listing
      .split("\n")
      .map((line) => line.match(/^ppt\/slides\/slide(\d+)\.xml$/)?.[1])
      .filter(Boolean)
      .map(Number),
  );
}

function extractSlide(file, index) {
  const xml = execFileSync("unzip", ["-p", file, `ppt/slides/slide${index}.xml`], { encoding: "utf8" });
  const runs = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/gs)]
    .map((match) => decodeXml(match[1]).replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const title = runs.find((line) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(line)) || `${basename(file)} 第 ${index} 页`;
  const content = runs
    .slice(runs.indexOf(title) + 1)
    .filter((line, pos, arr) => line !== title && arr.indexOf(line) === pos)
    .slice(0, 26);
  return { number: index, title, content };
}

function assignSection(deck, slideNumber) {
  const ordered = [...deck.sections].sort((a, b) => a.start - b.start);
  let current = ordered[0].title;
  for (const section of ordered) {
    if (slideNumber >= section.start) current = section.title;
  }
  return current;
}

const output = decks.map((deck) => {
  const count = slideCount(deck.file);
  const slides = Array.from({ length: count }, (_, i) => {
    const slide = extractSlide(deck.file, i + 1);
    return { ...slide, section: assignSection(deck, i + 1) };
  });
  return { ...deck, slideCount: count, slides };
});

mkdirSync("assets/data", { recursive: true });
writeFileSync("assets/data/decks.js", `window.COURSE_DECKS = ${JSON.stringify(output, null, 2)};\n`);
console.log(`Extracted ${output.map((deck) => `${deck.title}: ${deck.slideCount}`).join(", ")}`);
