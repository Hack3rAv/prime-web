document.addEventListener("DOMContentLoaded", () => {

    // MOCK: admin logged in
    const isAdmin = true;

    const adminTools = document.getElementById("adminTools");
    const badge = document.querySelector(".thread-badge");
    const page = document.querySelector("main");

    if (isAdmin) {
        adminTools.classList.remove("hidden");
    }

    document.querySelectorAll(".admin-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.dataset.action;

            if (action === "close") setStatus("closed");
            if (action === "lock") setStatus("locked");
            if (action === "status") setStatus("open");
        });
    });

    function setStatus(status) {
        // Reset badge
        badge.classList.remove("open", "closed", "locked");
        badge.classList.add(status);
        badge.textContent = status.toUpperCase();

        // Reset page state
        page.classList.remove("thread-open", "thread-closed", "thread-locked");
        page.classList.add(`thread-${status}`);
    }

});
