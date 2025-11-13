# Open Graph Preview Image Instructions

## 建議的預覽圖片規格

### 主要預覽圖片 (og-preview.jpg)
- **尺寸**: 1200 x 630 pixels
- **比例**: 1.91:1 (Facebook/Twitter 推薦)
- **格式**: JPG 或 PNG
- **檔案大小**: 建議小於 1MB
- **位置**: `/src/images/og-preview.jpg`

### 設計建議
1. **背景**: 使用你的品牌色彩 (目前網站的深色主題)
2. **文字**: 
   - 主標題: "Bax - Creative Portfolio"
   - 副標題: "Motion Design & Graphic Design"
3. **元素**:
   - 你的 Logo 或頭像
   - 一些作品預覽縮圖
   - 簡潔的設計風格，符合你的網站美學

### 為個別作品創建預覽圖片
每個作品可以有自己的預覽圖片，建議格式：
- 作品主視覺 + 標題
- 統一的品牌框架
- 作品類別標籤 (Motion Design / Graphic Design)

## 快速創建方法

### 方法一: 使用設計工具
- Figma, Canva, Photoshop
- 使用 1200x630 的畫布
- 加入品牌元素和作品預覽

### 方法二: 線上工具
- [og-image.vercel.app](https://og-image.vercel.app/)
- [bannerbear.com](https://www.bannerbear.com/)
- [placid.app](https://placid.app/)

### 方法三: 程式化生成
如果有很多作品需要預覽圖，可以考慮：
- 使用 Puppeteer 自動截圖
- Canvas API 動態生成
- 整合到 build 流程中

## 檔案命名規範

```
/src/images/
├── og-preview.jpg              # 主站預覽圖
├── og-motion-design.jpg        # Motion Design 分類預覽圖
├── og-graphic-design.jpg       # Graphic Design 分類預覽圖
└── works/
    ├── motion-work-1-og.jpg    # 個別作品預覽圖
    └── graphic-work-1-og.jpg
```

## 測試預覽效果

### Facebook
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- 輸入你的網址測試預覽效果

### Twitter
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- 檢查 Twitter Card 顯示效果

### LinkedIn
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- 驗證 LinkedIn 分享預覽

### 通用工具
- [OpenGraph.xyz](https://www.opengraph.xyz/)
- [Meta Tags](https://metatags.io/)

## 目前設定

你的網站已經配置了以下 meta 標籤：

### 主頁面
- `og:title`: "Bax - Creative Portfolio"
- `og:description`: "Explore Bax's creative portfolio featuring motion design, graphic design, and digital art works."
- `og:image`: "https://bax-portfolio.com/src/images/og-preview.jpg"

### 作品頁面
- 動態標題和描述
- 使用作品的原始圖片作為預覽圖
- 自動生成 URL

## 下一步

1. 創建主要的 `og-preview.jpg` 檔案
2. 測試預覽效果
3. 根據需要為個別作品創建專屬預覽圖
4. 更新網域名稱 (目前使用 placeholder: bax-portfolio.com)