let particles = [];
let numParticles = 50;
let canvas;
let particlesStarted = false;
let particlesInitialized = false;

// Check motion preferences
function shouldRenderParticles() {
  return window.motionPrefs
    ? window.motionPrefs.shouldAnimate("particles")
    : true;
}

// 檢查是否為瀏覽器回退
function isBackNavigation() {
  return (
    (window.performance &&
      window.performance.navigation &&
      window.performance.navigation.type ===
        window.performance.navigation.TYPE_BACK_FORWARD) ||
    (window.performance &&
      window.performance.getEntriesByType &&
      window.performance.getEntriesByType("navigation")[0] &&
      window.performance.getEntriesByType("navigation")[0].type ===
        "back_forward")
  );
}

function setup() {
  const isBack = isBackNavigation();

  // Check if particles should be disabled due to motion preferences
  if (!shouldRenderParticles()) {
    console.log("Particles disabled due to motion preferences");
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.display = "none";
    }
    return;
  }

  // 防止重複初始化，除非是瀏覽器回退
  if (particlesInitialized && !isBack) {
    console.log("Particles already initialized, skipping setup");
    return;
  }

  if (isBack) {
    console.log("Back navigation detected, reinitializing particles");
    // 重置狀態
    particlesInitialized = false;
    particlesStarted = false;
    particles = [];
  }

  particlesInitialized = true;
  console.log("Initializing particles system");

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  // Don't initialize particles immediately - wait for loading to complete
  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  // 如果是瀏覽器回退，立即啟動粒子
  if (isBack) {
    particlesStarted = true;
    console.log("Particles started immediately for back navigation");
  } else {
    // Check if loading is complete
    checkLoadingStatus();
  }
}

function checkLoadingStatus() {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen && loadingScreen.style.display !== "none") {
    // Loading still active, check again later
    setTimeout(checkLoadingStatus, 100);
    return;
  }

  // Loading complete, start particles
  if (!particlesStarted) {
    particlesStarted = true;
    console.log("Particles animation started");
  }
}

function draw() {
  // Clear background with transparency
  clear();

  // Only animate particles if loading is complete
  if (particlesStarted) {
    // Update and display particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].display();
    }
  }
}

function windowResized() {
  if (canvas && particlesInitialized) {
    resizeCanvas(windowWidth, windowHeight);
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.size = random(2, 6);
    this.opacity = random(0.1, 0.3);
    this.color = this.getThemeColor();
  }

  getThemeColor() {
    // Check if light theme is active
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    return isLight
      ? color(0, 0, 0, this.opacity * 255)
      : color(255, 255, 255, this.opacity * 255);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen edges
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;

    // Update color based on current theme
    this.color = this.getThemeColor();
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size);
  }
}

// Listen for theme changes
document.addEventListener("DOMContentLoaded", function () {
  const isBack = isBackNavigation();

  // 防止重複設置觀察器，除非是瀏覽器回退
  if (window.particleThemeObserverSetup && !isBack) {
    return;
  }

  if (isBack) {
    console.log("Back navigation detected, resetting particle theme observer");
  }

  window.particleThemeObserverSetup = true;

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        // Theme changed, particles will update their colors in the next frame
        console.log("Theme changed, particles will update colors");
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});

// 處理瀏覽器回退
window.addEventListener("pageshow", function (event) {
  if (event.persisted || isBackNavigation()) {
    console.log(
      "Page restored from cache or back navigation - resetting particles",
    );

    // 重置粒子系統狀態
    particlesInitialized = false;
    particlesStarted = false;
    particles = [];
    window.particleThemeObserverSetup = false;

    // 重新初始化粒子系統
    setTimeout(() => {
      if (typeof setup === "function") {
        setup();
      }
    }, 100);
  }
});
