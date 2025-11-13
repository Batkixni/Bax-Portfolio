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
