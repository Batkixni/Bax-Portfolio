// HTMX Back Navigation Fix
// 專門處理瀏覽器回退時 HTMX 內容重新載入的問題
console.log("HTMX Back Navigation Fix loaded");

class HTMXBackNavigationFix {
  constructor() {
    this.initialized = false;
    this.isBackNavigation = this.checkBackNavigation();
    this.pendingReloads = new Set();
    this.reloadAttempts = new Map();
    this.maxRetries = 3;

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

  init() {
    if (this.initialized) {
      console.log("HTMX Back Navigation Fix already initialized");
      return;
    }

    this.initialized = true;
    this.setupEventListeners();
    this.checkAndReloadContent();
  }

  setupEventListeners() {
    // 監聽 HTMX 事件
    document.addEventListener("htmx:beforeRequest", (e) => {
      console.log("HTMX request started for:", e.target.id);
      this.pendingReloads.add(e.target.id);
    });

    document.addEventListener("htmx:afterRequest", (e) => {
      console.log("HTMX request completed for:", e.target.id);
      this.pendingReloads.delete(e.target.id);
      this.reloadAttempts.delete(e.target.id);

      // 確保載入的內容立即可見
      this.makeContentVisible(e.target);
    });

    document.addEventListener("htmx:responseError", (e) => {
      console.error("HTMX request failed for:", e.target.id, e.detail);
      this.pendingReloads.delete(e.target.id);

      // 重試機制
      this.retryReload(e.target);
    });

    document.addEventListener("htmx:timeout", (e) => {
      console.warn("HTMX request timeout for:", e.target.id);
      this.pendingReloads.delete(e.target.id);
      this.retryReload(e.target);
    });

    // 監聽頁面恢復事件
    window.addEventListener("pageshow", (event) => {
      if (event.persisted || this.checkBackNavigation()) {
        console.log("Page restored - checking HTMX content");
        setTimeout(() => {
          this.handlePageRestore();
        }, 100);
      }
    });

    // 監聽 popstate 事件（瀏覽器前進/後退）
    window.addEventListener("popstate", () => {
      console.log("PopState detected - reloading HTMX content");
      setTimeout(() => {
        this.reloadAllContent();
      }, 50);
    });
  }

  makeContentVisible(container) {
    if (!container) return;

    // 立即設置容器可見
    container.style.opacity = "1";
    container.style.transform = "translateY(0)";
    container.classList.add("animated", "force-visible");

    // 設置容器內的所有 portfolio items 可見
    const portfolioItems = container.querySelectorAll(".portfolio-item");
    portfolioItems.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
      item.classList.add("animated", "force-visible");
    });

    // 如果是瀏覽器回退狀態，添加特殊標記
    if (this.isBackNavigation || document.body.classList.contains("back-navigation")) {
      container.classList.add("force-visible");
    }

    console.log(`Made content visible for: ${container.id}`);
  }

  retryReload(element) {
    if (!element || !element.id) return;

    const attempts = (this.reloadAttempts.get(element.id) || 0) + 1;
    if (attempts > this.maxRetries) {
      console.error(`Max retries reached for ${element.id}`);
      this.showErrorState(element);
      return;
    }

    this.reloadAttempts.set(element.id, attempts);
    console.log(`Retrying reload for ${element.id} (attempt ${attempts})`);

    setTimeout(() => {
      this.triggerReload(element);
    }, 1000 * attempts); // 指數退避
  }

  showErrorState(element) {
    if (!element) return;

    element.innerHTML = `
      <div class="loading error">
        載入失敗，請重新整理頁面
        <button onclick="window.htmxBackNavFix.triggerReload(document.getElementById('${element.id}'))"
                style="margin-left: 10px; padding: 5px 10px; cursor: pointer;">
          重試
        </button>
      </div>
    `;

    // 確保錯誤狀態也是可見的
    this.makeContentVisible(element);
  }

  checkAndReloadContent() {
    // 等待 DOM 和 HTMX 完全載入
    setTimeout(() => {
      if (this.isBackNavigation || document.body.classList.contains("back-navigation")) {
        console.log("Back navigation detected - reloading all HTMX content");
        this.reloadAllContent();
      } else {
        // 檢查是否有空的容器需要載入
        this.checkEmptyContainers();
      }
    }, 200);
  }

  checkEmptyContainers() {
    const containers = [
      document.getElementById("motion-grid"),
      document.getElementById("graphic-grid")
    ];

    containers.forEach(container => {
      if (!container) return;

      const hasContent = container.querySelectorAll(".portfolio-item").length > 0;
      const isLoading = container.querySelector(".loading");

      if (!hasContent && !isLoading) {
        console.log(`Empty container detected: ${container.id}`);
        this.triggerReload(container);
      } else if (hasContent) {
        // 確保已有內容可見
        this.makeContentVisible(container);
      }
    });
  }

  handlePageRestore() {
    // 標記為瀏覽器回退狀態
    document.body.classList.add("back-navigation");
    document.body.setAttribute("data-back-navigation", "true");

    // 重新載入所有 HTMX 內容
    this.reloadAllContent();

    // 確保所有現有內容立即可見
    this.makeAllContentVisible();
  }

  reloadAllContent() {
    const containers = [
      document.getElementById("motion-grid"),
      document.getElementById("graphic-grid")
    ];

    containers.forEach(container => {
      if (container) {
        this.triggerReload(container);
      }
    });
  }

  triggerReload(element) {
    if (!element || typeof htmx === "undefined") {
      console.warn("Cannot trigger reload - element or HTMX not available");
      return;
    }

    console.log(`Triggering reload for: ${element.id}`);

    // 清除當前內容並顯示載入狀態
    element.innerHTML = '<div class="loading">重新載入中...</div>';

    try {
      // 觸發 HTMX 載入
      htmx.trigger(element, "load");
    } catch (error) {
      console.error(`Error triggering HTMX reload for ${element.id}:`, error);
      this.showErrorState(element);
    }
  }

  makeAllContentVisible() {
    // 確保所有動畫元素可見
    const animateElements = document.querySelectorAll(".animate-element");
    animateElements.forEach(element => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      element.classList.add("animated", "force-visible");
    });

    // 確保作品網格可見
    const portfolioGrids = document.querySelectorAll(".portfolio-grid");
    portfolioGrids.forEach(grid => {
      this.makeContentVisible(grid);
    });
  }

  // 公開方法供調試使用
  manualReload(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      this.triggerReload(element);
    } else {
      console.error(`Element with id '${elementId}' not found`);
    }
  }

  getStatus() {
    return {
      initialized: this.initialized,
      isBackNavigation: this.isBackNavigation,
      pendingReloads: Array.from(this.pendingReloads),
      reloadAttempts: Object.fromEntries(this.reloadAttempts),
      htmxAvailable: typeof htmx !== "undefined"
    };
  }

  reset() {
    this.pendingReloads.clear();
    this.reloadAttempts.clear();
    document.body.classList.remove("back-navigation");
    document.body.removeAttribute("data-back-navigation");
    console.log("HTMX Back Navigation Fix reset");
  }
}

// 等待 DOM 載入完成後初始化
document.addEventListener("DOMContentLoaded", () => {
  // 確保只初始化一次
  if (window.htmxBackNavFix) {
    console.log("HTMX Back Navigation Fix already exists");
    return;
  }

  // 等待 HTMX 載入完成
  const initHTMXFix = () => {
    if (typeof htmx !== "undefined") {
      window.htmxBackNavFix = new HTMXBackNavigationFix();
      console.log("HTMX Back Navigation Fix initialized");
    } else {
      // 如果 HTMX 還沒載入，等待一下
      setTimeout(initHTMXFix, 100);
    }
  };

  initHTMXFix();
});

// 導出給調試使用
window.HTMXBackNavigationFix = HTMXBackNavigationFix;

console.log("HTMX Back Navigation Fix script loaded");
