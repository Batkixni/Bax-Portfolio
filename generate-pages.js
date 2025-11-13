#!/usr/bin/env node

const PageGenerator = require("./utils/page-generator");
const path = require("path");

async function main() {
  console.log("🚀 Generating Pages...");

  try {
    // 生成作品頁面
    console.log("\n📄 Generating Work Pages...");
    const pageGenerator = new PageGenerator(
      __dirname,
      path.join(__dirname, "templates"),
      __dirname,
    );

    const generatedWorks = await pageGenerator.generateAllPages();

    if (generatedWorks.length > 0) {
      console.log(`\n✅ Successfully generated ${generatedWorks.length} work pages:`);
      generatedWorks.forEach(({ work, path }) => {
        console.log(`   📄 ${work.title} -> ${path}`);
      });
    }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = main;
