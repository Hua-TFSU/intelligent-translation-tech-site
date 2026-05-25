# 智能翻译技术应用与研发

面向课程教学的静态网站，包含自主学习区、研发实验室、学生交流区和教师联系信息。

## 内容模块

- 自主学习区：通过 Office Online Viewer 嵌入原始 PPT，保留版式、图片和软件截图，并提供全屏打开与下载入口。
- 研发实验室：MemoQ / CAT、Trados、智能体设计、VibeCoding 四条训练线。
- 智能体资料：提供“口语口译智能体设计与优化”PPT，并链接少儿口语对话流智能体、CATTI 口译练习智能体两份飞书练习。
- Vibe Coding 资料：提供“Vibe Coding 氛围编程入门”PPT，并保留飞书原文标签链接。
- 软件下载专区：根据工作坊待装软件整理 CAT 工具、LanguageX、语料对齐工具、智语 AI 翻译工具箱和本地化部署工具入口。
- 学生交流区：预留 GitHub Discussions 入口。
- 联系教师：根据项目文件夹中的朱华简历整理公开简介。

## 本地预览

```bash
npx serve . -l 4173
```

或直接打开 `index.html`。

## Render 部署

仓库包含 `render.yaml`，可在 Render 选择 Blueprint 或 Static Site 方式部署。发布目录为项目根目录，无需构建命令。

原始 CAT / Trados PPT 不提交到 Git 仓库，部署后通过 GitHub Release 资产提供下载链接；轻量自制课件可随站点静态资源一起发布。

一键部署入口：

```text
https://render.com/deploy?repo=https://github.com/Hua-TFSU/intelligent-translation-tech-site
```
