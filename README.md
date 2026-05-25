# 智能翻译技术应用与研发

面向课程教学的静态网站，包含自主学习区、研发实验室、学生交流区和教师联系信息。

## 内容模块

- 自主学习区：将 `计算机辅助翻译软件CAT简介.pptx` 与 `Trados2022_从入门到进阶.pptx` 抽取为网页课件，支持分节、搜索、上一页/下一页和进度记录。
- 研发实验室：MemoQ / CAT、Trados、智能体设计、VibeCoding 四条训练线。
- 学生交流区：静态站点内置本地问题池，并预留 GitHub Discussions 入口。
- 联系教师：根据项目文件夹中的朱华简历整理公开简介。

## 本地预览

```bash
npx serve . -l 4173
```

或直接打开 `index.html`。

## Render 部署

仓库包含 `render.yaml`，可在 Render 选择 Blueprint 或 Static Site 方式部署。发布目录为项目根目录，无需构建命令。

原始 PPT 不提交到 Git 仓库，部署后通过 GitHub Release 资产提供下载链接。
