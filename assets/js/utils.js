/**
 * ==========================================
 * UTILITIES & GLOBAL LOGIC
 * ==========================================
 */

// 1. MAINTENANCE MODE CHECK (Runs Immediately)
(function checkMaintenance() {
    // Safety Check: Ensure Config is loaded
    if (typeof window.SITE_CONFIG === 'undefined') return;

    const isMaintenance = window.SITE_CONFIG.MAINTENANCE_MODE === true;
    const currentPath = window.location.pathname;
    const maintenancePage = "/pages/maintenance.html";

    // SCENARIO A: Maintenance is ON, but user is NOT on maintenance page -> Redirect them there
    if (isMaintenance && currentPath !== maintenancePage) {
        window.location.replace(maintenancePage);
        return; 
    }

    // SCENARIO B: Maintenance is OFF, but user is stuck on maintenance page -> Redirect home
    if (!isMaintenance && currentPath === maintenancePage) {
        window.location.replace("/index.html");
        return;
    }
})();

// 2. WIKI SEARCH FUNCTIONALITY (Your existing code)
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".wiki-search");
    const sections = document.querySelectorAll(".wiki-section");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        sections.forEach(section => {
            const cards = section.querySelectorAll(".wiki-card");
            let sectionHasMatch = false;

            cards.forEach(card => {
                const text = card.innerText.toLowerCase();

                if (text.includes(query)) {
                    card.style.display = "";
                    sectionHasMatch = true;
                } else {
                    card.style.display = "none";
                }
            });

            // Hide section title if no cards match
            const title = section.querySelector("h2");
            if (title) {
                title.style.display = sectionHasMatch ? "" : "none";
            }
        });
    });
});