# Bax Portfolio - 個人作品集網站

一個現代化的響應式個人作品集網站，專為創意設計師打造，結合了流暢的動畫效果和優雅的使用者體驗。

## 功能特色

### 視覺設計
- 炫酷載入動畫 - 自定義SVG logo 路徑描繪效果
- 響應式設計 - 適配所有裝置尺寸
- 暗黑/明亮主題 - 一鍵切換主題模式
- 粒子背景 - 動態互動粒子系統
- 自定義游標 - 跟隨滑鼠的動態游標效果

### 動畫效果
- GSAP驅動 - 流暢的進場動畫和過場效果
- 滾動觸發 - ScrollTrigger實現的滾動動畫
- 頁面轉場 - 無縫的頁面切換體驗
- 載入進度 - 帶發光效果的進度條動畫

### 技術特色
- HTMX整合 - 動態內容載入，無需重新整理頁面
- Markdown支援 - 作品和文章內容使用Markdown撰寫
- 靜態生成 - 自動生成作品和Blog詳情頁面
- 模組化架構 - 易於維護和擴展的程式碼結構

## 快速開始

### 環境需求
- Node.js 16.0+
- pnpm (推薦) 或 npm

### 安裝步驟

1. 複製專案
```bash
git clone <repository-url>
cd bax-website
```

2. 安裝依賴
```bash
pnpm install
```

3. 生成所有頁面
```bash
pnpm run generate
```

4. 啟動開發伺服器
```bash
pnpm run dev
```

5. 開啟瀏覽器訪問 `http://localhost:3000`

## 專案結構

```
bax-website/
├── src/                    # 前端資源
│   ├── css/               # 樣式表
│   ├── js/                # JavaScript模組
│   └── images/            # 圖片資源
├── templates/             # 頁面模板
├── works/                 # 作品Markdown文件
│   ├── motion-design/     # 動態設計作品
│   └── graphic-design/    # 平面設計作品
├── work/                  # 生成的作品HTML頁面
├── blog-posts/            # Blog文章原始檔案
├── blog/                  # 生成的Blog HTML頁面
├── utils/                 # 工具模組
├── server.js              # Express伺服器
├── generate-pages.js      # 統一頁面生成腳本
└── generate-blog.js       # Blog生成腳本
```

## 新增作品

1. 在 `works/motion-design/` 或 `works/graphic-design/` 目錄下建立新的 `.md` 檔案

2. 使用以下格式：
```markdown
---
title: "作品標題"
description: "作品描述"
image: "/src/images/work-cover.jpg"
date: "2024"
tags: ["tag1", "tag2"]
category: "motion-design"
---

# 作品內容

這裡撰寫作品的詳細說明...
```

3. 重新生成頁面：`pnpm run generate`

## 新增Blog文章

1. 在 `blog-posts/` 目錄下建立新的 `.md` 檔案

2. 使用以下格式：
```markdown
---
title: "文章標題"
description: "文章簡述"
date: "2025-01-11"
image: "/src/images/your-image.jpg"
tags: ["標籤1", "標籤2"]
---

# 文章內容

這裡寫你的文章內容...
```

3. 生成Blog頁面：
```bash
# 只生成Blog
node generate-blog.js

# 或生成所有頁面
node generate-pages.js
```

## Front Matter 說明

### 作品文件
- **title**: 作品標題 (必填)
- **description**: 作品描述 (必填)
- **image**: 封面圖片路徑 (必填)
- **date**: 完成年份 (必填)
- **tags**: 標籤陣列 (可選)
- **category**: 分類 (motion-design 或 graphic-design)

### Blog文章
- **title**: 文章標題 (必填)
- **description**: 文章簡述 (必填)
- **date**: 發布日期，格式 YYYY-MM-DD (必填)
- **image**: 文章封面圖片路徑 (可選)
- **tags**: 文章標籤陣列 (可選)

## 開發指令

```bash
# 開發模式 (熱重載)
pnpm run dev

# 生產模式
pnpm start

# 生成所有頁面 (作品 + Blog)
pnpm run generate

# 只生成Blog頁面
node generate-blog.js

# 建構靜態檔案
pnpm run build
```

## 技術架構

### 前端技術
- HTML5 - 語意化標記
- CSS3 - 現代CSS特性與CSS變數
- JavaScript ES6+ - 模組化JavaScript
- GSAP 3.12 - 動畫引擎
- P5.js - 粒子系統
- HTMX - 動態內容載入

### 後端技術
- Node.js - 伺服器環境
- Express.js - Web框架
- Marked - Markdown解析器
- Front-Matter - 元數據處理

## 自定義設定

### 修改主題顏色
編輯 `src/css/style.css` 中的CSS變數：
```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #007bff;
}
```

### 修改Logo
替換 `src/images/logo.svg` 並更新HTML中的SVG路徑。

### 調整動畫效果
編輯 `src/js/animations.js` 中的動畫參數。

## 瀏覽器支援

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 授權條款

本專案採用 MIT 授權條款。