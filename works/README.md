## How to Add New Works

Follow these steps to showcase and organize your portfolio works easily.

---

### 1.  Create a New Markdown File

- Place the `.md` file inside one of the relevant folders, such as:
  - `works/motion/`
  - `works/visual/`
  - (Other category folders as needed)

#### Example frontmatter template (must be included at the top of every work file):

```yaml
---
title: "WORK TITLE"
description: "Short description of your work"
image: "/src/images/work-cover.jpg" # Thumbnail/cover image
date: "2024"
tags: ["tag1", "tag2"] # Use keywords for search/filter
category: "motion-design" # Should match the folder/category
---
```

> **Note:**  
> The **frontmatter** block above provides essential metadata so the backend recognizes, displays, and organizes your work properly.

---

### 2. Add Work Details & Assets

- Write a description and any relevant information about your work.
- Insert images, GIFs, or other media assets as needed.
- To show your work in a visually organized way, use grids and video embeds as outlined below.

#### Example for images:

```
![Your descriptive alt text](/src/images/work-detail.jpg)
```

---

### 3. Use Grid Layouts

- Use `%grid[n] ... %` syntax to arrange images or elements in rows.
- Replace `n` with the number of items per row you want (e.g., `%grid[2]` for two columns).

**Example:**

```
%grid[2]

![countdown.gif](/src/images/works/countdown.gif)
![visual](/src/images/works/sources.gif)

%
```

> The `%grid[2] ... %` block above will display 2 items per row side-by-side.

---

### 4. Embed Videos

- For direct video links, use:
  
  ```
  !vid(https://your-video-link.mp4)
  ```

- For YouTube videos, use:
  
  ```
  !yt(https://www.youtube.com/watch?v=YOUR_ID)
  ```

---

### 5. Tips & Best Practices

- Keep your work information clear, accurate, and concise.
- Make sure all image and video paths are correct.
- Organize works by category for easier navigation.
- Use tags and descriptions to help users find or filter works.

---

