/**
 * Motion Preferences Manager
 * 處理 prefers-reduced-motion 設置並提供統一的動畫控制
 */

class MotionPreferences {
  constructor() {
    this.prefersReducedMotion = this.checkReducedMotionPreference();
    this.motionSettings = {
      animations: !this.prefersReducedMotion,
      transitions: !this.prefersReducedMotion,
      particles: !this.prefersReducedMotion,
      scrollAnimations: !this.prefersReducedMotion,
      loadingAnimations: !this.prefersReducedMotion,
      cursorEffects: !this.prefersReducedMotion,
    };

    this.init();
  }

  /**
   * 檢查用戶的動畫偏好設置
   * @returns {boolean} 是否偏好減少動畫
   */
  checkReducedMotionPreference() {
    // 檢查 CSS media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    return mediaQuery.matches;
  }

  /**
   * 初始化動畫偏好管理器
   */
  init() {
    console.log("Motion Preferences initialized:", {
      prefersReducedMotion: this.prefersReducedMotion,
      settings: this.motionSettings,
    });

    // 監聽動畫偏好設置的變化
    this.setupMediaQueryListener();

    // 設置 CSS 變數
    this.setCSSVariables();

    // 設置 HTML 屬性
    this.setHTMLAttributes();

    // 初始化 GSAP 設置
    this.setupGSAPDefaults();
  }

  /**
   * 監聽 prefers-reduced-motion 設置的變化
   */
  setupMediaQueryListener() {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    mediaQuery.addEventListener("change", (e) => {
      this.prefersReducedMotion = e.matches;
      this.updateMotionSettings();
      this.setCSSVariables();
      this.setHTMLAttributes();
      this.setupGSAPDefaults();

      // 觸發自定義事件通知其他組件
      window.dispatchEvent(
        new CustomEvent("motionPreferenceChanged", {
          detail: { prefersReducedMotion: this.prefersReducedMotion },
        }),
      );
    });
  }

  /**
   * 更新動畫設置
   */
  updateMotionSettings() {
    this.motionSettings = {
      animations: !this.prefersReducedMotion,
      transitions: !this.prefersReducedMotion,
      particles: !this.prefersReducedMotion,
      scrollAnimations: !this.prefersReducedMotion,
      loadingAnimations: !this.prefersReducedMotion,
      cursorEffects: !this.prefersReducedMotion,
    };

    // Notify all animation systems of the change
    this.notifyAnimationSystems();
  }

  /**
   * 設置 CSS 自定義屬性
   */
  setCSSVariables() {
    const root = document.documentElement;

    if (this.prefersReducedMotion) {
      // 減少動畫的設置
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
      root.style.setProperty("--animation-timing", "linear");
      root.style.setProperty("--transform-scale", "1");
      root.style.setProperty("--opacity-transition", "none");
    } else {
      // 正常動畫設置
      root.style.setProperty(
        "--animation-duration",
        "var(--default-animation-duration, 0.3s)",
      );
      root.style.setProperty(
        "--transition-duration",
        "var(--default-transition-duration, 0.2s)",
      );
      root.style.setProperty(
        "--animation-timing",
        "var(--default-animation-timing, ease-out)",
      );
      root.style.setProperty(
        "--transform-scale",
        "var(--default-transform-scale, 1.05)",
      );
      root.style.setProperty(
        "--opacity-transition",
        "var(--default-opacity-transition, opacity 0.3s ease)",
      );
    }
  }

  /**
   * 設置 HTML 屬性以供 CSS 使用
   */
  setHTMLAttributes() {
    document.documentElement.setAttribute(
      "data-motion-preference",
      this.prefersReducedMotion ? "reduce" : "no-preference",
    );

    document.body.classList.toggle("reduce-motion", this.prefersReducedMotion);
    document.body.classList.toggle("allow-motion", !this.prefersReducedMotion);
  }

  /**
   * 設置 GSAP 的默認值
   */
  setupGSAPDefaults() {
    if (typeof gsap !== "undefined") {
      if (this.prefersReducedMotion) {
        // 減少 GSAP 動畫
        gsap.defaults({
          duration: 0,
          ease: "none",
        });

        // 全局配置 GSAP 以跳過動畫
        gsap.globalTimeline.timeScale(1000); // 極快速度完成動畫
      } else {
        // 恢復正常的 GSAP 設置
        gsap.defaults({
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.globalTimeline.timeScale(1); // 正常速度
      }
    }
  }

  /**
   * 檢查是否應該顯示動畫
   * @param {string} animationType - 動畫類型
   * @returns {boolean}
   */
  shouldAnimate(animationType = "animations") {
    return this.motionSettings[animationType] || false;
  }

  /**
   * 安全的動畫執行函數
   * @param {Function} animationFn - 動畫函數
   * @param {Function} fallbackFn - 備用函數（無動畫）
   * @param {string} animationType - 動畫類型
   */
  safeAnimate(animationFn, fallbackFn = null, animationType = "animations") {
    if (this.shouldAnimate(animationType)) {
      return animationFn();
    } else if (fallbackFn) {
      return fallbackFn();
    }
  }

  /**
   * 創建可配置的 GSAP 動畫
   * @param {*} target - 動畫目標
   * @param {Object} vars - GSAP 動畫參數
   * @param {string} animationType - 動畫類型
   * @returns {gsap.core.Tween}
   */
  createGSAPAnimation(target, vars, animationType = "animations") {
    if (!this.shouldAnimate(animationType)) {
      // 如果不應該動畫，立即設置最終狀態
      const finalState = { ...vars };
      delete finalState.duration;
      delete finalState.ease;
      delete finalState.delay;
      delete finalState.onComplete;
      delete finalState.onStart;
      delete finalState.onUpdate;

      gsap.set(target, finalState);

      // 如果有完成回調，立即執行
      if (vars.onComplete) {
        vars.onComplete();
      }

      return null;
    }

    return gsap.to(target, vars);
  }

  /**
   * 創建可配置的 GSAP 時間軸
   * @param {Object} vars - 時間軸參數
   * @param {string} animationType - 動畫類型
   * @returns {gsap.core.Timeline}
   */
  createGSAPTimeline(vars = {}, animationType = "animations") {
    const tl = gsap.timeline(vars);

    if (!this.shouldAnimate(animationType)) {
      tl.timeScale(1000); // 極快完成
    }

    return tl;
  }

  /**
   * 處理 ScrollTrigger 動畫
   * @param {Object} config - ScrollTrigger 配置
   * @param {string} animationType - 動畫類型
   * @returns {ScrollTrigger}
   */
  createScrollTrigger(config, animationType = "scrollAnimations") {
    if (!this.shouldAnimate(animationType)) {
      // 如果不需要滾動動畫，立即設置最終狀態
      if (config.animation) {
        const animation = config.animation;
        if (animation.vars) {
          gsap.set(animation.targets(), animation.vars);
        }
      }
      return null;
    }

    return ScrollTrigger.create(config);
  }

  /**
   * 處理粒子系統
   * @param {Function} startParticles - 啟動粒子函數
   * @param {Function} stopParticles - 停止粒子函數
   */
  handleParticles(startParticles, stopParticles) {
    if (this.shouldAnimate("particles")) {
      startParticles();
    } else {
      stopParticles();
    }
  }

  /**
   * 獲取動畫持續時間
   * @param {number} defaultDuration - 默認持續時間
   * @param {string} animationType - 動畫類型
   * @returns {number}
   */
  getDuration(defaultDuration, animationType = "animations") {
    return this.shouldAnimate(animationType) ? defaultDuration : 0;
  }

  /**
   * 獲取動畫延遲
   * @param {number} defaultDelay - 默認延遲
   * @param {string} animationType - 動畫類型
   * @returns {number}
   */
  getDelay(defaultDelay, animationType = "animations") {
    return this.shouldAnimate(animationType) ? defaultDelay : 0;
  }

  /**
   * 處理 CSS 過渡
   * @param {HTMLElement} element - 目標元素
   * @param {string} property - CSS 屬性
   * @param {string} value - 目標值
   * @param {number} duration - 持續時間（毫秒）
   */
  cssTransition(element, property, value, duration = 300) {
    if (this.shouldAnimate("transitions")) {
      element.style.transition = `${property} ${duration}ms ease`;
      element.style[property] = value;
    } else {
      element.style.transition = "none";
      element.style[property] = value;
    }
  }

  /**
   * 手動切換動畫偏好（用於測試和用戶設置）
   */
  toggleMotionPreference() {
    this.prefersReducedMotion = !this.prefersReducedMotion;
    this.updateMotionSettings();
    this.setCSSVariables();
    this.setHTMLAttributes();
    this.setupGSAPDefaults();

    console.log("Motion preference toggled:", {
      prefersReducedMotion: this.prefersReducedMotion,
      settings: this.motionSettings,
    });

    // 觸發自定義事件
    window.dispatchEvent(
      new CustomEvent("motionPreferenceChanged", {
        detail: {
          prefersReducedMotion: this.prefersReducedMotion,
          manual: true,
        },
      }),
    );
  }

  /**
   * 通知所有動畫系統設置已更改
   */
  notifyAnimationSystems() {
    // 重新初始化粒子系統
    if (window.setup && typeof window.setup === "function") {
      try {
        window.setup();
      } catch (e) {
        console.log("Particles system notification failed:", e);
      }
    }

    // 更新游標動畫
    const cursor = document.querySelector(".cursor");
    const cursorFollower = document.querySelector(".cursor-follower");

    if (cursor && cursorFollower) {
      if (this.shouldAnimate("cursorEffects")) {
        cursor.style.display = "";
        cursorFollower.style.display = "";
      } else {
        cursor.style.display = "none";
        cursorFollower.style.display = "none";
      }
    }

    // 重新設置 GSAP 動畫
    if (typeof gsap !== "undefined") {
      gsap.killTweensOf("*");

      if (!this.shouldAnimate("animations")) {
        gsap.set(".animate-element", {
          opacity: 1,
          y: 0,
          scale: 1,
          clearProps: "transform",
        });
      }
    }
  }

  /**
   * 添加動畫偏好變更監聽器
   * @param {Function} callback - 回調函數
   */
  addMotionChangeListener(callback) {
    window.addEventListener("motionPreferenceChanged", callback);
  }

  /**
   * 移除動畫偏好變更監聽器
   * @param {Function} callback - 回調函數
   */
  removeMotionChangeListener(callback) {
    window.removeEventListener("motionPreferenceChanged", callback);
  }
}

// 創建全局實例
window.motionPrefs = new MotionPreferences();

// 為開發和測試添加全局切換函數
window.toggleMotionPreference = () => {
  if (window.motionPrefs) {
    window.motionPrefs.toggleMotionPreference();
  }
};

// 導出類別以供其他模組使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = MotionPreferences;
}
