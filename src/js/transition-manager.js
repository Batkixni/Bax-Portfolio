// Transition Manager - 處理頁面間的平滑轉場
console.log("Transition Manager loaded");

class TransitionManager {
  constructor() {
    this.isFromHomepage = false;
    this.isTransitioning = false;
    this.fadeOutDuration = 800;
    this.fadeInDuration = 600;
    this.initialized = false;
    this.isBackNavigation = this.checkBackNavigation();

    this.init();
  }

  init() {
    if (this.initialized && !this.isBackNavigation) {
      console.log("TransitionManager already initialized, skipping");
      return;
    }

    if (this.isBackNavigation) {
      console.log(
        "Back navigation detected in TransitionManager, reinitializing",
      );
      this.resetForBackNavigation();
    }

    this.checkNavigationSource();
    this.setupPageTransitions();
    this.setupLoadingBehavior();
    this.initialized = true;

    // 設置頁面可見性變化監聽（只設置一次）
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          // 頁面隱藏時清除來源標記
          this.clearNavigationSource();
        }
      },
      { once: false, passive: true },
    );
  }

  // 檢查是否為瀏覽器回退
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

  // 重置瀏覽器回退狀態
  resetForBackNavigation() {
    console.log("Resetting transition manager for back navigation");

    // 清除轉場狀態
    this.isTransitioning = false;
    document.body.classList.remove("page-transitioning", "transitioning-out");

    // 立即重置視覺狀態
    document.body.style.opacity = "1";

    // 立即顯示所有動畫元素
    const animateElements = document.querySelectorAll(".animate-element");
    animateElements.forEach((element) => {
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

    // 確保主要內容區域可見
    const mainElements = document.querySelectorAll(
      "main, .hero, .portfolio-section",
    );
    mainElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });

    // 確保畫布容器可見
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.style.opacity = "1";
    }

    // 重置頁面狀態
    if (window.gsap) {
      gsap.killTweensOf("*");
      gsap.set(".animate-element", { clearProps: "all" });
      gsap.set("body", { clearProps: "all" });
      gsap.set("main, .hero, .portfolio-section", { clearProps: "all" });
      gsap.set(".nav", { clearProps: "all" });
      gsap.set("#canvas-container", { clearProps: "all" });
    }

    // 確保載入畫面隱藏
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
      loadingScreen.style.opacity = "0";
      loadingScreen.style.visibility = "hidden";
    }

    // 清除導航標記但設置為內部導航
    this.clearNavigationSource();
    sessionStorage.setItem("internalNavigation", "true");

    // 重新載入 HTMX 內容
    setTimeout(() => {
      const motionGrid = document.getElementById("motion-grid");
      const graphicGrid = document.getElementById("graphic-grid");

      if (motionGrid && typeof htmx !== "undefined") {
        console.log("TransitionManager: Reloading motion grid content");
        htmx.trigger(motionGrid, "load");
      }

      if (graphicGrid && typeof htmx !== "undefined") {
        console.log("TransitionManager: Reloading graphic grid content");
        htmx.trigger(graphicGrid, "load");
      }
    }, 100);
  }

  // 檢查導航來源
  checkNavigationSource() {
    // 如果是瀏覽器回退，視為內部導航
    if (this.isBackNavigation) {
      this.isFromHomepage = true;
      console.log("Back navigation detected, treating as internal navigation");
      return;
    }

    // 檢查 sessionStorage 中是否有內部導航標記
    const hasInternalNav =
      sessionStorage.getItem("internalNavigation") === "true";
    const hasHomepageNav = sessionStorage.getItem("fromHomepage") === "true";

    this.isFromHomepage = hasInternalNav || hasHomepageNav;

    // 檢查 referrer 是否為內部頁面
    const referrer = document.referrer;
    const currentOrigin = window.location.origin;

    // 如果來自同一個網站的任何頁面，都視為內部導航
    if (referrer && referrer.startsWith(currentOrigin) && !hasInternalNav) {
      this.isFromHomepage = true;
      sessionStorage.setItem("internalNavigation", "true");
    }

    // 特別檢查是否當前頁面是首頁且來自內部導航
    if (this.isHomepage() && hasInternalNav) {
      this.isFromHomepage = true;
    }

    console.log(
      "Navigation source - Internal Navigation:",
      this.isFromHomepage,
    );
    console.log("Current page is homepage:", this.isHomepage());
    console.log("Referrer:", referrer);

    // 立即清除標記以避免影響後續導航
    if (hasInternalNav || hasHomepageNav) {
      // 延遲清除，給動畫系統時間讀取狀態
      setTimeout(() => {
        this.clearNavigationSource();
      }, 100);
    }
  }

  // 設置載入行為
  setupLoadingBehavior() {
    const loadingScreen = document.getElementById("loading-screen");

    if (!loadingScreen) {
      console.log("No loading screen found");
      return;
    }

    // 瀏覽器回退時直接隱藏載入畫面
    if (this.isBackNavigation) {
      loadingScreen.style.display = "none";
      console.log(
        "Transition Manager: Hiding loading screen for back navigation",
      );
      return;
    }

    // 設置標記供動畫系統使用，但不直接操作DOM
    if (this.isFromHomepage) {
      console.log("Transition Manager: Marking for skip loading animation");
      window.transitionManagerState = {
        shouldSkipLoading: true,
        isFromHomepage: true,
      };
    } else {
      console.log("Transition Manager: Marking for full loading animation");
      window.transitionManagerState = {
        shouldSkipLoading: false,
        isFromHomepage: false,
      };
    }
  }

  // 獲取載入狀態（供動畫系統使用）
  shouldSkipLoadingAnimation() {
    return this.isFromHomepage;
  }

  // 顯示完整載入動畫
  showFullLoadingAnimation() {
    // 讓原有的載入動畫正常執行
    // animations.js 會處理完整的載入序列
  }

  // 快速進場動畫（來自首頁時使用）
  startQuickEntranceAnimation() {
    // 設置初始狀態 - 頁面從透明開始
    gsap.set("body", { opacity: 0 });

    // 創建快速進場時間軸
    const quickTl = gsap.timeline({
      onComplete: () => {
        // 啟動正常的滾動動畫
        this.setupScrollAnimations();
      },
    });

    // 頁面淡入
    quickTl.to("body", {
      opacity: 1,
      duration: this.fadeInDuration / 1000,
      ease: "power2.out",
    });

    // 導航欄動畫
    quickTl.to(
      ".nav",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0.2,
    );

    // 檢查是否為作品頁面
    const isWorkPage = document.querySelector(".work-detail-page");

    if (isWorkPage) {
      this.animateWorkPageElements(quickTl);
    } else {
      this.animateRegularPageElements(quickTl);
    }
  }

  // 動畫作品頁面元素
  animateWorkPageElements(timeline) {
    const heroCover = document.querySelector(".work-hero-cover");
    const heroOverlay = document.querySelector(".work-hero-overlay");

    // 作品頁面的色彩遮罩動畫
    if (heroCover) {
      timeline.to(
        heroCover,
        {
          y: "-100%",
          duration: 1.0,
          ease: "power2.inOut",
        },
        0.3,
      );
    }

    // 英雄區覆層動畫
    if (heroOverlay) {
      timeline.to(
        heroOverlay,
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.8,
      );
    }

    // 其他內容區域
    timeline.to(
      ".work-info-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.0,
    );

    timeline.to(
      ".work-content-section",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      1.2,
    );
  }

  // 動畫一般頁面元素
  animateRegularPageElements(timeline) {
    // 基本頁面元素動畫
    timeline.to(
      ".animate-element",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
      },
      0.4,
    );
  }

  // 設置頁面轉場
  setupPageTransitions() {
    // 為所有內部連結添加轉場效果
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");

      // 檢查是否為內部連結
      if (this.isInternalLink(href)) {
        e.preventDefault();
        this.performTransition(href, link);
      }
    });

    // 設置 popstate 事件處理（瀏覽器前進/後退）
    window.addEventListener("popstate", (e) => {
      console.log("Popstate event detected - browser navigation");
      if (!this.isTransitioning) {
        this.handleBrowserNavigation();
      }
    });
  }

  // 檢查是否為內部連結
  isInternalLink(href) {
    if (!href) return false;

    // 排除外部連結、錨點、特殊協議
    if (href.startsWith("http") && !href.startsWith(window.location.origin)) {
      return false;
    }
    if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      return false;
    }
    if (href.startsWith("#")) {
      return false;
    }

    return true;
  }

  // 執行轉場
  async performTransition(url, linkElement) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    try {
      // 添加轉場樣式
      document.body.classList.add("page-transitioning");

      // 設置內部導航標記（從任何頁面導航都算內部導航）
      sessionStorage.setItem("internalNavigation", "true");

      // 如果從首頁導航，也保持首頁標記
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html"
      ) {
        sessionStorage.setItem("fromHomepage", "true");
      }

      // 為點擊的連結添加視覺回饋
      if (linkElement) {
        linkElement.style.transform = "scale(0.95)";
        linkElement.style.opacity = "0.7";
      }

      // 頁面淡出動畫
      await this.fadeOutPage();

      // 導航到新頁面
      window.location.href = url;
    } catch (error) {
      console.error("Transition error:", error);
      this.isTransitioning = false;
      document.body.classList.remove("page-transitioning");

      // 恢復連結狀態
      if (linkElement) {
        linkElement.style.transform = "";
        linkElement.style.opacity = "";
      }

      // 如果轉場失敗，直接導航
      window.location.href = url;
    }
  }

  // 頁面淡出動畫
  fadeOutPage() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      // 添加轉場樣式類
      document.body.classList.add("transitioning-out");

      // 淡出主要內容
      tl.to("main, .hero, .portfolio-section, .work-detail-page", {
        opacity: 0,
        y: -30,
        duration: this.fadeOutDuration / 1000,
        ease: "power2.inOut",
        stagger: 0.1,
      });

      // 導航欄稍後淡出
      tl.to(
        ".nav",
        {
          opacity: 0.3,
          duration: (this.fadeOutDuration / 1000) * 0.5,
          ease: "power2.inOut",
        },
        `-=${(this.fadeOutDuration / 1000) * 0.3}`,
      );

      // 背景粒子效果淡出
      tl.to(
        "#canvas-container",
        {
          opacity: 0.3,
          duration: this.fadeOutDuration / 1000,
          ease: "power2.inOut",
        },
        0,
      );
    });
  }

  // 處理瀏覽器導航（前進/後退）
  handleBrowserNavigation() {
    console.log("Handling browser navigation");

    // 設置內部導航標記
    sessionStorage.setItem("internalNavigation", "true");

    // 立即重置視覺狀態
    this.resetForBackNavigation();

    // 重新載入 HTMX 內容
    setTimeout(() => {
      const motionGrid = document.getElementById("motion-grid");
      const graphicGrid = document.getElementById("graphic-grid");

      if (motionGrid && typeof htmx !== "undefined") {
        console.log("PopState: Reloading motion grid content");
        htmx.trigger(motionGrid, "load");
      }

      if (graphicGrid && typeof htmx !== "undefined") {
        console.log("PopState: Reloading graphic grid content");
        htmx.trigger(graphicGrid, "load");
      }
    }, 50);

    // 觸發頁面重新初始化
    setTimeout(() => {
      if (window.resetInitializationFlags) {
        window.resetInitializationFlags();
      }

      // 重新觸發初始化事件
      window.dispatchEvent(new Event("load"));
      document.dispatchEvent(new Event("DOMContentLoaded"));
    }, 100);
  }

  // 設置滾動動畫
  setupScrollAnimations() {
    if (typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // 為新載入的元素設置滾動觸發動畫
    gsap.utils.toArray(".animate-element").forEach((element) => {
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
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          },
        );

        element.setAttribute("data-scroll-animated", "true");
      }
    });
  }

  // 清除導航來源標記
  clearNavigationSource() {
    sessionStorage.removeItem("fromHomepage");
    sessionStorage.removeItem("internalNavigation");
    sessionStorage.removeItem("isHomepage");

    // 清除全局狀態
    if (window.transitionManagerState) {
      delete window.transitionManagerState;
    }
  }

  // 重置轉場狀態
  resetTransitionState() {
    this.isTransitioning = false;
    this.clearNavigationSource();
  }

  // 設置首頁標記（在首頁調用）
  markAsHomepage() {
    sessionStorage.setItem("isHomepage", "true");

    // 為首頁的所有內部連結添加特殊處理
    document
      .querySelectorAll(
        'a[href^="/"], a[href^="./"], a[href^="../"], .portfolio-item',
      )
      .forEach((link) => {
        link.addEventListener("click", (e) => {
          // 檢查是否為作品項目的點擊
          const portfolioItem = e.target.closest(".portfolio-item");
          if (portfolioItem) {
            const workLink = portfolioItem.querySelector("a");
            if (workLink && this.isInternalLink(workLink.href)) {
              sessionStorage.setItem("fromHomepage", "true");
              sessionStorage.setItem("internalNavigation", "true");
            }
          } else {
            sessionStorage.setItem("fromHomepage", "true");
            sessionStorage.setItem("internalNavigation", "true");
          }
        });
      });
  }

  // 檢查是否在首頁
  isHomepage() {
    const path = window.location.pathname;
    return (
      path === "/" || path === "/index.html" || path.endsWith("index.html")
    );
  }
}

// 自動初始化（確保只初始化一次）
document.addEventListener(
  "DOMContentLoaded",
  () => {
    if (window.transitionManager) {
      console.log("TransitionManager already exists, skipping initialization");
      return;
    }

    window.transitionManager = new TransitionManager();

    // 如果在首頁，設置首頁標記
    if (window.transitionManager.isHomepage()) {
      window.transitionManager.markAsHomepage();
    }

    // 添加頁面卸載前的清理
    window.addEventListener(
      "beforeunload",
      () => {
        if (window.transitionManager) {
          window.transitionManager.resetTransitionState();
        }
      },
      { once: true },
    );

    // 添加頁面顯示事件處理（用於瀏覽器前進/後退）
    window.addEventListener(
      "pageshow",
      (e) => {
        if (
          (e.persisted || window.transitionManager.checkBackNavigation()) &&
          window.transitionManager
        ) {
          console.log("Page restored from cache or back navigation");
          // 頁面從快取中恢復，重置狀態
          document.body.classList.remove(
            "page-transitioning",
            "transitioning-out",
          );
          window.transitionManager.resetTransitionState();
          window.transitionManager.resetForBackNavigation();

          // 重新初始化必要組件
          if (window.resetInitializationFlags) {
            window.resetInitializationFlags();
          }

          // 重新載入 HTMX 內容
          setTimeout(() => {
            const motionGrid = document.getElementById("motion-grid");
            const graphicGrid = document.getElementById("graphic-grid");

            if (motionGrid && typeof htmx !== "undefined") {
              console.log("PageShow: Reloading motion grid content");
              htmx.trigger(motionGrid, "load");
            }

            if (graphicGrid && typeof htmx !== "undefined") {
              console.log("PageShow: Reloading graphic grid content");
              htmx.trigger(graphicGrid, "load");
            }
          }, 150);
        }
      },
      { passive: true },
    );
  },
  { once: true },
);

// 導出給其他腳本使用
window.TransitionManager = TransitionManager;

console.log("Transition Manager setup complete");
