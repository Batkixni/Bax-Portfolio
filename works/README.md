## How to Add New Works

Follow these steps to showcase and organize your portfolio works easily.

---

### 1.  Create a New Markdown File

- Place the `.md` file inside one of the relevant folders, such as:
  - `works/motion/`
  - `works/visual/`
  - (Other category folders as needed)

#### Example frontmatter template (must be included at the top of every work file):

```yaml
---
title: "WORK TITLE"
description: "Short description of your work"
image: "/src/images/work-cover.jpg" # Thumbnail/cover image
date: "2024"
tags: ["tag1", "tag2"] # Use keywords for search/filter
category: "motion-design" # Should match the folder/category
---
```

> **Note:**  
> The **frontmatter** block above provides essential metadata so the backend recognizes, displays, and organizes your work properly.

---

### 2. Add Work Details & Assets

- Write a description and any relevant information about your work.
- Insert images, GIFs, or other media assets as needed.
- To show your work in a visually organized way, use grids and video embeds as outlined below.

#### Example for images:

```
![Your descriptive alt text](/src/images/work-detail.jpg)
```

---

### 3. Use Grid Layouts

- Use `%grid[n] ... %` syntax to arrange images or elements in rows.
- Replace `n` with the number of items per row you want (e.g., `%grid[2]` for two columns).

**Example:**

```
%grid[2]

![countdown.gif](/src/images/works/countdown.gif)
![visual](/src/images/works/sources.gif)

%
```

> The `%grid[2] ... %` block above will display 2 items per row side-by-side.

---

### 4. Embed Videos

- For direct video links, use:
  
  ```
  !vid(https://your-video-link.mp4)
  ```

- For YouTube videos, use:
  
  ```
  !yt(https://www.youtube.com/watch?v=YOUR_ID)
  ```

---

### 5. Tips & Best Practices

- Keep your work information clear, accurate, and concise.
- Make sure all image and video paths are correct.
- Organize works by category for easier navigation.
- Use tags and descriptions to help users find or filter works.

---

## 中文版 (Chinese Version)

## 如何添加新作品

按照以下步驟輕鬆展示和整理您的作品集作品。

---

### 1. 創建新的 Markdown 檔案

- 將 `.md` 檔案放置在相關資料夾中，例如：
  - `works/motion/`
  - `works/visual/`
  - （其他需要的類別資料夾）

#### frontmatter 範本範例（必須包含在每個作品檔案的頂部）：

```yaml
---
title: "作品標題"
description: "您作品的簡短描述"
image: "/src/images/work-cover.jpg" # 縮圖/封面圖片
date: "2024"
tags: ["標籤1", "標籤2"] # 使用關鍵字進行搜尋/篩選
category: "motion-design" # 應與資料夾/類別匹配
---
```

> **注意：**  
> 上述的 **frontmatter** 區塊提供了必要的元數據，讓後端能夠識別、顯示和正確組織您的作品。

---

### 2. 添加作品詳情和素材

- 撰寫作品的描述和任何相關資訊。
- 根據需要插入圖片、GIF 或其他媒體素材。
- 要以視覺化組織的方式展示您的作品，請使用下述的網格和視頻嵌入方法。

#### 圖片範例：

```
![您的描述性替代文字](/src/images/work-detail.jpg)
```

---

### 3. 使用網格佈局

- 使用 `%grid[n] ... %` 語法將圖片或元素排列成行。
- 將 `n` 替換為您想要的每行項目數（例如，`%grid[2]` 表示兩欄）。

**範例：**

```
%grid[2]

![countdown.gif](/src/images/works/countdown.gif)
![visual](/src/images/works/sources.gif)

%
```

> 上述的 `%grid[2] ... %` 區塊將以並排方式顯示每行 2 個項目。

---

### 4. 嵌入視頻

- 對於直接視頻鏈接，使用：
  
  ```
  !vid(https://your-video-link.mp4)
  ```

- 對於 YouTube 視頻，使用：
  
  ```
  !yt(https://www.youtube.com/watch?v=YOUR_ID)
  ```

---

### 5. 技巧與最佳實踐

- 保持您的作品資訊清晰、準確且簡潔。
- 確保所有圖片和視頻路徑都正確。
- 按類別組織作品以便於導航。
- 使用標籤和描述幫助使用者查找或篩選作品。

---

