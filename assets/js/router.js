/**
 * =====================================================
 * HISTORY API ROUTER (FRONTEND ONLY)
 * =====================================================
 */

const appOutlet = document.getElementById("app-content");

/**
 * Resolve route → file path
 */
function resolvePage(path) {

    // ---- Maintenance override ----
    if (window.SITE_CONFIG.MAINTENANCE_MODE && path !== "/maintenance") {
        return "/pages/maintenance.html";
    }

    // ---- Admin routes ----
    if (path.startsWith("/admin")) {
        const subPath = path.replace("/admin", "") || "/dashboard";
        return `/admin${subPath}.html`;
    }

    // ---- Public routes ----
    const ROUTES = {
        "/": "/pages/home.html",
        "/features": "/pages/features.html",
        "/wiki": "/pages/wiki.html",
        "/rules": "/pages/rules.html",
        "/download": "/pages/download.html",
        "/community": "/pages/community.html",
        "/apply": "/pages/apply.html",
        "/maintenance": "/pages/maintenance.html"
    };

    return ROUTES[path] || "/404.html";
}

/**
 * Load page
 */
async function loadPage(path, replaceState = false) {
    const filePath = resolvePage(path);

    try {
        const res = await fetch(filePath, { cache: "no-store" });
        if (!res.ok) throw new Error("Not found");

        const html = await res.text();
        appOutlet.innerHTML = html;

        if (replaceState) {
            history.replaceState({}, "", path);
        } else {
            history.pushState({}, "", path);
        }

        document.dispatchEvent(
            new CustomEvent("page:loaded", { detail: { path } })
        );

    } catch (err) {
        console.error("[Router]", err);

        const fallback = await fetch("/404.html");
        appOutlet.innerHTML = await fallback.text();
    }
}

/**
 * Intercept internal links
 */
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || !href.startsWith("/")) return;

    e.preventDefault();
    loadPage(href);
});

/**
 * Back / Forward
 */
window.addEventListener("popstate", () => {
    loadPage(window.location.pathname, true);
});

/**
 * Initial load
 */
document.addEventListener("DOMContentLoaded", () => {
    loadPage(window.location.pathname, true);
});








function updateActiveNav(path) {
    document.querySelectorAll("a[data-link]").forEach(link => {
        const href = link.getAttribute("href");
        if (href === path) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
