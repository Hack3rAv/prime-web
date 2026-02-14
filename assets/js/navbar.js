// components/navbar.js

class Navbar {
    constructor() {
        // Initialize State
        this.statusLastState = { online: null, players: null };

        this.render();
        this.initAuth();
        this.highlightActiveLink();
    }

    render() {
        // 1. GET CONFIG
        const config = window.SITE_CONFIG || {};
        const shouldShowBadge = config.isDonationMultiplierActive === true;

        // 2. CREATE BADGE HTML
        const donateBadgeHTML = shouldShowBadge
            ? `<span class="badge-2x-text">2X</span>` 
            : '';

        // 3. GENERATE NAVBAR HTML
        // Note: I added a <style> block right here to define the Neon Animation
        const navbarHTML = `
        <style>
            @keyframes neonPulse {
                0% { opacity: 1; transform: scale(1); filter: brightness(100%); }
                50% { opacity: 0.8; transform: scale(0.95); filter: brightness(130%); }
                100% { opacity: 1; transform: scale(1); filter: brightness(100%); }
            }
            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
                transition: all 0.4s ease;
            }
            .status-dot.online {
                background-color: #00ffaa;
                box-shadow: 0 0 5px #00ffaa, 0 0 10px #00ffaa, 0 0 20px rgba(0, 255, 170, 0.5);
                animation: neonPulse 2s infinite ease-in-out;
            }
            .status-dot.offline {
                background-color: #ff0055;
                box-shadow: 0 0 5px #ff0055, 0 0 10px #ff0055;
            }
            .status-dot.loading {
                background-color: #555;
                box-shadow: none;
            }
        </style>

        <header>
            <div class="nav-container">

                <div class="logo">
                    Prime <span>Roleplay</span>
                </div>

                <nav>
                    <ul class="nav-links">
                        <li><a href="/index.html">HOME</a></li>
                        <li><a href="/pages/features.html">FEATURES</a></li>
                        <li><a href="/pages/wiki.html">WIKI</a></li>
                        <li><a href="/pages/rules.html">RULES</a></li>
                        <li><a href="/pages/community.html">COMMUNITY</a></li>
                        <li><a href="/forums">FORUM</a></li>
                        <li>
                            <a href="/pages/donate.html" class="nav-link-donate">
                                DONATE${donateBadgeHTML}
                            </a>
                        </li>
                    </ul>
                </nav>

                <div class="header-actions">
                    <div id="headerStatus">
                        <div style="display:flex; align-items:center; gap:8px; opacity:0.6;">
                            <span class="status-dot loading"></span>
                            <span style="font-size:0.65rem; letter-spacing:1px; font-weight:600;">CONNECTING...</span>
                        </div>
                    </div>

                    <button id="guestActionBtn" class="btn-mega" onclick="window.location.href='/pages/register.html'">
                        REGISTER
                    </button>

                    <div id="userActionBadge" class="profile-badge">
                        <div class="profile-avatar" id="navAvatar">U</div>
                        <div class="profile-name">
                            <span id="navUsername">User</span>
                            <div class="profile-arrow"></div>
                        </div>

                        <div class="profile-dropdown-menu">
                            <div class="dropdown-header">
                                <h4 id="menuUsername" style="color:#fff; margin:0; margin-bottom: 5px;">Username</h4>
                                <div style="display:flex; gap:5px; justify-content:center;">
                                    <div id="menuRole" class="dropdown-role-badge">CITIZEN</div>
                                    <div id="menuVip" class="dropdown-role-badge vip" style="display:none; border-color:#FFD700; color:#FFD700; background:rgba(255, 215, 0, 0.1);">VIP</div>
                                </div>
                            </div>

                            <div class="dropdown-stats">
                                <div class="stat-box">
                                    <div class="stat-label">CASH</div>
                                    <div class="stat-value text-green" id="menuCash">$0</div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-label">BANK</div>
                                    <div class="stat-value" id="menuBank">$0</div>
                                </div>
                            </div>

                            <a href="/pages/dashboard.html" class="dropdown-item">
                                <span>Dashboard</span>
                                <span>→</span>
                            </a>

                            <a href="#" onclick="window.Navbar.logout()" class="dropdown-item logout">
                                LOGOUT
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </header>
        `;

        // 4. INJECT HTML
        document.body.insertAdjacentHTML('afterbegin', navbarHTML);

        // 5. START POLLING
        this.initStatusPolling();
    }

    // =========================================================
    // INTEGRATED SERVER STATUS LOGIC
    // =========================================================
    
    initStatusPolling() {
        const config = window.SITE_CONFIG;
        if (!config || !config.SERVER_STATUS_API) {
            console.warn("Navbar: Missing SITE_CONFIG.SERVER_STATUS_API");
            return;
        }

        // Fetch immediately
        this.fetchServerStatus();

        // Then interval
        setInterval(() => {
            this.fetchServerStatus();
        }, config.SERVER_STATUS_INTERVAL || 10000);
    }

    async fetchServerStatus() {
        try {
            // Timeout mechanism to avoid hanging
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);

            const res = await fetch(window.SITE_CONFIG.SERVER_STATUS_API, {
                signal: controller.signal,
                cache: "no-store"
            });

            clearTimeout(timeout);

            if (!res.ok) throw new Error("Bad response");

            const data = await res.json();

            this.renderServerStatus({
                online: Boolean(data.online),
                players: Number(data.players || 0)
            });

        } catch (err) {
            this.renderServerStatus({ online: false, players: 0 });
        }
    }

    renderServerStatus({ online, players }) {
        const statusContainer = document.getElementById("headerStatus");
        if (!statusContainer) return;

        // Prevent flickering if data is same
        if (
            this.statusLastState.online === online &&
            this.statusLastState.players === players
        ) {
            return;
        }

        this.statusLastState = { online, players };

        // Class Logic for the Neon Dots
        const dotClass = online ? "status-dot online" : "status-dot offline";
        const statusText = online ? "ONLINE" : "OFFLINE";
        const statusColor = online ? "#00ffaa" : "#ff0055"; // Text color matching the neon
        const playerText = online ? `${players} PLAYERS` : "0 PLAYERS";

        statusContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:flex-end; line-height:1.2;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="${dotClass}"></span>
                    
                    <span style="font-size:0.7rem; letter-spacing:1px; font-weight:800; color:${statusColor}; text-shadow: 0 0 10px ${statusColor}40;">
                        ${statusText}
                    </span>
                </div>
                <div style="font-size:0.65rem; opacity:0.6; font-weight:500; letter-spacing:0.5px; margin-top:2px;">
                    ${playerText}
                </div>
            </div>
        `;
    }

    // =========================================================
    // AUTH & USER DATA LOGIC (UNCHANGED)
    // =========================================================

    initAuth() {
        const userJson = localStorage.getItem('prime_user');
        const guestBtn = document.getElementById('guestActionBtn');
        const userBadge = document.getElementById('userActionBadge');

        if (userJson) {
            const user = JSON.parse(userJson);
            if(guestBtn) guestBtn.style.display = 'none';
            if(userBadge) userBadge.style.display = 'flex';

            const nameEl = document.getElementById('navUsername');
            const menuNameEl = document.getElementById('menuUsername');
            if(nameEl) nameEl.innerText = user.username;
            if(menuNameEl) menuNameEl.innerText = user.username;

            const avatarEl = document.getElementById('navAvatar');
            const savedAvatar = localStorage.getItem('prime_avatar_url');
            if (savedAvatar && avatarEl) {
                avatarEl.style.backgroundImage = `url('${savedAvatar}')`;
                avatarEl.innerText = '';
            } else if (avatarEl) {
                avatarEl.innerText = user.username.charAt(0).toUpperCase();
            }

            setTimeout(() => this.fetchStats(user.username), 500);
        } else {
            if(guestBtn) guestBtn.style.display = 'inline-block';
            if(userBadge) userBadge.style.display = 'none';
        }
    }

    highlightActiveLink() {
        const path = window.location.pathname;
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active');
            if (href === path || (path === '/' && href === '/index.html')) {
                link.classList.add('active');
            }
        });
    }

    async fetchStats(username) {
        if(typeof window.SITE_CONFIG === 'undefined') return;
        
        try {
            const response = await fetch(`${window.SITE_CONFIG.apiBaseUrl}/user/${username}`);
            if(response.ok) {
                const data = await response.json();
                const char = data.characters && data.characters.length > 0 ? data.characters[0] : null;
                
                if(char) {
                    const cashEl = document.getElementById('menuCash');
                    const bankEl = document.getElementById('menuBank');
                    const roleBadge = document.getElementById('menuRole');

                    if(cashEl) cashEl.innerText = `$${char.money.toLocaleString()}`;
                    if(bankEl) bankEl.innerText = `$${char.bank.toLocaleString()}`;
                    
                    if(char.adminlvl > 0 && roleBadge) {
                        roleBadge.innerText = "STAFF";
                        roleBadge.style.borderColor = "#ff5555";
                        roleBadge.style.color = "#ff5555";
                        roleBadge.style.background = "rgba(255, 85, 85, 0.1)";
                    }
                }
                const vipBadge = document.getElementById('menuVip');
                if (data.account && data.account.viplvl > 0 && vipBadge) {
                    vipBadge.style.display = 'inline-block';
                    vipBadge.innerText = `VIP ${data.account.viplvl}`;
                }
            }
        } catch(e) { } 
    }

    static logout() {
        localStorage.removeItem('prime_user');
        localStorage.removeItem('prime_token');
        window.location.href = '/index.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.Navbar = new Navbar();
});