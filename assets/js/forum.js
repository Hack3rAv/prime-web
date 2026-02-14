document.addEventListener("DOMContentLoaded", async () => {

    const forumBar = document.querySelector(".forum-bar-inner");
    const threadList = document.querySelector(".forum-thread-list");

    // ---------------------------
    // FETCH CATEGORIES
    // ---------------------------
    const res = await fetch("http://localhost:3000/api/forum/categories");
    const data = await res.json();

    if (!data.success) return;

    forumBar.innerHTML = "";

    let firstCategory = null;

    data.categories.forEach(cat => {
        if (cat.is_admin_only) return;

        const btn = document.createElement("button");
        btn.className = "forum-cat-btn";
        btn.textContent = cat.display_name;
        btn.dataset.category = cat.key_name;

        forumBar.appendChild(btn);

        if (!firstCategory) firstCategory = cat.key_name;
    });

    // ---------------------------
    // LOAD DEFAULT CATEGORY
    // ---------------------------
    if (firstCategory) {
        document
            .querySelector(".forum-cat-btn")
            .classList.add("active");

        loadThreads(firstCategory);
    }

    // ---------------------------
    // CATEGORY CLICK HANDLER
    // ---------------------------
    forumBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".forum-cat-btn");
        if (!btn) return;

        document
            .querySelectorAll(".forum-cat-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        const category = btn.dataset.category;
        if (!category) return;

        loadThreads(category);
    });

    // ---------------------------
    // LOAD THREADS FUNCTION
    // ---------------------------
    async function loadThreads(category) {
        threadList.innerHTML = `
            <p style="opacity:.6">Loading threads...</p>
        `;

        try {
            const res = await fetch(
                `http://localhost:3000/api/forum/threads?category=${category}`
            );
            const data = await res.json();

            threadList.innerHTML = "";

            if (!data.success || data.threads.length === 0) {
                threadList.innerHTML = `
                    <p style="opacity:.6">No threads in this category.</p>
                `;
                return;
            }

            data.threads.forEach(thread => {
                const div = document.createElement("div");
                div.className = "forum-thread";

                div.innerHTML = `
                    <span class="thread-badge ${thread.status}">
                        ${thread.status.toUpperCase()}
                    </span>

                    <a href="thread.html?id=${thread.id}" class="thread-title">
                        ${thread.title}
                    </a>

                    <span class="thread-meta">
                        by ${thread.username} · 
                        ${new Date(thread.created_at).toLocaleString()}
                    </span>
                `;

                threadList.appendChild(div);
            });

        } catch (err) {
            console.error(err);
            threadList.innerHTML = `<p>Error loading threads.</p>`;
        }
    }

});
