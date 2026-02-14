/**
 * =====================================================
 * SITE CONFIGURATION (FRONTEND ONLY)
 * =====================================================
 * This file contains ONLY static configuration.
 * No logic, no DOM access, no fetch calls.
 * =====================================================
 */

window.SITE_CONFIG = {

    // API Configuration
    apiBaseUrl: "http://localhost:3000/api",

    // -----------------------------
    // 2x Donation ?
    // -----------------------------
    isDonationMultiplierActive: true,

    // -----------------------------
    // SERVER STATUS API
    // -----------------------------
    SERVER_STATUS_API: "https://status.gta5prime.in/api/status",

    // Polling interval in milliseconds
    SERVER_STATUS_INTERVAL: 10000, // 10 seconds

    // -----------------------------
    // MAINTENANCE MODE (FRONTEND)
    // -----------------------------
    MAINTENANCE_MODE: false,

    // -----------------------------
    // ROUTING
    // -----------------------------
    DEFAULT_ROUTE: "/",
    NOT_FOUND_ROUTE: "/404",

    // -----------------------------
    // UI / BEHAVIOR FLAGS
    // -----------------------------
    ENABLE_PARALLAX: true,
    ENABLE_HORIZONTAL_SECTIONS: true,

    // Reduce motion automatically on small devices
    REDUCE_MOTION_WIDTH: 768
};
