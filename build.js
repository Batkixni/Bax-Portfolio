const fs = require("fs-extra");
const path = require("path");

// Build script for the portfolio website
async function build() {
  console.log("🏗️  開始建構網站...");

  try {
    // Ensure all directories exist
    const directories = [
      "src/css",
      "src/js",
      "src/images",
      "works/motion-design",
      "works/visual-design",
      "works/cinematic-design",
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
      console.log(`✅ 確保目錄存在: ${dir}`);
    }

    // Create placeholder images if they don't exist
    const placeholderImages = [
      "src/images/motion-work-1.jpg",
      "src/images/motion-work-2.jpg",
      "src/images/graphic-work-1.jpg",
      "src/images/graphic-work-2.jpg",
      "src/images/placeholder.jpg",
    ];

    for (const imagePath of placeholderImages) {
      if (!(await fs.pathExists(imagePath))) {
        // Create a simple SVG placeholder
        const svgContent = `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#222"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#fff" text-anchor="middle" dy=".3em">
    ${path.basename(imagePath, ".jpg").replace("-", " ").toUpperCase()}
  </text>
</svg>`;

        await fs.writeFile(imagePath.replace(".jpg", ".svg"), svgContent);
        console.log(`✅ 創建占位圖片: ${imagePath.replace(".jpg", ".svg")}`);
      }
    }

    // Validate markdown files
    const workDirs = ["works/motion", "works/visual", "works/cinematic"];

    for (const workDir of workDirs) {
      if (await fs.pathExists(workDir)) {
        const files = await fs.readdir(workDir);
        const mdFiles = files.filter((file) => file.endsWith(".md"));
        console.log(`✅ ${workDir} 包含 ${mdFiles.length} 個作品文件`);
      }
    }

    // Check if all required files exist
    const requiredFiles = [
      "index.html",
      "package.json",
      "server.js",
      "src/css/style.css",
      "src/js/app.js",
    ];

    for (const file of requiredFiles) {
      if (await fs.pathExists(file)) {
        console.log(`✅ 檔案存在: ${file}`);
      } else {
        console.log(`❌ 檔案缺失: ${file}`);
      }
    }

    console.log("\n🎉 建構完成！");
    console.log("\n📋 接下來的步驟:");
    console.log("1. 執行 `pnpm install` 安裝依賴");
    console.log("2. 將您的作品圖片放入 src/images/ 目錄");
    console.log("3. 執行 `pnpm run dev` 啟動開發伺服器");
    console.log("4. 在瀏覽器中打開 http://localhost:3000");
  } catch (error) {
    console.error("❌ 建構過程中發生錯誤:", error);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = build;
