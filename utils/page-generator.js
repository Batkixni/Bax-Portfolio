const fs = require("fs-extra");
const path = require("path");
const marked = require("marked");
const fm = require("front-matter");

// YouTube URL 處理函數
function extractYouTubeId(url) {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// 處理自定義 YouTube 語法
function processYouTubeShortcodes(content) {
  // 匹配 !yt(URL) 格式
  const youtubePattern = /!yt\(([^)]+)\)/g;

  return content.replace(youtubePattern, (match, url) => {
    const videoId = extractYouTubeId(url.trim());

    if (!videoId) {
      console.warn(`無法從 URL 提取 YouTube ID: ${url}`);
      return match; // 如果無法提取 ID，保持原始文本
    }

    // 生成響應式的 YouTube embed HTML
    // 生成 Vidstack 播放器 HTML
    return `<div class="video-container">
<media-player
  id="${videoId}"
  src="youtube/${videoId}"
  view-type="video"
  stream-type="on-demand"
  crossOrigin= true
  playInline = true
  logLevel= "warn"
  load="eager"
  poster="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg"
  aspect-ratio="16/9"
  crossorigin="anonymous">
  <media-provider></media-provider>
  <media-video-layout
    thumbnails="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg"
    small-when="never">
  </media-video-layout>
</media-player>
</div>`;
    //     return `<div class="yt-container">
    //   <iframe class="responsive-iframe" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    // </div>`;
  });
}

// 處理自定義 Vidstack 影片語法
function processVideoShortcodes(content, defaultPoster = "") {
  // 先保護程式碼區塊，避免誤解析
  const codeBlocks = [];
  let protectedContent = content;

  // 保護三個反引號的程式碼區塊
  protectedContent = protectedContent.replace(
    /```[\s\S]*?```/g,
    (match, index) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(match);
      return placeholder;
    },
  );

  // 保護單個反引號的內聯程式碼
  protectedContent = protectedContent.replace(/`[^`]+`/g, (match, index) => {
    const placeholder = `__INLINE_CODE_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // 匹配 !vid(URL, type, poster) 格式，type 和 poster 為可選參數
  const videoPattern = /!vid\(([^,)]+)(?:,\s*([^,)]+))?(?:,\s*([^)]+))?\)/g;

  protectedContent = protectedContent.replace(
    videoPattern,
    (match, url, type = "mp4", poster = "") => {
      const cleanUrl = url.trim();
      const cleanType = type.trim();
      const cleanPoster = poster ? poster.trim() : "";

      // 生成唯一的 ID
      const videoId = `video-${Math.random().toString(36).substr(2, 9)}`;

      // 使用提供的poster或預設poster
      const finalPoster = cleanPoster || defaultPoster;

      // 生成 Vidstack 播放器 HTML
      return `<div class="video-container">
  <media-player
    id="${videoId}"
    src="${cleanUrl}"
    view-type="video"
    stream-type="on-demand"
    load="eager"
    poster="${finalPoster}"
    aspect-ratio="16/9"
    crossorigin="anonymous">
    <media-provider></media-provider>
    <media-video-layout
      thumbnails="${finalPoster}"
      small-when="never">
    </media-video-layout>
  </media-player>
</div>`;
    },
  );

  // 恢復程式碼區塊
  codeBlocks.forEach((block, index) => {
    protectedContent = protectedContent.replace(
      `__CODE_BLOCK_${index}__`,
      block,
    );
    protectedContent = protectedContent.replace(
      `__INLINE_CODE_${index}__`,
      block,
    );
  });

  return protectedContent;
}

// 處理自定義 Grid 語法
function processGridShortcodes(content) {
  // 先處理結束標記，將單獨的 % 替換為特殊標記
  let processedContent = content.replace(/^%\s*$/gm, "%%GRID_END%%");

  // 匹配 %grid[數字] 開始標記和 %%GRID_END%% 結束標記
  const gridPattern = /%grid\[(\d+)\]([\s\S]*?)%%GRID_END%%/g;

  return processedContent.replace(
    gridPattern,
    (match, columns, gridContent) => {
      // 清理 gridContent，移除開頭和結尾的空白行
      const cleanContent = gridContent.trim();

      // 提取所有圖片並為每個圖片創建獨立的div
      const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const images = [];
      let imageMatch;

      while ((imageMatch = imagePattern.exec(cleanContent)) !== null) {
        const alt = imageMatch[1];
        const src = imageMatch[2];
        images.push(`<img src="${src}" alt="${alt}" />`);
      }

      // 如果找到圖片，使用圖片；否則使用原始內容
      const gridItems = images.length > 0 ? images.join("\n") : cleanContent;

      // 生成 grid HTML
      return `<div class="custom-grid" style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 15px; margin: 20px 0; overflow: hidden;">
${gridItems}
</div>

`;
    },
  );
}

class PageGenerator {
  constructor(baseDir, templateDir, outputDir) {
    this.baseDir = baseDir;
    this.templateDir = templateDir;
    this.outputDir = outputDir;
    this.worksDir = path.join(baseDir, "works");
    this.template = null;
  }

  async initialize() {
    // 載入模板
    const templatePath = path.join(this.templateDir, "work-template.html");
    this.template = await fs.readFile(templatePath, "utf8");

    // 確保輸出目錄存在
    await fs.ensureDir(this.outputDir);
    await fs.ensureDir(path.join(this.outputDir, "work"));
  }

  // 簡單的模板替換函數
  replaceTemplate(template, data) {
    let result = template;

    // 基本替換
    Object.keys(data).forEach((key) => {
      const value = data[key] || "";
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, value);
    });

    // 條件性內容處理 (簡化版)
    // 處理 {{#image}} ... {{/image}} 這樣的條件塊
    if (data.image) {
      result = result.replace(/{{#image}}([\s\S]*?){{\/image}}/g, "$1");
    } else {
      result = result.replace(/{{#image}}([\s\S]*?){{\/image}}/g, "");
    }

    if (data.date) {
      result = result.replace(/{{#date}}([\s\S]*?){{\/date}}/g, "$1");
    } else {
      result = result.replace(/{{#date}}([\s\S]*?){{\/date}}/g, "");
    }

    // 處理標籤
    if (data.tags && data.tags.length > 0) {
      const tagsHtml = data.tags
        .map((tag) => `<span class="work-tag">${tag}</span>`)
        .join("");
      result = result.replace(
        /{{#tags}}([\s\S]*?){{\/tags}}/g,
        `<div class="work-tags">${tagsHtml}</div>`,
      );
    } else {
      result = result.replace(/{{#tags}}([\s\S]*?){{\/tags}}/g, "");
    }

    // 處理導航 (暫時移除前後作品導航)
    result = result.replace(/{{#prevWork}}([\s\S]*?){{\/prevWork}}/g, "");
    result = result.replace(/{{#nextWork}}([\s\S]*?){{\/nextWork}}/g, "");

    return result;
  }

  async getAllWorks() {
    const allWorks = [];
    const categories = await fs.readdir(this.worksDir);

    for (const category of categories) {
      const categoryPath = path.join(this.worksDir, category);
      const stat = await fs.stat(categoryPath);

      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);
        const mdFiles = files.filter((file) => file.endsWith(".md"));

        for (const file of mdFiles) {
          const filePath = path.join(categoryPath, file);
          const content = await fs.readFile(filePath, "utf8");
          const parsed = fm(content);

          // 處理自定義語法，傳入作品的image作為預設poster
          const workImage = parsed.attributes.image || "";
          let processedBody = processYouTubeShortcodes(parsed.body);
          processedBody = processVideoShortcodes(processedBody, workImage);
          processedBody = processGridShortcodes(processedBody);

          const work = {
            id: path.parse(file).name,
            title: parsed.attributes.title || "未命名作品",
            description: parsed.attributes.description || "",
            image: parsed.attributes.image || "/src/images/placeholder.svg",
            category: category,
            categoryDisplay: this.getCategoryDisplay(category),
            path: `${category}/${path.parse(file).name}`,
            order: parsed.attributes.order || 999,
            date: parsed.attributes.date || "",
            tags: parsed.attributes.tags || [],
            content: marked.parse(processedBody),
            filePath: filePath,
          };

          allWorks.push(work);
        }
      }
    }

    return allWorks;
  }

  getCategoryDisplay(category) {
    const categoryMap = {
      "graphic-design": "Visual Designs",
      "motion-design": "Motion Designs",
    };
    return categoryMap[category] || category;
  }

  async generateWorkPage(work) {
    const data = {
      title: work.title,
      description: work.description,
      image: work.image,
      category: work.categoryDisplay,
      date: work.date ? new Date(work.date).toLocaleDateString("zh-TW") : "",
      tags: work.tags,
      content: work.content,
      id: work.id,
    };

    const html = this.replaceTemplate(this.template, data);

    // 建立輸出路徑
    const outputPath = path.join(this.outputDir, "work", `${work.path}.html`);
    await fs.ensureDir(path.dirname(outputPath));

    // 寫入檔案
    await fs.writeFile(outputPath, html, "utf8");

    return outputPath;
  }

  async generateAllPages() {
    if (!this.template) {
      await this.initialize();
    }

    const works = await this.getAllWorks();
    const generatedPages = [];

    console.log(`找到 ${works.length} 個作品，開始生成頁面...`);

    for (const work of works) {
      try {
        const outputPath = await this.generateWorkPage(work);
        generatedPages.push({
          work: work,
          path: outputPath,
        });
        console.log(`✓ 已生成: ${work.title} -> ${outputPath}`);
      } catch (error) {
        console.error(`✗ 生成失敗: ${work.title}`, error);
      }
    }

    return generatedPages;
  }

  async checkMissingPages() {
    const works = await this.getAllWorks();
    const missingPages = [];

    for (const work of works) {
      const expectedPath = path.join(
        this.outputDir,
        "work",
        `${work.path}.html`,
      );
      const exists = await fs.pathExists(expectedPath);

      if (!exists) {
        missingPages.push(work);
      } else {
        // 檢查檔案是否比 markdown 檔案舊
        const htmlStat = await fs.stat(expectedPath);
        const mdStat = await fs.stat(work.filePath);

        if (mdStat.mtime > htmlStat.mtime) {
          missingPages.push(work);
        }
      }
    }

    return missingPages;
  }

  async generateMissingPages() {
    if (!this.template) {
      await this.initialize();
    }

    const missingPages = await this.checkMissingPages();

    if (missingPages.length === 0) {
      console.log("所有作品頁面都是最新的");
      return [];
    }

    console.log(`需要生成/更新 ${missingPages.length} 個頁面`);

    const generatedPages = [];

    for (const work of missingPages) {
      try {
        const outputPath = await this.generateWorkPage(work);
        generatedPages.push({
          work: work,
          path: outputPath,
        });
        console.log(`✓ 已生成/更新: ${work.title}`);
      } catch (error) {
        console.error(`✗ 生成失敗: ${work.title}`, error);
      }
    }

    return generatedPages;
  }
}

module.exports = PageGenerator;
