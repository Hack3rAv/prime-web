/**
 * =====================================================
 * APPLICATION BOOTSTRAP
 * =====================================================
 * - Initializes Lenis
 * - Handles global behavior
 * - Coordinates page systems
 * =====================================================
 */

let lenis = null;

/**
 * Detect reduced motion conditions
 */
function shouldReduceMotion() {
    return (
        window.innerWidth <= window.SITE_CONFIG.REDUCE_MOTION_WIDTH ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

/**
 * Initialize Lenis smooth scrolling
 */
function initLenis() {
    if (shouldReduceMotion()) {
        console.log("[Lenis] Reduced motion active — skipping smooth scroll");
        return;
    }

    lenis = new Lenis({
        duration: 1.1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        smoothTouch: false
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
}

/**
 * Reset scroll to top on navigation
 */
function resetScroll() {
    requestAnimationFrame(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo({ top: 0, behavior: "auto" });
        }
    });
}


/**
 * Handle page loaded hook
 */
function onPageLoaded(e) {
    resetScroll();

    // Init parallax if enabled
    if (window.SITE_CONFIG.ENABLE_PARALLAX && !shouldReduceMotion()) {
        if (window.initParallax) {
            window.initParallax();
        }
    }

    // Init horizontal sections
    if (window.SITE_CONFIG.ENABLE_HORIZONTAL_SECTIONS && !shouldReduceMotion()) {
        if (window.initHorizontalSections) {
            window.initHorizontalSections();
        }
    }
}

/**
 * Bootstrap app
 */
document.addEventListener("DOMContentLoaded", () => {
    initLenis();

    document.addEventListener("page:loaded", onPageLoaded);
});
