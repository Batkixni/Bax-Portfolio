# 🟦 Bax Portfolio - Personal Portfolio Website

A modern, responsive portfolio website specifically built for **Motion Designers**, combining smooth animations, an elegant user experience, and an extremely simplified content management workflow.

> Disclaimer: I am planning to restructuring this project to Astro & Tailwind CSS based framework at one day, the current version is still stable but may a little tricky to use if you want more customisations.

![Preview](https://files.catbox.moe/opt3u1.jpg)

[中文版](https://github.com/Batkixni/Bax-Portfolio/blob/main/README-zh.md)

## 🌠 Core Key Features

### Portfolio & Content Management
* **Designer Content Core:** Built for creative designers, the entire portfolio is automatically updated simply by writing **Markdown (.md)** files within the `/works` folder.
* **Dedicated Photography Page:** Includes a special `/photography` page for showcasing photography, static graphics, or other visual art creations.
* **Quick Media Embedding:** Supports extended Markdown syntax:
    * `!vid`: For quickly embedding local videos.
    * `!yt`: For quickly embedding YouTube videos.
* **Advanced Layout:** Supports the `%grid` special syntax for quickly creating responsive, multi-column grid layouts for projects.

### Visual & UX
* **Responsive Design** - Adapts to all device sizes.
* **Dark/Light Theme** - One-click theme mode switching.
* **Particle Background** - Dynamic interactive particle system.
* **Custom Cursor** - Dynamic cursor effect that follows the mouse.

### Animation & Technical
* **HTMX Integration** - Dynamic content loading without page refresh.
* **Static Generation** - Automatically generates portfolio and blog detail pages.
* **Modular Architecture** - Easy-to-maintain and extendable code structure.

-----

## ✒️ Quick Start

### Environment Requirements
* Node.js 16.0+
* **Yarn (Recommended)** or npm/pnpm

### Installation Steps

1.  Clone the project
    ```bash
    git clone https://github.com/Batkixni/Bax-Portfolio.git
    cd bax-website
    ```

2.  Install dependencies
    ```bash
    yarn
    ```

3.  Start the development server
    ```bash
    yarn dev
    ```

4.  Open your browser and visit `http://localhost:3001`

-----

## 📝 Add New Portfolio Work

1.  Create a new `.md` file in the `works/motion/` or `works/graphic/` directory.

2.  Use the following format:
    ```markdown
    ---
    title: "Project Title"
    description: "Project Description"
    image: "/src/images/work-cover.jpg"
    date: "2024"
    tags: ["tag1", "tag2"]
    category: "motion-design"
    ---

    # Project Content

    Write the detailed description of the project here...
    ```

-----


## 🛠️ Customization Guide

### 1\. Modify Basic Info (Title, Footer & Bio)

You need to modify the `<title>` tag and Footer information in the following files:

  * `src/index.html` (Homepage)
  * `src/photography.html` (Photography Page)
  * `src/404.html` (Error Page)
  * `templates/work-template.html` (Work Detail Page Template)

**Modify Title:**
Find `<title>{{title}} - Bax Portfolio</title>` and change it to your desired website title.

**Modify Bio:**
In `src/index.html`, find the **Hero Section** under \`\` and edit the text introduction.

**Modify Footer:**
In all the files listed above, find the \`\` section and update the copyright and contact information.

### 2\. Modify Logo & Avatar (Branding)

Please replace the following images in the `src/images/` folder:

  * `favico.svg` & `favico.jpg`: Website Logo (Browser favicon).
  * `header.jpg`: The circular personal avatar displayed in the Homepage Hero Section.

### 3\. Modify Loading Animation

To replace the loading screen with your own SVG logo, please modify the four HTML files mentioned above (index, photography, 404, work-template).

Find the \`\` section and paste your SVG code to replace the existing `<svg id="loading-svg" ...>` block.

### 4\. Configure Social Media Preview (Open Graph / SEO)

To ensure your website displays the correct preview image and information when shared on platforms like Facebook, Twitter, or Line, please modify the \`\` section in all HTML files.

**Example Configuration:**

````html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="Your Name - Creative Portfolio" />
<meta property="og:description" content="Visual designer / Motion Graphics" />
<meta property="og:image" content="./images/og-preview.svg" /> <meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="My Portfolio" />
<meta property="og:locale" content="en_US" />

````
---

## ⚙️ Advanced Configuration

### Remove Photography Page

If you don't need the photography portfolio feature, follow these steps to hide it:

1.  Open `src/index.html`.
2.  Find the `` section and delete the link inside `<div class="nav-links">`.
3.  Simply delete the `src/photography.html` file.
    *(Note: A deeper removal involves `src/js/photography.js` and backend logic, but these steps are sufficient to make the page inaccessible to users and will not affect the site's operation.)*

### Customize Portfolio Sections

By default, the site includes **Motion**, **Graphic**, and **Cinematic** sections.

#### 1. Simple Section Deletion

If you only need to delete a section (e.g., Cinematic), just delete the entire corresponding `<section id="cinematic" ...>` block from `src/index.html`.

#### 2. Add or Rename Sections (Advanced)

To add a new category (using "UI/UX" as an example) or modify paths, you must edit three files in order:

**Step A: Modify `build.js`**
Update the directory structure and Markdown validation paths:

```javascript
// Ensure all directories exist
const directories = [
  // ...other paths
  "works/motion",
  "works/uiux", // Modify or add your path
];

// Validate markdown files
const workDirs = [
  "works/motion",
  "works/uiux", // Modify or add your path
];
````

**Step B: Modify `src/js/app.js`**
Find the `// Immediately reload HTMX content` comment, then add your grid variable and reload logic:

```javascript
// 1. Define variables (recommend naming as xxxGrid)
const motionGrid = document.getElementById("motion-grid");
const uiuxGrid = document.getElementById("uiux-grid"); // Add new

// 2. Copy and modify the reload logic
if (uiuxGrid && typeof htmx !== "undefined") {
    console.log("Reloading uiux grid on pageshow");
    htmx.trigger(uiuxGrid, "load");
}
```

**Step C: Modify `src/index.html`**
Copy an existing Section block and modify its `id`, `hx-get` path, and `hx-target`:

```html
<section id="uiux" class="portfolio-section animate-element">
    <h2 class="section-title animate-element">UI/UX Designs</h2>
    <div
        class="portfolio-grid"
        id="uiux-grid" 
        hx-get="/api/works/uiux" 
        hx-trigger="load"
        hx-target="#uiux-grid"
    >
        <div class="loading">Loading...</div>
    </div>
</section>
```

*(Note: The `id="uiux-grid"` must match the variable in `app.js`; the `hx-get` path must match the folder in `build.js`.)*

**Step D: Create the Folder**
In the project's root `works/` directory, create the corresponding folder (e.g., `works/uiux/`) and place your `.md` files inside.

-----
## 💻 Development Commands

```bash
# Development Mode (Hot Reload + API)
yarn dev                 # Runs at http://localhost:3001

# Production Build & Deploy
yarn start              # Production server at :3000

# Content Management
yarn generate           # Generate work pages
yarn generate:force     # Force regenerate all pages
```

-----

## Technical Stack

### Frontend Technologies

  * HTML5 - Semantic Markup
  * CSS3 - Modern CSS features and CSS Variables
  * JavaScript ES6+ - Modular JavaScript
  * GSAP 3.12 - Animation Engine
  * P5.js - Particle System
  * HTMX - Dynamic Content Loading
  * **Vidstack** - Modern video player component (used for handling `!vid` embedding)

### Backend Technologies

  * Node.js - Server Environment
  * Express.js - Web Framework with compression & caching
  * Marked - Markdown Parser
  * Front-Matter - Metadata Processing
  * **Sharp** - High-performance image processing

-----

## 💡 Important Note

  * **AI Collaboration:** A majority of the features, structure, and code in this project were generated and optimized with the assistance of **Claude 3.7 and 4.0** models.

-----

## 📜 License and Attribution

This project uses the following open-source packages. Their license terms and official websites are noted below:

| Package Name | License |
| :--- | :--- | 
| [**GSAP** ](https://gsap.com/)| **Standard "No-Charge" License** | 
| [**p5.js** ](https://p5js.org/ )| **GNU Lesser General Public License 2.1 (LGPL 2.1)** | 
| [**HTMX**](https://htmx.org/ )| **MIT License** | 
| [**Vidstack** ](https://www.vidstack.io/ )| **MIT License** |

This project itself is licensed under the **MIT License**. If you have any questions, please open an issue on this Github repo.
