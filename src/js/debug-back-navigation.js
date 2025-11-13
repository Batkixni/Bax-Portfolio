// Debug script for back navigation issues
console.log("Debug back navigation script loaded");

// 監控瀏覽器導航類型
function detectNavigationType() {
  let navigationType = "unknown";

  if (window.performance && window.performance.navigation) {
    switch (window.performance.navigation.type) {
      case window.performance.navigation.TYPE_NAVIGATE:
        navigationType = "navigate";
        break;
      case window.performance.navigation.TYPE_RELOAD:
        navigationType = "reload";
        break;
      case window.performance.navigation.TYPE_BACK_FORWARD:
        navigationType = "back_forward";
        break;
      case window.performance.navigation.TYPE_RESERVED:
        navigationType = "reserved";
        break;
    }
  } else if (window.performance && window.performance.getEntriesByType) {
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries.length > 0) {
      navigationType = navEntries[0].type;
    }
  }

  return navigationType;
}

// 監控初始化狀態
function logInitializationStates() {
  console.group("🔍 Initialization States");
  console.log("App initialized:", !!window.appInitialized);
  console.log("Animations initialized:", !!window.animationsInitialized);
  console.log("Navigation initialized:", !!window.navigationInitialized);
  console.log("HTMX events initialized:", !!window.htmxEventsInitialized);
  console.log("Particles initialized:", !!window.particlesInitialized);
  console.log("Particles started:", !!window.particlesStarted);
  console.log(
    "Particle theme observer setup:",
    !!window.particleThemeObserverSetup,
  );
  console.groupEnd();
}

// 監控頁面狀態
function logPageState() {
  console.group("📄 Page State");
  console.log("Navigation type:", detectNavigationType());
  console.log("Document visibility:", document.visibilityState);
  console.log("Page URL:", window.location.href);
  console.log("Referrer:", document.referrer);
  console.log("Body classes:", document.body.className);
  console.log(
    "Back navigation attribute:",
    document.body.getAttribute("data-back-navigation"),
  );

  // 檢查載入畫面狀態
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    console.log(
      "Loading screen display:",
      getComputedStyle(loadingScreen).display,
    );
    console.log(
      "Loading screen opacity:",
      getComputedStyle(loadingScreen).opacity,
    );
  }

  // 檢查主要元素狀態
  const mainElements = document.querySelectorAll(
    "main, .nav, .hero, .portfolio-section",
  );
  mainElements.forEach((element, index) => {
    const style = getComputedStyle(element);
    console.log(`Element ${index} (${element.tagName.toLowerCase()}):`, {
      opacity: style.opacity,
      transform: style.transform,
      display: style.display,
      classes: element.className,
    });
  });

  // 檢查動畫元素狀態
  const animateElements = document.querySelectorAll(".animate-element");
  console.log(`Found ${animateElements.length} animate elements`);
  animateElements.forEach((element, index) => {
    if (index < 5) {
      // 只顯示前5個以避免輸出過多
      const style = getComputedStyle(element);
      console.log(`Animate Element ${index}:`, {
        opacity: style.opacity,
        transform: style.transform,
        classes: element.className,
        hasAnimated: element.classList.contains("animated"),
        hasForceVisible: element.classList.contains("force-visible"),
      });
    }
  });

  console.groupEnd();
}

// 監控 sessionStorage 狀態
function logSessionStorage() {
  console.group("💾 Session Storage");
  console.log(
    "Internal navigation:",
    sessionStorage.getItem("internalNavigation"),
  );
  console.log("From homepage:", sessionStorage.getItem("fromHomepage"));
  console.log("Is homepage:", sessionStorage.getItem("isHomepage"));
  console.groupEnd();
}

// 監控 GSAP 動畫狀態
function logGSAPState() {
  if (typeof gsap !== "undefined") {
    console.group("🎬 GSAP State");
    console.log("GSAP version:", gsap.version);
    console.log("Active tweens:", gsap.getTweensOf("*").length);
    console.log(
      "ScrollTrigger available:",
      typeof ScrollTrigger !== "undefined",
    );
    console.groupEnd();
  }
}

// 監控 HTMX 狀態
function logHTMXState() {
  console.group("🔄 HTMX State");
  console.log("HTMX available:", typeof htmx !== "undefined");

  if (typeof htmx !== "undefined") {
    // 檢查 portfolio grid 元素
    const motionGrid = document.getElementById("motion-grid");
    const graphicGrid = document.getElementById("graphic-grid");

    if (motionGrid) {
      const motionItems = motionGrid.querySelectorAll(".portfolio-item");
      console.log("Motion grid:", {
        hasContent:
          motionGrid.innerHTML.trim() !==
          '<div class="loading">載入中...</div>',
        itemsCount: motionItems.length,
        opacity: getComputedStyle(motionGrid).opacity,
        innerHTML: motionGrid.innerHTML.substring(0, 100) + "...",
      });
    } else {
      console.log("Motion grid: not found");
    }

    if (graphicGrid) {
      const graphicItems = graphicGrid.querySelectorAll(".portfolio-item");
      console.log("Graphic grid:", {
        hasContent:
          graphicGrid.innerHTML.trim() !==
          '<div class="loading">載入中...</div>',
        itemsCount: graphicItems.length,
        opacity: getComputedStyle(graphicGrid).opacity,
        innerHTML: graphicGrid.innerHTML.substring(0, 100) + "...",
      });
    } else {
      console.log("Graphic grid: not found");
    }
  }

  console.groupEnd();
}

// 主要調試函數
function debugBackNavigation() {
  console.log("🐛 =========================");
  console.log("🐛 BACK NAVIGATION DEBUG");
  console.log("🐛 =========================");

  logInitializationStates();
  logPageState();
  logSessionStorage();
  // 檢查 GSAP 動畫狀態
  logGSAPState();

  // 檢查 HTMX 狀態
  logHTMXState();

  console.log("🐛 =========================");
}

// 在頁面載入時執行調試
document.addEventListener("DOMContentLoaded", function () {
  console.log("🐛 DOM loaded - running initial debug");
  setTimeout(debugBackNavigation, 500);
});

window.addEventListener("load", function () {
  console.log("🐛 Window loaded - running debug");
  setTimeout(debugBackNavigation, 500);
});

// 監控 pageshow 事件
window.addEventListener("pageshow", function (event) {
  console.log("🐛 PageShow event:", {
    persisted: event.persisted,
    type: detectNavigationType(),
  });
  setTimeout(debugBackNavigation, 100);
});

// 監控 popstate 事件
window.addEventListener("popstate", function (event) {
  console.log("🐛 PopState event detected");
  setTimeout(debugBackNavigation, 100);
});

// 監控狀態變化
let lastStates = {};

function monitorStateChanges() {
  const currentStates = {
    appInitialized: !!window.appInitialized,
    animationsInitialized: !!window.animationsInitialized,
    particlesInitialized: !!window.particlesInitialized,
    particlesStarted: !!window.particlesStarted,
    hasBackNavigationClass: document.body.classList.contains("back-navigation"),
    hasBackNavigationAttr: document.body.hasAttribute("data-back-navigation"),
  };

  Object.keys(currentStates).forEach((key) => {
    if (lastStates[key] !== currentStates[key]) {
      console.log(`🔄 State changed: ${key} = ${currentStates[key]}`);
    }
  });

  lastStates = { ...currentStates };
}

// 每秒監控一次狀態變化
setInterval(monitorStateChanges, 1000);

// 監控元素可見性變化
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "attributes") {
      if (
        mutation.attributeName === "style" ||
        mutation.attributeName === "class"
      ) {
        const element = mutation.target;
        if (
          element.id === "loading-screen" ||
          element.classList.contains("animate-element")
        ) {
          console.log(
            `🎨 Style changed on ${element.tagName}#${element.id || "no-id"}:`,
            {
              display: getComputedStyle(element).display,
              opacity: getComputedStyle(element).opacity,
              transform: getComputedStyle(element).transform,
              classes: element.className,
            },
          );
        }
      }
    }
  });
});

// 開始觀察
document.addEventListener("DOMContentLoaded", function () {
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ["style", "class"],
  });
});

// 提供手動調試函數給 console
window.debugBackNav = debugBackNavigation;
window.logStates = logInitializationStates;
window.logPage = logPageState;

console.log(
  "🐛 Debug script ready. Use window.debugBackNav() to run manual debug.",
);

// 額外的助手函數
window.checkAnimateElements = function () {
  console.group("🎭 Animate Elements Status");
  const elements = document.querySelectorAll(".animate-element");
  console.log(`Total animate elements: ${elements.length}`);

  elements.forEach((el, index) => {
    const style = getComputedStyle(el);
    console.log(`Element ${index}:`, {
      tag: el.tagName,
      id: el.id || "no-id",
      classes: el.className,
      opacity: style.opacity,
      transform: style.transform,
      isVisible: style.opacity !== "0",
    });
  });
  console.groupEnd();
};

window.forceShowAll = function () {
  console.log("🔧 Force showing all animate elements");
  document.body.classList.add("back-navigation");
  document.body.setAttribute("data-back-navigation", "true");

  const elements = document.querySelectorAll(".animate-element");
  elements.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
    el.classList.add("animated", "force-visible");
  });

  console.log(`Updated ${elements.length} elements`);
};

// HTMX 相關助手函數
window.reloadHTMXContent = function () {
  console.log("🔄 Manually reloading HTMX content");

  const motionGrid = document.getElementById("motion-grid");
  const graphicGrid = document.getElementById("graphic-grid");

  if (motionGrid && typeof htmx !== "undefined") {
    console.log("Triggering motion grid reload");
    htmx.trigger(motionGrid, "load");
  }

  if (graphicGrid && typeof htmx !== "undefined") {
    console.log("Triggering graphic grid reload");
    htmx.trigger(graphicGrid, "load");
  }
};

window.checkHTMXStatus = function () {
  logHTMXState();
};
