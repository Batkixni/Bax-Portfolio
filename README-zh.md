# 🟦 Bax Portfolio - 個人作品集網站

一個專為**動態設計師 (Motion Designers)** 打造的現代化響應式作品集網站，結合了流暢的動畫效果、優雅的使用者體驗以及極致簡化的內容管理流程。

![Preview](https://files.catbox.moe/opt3u1.jpg)

## 🌠 核心功能特色 (Core Key Features)

### 作品與內容管理 (Portfolio & Content Management)
* **設計師內容核心：** 專為創意設計師打造，只需在 `/works` 資料夾內撰寫 **Markdown (.md)** 文件，即可自動更新整個作品集。
* **獨立攝影頁面：** 新增專屬 `/photography` 頁面，用於展示攝影、靜態圖形或其他視覺藝術創作。
* **快速媒體嵌入：** 支援擴展 Markdown 語法：
    * `!vid`：用於快速嵌入本機影片。
    * `!yt`：用於快速嵌入 YouTube 影片。
* **進階排版：** 支援 `%grid` 特殊語法，用於快速創建響應式、多欄位的作品網格排版。

### 視覺與使用者體驗 (Visual & UX)
* **響應式設計** - 適配所有裝置尺寸。
* **暗黑/明亮主題** - 一鍵切換主題模式。
* **粒子背景** - 動態互動粒子系統。
* **自定義游標** - 跟隨滑鼠的動態游標效果。

### 動畫與技術 (Animation & Technical)
* **HTMX整合** - 動態內容載入，無需重新整理頁面。
* **靜態生成** - 自動生成作品和 Blog 詳情頁面。
* **模組化架構** - 易於維護和擴展的程式碼結構。

---
## ✒️ 快速開始 (Quick Start)

### 環境需求 (Environment Requirements)
* Node.js 16.0+
* **Yarn (推薦)** 或 npm/pnpm

### 安裝步驟 (Installation Steps)

1.  複製專案
    ```bash
    git clone https://github.com/Batkixni/Bax-Portfolio.git
    cd bax-website
    ```

2.  安裝依賴
    ```bash
    yarn
    ```

3.  啟動開發伺服器
    ```bash
    yarn dev
    ```

5.  開啟瀏覽器訪問 `http://localhost:3000`

---

## 📝 新增作品 (Add New Portfolio Work)

1.  在 `works/motion/` 或 `works/graphic/` 目錄下建立新的 `.md` 檔案。

2.  使用以下格式：
    ```markdown
    ---
    title: "Project Title"
    description: "Project Description"
    image: "/src/images/work-cover.jpg"
    date: "2024"
    tags: ["tag1", "tag2"]
    category: "motion-design"
    ---

    # Project Content

    這裡撰寫作品的詳細說明...
    ```

---
## 💻 開發指令 (Development Commands)

```bash
# 開發模式 (熱重載)
yarn dev

# 生產模式
yarn start

# 只生成 Blog 頁面
node generate-blog.js

````

-----

## 技術架構 (Technical Stack)

### 前端技術 (Frontend Technologies)

  * HTML5 - 語意化標記
  * CSS3 - 現代CSS特性與CSS變數
  * JavaScript ES6+ - 模組化JavaScript
  * GSAP 3.12 - 動畫引擎
  * P5.js - 粒子系統
  * HTMX - 動態內容載入
  * **Vidstack** - 現代化影片播放器元件 (用於處理 `!vid` 嵌入)

### 後端技術 (Backend Technologies)

  * Node.js - 伺服器環境
  * Express.js - Web框架
  * Marked - Markdown解析器
  * Front-Matter - 元數據處理

-----

## 💡 注意事項 (Important Note)

  * **AI 協作：** 本專案大部分功能、結構和程式碼由 **Claude 3.7 與 4.0** 模型生成與協助優化。

-----

## 📜 授權與歸屬 (License and Attribution)

本專案使用以下開源套件，其授權條款與網頁資訊如下：

| 套件名稱 | 授權條款 (License) |
| :--- | :--- | 
| [**GSAP**](https://gsap.com/) | **Standard "No-Charge" License** | 
| [**p5.js**](https://p5js.org/) | **GNU Lesser General Public License 2.1 (LGPL 2.1)** | 
| [**HTMX**](https://htmx.org/) | **MIT License** | 
| [**Vidstack**](https://www.vidstack.io/) | **MIT License** | 

本專案本身採用 **MIT 授權條款**。
