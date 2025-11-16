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

-----

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

4.  開啟瀏覽器訪問 `http://localhost:3000`

-----

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
    
-----

## 🛠️ 客製化指南 (Customization Guide)

### 1\. 修改基本資訊 (Title, Footer & Bio)

你需要修改以下檔案中的 `<title>` 標籤與 Footer 資訊：

  * `src/index.html` (首頁)
  * `src/photography.html` (攝影頁)
  * `src/404.html` (錯誤頁)
  * `templates/work-template.html` (作品內頁模板)

**修改標題：**
找到 `<title>{{title}} - Bax Portfolio</title>` 並修改為你的網頁標題。

**修改個人簡介 (Bio)：**
在 `src/index.html` 中找到 \`\` 下方的 **Hero Section**，修改其中的文字介紹。

**修改頁尾 (Footer)：**
在上述所有檔案中找到 \`\` 區塊，修改版權宣告與聯絡資訊。

### 2\. 修改 Logo 與頭像 (Branding)

請替換 `src/images/` 資料夾中的以下圖片：

  * `favico.svg` & `favico.jpg`：網站 Logo (瀏覽器分頁圖示)。
  * `header.jpg`：首頁 Hero Section 顯示的圓形個人頭像。

### 3\. 修改 Loading 動畫

若要將 Loading 畫面更換為你自己的 SVG Logo，請修改上述提到的四個 HTML 檔案（index, photography, 404, work-template）。

找到 \`\` 區塊，將你的 SVG 代碼貼入取代現有的 `<svg id="loading-svg" ...>` 區塊。

### 4\. 設定社群預覽 (Open Graph / SEO)

為了讓網站在 Facebook、Twitter 或 Line 分享時顯示正確的預覽圖與資訊，請修改所有 HTML 檔案中的 \`\` 區塊。

**範例設定：**

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://你的網域.com/" />
<meta property="og:title" content="你的名字 - Creative Portfolio" />
<meta property="og:description" content="Visual designer / Motion Graphics" />
<meta property="og:image" content="./images/og-preview.svg" /> <meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="My Portfolio" />
<meta property="og:locale" content="zh_TW" />
```

-----

## ⚙️ 進階設定 (Advanced Configuration)

### 移除 Photography (攝影) 頁面

如果你不需要攝影作品集功能，請依照以下步驟隱藏：

1.  打開 `src/index.html`。
2.  找到 \`\` 區塊，刪除 `<div class="nav-links">` 內的連結代碼。
3.  直接刪除 `src/photography.html` 檔案。
    *(註：更深層的移除涉及 `src/js/photography.js` 與後端邏輯，但僅執行上述步驟即可讓使用者無法訪問該頁面且不影響網站運作。)*

### 自定義作品集區塊 (Modify Portfolio Sections)

預設包含 **Motion**, **Graphic**, **Cinematic** 三個區塊。

#### 1\. 簡單刪除區塊

若只需刪除某個區塊（例如 Cinematic），直接在 `src/index.html` 中刪除對應的 `<section id="cinematic" ...>` 整個區塊即可。

#### 2\. 新增或重新命名區塊 (進階)

若要新增類別（以下內容均以 "UI/UX"為例）或修改路徑，需依序修改三個檔案：

**步驟 A：修改 `build.js`**
更新目錄結構與 Markdown 驗證路徑：

```javascript
// Ensure all directories exist
const directories = [
  // ...其他路徑
  "works/motion",
  "works/uiux", // 修改或新增你的路徑
];

// Validate markdown files
const workDirs = [
  "works/motion",
  "works/uiux", // 修改或新增你的路徑
];
```

**步驟 B：修改 `src/js/app.js`**
找到 `// 立即重新載入 HTMX 內容` 註解下方，新增你的 Grid 變數與重載邏輯：

```javascript
// 1. 定義變數 (建議命名為 xxxGrid)
const motionGrid = document.getElementById("motion-grid");
const uiuxGrid = document.getElementById("uiux-grid"); // 新增

// 2. 複製並修改重載邏輯
if (uiuxGrid && typeof htmx !== "undefined") {
    console.log("Reloading uiux grid on pageshow");
    htmx.trigger(uiuxGrid, "load");
}
```

**步驟 C：修改 `src/index.html`**
複製現有的 Section 區塊並修改 `id`、`hx-get` 路徑與 `hx-target`：

```html
<section id="uiux" class="portfolio-section animate-element">
    <h2 class="section-title animate-element">UI/UX Designs</h2>
    <div
        class="portfolio-grid"
        id="uiux-grid" 
        hx-get="/api/works/uiux" 
        hx-trigger="load"
        hx-target="#uiux-grid"
    >
        <div class="loading">Loading...</div>
    </div>
</section>
```

*(注意：`id="uiux-grid"` 必須與 `app.js` 中的變數對應；`hx-get` 路徑必須與 `build.js` 中的資料夾對應。)*

**步驟 D：建立資料夾**
在專案根目錄的 `works/` 資料夾下，建立對應的資料夾（如 `works/uiux/`），並放入 `.md` 文件。

-----

## 💻 開發指令 (Development Commands)

```bash
# 開發模式 (熱重載)
yarn dev

# 生產模式
yarn start

# 只生成 Blog 頁面
yarn generate       
yarn generate:force     # 強制生成頁面

```

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
如果您有任何問題，歡迎在Github提出Issue詢問。
