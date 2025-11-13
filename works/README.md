### **Add new works**

1. **Create new markdown file**
Under path `works/motion/` or `works/visual/` etc to add new .md file：
```
---
title: "WORK TITAL"
description: "DESC"
image: "/src/images/work-cover.jpg"
date: "2024"
tags: ["tag1", "tag2"]
category: "motion-design"
---
```

```
↑ These info is needed to let the backend know what your works are.
```

# Information of your works

Write down your works informations here
```

![Insert your image](/src/images/work-detail.jpg)

```
The first %grid[2] means you are creating a grid that can place two objects in one row. Similarly, you can change the number to whatever you need. Add a % at the end after you finish using the grid to signify the end of the grid block.

Use !vid(link) to insert any direct video link, and use !yt(link) to insert a YouTube video.

For Example:

%grid[2]

```
![countdown.gif](/src/images/works/countdown.gif)

![visual](/src/images/works/sources.gif)
```
%

This will let the backend know you want to create a 2X1 grid.

```
