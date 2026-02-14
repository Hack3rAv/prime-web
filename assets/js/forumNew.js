document.addEventListener("DOMContentLoaded", () => {

    const categorySelect = document.getElementById("threadCategory");
    const titleInput = document.getElementById("threadTitle");
    const contentInput = document.getElementById("threadContent");
    const submitBtn = document.getElementById("submitThread");

    const supportBlock = document.getElementById("supportBlock");
    const applicationBlock = document.getElementById("applicationBlock");
    const appealBlock = document.getElementById("appealBlock");

    // -------------------------
    // CATEGORY VISIBILITY LOGIC
    // -------------------------
    categorySelect.addEventListener("change", () => {
        const value = categorySelect.value;

        supportBlock.classList.add("hidden");
        applicationBlock.classList.add("hidden");
        appealBlock.classList.add("hidden");

        if (value === "support") supportBlock.classList.remove("hidden");
        if (value === "applications") applicationBlock.classList.remove("hidden");
        if (value === "appeals") appealBlock.classList.remove("hidden");
    });

    // -------------------------
    // SUBMIT THREAD
    // -------------------------
    submitBtn.addEventListener("click", async () => {

        const category = categorySelect.value;
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!category || !title || !content) {
            alert("Please fill all required fields");
            return;
        }

        // TEMP DEV mapping (DB will replace this later)
        const categoryMap = {
            announcements: 1,
            support: 2,
            appeals: 3,
            applications: 4,
            discussion: 5
        };

        const payload = {
            title,
            content,
            category_id: categoryMap[category],
            type: category
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "CREATING...";

        try {
            const res = await fetch("http://localhost:3000/api/forum/thread", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Thread creation failed");
            }

            // ✅ SUCCESS
            window.location.href =
                `/pages/forum/thread.html?id=${data.threadId}`;

        } catch (err) {
            console.error("Create thread error:", err);
            alert("Failed to create thread");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT THREAD";
        }
    });
});
