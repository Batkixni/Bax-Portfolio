# Photography Portfolio Feature Guide

This photography portfolio page provides a complete display system for photographic works, including an image grid display and a detailed information modal.

## File Structure

```
photography/
├── images/             # Stores the image files of the photography works
│   ├── example.jpg
│   ├── sunset.jpg
│   └── portrait.jpg
├── photo-info.json     # Configuration file for detailed image information
└── README.md           # This documentation file
```

## Usage

### 1\. Adding a New Photography Work

1.  Place the image file into the `photography/images/` folder.
2.  Add the corresponding image information to `photo-info.json`.

### 2\. Configuring Image Information

Edit the `photo-info.json` file to add detailed information for each image:

```json
{
  "photos": {
    "your-photo.jpg": {
      "title": "Photo Title",
      "description": "Photo Description",
      "exif": {
        "camera": "Camera Model",
        "lens": "Lens Model",
        "focal_length": "Focal Length",
        "aperture": "Aperture Value",
        "shutter_speed": "Shutter Speed",
        "iso": "ISO Value",
        "date_taken": "Date Taken (YYYY-MM-DD)"
      },
      "tags": ["Tag 1", "Tag 2"]
    }
  }
}
```

### 3\. Supported Image Formats

  * JPG/JPEG
  * PNG
  * WebP
  * GIF

## Key Features

### Image Grid Display

  * Responsive grid layout
  * Hover effect animation
  * Image lazy loading

### Detailed Information Modal

  * Click on an image to view detailed information
  * EXIF data display
  * Tagging system
  * High-resolution image preview


## Example Configuration

Refer to the example configurations in `photo-info.json`:

  * `example.jpg` - Basic configuration example
  * `sunset.jpg` - Landscape photography example
  * `portrait.jpg` - Portrait photography example

The system will automatically load the latest images and configuration information every time the server is restarted or the page is refreshed.

---

## 中文版 (Chinese Version)

# 攝影作品集功能指南

此攝影作品集頁面提供了完整的攝影作品展示系統，包括圖片網格顯示和詳細資訊模態框。

## 檔案結構

```
photography/
├── images/             # 儲存攝影作品的圖片檔案
│   ├── example.jpg
│   ├── sunset.jpg
│   └── portrait.jpg
├── photo-info.json     # 詳細圖片資訊的設定檔案
└── README.md           # 此說明文件
```

## 使用方法

### 1. 加入新的攝影作品

1. 將圖片檔案放置到 `photography/images/` 資料夾中。
2. 在 `photo-info.json` 中加入對應的圖片資訊。

### 2. 設定圖片資訊

編輯 `photo-info.json` 檔案為每張圖片加入詳細資訊：

```json
{
  "photos": {
    "your-photo.jpg": {
      "title": "照片標題",
      "description": "照片描述",
      "exif": {
        "camera": "相機型號",
        "lens": "鏡頭型號",
        "focal_length": "焦距",
        "aperture": "光圈值",
        "shutter_speed": "快門速度",
        "iso": "ISO 值",
        "date_taken": "拍攝日期 (YYYY-MM-DD)"
      },
      "tags": ["標籤 1", "標籤 2"]
    }
  }
}
```

### 3. 支援的圖片格式

  * JPG/JPEG
  * PNG
  * WebP
  * GIF

## 主要功能

### 圖片網格顯示

  * 響應式網格佈局
  * Hover效果動畫
  * 圖片延遲載入

### 詳細資訊框

  * 點擊圖片查看詳細資訊
  * EXIF 資料顯示
  * 標籤系統
  * 高解析度圖片預覽

## 設定範例

請參考 `photo-info.json` 中的範例設定：

  * `example.jpg` - 基本設定範例
  * `sunset.jpg` - 風景攝影範例
  * `portrait.jpg` - 人像攝影範例

系統會在每次伺服器重啟或頁面刷新時自動載入最新的圖片和設定資訊。
