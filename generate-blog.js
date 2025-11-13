#!/usr/bin/env node

const BlogGenerator = require("./utils/blog-generator");
const path = require("path");

async function main() {
  console.log("🚀 開始生成blog頁面...");

  try {
    const blogGenerator = new BlogGenerator(
      __dirname,
      path.join(__dirname, "templates"),
      __dirname,
    );

    // 生成所有blog頁面
    const generatedPosts = await blogGenerator.generateAllPosts();

    if (generatedPosts.length > 0) {
      console.log(`\n✅ 成功生成 ${generatedPosts.length} 篇blog文章:`);
      generatedPosts.forEach(({ post, path }) => {
        console.log(`   📄 ${post.title} -> ${path}`);
      });
    } else {
      console.log("\n📝 沒有找到blog文章或所有文章都是最新的");
    }

    console.log("\n🎉 Blog頁面生成完成！");
  } catch (error) {
    console.error("❌ Blog頁面生成失敗:", error);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = main;
