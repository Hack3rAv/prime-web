/**
 * =====================================================
 * SERVER STATUS & PLAYER COUNT (FRONTEND ONLY)
 * =====================================================
 * - Single source of truth
 * - Safe polling
 * - Error tolerant
 * =====================================================
 */

(() => {
    const statusContainer = document.getElementById("headerStatus");
    if (!statusContainer) return;

    let lastState = {
        online: null,
        players: null
    };

    /**
     * Render status UI
     */
    function renderStatus({ online, players }) {
        // Avoid unnecessary DOM updates
        if (
            lastState.online === online &&
            lastState.players === players
        ) {
            return;
        }

        lastState = { online, players };

        const dotColor = online ? "var(--success)" : "var(--accent)";
        const statusText = online ? "ONLINE" : "OFFLINE";
        const playerText = online ? `${players} PLAYERS` : "0 PLAYERS";

        statusContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:flex-end; line-height:1.2;">
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="
                        width:8px;
                        height:8px;
                        border-radius:50%;
                        background:${dotColor};
                        box-shadow:0 0 6px ${dotColor};
                    "></span>
                    <span style="font-size:0.7rem; letter-spacing:1px;">
                        ${statusText}
                    </span>
                </div>
                <div style="font-size:0.65rem; opacity:0.7;">
                    ${playerText}
                </div>
            </div>
        `;
    }

    /**
     * Fetch server status safely
     */
    async function fetchStatus() {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(
                window.SITE_CONFIG.SERVER_STATUS_API,
                { signal: controller.signal, cache: "no-store" }
            );

            clearTimeout(timeout);

            if (!res.ok) throw new Error("Bad response");

            const data = await res.json();

            renderStatus({
                online: Boolean(data.online),
                players: Number(data.players || 0)
            });

        } catch (err) {
            console.warn("[ServerStatus] API failed, marking offline");
            renderStatus({ online: false, players: 0 });
        }
    }

    /**
     * Start polling
     */
    function startPolling() {
        fetchStatus();
        setInterval(fetchStatus, window.SITE_CONFIG.SERVER_STATUS_INTERVAL);
    }

    // Start after DOM is ready
    document.addEventListener("DOMContentLoaded", startPolling);
})();
