// Photography Page JavaScript
class PhotographyManager {
  constructor() {
    this.photos = [];
    this.photoInfo = {};
    this.modal = null;
    this.grid = null;

    this.init();
  }

  async init() {
    this.grid = document.getElementById("photography-grid");
    this.modal = document.getElementById("photo-modal");

    // Load photo information
    await this.loadPhotoInfo();

    // Load photos from directory
    await this.loadPhotos();

    // Setup modal functionality
    this.setupModal();

    // Setup animations
    this.setupAnimations();
  }

  async loadPhotoInfo() {
    try {
      const response = await fetch("/photography/photo-info.json");
      const data = await response.json();
      this.photoInfo = data.photos;
    } catch (error) {
      console.error("Error loading photo info:", error);
      this.photoInfo = {};
    }
  }

  async loadPhotos() {
    try {
      // Get photos from the API endpoint
      const response = await fetch("/api/photography/images");
      const data = await response.json();

      if (data.error) {
        console.error("API Error:", data.error);
        this.renderError();
        return;
      }

      this.photos = data.photos || [];
      this.renderPhotos();
    } catch (error) {
      console.error("Error loading photos:", error);
      this.renderError();
    }
  }

  renderPhotos() {
    if (this.photos.length === 0) {
      this.renderEmpty();
      return;
    }

    const photosHTML = this.photos
      .map((photo) => {
        const info = photo.info;
        const title = info?.title || "未命名照片";

        return `
                <div class="photo-item animate-element" data-filename="${photo.filename}">
                    <div class="photo-image">
                        <img src="${photo.path}" alt="${title}" loading="lazy">
                    </div>
                </div>
            `;
      })
      .join("");

    this.grid.innerHTML = photosHTML;

    // Add click events to photos
    this.grid.querySelectorAll(".photo-item").forEach((item) => {
      item.addEventListener("click", () => {
        const filename = item.dataset.filename;
        this.openModal(filename);
      });
    });

    // Trigger animations
    this.triggerAnimations();
  }

  renderEmpty() {
    this.grid.innerHTML = `
            <div class="empty-state">
                <p>目前還沒有攝影作品，請先將照片放入 photography/images 資料夾中。</p>
            </div>
        `;
  }

  renderError() {
    this.grid.innerHTML = `
            <div class="error-state">
                <p>載入攝影作品時發生錯誤，請稍後再試。</p>
            </div>
        `;
  }

  openModal(filename) {
    const photo = this.photos.find((p) => p.filename === filename);
    if (!photo) return;

    const info = photo.info;

    // Update modal content
    document.getElementById("modal-photo").src = photo.path;
    document.getElementById("modal-title").textContent =
      info?.title || "未命名照片";

    // Show modal
    this.modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Animate modal entrance
    gsap.fromTo(
      this.modal.querySelector(".photo-modal-content"),
      {
        scale: 0.8,
        opacity: 0,
        y: 50,
      },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
    );
  }

  closeModal() {
    gsap.to(this.modal.querySelector(".photo-modal-content"), {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        this.modal.classList.remove("show");
        document.body.style.overflow = "";
      },
    });
  }

  setupModal() {
    // Close modal when clicking close button
    const closeBtn = this.modal.querySelector(".photo-modal-close");
    closeBtn.addEventListener("click", () => this.closeModal());

    // Close modal when clicking outside
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal with ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.closeModal();
      }
    });
  }

  setupAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animation
    gsap.fromTo(
      ".photography-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      },
    );

    gsap.fromTo(
      ".photography-subtitle",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
      },
    );
  }

  triggerAnimations() {
    // Animate photo items on scroll
    gsap.fromTo(
      ".photo-item",
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".photography-grid",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }
}

// Alternative approach for getting photos when directory listing is not available
class PhotoLoader {
  constructor() {
    this.commonPhotoNames = [
      "photo1.jpg",
      "photo2.jpg",
      "photo3.jpg",
      "photo4.jpg",
      "photo5.jpg",
      "img1.jpg",
      "img2.jpg",
      "img3.jpg",
      "img4.jpg",
      "img5.jpg",
      "portrait1.jpg",
      "portrait2.jpg",
      "landscape1.jpg",
      "landscape2.jpg",
      "sunset.jpg",
      "sunrise.jpg",
      "nature.jpg",
      "city.jpg",
      "street.jpg",
    ];
  }

  async findExistingPhotos() {
    const existingPhotos = [];

    for (const photoName of this.commonPhotoNames) {
      try {
        const response = await fetch(`/photography/images/${photoName}`, {
          method: "HEAD",
        });
        if (response.ok) {
          existingPhotos.push(photoName);
        }
      } catch (error) {
        // Photo doesn't exist, continue
      }
    }

    return existingPhotos;
  }
}

// Initialize photography manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PhotographyManager();
});

// Export for potential use in other files
window.PhotographyManager = PhotographyManager;
