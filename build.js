const fs = require("fs-extra");
const path = require("path");

// Build script for the portfolio website
async function build() {
  console.log("🏗️  Start Building Website...");

  try {
    // Ensure all directories exist
    const directories = [
      "src/css",
      "src/js",
      "src/images",
      "works/motion",
      "works/visual",
      "works/cinematic",
    ];

    for (const dir of directories) {
      await fs.ensureDir(dir);
      console.log(`✅ Ensure the Catalogs Exist: ${dir}`);
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
        console.log(
          `✅ Create Placeholder Images: ${imagePath.replace(".jpg", ".svg")}`,
        );
      }
    }

    // Validate markdown files
    const workDirs = ["works/motion", "works/visual", "works/cinematic"];

    for (const workDir of workDirs) {
      if (await fs.pathExists(workDir)) {
        const files = await fs.readdir(workDir);
        const mdFiles = files.filter((file) => file.endsWith(".md"));
        console.log(`✅ ${workDir} contain ${mdFiles.length} work files`);
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
        console.log(`✅ File Exist: ${file}`);
      } else {
        console.log(`❌ File Gone: ${file}`);
      }
    }

    console.log("\n🎉 Build Complete");
    console.log("\n📋 Next Up Steps");
    console.log("1. Run `yarn` to install dependences");
    console.log("2. Put your work image into src/images/");
    console.log("3. Run `yarn dev` to start the develop server");
    console.log("4. Open http://localhost:3000 in your browser");
  } catch (error) {
    console.error("❌ Error while building the website:", error);
  }
}

// Run build if this script is executed directly
if (require.main === module) {
  build();
}

module.exports = build;
