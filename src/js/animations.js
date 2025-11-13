// Loading Animation and GSAP Entrance Animations
console.log("Animations.js loaded");

// Loading Animation Controller
class LoadingAnimation {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.progressBar = document.querySelector(".progress-bar");
    this.loadingSvg = document.querySelector("#loading-svg");
    this.loadingSvgPaths = document.querySelectorAll("#loading-svg path");
    this.loadingText = document.querySelector(".loading-text");
    this.progress = 0;
    this.isComplete = false;
    this.shouldSkipLoading = false;
    this.initialized = false;
    this.isBackNavigation = this.checkBackNavigation();

    // Check motion preferences
    this.motionPrefs = window.motionPrefs || null;
    this.shouldAnimate = this.motionPrefs
      ? this.motionPrefs.shouldAnimate("loadingAnimations")
      : true;

    this.checkTransitionManager();
    this.init();
  }

  checkBackNavigation() {
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

  checkTransitionManager() {
    // 如果是瀏覽器回退，跳過載入動畫
    if (this.isBackNavigation) {
      this.shouldSkipLoading = true;
      console.log("Loading animation: Skipping for back navigation");
      return;
    }

    // 檢查全局狀態
    if (
      window.transitionManagerState &&
      window.transitionManagerState.shouldSkipLoading
    ) {
      this.shouldSkipLoading = true;
      console.log(
        "Loading animation: Skipping based on transition manager state",
      );
    }
    // 檢查是否有轉場管理器，並且是否應該跳過載入動畫
    else if (
      window.transitionManager &&
      window.transitionManager.shouldSkipLoadingAnimation()
    ) {
      this.shouldSkipLoading = true;
      console.log("Loading animation: Skipping based on transition manager");
    }
  }

  init() {
    if (this.initialized && !this.isBackNavigation) {
      console.log("Loading animation already initialized, skipping");
      return;
    }

    this.initialized = true;

    if (this.shouldSkipLoading) {
      // 如果應該跳過載入動畫，立即隱藏載入畫面並顯示內容
      this.skipLoadingAnimation();
      this.immediateShow();
      return;
    }

    // Initialize SVG paths
    this.initializeSvgPaths();

    // Animate SVG logo in with scale
    gsap.to(this.loadingSvg, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.2,
    });

    // Animate SVG paths with draw-on effect
    this.animateSvgPaths();

    // Animate loading text in
    gsap.to(this.loadingText, {
      opacity: 0.7,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 1.0,
    });

    // Start progress animation
    this.startProgress();
  }

  initializeSvgPaths() {
    // Set initial state for SVG paths
    this.loadingSvgPaths.forEach((path) => {
      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        fill: "transparent",
        stroke: "currentColor",
        strokeWidth: 2,
        opacity: 1,
      });
    });
  }

  animateSvgPaths() {
    if (!this.shouldAnimate) {
      // If animations are disabled, immediately show final state
      this.loadingSvgPaths.forEach((path) => {
        gsap.set(path, {
          strokeDashoffset: 0,
          fill: "currentColor",
          strokeWidth: 0,
          filter: "none",
        });
      });
      return;
    }

    // Create timeline for path animations
    const pathTimeline = this.motionPrefs
      ? this.motionPrefs.createGSAPTimeline({ delay: 0.5 }, "loadingAnimations")
      : gsap.timeline({ delay: 0.5 });

    this.loadingSvgPaths.forEach((path, index) => {
      // Draw path with stroke
      pathTimeline.to(
        path,
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        index * 0.4,
      );

      // Fill path after drawing
      pathTimeline.to(
        path,
        {
          fill: "currentColor",
          strokeWidth: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        index * 0.4 + 1.2,
      );

      // Add subtle glow pulsing effect
      pathTimeline.to(
        path,
        {
          filter: "drop-shadow(0 0 8px currentColor)",
          duration: 0.6,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        index * 0.4 + 1.8,
      );
    });
  }

  skipLoadingAnimation() {
    console.log("Skipping loading animation - smooth transition from homepage");
    this.loadingScreen.style.display = "none";
    this.isComplete = true;
    this.startEntranceAnimations();
  }

  immediateShow() {
    console.log("Immediately showing all content for back navigation");

    // 隱藏載入畫面
    if (this.loadingScreen) {
      this.loadingScreen.style.display = "none";
      this.loadingScreen.style.opacity = "0";
      this.loadingScreen.style.visibility = "hidden";
    }

    // 立即顯示所有動畫元素
    const animateElements = document.querySelectorAll(".animate-element");
    animateElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("animated");
    });

    // 確保頁面主體可見
    document.body.style.opacity = "1";
    document.body.classList.remove("page-transitioning", "transitioning-out");

    // 確保導航欄可見
    const nav = document.querySelector(".nav");
    if (nav) {
      nav.style.opacity = "1";
      nav.style.transform = "translateX(-50%) translateY(0)";
    }

    // 確保主要內容區域可見
    const mainElements = document.querySelectorAll(
      "main, .hero, .portfolio-section",
    );
    mainElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });

    this.isComplete = true;
  }

  startProgress() {
    // Simulate loading progress
    const progressTween = gsap.to(this, {
      progress: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        this.progressBar.style.width = this.progress + "%";

        // Add glow effect to SVG based on progress
        if (this.loadingSvg) {
          const glowIntensity = this.progress / 100;
          this.loadingSvg.style.filter = `drop-shadow(0 0 ${glowIntensity * 20}px var(--text-color))`;
        }
      },
      onComplete: () => {
        this.complete();
      },
    });
  }

  complete() {
    this.isComplete = true;

    // Final flourish animation for SVG
    gsap.to(this.loadingSvg, {
      scale: 1.1,
      duration: 0.5,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    // Small delay before hiding
    setTimeout(() => {
      this.hide();
    }, 800);
  }

  hide() {
    // Fade out loading screen
    gsap.to(this.loadingScreen, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        this.loadingScreen.style.display = "none";
        // Start entrance animations after loading is complete
        this.startEntranceAnimations();
      },
    });
  }

  startEntranceAnimations() {
    // Check if we're on a work detail page
    const isWorkPage = document.querySelector(".work-detail-page");

    if (isWorkPage) {
      // Initialize work page specific animations
      const workAnimations = new WorkPageAnimations();
      workAnimations.init();
    } else {
      // Initialize regular entrance animations
      const entranceAnimations = new EntranceAnimations();
      entranceAnimations.init();
    }
  }
}

// Work Page Animations Controller
class WorkPageAnimations {
  constructor() {
    this.heroSection = document.querySelector(".work-hero-fullscreen");
    this.heroCover = document.querySelector(".work-hero-cover");
    this.heroOverlay = document.querySelector(".work-hero-overlay");
    this.nav = document.querySelector(".nav");
    this.timeline = gsap.timeline();
  }

  init() {
    console.log("Starting work page entrance animations");
    this.createWorkPageSequence();
  }

  createWorkPageSequence() {
    // First animate the navigation
    this.timeline.to(
      this.nav,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0,
    );

    // Animate the color cover sliding up to reveal the image
    if (this.heroCover) {
      this.timeline.to(
        this.heroCover,
        {
          y: "-100%",
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.3,
      );
    }

    // Fade in the hero overlay content after the cover animation
    if (this.heroOverlay) {
      this.timeline.to(
        this.heroOverlay,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        1.0,
      );
    }

    // Animate other page elements
    this.timeline.to(
      ".work-info-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      1.2,
    );

    this.timeline.to(
      ".work-content-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      1.4,
    );

    this.timeline.to(
      ".footer",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.6,
    );

    // Setup scroll animations for work page
    this.setupWorkPageScrollAnimations();
  }

  setupWorkPageScrollAnimations() {
    // 檢查 ScrollTrigger 是否已經註冊
    if (!window.gsapScrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      window.gsapScrollTriggerRegistered = true;
    }

    // Animate work content elements when they come into view
    gsap.utils
      .toArray(
        ".work-article h1, .work-article h2, .work-article h3, .work-article p, .work-article img",
      )
      .forEach((element) => {
        if (!element.hasAttribute("data-work-scroll-animated")) {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play none none reverse",
              },
            },
          );
          element.setAttribute("data-work-scroll-animated", "true");
        }
      });
  }
}

// Entrance Animations Controller
class EntranceAnimations {
  constructor() {
    this.animateElements = document.querySelectorAll(".animate-element");
    this.timeline = gsap.timeline();
    this.initialized = false;
    this.isBackNavigation = this.checkBackNavigation();

    // Check motion preferences
    this.motionPrefs = window.motionPrefs || null;
    this.shouldAnimate = this.motionPrefs
      ? this.motionPrefs.shouldAnimate("animations")
      : true;
  }

  checkBackNavigation() {
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

  init() {
    if (this.initialized && !this.isBackNavigation) {
      console.log("Entrance animations already initialized, skipping");
      return;
    }

    this.initialized = true;
    console.log("Starting entrance animations");

    // 如果是瀏覽器回退，重置動畫狀態
    if (this.isBackNavigation) {
      this.resetAnimationStates();
    }

    this.createAnimationSequence();
  }

  resetAnimationStates() {
    console.log("Resetting animation states for back navigation");

    // 殺死所有正在進行的動畫
    gsap.killTweensOf("*");

    // 立即重置所有動畫元素為可見狀態
    const animateElements = document.querySelectorAll(".animate-element");
    animateElements.forEach((element) => {
      // 使用內聯樣式立即顯示元素
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("animated");
    });

    // 確保導航欄可見
    const nav = document.querySelector(".nav");
    if (nav) {
      nav.style.opacity = "1";
      nav.style.transform = "translateX(-50%) translateY(0)";
    }

    // 確保頁面主體可見
    document.body.style.opacity = "1";
    document.body.classList.remove("page-transitioning", "transitioning-out");

    // 立即隱藏載入畫面
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
      loadingScreen.style.opacity = "0";
      loadingScreen.style.visibility = "hidden";
    }

    // 確保主要內容區域可見
    const mainElements = document.querySelectorAll(
      "main, .hero, .portfolio-section",
    );
    mainElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });

    // 重置任何 GSAP 設置的屬性
    gsap.set(".animate-element", { clearProps: "all" });
    gsap.set("body", { clearProps: "all" });
    gsap.set("main, .hero, .portfolio-section", { clearProps: "all" });
  }

  createAnimationSequence() {
    if (!this.shouldAnimate) {
      // If animations are disabled, immediately show final state
      gsap.set(".animate-element", {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: "transform",
      });
      return;
    }

    // Create timeline with motion preferences
    this.timeline = this.motionPrefs
      ? this.motionPrefs.createGSAPTimeline({}, "animations")
      : gsap.timeline();

    // Navigation
    this.timeline.to(
      ".nav",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.2,
    );

    // Hero avatar
    this.timeline.to(
      ".hero-avatar",
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      0.4,
    );

    // Hero title
    this.timeline.to(
      ".hero-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.5,
    );

    this.timeline.to(
      ".hero-subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.6,
    );

    // Works main title
    this.timeline.to(
      ".works-main-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      0.8,
    );

    // Section titles
    this.timeline.to(
      ".section-title",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
      },
      1.0,
    );

    // Portfolio items with stagger
    this.timeline.to(
      ".portfolio-item",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: {
          amount: 0.8,
          from: "start",
        },
      },
      1.2,
    );

    // Footer
    this.timeline.to(
      ".footer",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.8,
    );

    // Add scroll-triggered animations for elements that come into view later
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    // 檢查 ScrollTrigger 是否已經註冊
    if (!window.gsapScrollTriggerRegistered) {
      gsap.registerPlugin(ScrollTrigger);
      window.gsapScrollTriggerRegistered = true;
    }

    // Animate portfolio items when they come into view
    gsap.utils.toArray(".portfolio-item").forEach((item, index) => {
      // Only apply to items that aren't already animated
      if (!item.hasAttribute("data-scroll-animated")) {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          },
        );
        item.setAttribute("data-scroll-animated", "true");
      }
    });

    // Animate other elements when they come into view
    gsap.utils
      .toArray(".animate-element:not(.portfolio-item)")
      .forEach((element) => {
        if (!element.hasAttribute("data-scroll-animated")) {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "bottom 10%",
                toggleActions: "play none none reverse",
              },
            },
          );
          element.setAttribute("data-scroll-animated", "true");
        }
      });

    // Special animation for works sections
    gsap.utils.toArray(".portfolio-section").forEach((section) => {
      if (section.hasAttribute("data-section-animated")) return;

      const title = section.querySelector(".section-title");
      const items = section.querySelectorAll(".portfolio-item");

      if (title && items.length > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        // Animate title first
        tl.fromTo(
          title,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
        );

        // Then animate items with stagger
        tl.fromTo(
          items,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.3",
        );

        section.setAttribute("data-section-animated", "true");
      }
    });
  }
}

// Particle Animation Integration
class ParticleIntegration {
  constructor() {
    this.initialized = false;
    this.isBackNavigation = this.checkBackNavigation();

    // Check motion preferences
    this.motionPrefs = window.motionPrefs || null;
    this.shouldAnimate = this.motionPrefs
      ? this.motionPrefs.shouldAnimate("particles")
      : true;
  }

  checkBackNavigation() {
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

  init() {
    if (this.initialized && !this.isBackNavigation) {
      console.log("Particle integration already initialized, skipping");
      return;
    }

    this.initialized = true;

    // Check if particles should be disabled due to motion preferences
    if (!this.shouldAnimate) {
      console.log("Particles disabled due to motion preferences");
      this.stopParticles();
      return;
    }

    // 如果是瀏覽器回退，立即啟動粒子
    if (this.isBackNavigation) {
      this.isLoadingComplete = true;
      this.startParticles();
      return;
    }

    // Wait for loading to complete before starting particles
    const checkLoading = setInterval(() => {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen && loadingScreen.style.display === "none") {
        this.isLoadingComplete = true;
        clearInterval(checkLoading);
        this.startParticles();
      }
    }, 100);
  }

  startParticles() {
    // Particles will start automatically via particles.js
    // This is just for coordination
    console.log("Particles can start now");
  }

  stopParticles() {
    // Hide canvas container if particles should be disabled
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.display = "none";
    }
    console.log("Particles stopped due to motion preferences");
  }
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

// Initialize everything when DOM is loaded
document.addEventListener(
  "DOMContentLoaded",
  function () {
    const isBack = isBackNavigation();

    // 防止重複初始化，除非是瀏覽器回退
    if (window.animationsInitialized && !isBack) {
      console.log("Animations already initialized, skipping");
      return;
    }

    if (isBack) {
      console.log("Back navigation detected in animations, reinitializing");
    }

    window.animationsInitialized = true;
    console.log("DOM loaded, starting animations");

    // 等待轉場管理器初始化完成
    const initializeAnimations = () => {
      // Start loading animation
      const loading = new LoadingAnimation();

      // Initialize particle integration
      const particles = new ParticleIntegration();
      particles.init();

      // Setup theme change animations
      setupThemeAnimations();
    };

    // 如果轉場管理器已經存在，立即初始化
    if (window.transitionManager) {
      initializeAnimations();
    } else {
      // 否則等待轉場管理器載入
      const waitForTransitionManager = setInterval(() => {
        if (window.transitionManager) {
          clearInterval(waitForTransitionManager);
          initializeAnimations();
        }
      }, 10);

      // 設置超時，避免無限等待
      setTimeout(() => {
        clearInterval(waitForTransitionManager);
        if (!window.transitionManager) {
          console.log(
            "Transition manager not found, proceeding with normal initialization",
          );
          initializeAnimations();
        }
      }, 1000);
    }
  },
  { once: true },
);

// Theme change animations
function setupThemeAnimations() {
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      // Animate theme change
      gsap.to("body", {
        duration: 0.3,
        ease: "power2.inOut",
      });

      // Animate all text elements
      gsap.to(".animate-element", {
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
  }
}

// Export for use in other files
window.AnimationController = {
  LoadingAnimation,
  EntranceAnimations,
  WorkPageAnimations,
  ParticleIntegration,
};

console.log("Animations.js setup complete");
