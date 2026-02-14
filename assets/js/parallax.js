/**
 * =====================================================
 * SECTION-BASED PARALLAX SYSTEM
 * =====================================================
 * - Opt-in only
 * - Transform-only (GPU safe)
 * - Lenis-compatible
 * =====================================================
 */

(() => {
    let parallaxItems = [];

    /**
     * Initialize parallax elements
     */
    function collectParallaxItems() {
        parallaxItems = Array.from(
            document.querySelectorAll("[data-parallax]")
        ).map(el => ({
            el,
            speed: parseFloat(el.dataset.speed || "0.2")
        }));
    }

    /**
     * Update parallax positions
     */
    function updateParallax() {
        const scrollY = window.scrollY;

        for (const item of parallaxItems) {
            const offset = scrollY * item.speed;
            item.el.style.transform = `translateY(${offset}px)`;
        }
    }

    /**
     * Throttled scroll handler
     */
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Public initializer
     */
    window.initParallax = function () {
        collectParallaxItems();

        // Remove old listener if re-initialized
        window.removeEventListener("scroll", onScroll);

        if (parallaxItems.length === 0) return;

        window.addEventListener("scroll", onScroll, { passive: true });
        updateParallax();
    };
})();
