document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // ---------------- VALIDATION ----------------
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        if (!regex.test(username)) {
            alert("Invalid LeetCode username");
            return false;
        }
        return true;
    }

    // ---------------- FETCH DATA ----------------
    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }

            const data = await response.json();

            // Valid user check
            if (data.totalSolved === undefined) {
                throw new Error("Invalid LeetCode username");
            }

            displayUserDataFromPublicAPI(data, username);

        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // ---------------- UI HELPERS ----------------
    function updateProgress(solved, total, label, circle) {
        const percent = total === 0 ? 0 : (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${percent}%`);
        label.textContent = `${solved}/${total}`;
    }

    // ---------------- DISPLAY DATA ----------------
    function displayUserDataFromPublicAPI(data, username) {

        updateProgress(data.easySolved, data.totalEasy, easyLabel, easyProgressCircle);
        updateProgress(data.mediumSolved, data.totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(data.hardSolved, data.totalHard, hardLabel, hardProgressCircle);

        const cards = [
            { label: "Total Solved", value: data.totalSolved },
            { label: "Easy Solved", value: data.easySolved },
            { label: "Medium Solved", value: data.mediumSolved },
            { label: "Hard Solved", value: data.hardSolved }
        ];

        cardStatsContainer.innerHTML = cards.map(card => `
            <div class="card">
                <h4>${card.label}</h4>
                <p>${card.value}</p>
            </div>
        `).join("");

        cardStatsContainer.innerHTML += `
            <div class="card">
                <h4>LeetCode Profile</h4>
                <a href="https://leetcode.com/${username}/" target="_blank">
                    Visit Profile 🔗
                </a>
            </div>
        `;
    }

    // ---------------- EVENTS ----------------
    searchButton.addEventListener("click", () => {
        const username = usernameInput.value;
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });

    usernameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });

});
