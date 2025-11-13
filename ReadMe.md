# 🟦 Bax Portfolio - Personal Portfolio Website

A modern, responsive portfolio website specifically built for **Motion Designers**, combining smooth animations, an elegant user experience, and an extremely simplified content management workflow.

![Preview](https://files.catbox.moe/opt3u1.jpg)

[中文版](https://github.com/Batkixni/Bax-Portfolio/blob/main/ReadMe-Zh.md)

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

---
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

5.  Open your browser and visit `http://localhost:3000`

---

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

---
## 💻 Development Commands

```bash
# Development Mode (Hot Reload)
yarn dev

# Production Mode
yarn start

# Generate Blog Pages Only
node generate-blog.js

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
  * Express.js - Web Framework
  * Marked - Markdown Parser
  * Front-Matter - Metadata Processing

-----

## 🚧 To-Do / Pending Updates

  * **Code Localization:** The code comments and internal variable names still largely use Chinese descriptions. 

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

This project itself is licensed under the **MIT License**.
