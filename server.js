const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const marked = require("marked");
const fm = require("front-matter");
const compression = require("compression");
const expressStaticGzip = require("express-static-gzip");
const PageGenerator = require("./utils/page-generator");
const PhotoManager = require("./utils/photo-manager");

const app = express();
const PORT = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV !== "production";

// Enable gzip compression (only in production)
if (!isDevelopment) {
  app.use(
    compression({
      level: 6,
      threshold: 1024,
    }),
  );

  // Serve Parcel built static files with compression and caching (production only)
  app.use(
    expressStaticGzip(path.join(__dirname, "dist"), {
      enableBrotli: true,
      orderPreferred: ["br", "gz"],
      setHeaders: (res, path) => {
        if (path.match(/\.(js|css)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
          res.setHeader("Cache-Control", "public, max-age=2592000");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      },
    }),
  );
}

// Set security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-DNS-Prefetch-Control", "on");
  next();
});

// Initialize photo manager
const photoManager = new PhotoManager(path.join(__dirname, "photography"));

// Initialize page generator
const pageGenerator = new PageGenerator(
  __dirname,
  path.join(__dirname, "templates"),
  __dirname,
);

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Serve static files
if (isDevelopment) {
  // In development, serve source files directly
  app.use(express.static(path.join(__dirname, "src")));
  app.use("/src", express.static(path.join(__dirname, "src")));
  app.use("/images", express.static(path.join(__dirname, "src/images")));
  // Handle photography route static files
  app.use(
    "/photography/css",
    express.static(path.join(__dirname, "src", "css")),
  );
  app.use("/photography/js", express.static(path.join(__dirname, "src", "js")));
  app.use(
    "/photography/lib",
    express.static(path.join(__dirname, "src", "lib")),
  );
  app.use(
    "/photography/images",
    express.static(path.join(__dirname, "src", "images")),
  );
} else {
  // In production, serve from dist and src for fallback
  app.use("/src", express.static(path.join(__dirname, "src")));
  app.use("/images", express.static(path.join(__dirname, "src/images")));
  // Handle photography route static files for production
  app.use("/photography", express.static(path.join(__dirname, "dist")));
}
app.use("/photography", express.static(path.join(__dirname, "photography")));

// Serve generated work pages
app.use("/work", express.static(path.join(__dirname, "work")));

// Serve main page
app.get("/", (req, res) => {
  if (isDevelopment) {
    // In development, serve from src
    const srcIndexPath = path.join(__dirname, "src", "index.html");
    res.sendFile(srcIndexPath);
  } else {
    // In production, serve from dist
    const distIndexPath = path.join(__dirname, "dist", "index.html");
    if (fs.existsSync(distIndexPath)) {
      res.sendFile(distIndexPath);
    } else {
      res
        .status(500)
        .send("Production build not found. Run 'yarn build' first.");
    }
  }
});

// Serve photography page
app.get("/photography", (req, res) => {
  if (isDevelopment) {
    // In development, serve from src
    const srcPhotographyPath = path.join(__dirname, "src", "photography.html");
    res.sendFile(srcPhotographyPath);
  } else {
    // In production, serve from dist
    const distPhotographyPath = path.join(
      __dirname,
      "dist",
      "photography.html",
    );
    if (fs.existsSync(distPhotographyPath)) {
      res.sendFile(distPhotographyPath);
    } else {
      res
        .status(500)
        .send("Production build not found. Run 'yarn build' first.");
    }
  }
});

// Explicit 404 route
app.get("/404", (req, res) => {
  if (isDevelopment) {
    res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
  } else {
    const dist404Path = path.join(__dirname, "dist", "404.html");
    if (fs.existsSync(dist404Path)) {
      res.status(404).sendFile(dist404Path);
    } else {
      res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
    }
  }
});

// Handle old photography.html route (redirect to clean URL)
app.get("/photography.html", (req, res) => {
  res.redirect(301, "/photography");
});

// Serve individual work pages
app.get("/work/:category/:id", (req, res) => {
  const { category, id } = req.params;
  const workPagePath = path.join(__dirname, "work", category, `${id}.html`);

  if (fs.existsSync(workPagePath)) {
    res.sendFile(workPagePath);
  } else {
    if (isDevelopment) {
      res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
    } else {
      const dist404Path = path.join(__dirname, "dist", "404.html");
      if (fs.existsSync(dist404Path)) {
        res.status(404).sendFile(dist404Path);
      } else {
        res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
      }
    }
  }
});

// Redirect .html requests to clean URLs
app.get("/blog/:id.html", (req, res) => {
  const { id } = req.params;
  res.redirect(301, `/blog/${id}`);
});

// API endpoint to get works by category
app.get("/api/works/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const worksDir = path.join(__dirname, "works", category);

    if (!(await fs.pathExists(worksDir))) {
      return res.json([]);
    }

    const files = await fs.readdir(worksDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    const works = [];

    for (const file of mdFiles) {
      const filePath = path.join(worksDir, file);
      const content = await fs.readFile(filePath, "utf8");
      const parsed = fm(content);

      const work = {
        id: path.parse(file).name,
        title: parsed.attributes.title || "Untitled Work",
        description: parsed.attributes.description || "",
        image: parsed.attributes.image || "/src/images/placeholder.svg",
        category: category,
        path: `${category}/${path.parse(file).name}`,
        order: parsed.attributes.order,
        date: parsed.attributes.date || "",
      };

      works.push(work);
    }

    // Sort by order if specified, otherwise by title
    works.sort((a, b) => {
      const orderA = a.order || 999;
      const orderB = b.order || 999;
      if (orderA !== orderB) {
        return orderB - orderA;
      }
      return b.title.localeCompare(a.title);
    });

    // Generate HTML for portfolio items
    const html = works
      .map(
        (work) => `
            <a href="/work/${work.path}" class="portfolio-item" data-work="${work.path}">
                <div class="portfolio-image">
                    <img src="${work.image}" alt="${work.title}" loading="lazy">
                </div>
                <div class="portfolio-content">
                    <h3 class="portfolio-title">${work.title}</h3>
                    <span class="portfolio-year">${work.date ? new Date(work.date).getFullYear() : ""}</span>
                </div>
            </a>
        `,
      )
      .join("");

    res.send(html);
  } catch (error) {
    console.error("Error loading works:", error);
    res.status(500).send('<div class="loading">Error loading works</div>');
  }
});

// API endpoint to get photography images
app.get("/api/photography/images", async (req, res) => {
  try {
    // Auto-update photos before serving
    await photoManager.scanAndUpdatePhotos();

    const photoData = await photoManager.loadPhotoData();
    const imageFiles = await photoManager.getImageFiles();

    // Build response
    const photos = imageFiles.map((filename) => ({
      filename,
      path: `/photography/images/${filename}`,
      info: photoData.photos[filename] || {
        title: filename.replace(/\.[^/.]+$/, ""),
        description: "",
        exif: {},
        tags: [],
      },
    }));

    res.json({ photos });
  } catch (error) {
    console.error("Error loading photography images:", error);
    res.status(500).json({ photos: [], error: "Failed to load images" });
  }
});

// API endpoint to update photo info
app.post(
  "/api/photography/update/:filename",
  express.json(),
  async (req, res) => {
    try {
      const { filename } = req.params;
      const updates = req.body;

      const updatedPhoto = await photoManager.updatePhotoInfo(
        filename,
        updates,
      );
      res.json({ success: true, photo: updatedPhoto });
    } catch (error) {
      console.error("Error updating photo info:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
);

// API endpoint to manually refresh photos
app.post("/api/photography/refresh", async (req, res) => {
  try {
    await photoManager.scanAndUpdatePhotos();
    res.json({ success: true, message: "Photos refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing photos:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint to get all share folders
app.get("/api/photography/share/folders", async (req, res) => {
  try {
    const folders = await photoShareManager.getShareFolders();
    res.json({ folders });
  } catch (error) {
    console.error("Error loading share folders:", error);
    res
      .status(500)
      .json({ folders: [], error: "Failed to load share folders" });
  }
});

// API endpoint to get photos from a specific share folder
app.get("/api/photography/share/:folderName", async (req, res) => {
  try {
    const folderName = decodeURIComponent(req.params.folderName);
    console.log(`Loading photos for folder: ${folderName}`);

    const folderInfo = await photoShareManager.getFolderInfo(folderName);

    if (!folderInfo) {
      return res.status(404).json({ error: "Folder does not exist" });
    }

    res.json({
      folderInfo: {
        name: folderInfo.name,
        displayName: folderInfo.displayName,
        photoCount: folderInfo.photoCount,
        totalSize: folderInfo.totalSize,
        created: folderInfo.created,
        modified: folderInfo.modified,
      },
      photos: folderInfo.photos,
    });
  } catch (error) {
    console.error("Error loading share folder photos:", error);
    res.status(500).json({ error: "Failed to load folder photos" });
  }
});

// API endpoint to download all photos from a folder as ZIP
app.get("/api/photography/share/:folderName/download", async (req, res) => {
  try {
    const folderName = decodeURIComponent(req.params.folderName);
    console.log(`Creating ZIP archive for folder: ${folderName}`);

    // Set timeout for large archives
    req.setTimeout(300000); // 5 minutes
    res.setTimeout(300000);

    await photoShareManager.createZipArchive(folderName, res);
  } catch (error) {
    console.error("Error creating ZIP download:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create ZIP download" });
    }
  }
});

// API endpoint to get individual work details
app.get("/api/work/:category/:id", async (req, res) => {
  try {
    const { category, id } = req.params;
    const filePath = path.join(__dirname, "works", category, `${id}.md`);

    if (!(await fs.pathExists(filePath))) {
      if (isDevelopment) {
        return res
          .status(404)
          .sendFile(path.join(__dirname, "src", "404.html"));
      } else {
        const dist404Path = path.join(__dirname, "dist", "404.html");
        if (fs.existsSync(dist404Path)) {
          return res.status(404).sendFile(dist404Path);
        } else {
          return res
            .status(404)
            .sendFile(path.join(__dirname, "src", "404.html"));
        }
      }
    }

    const content = await fs.readFile(filePath, "utf8");
    const parsed = fm(content);
    const html = marked.parse(parsed.body);

    const workHtml = `
            <div class="work-detail">
                <h1>${parsed.attributes.title || "Untitled Work"}</h1>
                ${parsed.attributes.image ? `<img src="${parsed.attributes.image}" alt="${parsed.attributes.title}" class="work-main-image">` : ""}
                <div class="work-content">
                    ${html}
                </div>
            </div>
        `;

    res.send(workHtml);
  } catch (error) {
    console.error("Error loading work detail:", error);
    res.status(500).send("<p>Error loading work details</p>");
  }
});

// Handle work path with single parameter (for modal links)
app.get("/api/work/:path", async (req, res) => {
  try {
    const workPath = req.params.path;
    const [category, id] = workPath.split("/");

    if (!category || !id) {
      return res.status(400).sendFile(path.join(__dirname, "404.html"));
    }

    // Redirect to the proper endpoint
    const filePath = path.join(__dirname, "works", category, `${id}.md`);

    if (!(await fs.pathExists(filePath))) {
      return res.status(404).sendFile(path.join(__dirname, "404.html"));
    }

    const content = await fs.readFile(filePath, "utf8");
    const parsed = fm(content);
    const html = marked.parse(parsed.body);

    const workHtml = `
            <div class="work-detail">
                <h1>${parsed.attributes.title || "Untitled Work"}</h1>
                ${parsed.attributes.image ? `<img src="${parsed.attributes.image}" alt="${parsed.attributes.title}" class="work-main-image">` : ""}
                <div class="work-content">
                    ${html}
                </div>
            </div>
        `;

    res.send(workHtml);
  } catch (error) {
    console.error("Error loading work detail:", error);
    res.status(500).send("<p>Error loading work details</p>");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.stack);

  // Check if response headers are already sent
  if (res.headersSent) {
    return next(err);
  }

  // Handle different error types
  const serve404 = () => {
    if (isDevelopment) {
      return path.join(__dirname, "src", "404.html");
    } else {
      const dist404Path = path.join(__dirname, "dist", "404.html");
      return fs.existsSync(dist404Path)
        ? dist404Path
        : path.join(__dirname, "src", "404.html");
    }
  };

  if (err.status === 404 || err.code === "ENOENT") {
    res.status(404).sendFile(serve404());
  } else if (err.status >= 400 && err.status < 500) {
    // Client errors -> 404 page
    res.status(404).sendFile(serve404());
  } else {
    // Server errors -> still show 404 page for user experience
    console.error("Server error:", err);
    res.status(500).sendFile(serve404());
  }
});

// 404 handler - catches all unmatched routes
app.use("*", (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);

  // Check if it's an API request
  if (req.originalUrl.startsWith("/api/")) {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    // Regular page request
    if (isDevelopment) {
      res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
    } else {
      const dist404Path = path.join(__dirname, "dist", "404.html");
      if (fs.existsSync(dist404Path)) {
        res.status(404).sendFile(dist404Path);
      } else {
        res.status(404).sendFile(path.join(__dirname, "src", "404.html"));
      }
    }
  }
});

// Regenerate all pages on server startup
async function startServer() {
  try {
    console.log("Regenerating all work pages...");
    await pageGenerator.generateAllPages();
    console.log("Work pages generated!");

    console.log("Initializing photo management system...");
    await photoManager.init();
    await photoManager.scanAndUpdatePhotos();
    console.log("Photo management system initialized!");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log("Press Ctrl+C to stop the server");
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
