// 簡化版本 - 使用CSS類控制cursor效果
console.log("App.js loaded");

// Browser compatibility checks
const supportsModernScrolling =
  "scrollBehavior" in document.documentElement.style;
// const supportsSmoothScroll =
//   CSS.supports && CSS.supports("scroll-behavior", "smooth");

// 全局變量
let cursor = null;
let cursorFollower = null;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// // Enhanced smooth scroll variables
// let isScrolling = false;
// let scrollVelocity = 0;
// let scrollMomentum = 0;
// let momentumFrame = null;

// 平滑跟隨動畫函數
function animateFollower() {
  // Check motion preferences before animating
  const shouldAnimate = window.motionPrefs
    ? window.motionPrefs.shouldAnimate("cursorEffects")
    : true;

  if (!shouldAnimate) {
    return; // Stop animation if motion is reduced
  }

  const diffX = mouseX - followerX;
  const diffY = mouseY - followerY;

  followerX += diffX * 0.1; // 調整跟隨速度
  followerY += diffY * 0.1;

  if (cursorFollower) {
    cursorFollower.style.left = followerX - 20 + "px";
    cursorFollower.style.top = followerY - 20 + "px";
  }

  requestAnimationFrame(animateFollower);
}

// 檢測是否為瀏覽器回退
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

// 重置所有初始化標誌
function resetInitializationFlags() {
  window.appInitialized = false;
  window.animationsInitialized = false;
  window.navigationInitialized = false;
  window.htmxEventsInitialized = false;
  window.particleThemeObserverSetup = false;
  console.log("All initialization flags reset for back navigation");
}

// 重新初始化頁面組件
function reinitializePage() {
  console.log("Reinitializing page components for back navigation");

  // 立即標記為瀏覽器回退狀態
  document.body.classList.add("back-navigation");
  document.body.setAttribute("data-back-navigation", "true");

  // 重置動畫狀態
  if (window.gsap) {
    gsap.killTweensOf("*");
    gsap.set(".animate-element", { clearProps: "all" });
    gsap.set("body", { opacity: 1 });
    gsap.set(".nav", { opacity: 1, y: 0 });
  }

  // 重置 CSS 動畫元素狀態 - 立即顯示所有元素
  const animateElements = document.querySelectorAll(".animate-element");
  animateElements.forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
    element.classList.add("animated", "force-visible");
  });

  // 確保頁面主體可見
  document.body.style.opacity = "1";

  // 隱藏載入畫面
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.style.display = "none";
  }

  // 重新載入 HTMX 內容
  setTimeout(() => {
    const motionGrid = document.getElementById("motion-grid");
    const visualGrid = document.getElementById("visual-grid");
    const cinematicGrid = document.getElementById("cinematic-grid");

    if (motionGrid && typeof htmx !== "undefined") {
      console.log("Reloading motion grid content");
      htmx.trigger(motionGrid, "load");
    }

    if (visualGrid && typeof htmx !== "undefined") {
      console.log("Reloading visual grid content");
      htmx.trigger(visualGrid, "load");
    }

    if (cinematicGrid && typeof htmx !== "undefined") {
      console.log("Reloading cinematic grid content");
      htmx.trigger(cinematicGrid, "load");
    }
  }, 200);

  // 重新初始化粒子系統
  if (window.particlesInitialized) {
    window.particlesInitialized = false;
    window.particlesStarted = false;
  }

  // 觸發重新初始化
  setTimeout(() => {
    window.dispatchEvent(new Event("load"));
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }, 50);
}

// 等待頁面完全載入
window.addEventListener(
  "load",
  function () {
    // 檢查是否為瀏覽器回退
    const isBack = isBackNavigation();

    // 防止重複初始化，除非是瀏覽器回退
    if (window.appInitialized && !isBack) {
      console.log("App already initialized, skipping");
      return;
    }

    if (isBack) {
      console.log("Back navigation detected, reinitializing");
      // 立即標記為瀏覽器回退
      document.body.classList.add("back-navigation");
      document.body.setAttribute("data-back-navigation", "true");
      resetInitializationFlags();
    }

    window.appInitialized = true;
    console.log("Window loaded");

    // 初始化cursor
    cursor = document.querySelector(".cursor");
    cursorFollower = document.querySelector(".cursor-follower");

    console.log("Cursor elements:", cursor, cursorFollower);

    // Check motion preferences for cursor effects
    const shouldShowCursor = window.motionPrefs
      ? window.motionPrefs.shouldAnimate("cursorEffects")
      : true;

    if (cursor && cursorFollower) {
      if (!shouldShowCursor) {
        console.log("Cursor disabled due to motion preferences");
        cursor.style.display = "none";
        cursorFollower.style.display = "none";
        return;
      }

      console.log("Cursor elements found, setting up mouse listener");

      // 啟動跟隨動畫
      animateFollower();

      // 滑鼠移動事件（使用 passive 和 once 優化）
      document.addEventListener(
        "mousemove",
        function (e) {
          if (window.innerWidth > 768) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // 主cursor即時跟隨
            cursor.style.left = e.clientX - 10 + "px";
            cursor.style.top = e.clientY - 10 + "px";
          }
        },
        { passive: true },
      );

      // Hover效果 - 使用CSS類
      document.addEventListener("mouseover", function (e) {
        // YouTube iframe 區域 - 隱藏自定義游標
        if (e.target.closest(".yt-container")) {
          cursor.style.opacity = "0";
          cursorFollower.style.opacity = "0";
        }
        // 作品項目
        else if (e.target.closest(".portfolio-item")) {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
          cursor.className = "cursor hover-item";
          cursorFollower.className = "cursor-follower hover-item";
        }
        // 導航連結
        else if (e.target.matches(".nav-link")) {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
          cursor.className = "cursor hover-link";
          cursorFollower.className = "cursor-follower hover-link";
        }
        // 按鈕和其他可點擊元素
        else if (
          e.target.matches(
            "a, button, .modal-close, .portfolio-link, .theme-toggle",
          )
        ) {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
          cursor.className = "cursor hover-button";
          cursorFollower.className = "cursor-follower hover-button";
        }
        // 文字元素
        else if (
          e.target.matches(
            "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
          )
        ) {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
          cursor.className = "cursor hover-text";
          cursorFollower.className = "cursor-follower hover-text";
        }
        // 其他區域
        else {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
        }
      });

      // 移出hover效果
      document.addEventListener("mouseout", function (e) {
        // 離開 YouTube iframe 區域時恢復游標
        if (e.target.closest(".yt-container")) {
          cursor.style.opacity = "1";
          cursorFollower.style.opacity = "1";
          cursor.className = "cursor";
          cursorFollower.className = "cursor-follower";
        } else if (
          e.target.closest(".portfolio-item") ||
          e.target.matches(
            "a, button, .nav-link, .modal-close, .portfolio-link, .theme-toggle",
          ) ||
          e.target.matches(
            "h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title",
          )
        ) {
          cursor.className = "cursor";
          cursorFollower.className = "cursor-follower";
        }
      });

      console.log("Mouse move listener added");
    } else {
      console.error("Cursor elements not found!");
    }

    // 主題切換（防止重複綁定）
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.querySelector(".theme-icon");

    if (
      themeToggle &&
      themeIcon &&
      !themeToggle.hasAttribute("data-theme-initialized")
    ) {
      themeToggle.setAttribute("data-theme-initialized", "true");

      themeToggle.addEventListener("click", function () {
        const currentTheme =
          document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        themeIcon.textContent = newTheme === "light" ? "🌙" : "☀️";
        localStorage.setItem("theme", newTheme);

        console.log("Theme switched to:", newTheme);
      });

      // 初始化主題
      const savedTheme = localStorage.getItem("theme") || "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);
      themeIcon.textContent = savedTheme === "light" ? "🌙" : "☀️";
    }
  },
  { once: true },
);

// // Modern smooth scrolling using native CSS scroll-behavior with fallback
// function smoothScrollTo(target, duration = 800) {
//   const targetPosition = target.offsetTop - 80; // Account for nav height

//   if (supportsModernScrolling && supportsSmoothScroll) {
//     // Use native smooth scrolling for better performance
//     window.scrollTo({
//       top: targetPosition,
//       behavior: "smooth",
//     });
//   } else {
//     // Fallback for older browsers
//     const startPosition = window.pageYOffset;
//     const distance = targetPosition - startPosition;
//     let startTime = null;

//     function animation(currentTime) {
//       if (startTime === null) startTime = currentTime;
//       const timeElapsed = currentTime - startTime;
//       const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
//       window.scrollTo(0, run);
//       if (timeElapsed < duration) requestAnimationFrame(animation);
//     }

//     function easeInOutQuad(t, b, c, d) {
//       t /= d / 2;
//       if (t < 1) return (c / 2) * t * t + b;
//       t--;
//       return (-c / 2) * (t * (t - 2) - 1) + b;
//     }

//     requestAnimationFrame(animation);
//   }
// }

// Enhanced momentum scrolling for wheel events
function applyMomentumScrolling() {
  if (Math.abs(scrollMomentum) < 0.1) {
    scrollMomentum = 0;
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
    return;
  }

  window.scrollBy(0, scrollMomentum);
  scrollMomentum *= 0.92; // Friction coefficient for smooth deceleration

  momentumFrame = requestAnimationFrame(applyMomentumScrolling);
}

// 導航連結功能
document.addEventListener(
  "DOMContentLoaded",
  function () {
    // 檢查是否為瀏覽器回退
    const isBack = isBackNavigation();

    // 防止重複初始化，除非是瀏覽器回退
    if (window.navigationInitialized && !isBack) {
      console.log("Navigation already initialized, skipping");
      return;
    }

    window.navigationInitialized = true;

    // 導航連結平滑滾動
    document.querySelectorAll(".nav-link").forEach(function (link) {
      if (!link.hasAttribute("data-nav-initialized")) {
        link.setAttribute("data-nav-initialized", "true");

        link.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            isScrolling = true;
            smoothScrollTo(targetElement);
            setTimeout(() => {
              isScrolling = false;
            }, 500);
          }
        });
      }
    });

    // 處理導航連結，特別是帶有錨點的連結
    document.addEventListener("click", function (e) {
      // 處理作品項目點擊
      const portfolioItem = e.target.closest(".portfolio-item");
      if (portfolioItem) {
        const workLink = portfolioItem.querySelector("a");
        if (workLink) {
          // 設置內部導航標記
          sessionStorage.setItem("internalNavigation", "true");
          // 如果有轉場管理器，讓它處理轉場
          if (
            window.transitionManager &&
            window.transitionManager.isHomepage()
          ) {
            sessionStorage.setItem("fromHomepage", "true");
          }
        }
        return; // 讓轉場管理器處理作品項目的導航
      }

      // 處理所有內部連結點擊
      const link = e.target.closest("a");
      if (link && link.href) {
        const href = link.getAttribute("href");
        // 檢查是否為內部連結
        if (
          href &&
          (href.startsWith("/") ||
            href.startsWith("./") ||
            href.startsWith("../") ||
            (!href.startsWith("http") &&
              !href.startsWith("mailto:") &&
              !href.startsWith("tel:")))
        ) {
          sessionStorage.setItem("internalNavigation", "true");
        }
      }

      // 處理回到首頁的錨點連結
      if (e.target.matches('a[href^="/#"]')) {
        const hash = e.target.getAttribute("href").substring(1);
        if (window.location.pathname === "/") {
          // 如果已經在首頁，進行平滑滾動
          e.preventDefault();
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            isScrolling = true;
            smoothScrollTo(targetElement);
            setTimeout(() => {
              isScrolling = false;
            }, 500);
          }
        }
        // 如果不在首頁，讓瀏覽器正常導航到首頁+錨點
      }
    });
  },
  { once: true },
);

// HTMX事件處理（防止重複綁定）
if (!window.htmxEventsInitialized || isBackNavigation()) {
  window.htmxEventsInitialized = true;

  document.addEventListener("htmx:beforeRequest", function (e) {
    if (e.target.classList.contains("portfolio-grid")) {
      e.target.innerHTML = '<div class="loading">載入中...</div>';
    }
  });

  document.addEventListener("htmx:responseError", function (e) {
    console.error("HTMX Request Error:", e.detail);
    e.target.innerHTML = '<div class="loading">載入失敗，請重新整理頁面</div>';
  });

  // HTMX載入完成後，為新載入的作品項目添加轉場支持
  document.addEventListener("htmx:afterRequest", function (e) {
    if (e.target.classList.contains("portfolio-grid")) {
      console.log("HTMX content loaded successfully for", e.target.id);

      // 確保新載入的內容立即可見
      const portfolioItems = e.target.querySelectorAll(".portfolio-item");
      portfolioItems.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
        item.classList.add("animated", "force-visible");

        if (!item.hasAttribute("data-transition-initialized")) {
          item.setAttribute("data-transition-initialized", "true");
          item.addEventListener("click", () => {
            if (
              window.transitionManager &&
              window.transitionManager.isHomepage()
            ) {
              sessionStorage.setItem("fromHomepage", "true");
            }
          });
        }
      });

      // 如果是瀏覽器回退情況，確保內容區域可見
      if (
        isBackNavigation() ||
        document.body.classList.contains("back-navigation")
      ) {
        e.target.style.opacity = "1";
        e.target.style.transform = "translateY(0)";
        e.target.classList.add("animated", "force-visible");
      }
    }
  });
}

// Enhanced smooth wheel scrolling with momentum
let lastWheelTime = 0;
let wheelTimeout = null;

document.addEventListener(
  "wheel",
  function (e) {
    if (isScrolling) return;

    // Check if user prefers reduced motion or browser doesn't support smooth scrolling
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !supportsModernScrolling
    ) {
      return; // Let browser handle native scrolling
    }

    const now = performance.now();
    const timeDelta = now - lastWheelTime;
    lastWheelTime = now;

    // // Only apply custom scrolling for trackpad/smooth wheels
    // if (Math.abs(e.deltaY) < 50 && timeDelta < 100) {
    //   e.preventDefault();

    //   // Add to momentum
    //   scrollVelocity = e.deltaY * 0.8;
    //   scrollMomentum += scrollVelocity;

    //   // Clamp momentum to prevent excessive speed
    //   scrollMomentum = Math.max(-15, Math.min(15, scrollMomentum));

    //   // Start momentum animation if not already running
    //   if (!momentumFrame) {
    //     momentumFrame = requestAnimationFrame(applyMomentumScrolling);
    //   }

    //   // Clear any existing timeout
    //   if (wheelTimeout) {
    //     clearTimeout(wheelTimeout);
    //   }

    //   // Stop momentum after inactivity
    //   wheelTimeout = setTimeout(() => {
    //     scrollMomentum *= 0.5;
    //   }, 150);
    // }
    // For mouse wheels or large deltas, use native scrolling
  },
  { passive: false },
);

// Performance optimization: throttle scroll events
let isScrollEventThrottled = false;

function throttledScrollHandler() {
  if (!isScrollEventThrottled) {
    isScrollEventThrottled = true;
    requestAnimationFrame(() => {
      // Handle any scroll-related logic here if needed
      isScrollEventThrottled = false;
    });
  }
}

// Add passive scroll listener for better performance
document.addEventListener("scroll", throttledScrollHandler, { passive: true });

// Cleanup momentum scrolling on page visibility change
document.addEventListener(
  "visibilitychange",
  function () {
    if (document.hidden) {
      scrollMomentum = 0;
      if (momentumFrame) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
    }
  },
  { passive: true },
);

// 處理瀏覽器回退和前進
window.addEventListener("pageshow", function (event) {
  if (event.persisted || isBackNavigation()) {
    console.log("Page restored from cache or back navigation detected");

    // 立即標記為瀏覽器回退狀態
    document.body.classList.add("back-navigation");
    document.body.setAttribute("data-back-navigation", "true");

    // 立即重置視覺狀態
    document.body.classList.remove("page-transitioning", "transitioning-out");
    document.body.style.opacity = "1";

    // 立即顯示所有動畫元素
    const animateElements = document.querySelectorAll(".animate-element");
    animateElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("animated", "force-visible");
    });

    // 確保導航欄可見
    const nav = document.querySelector(".nav");
    if (nav) {
      nav.style.opacity = "1";
      nav.style.transform = "translateX(-50%) translateY(0)";
    }

    // 隱藏載入畫面
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }

    // 重置初始化標誌並重新初始化
    resetInitializationFlags();

    // 立即重新載入 HTMX 內容
    setTimeout(() => {
      const motionGrid = document.getElementById("motion-grid");
      const visualGrid = document.getElementById("visual-grid");
      const cinematicGrid = document.getElementById("cinematic-grid");

      if (motionGrid && typeof htmx !== "undefined") {
        console.log("Reloading motion grid on pageshow");
        htmx.trigger(motionGrid, "load");
      }

      if (visualGrid && typeof htmx !== "undefined") {
        console.log("Reloading visual grid on pageshow");
        htmx.trigger(visualGrid, "load");
      }

      if (cinematicGrid && typeof htmx !== "undefined") {
        console.log("Reloading cinematic grid on pageshow");
        htmx.trigger(cinematicGrid, "load");
      }
    }, 50);

    // 延遲重新初始化以確保頁面完全恢復
    setTimeout(() => {
      reinitializePage();
    }, 100);
  }
});

// Cleanup on page unload
window.addEventListener(
  "beforeunload",
  function () {
    scrollMomentum = 0;
    if (momentumFrame) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
  },
  { once: true },
);

console.log("App.js setup complete with enhanced smooth scrolling");
