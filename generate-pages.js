#!/usr/bin/env node

const PageGenerator = require("./utils/page-generator");
const BlogGenerator = require("./utils/blog-generator");
const path = require("path");

async function main() {
  console.log("🚀 開始生成頁面...");

  try {
    // 生成作品頁面
    console.log("\n📄 生成作品頁面...");
    const pageGenerator = new PageGenerator(
      __dirname,
      path.join(__dirname, "templates"),
      __dirname,
    );

    const generatedWorks = await pageGenerator.generateAllPages();

    if (generatedWorks.length > 0) {
      console.log(`\n✅ 成功生成 ${generatedWorks.length} 個作品頁面:`);
      generatedWorks.forEach(({ work, path }) => {
        console.log(`   📄 ${work.title} -> ${path}`);
      });
    }

    // 生成Blog頁面
    console.log("\n📝 生成Blog頁面...");
    const blogGenerator = new BlogGenerator(
      __dirname,
      path.join(__dirname, "templates"),
      __dirname,
    );

    const generatedBlogs = await blogGenerator.generateAllPosts();

    if (generatedBlogs.length > 0) {
      console.log(`\n✅ 成功生成 ${generatedBlogs.length} 篇Blog文章:`);
      generatedBlogs.forEach(({ post, path }) => {
        console.log(`   📝 ${post.title} -> ${path}`);
      });
    }

    const totalGenerated = generatedWorks.length + generatedBlogs.length;
    console.log(`\n🎉 頁面生成完成！總共生成 ${totalGenerated} 個頁面。`);
  } catch (error) {
    console.error("❌ 頁面生成失敗:", error);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = main;
