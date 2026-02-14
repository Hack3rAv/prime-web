/**
 * =====================================================
 * HORIZONTAL SCROLL SECTIONS
 * =====================================================
 * - Vertical scroll drives horizontal movement
 * - Opt-in via [data-horizontal]
 * - Transform-only (GPU safe)
 * =====================================================
 */

(() => {
    let sections = [];

    /**
     * Collect horizontal sections
     */
    function collectSections() {
        sections = Array.from(
            document.querySelectorAll("[data-horizontal]")
        ).map(section => {
            const track = section.querySelector(".horizontal-track");
            if (!track) return null;

            return {
                section,
                track,
                start: 0,
                end: 0,
                maxTranslate: 0
            };
        }).filter(Boolean);
    }

    /**
     * Calculate scroll boundaries
     */
    function calculateBounds() {
        sections.forEach(obj => {
            const rect = obj.section.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const sectionTop = rect.top + scrollTop;

            const sectionHeight = obj.section.offsetHeight;
            const trackWidth = obj.track.scrollWidth;
            const viewportWidth = window.innerWidth;

            obj.start = sectionTop;
            obj.end = sectionTop + sectionHeight;
            obj.maxTranslate = Math.max(0, trackWidth - viewportWidth);
        });
    }

    /**
     * Update horizontal position
     */
    function update() {
        const scrollY = window.scrollY || window.pageYOffset;

        sections.forEach(obj => {
            if (scrollY < obj.start || scrollY > obj.end) return;

            const progress =
                (scrollY - obj.start) / (obj.end - obj.start);

            const translateX =
                -obj.maxTranslate * progress;

            obj.track.style.transform =
                `translateX(${translateX}px)`;
        });
    }

    /**
     * Throttled scroll handler
     */
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Public initializer
     */
    window.initHorizontalSections = function () {
        collectSections();
        calculateBounds();

        window.removeEventListener("scroll", onScroll);

        if (sections.length === 0) return;

        window.addEventListener("scroll", onScroll, { passive: true });
        update();
    };

    // Recalculate on resize
    window.addEventListener("resize", () => {
        calculateBounds();
        update();
    });
})();
