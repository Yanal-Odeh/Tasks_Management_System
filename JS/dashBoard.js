///////////////////////////////////////////aside///////////////////////////////////////////////

    const buttons = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".content-section");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove "active" class from all buttons and sections
            buttons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(section => section.classList.remove("active"));

            // Add "active" class to the clicked button
            this.classList.add("active");

            // Get the corresponding section ID
            let sectionId = this.textContent.toLowerCase() + "Content";

            // Show the matching section
            document.getElementById(sectionId).classList.add("active");
        });
    });

///////////////////////////////////////////aside///////////////////////////////////////////////









/////////////////////////////////////////////time//////////////////////////////////////////////

// Function to update date & time dynamically
function updateDateTime() {
    const now = new Date();
    
    const formattedDate = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(',', '') // Removes comma after weekday
    
    document.getElementById('datetime').textContent = formattedDate;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();

/////////////////////////////////////////////time//////////////////////////////////////////////



/////////////////////////////////////////////chart.js//////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    
    // Chart Data
        const ctx = document.getElementById("myChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Number of Projects", "Number of Students", "Number of Tasks", "Number of Finished Projects"],
                datasets: [{
                    label: "Count",
                    data: [5, 20, 10, 2],
                    backgroundColor: [
                        "rgba(47, 138, 230, 0.5)", 
                        "rgba(216, 189, 39, 0.5)", 
                        "rgba(139, 69, 19, 0.5)", 
                        "rgba(128, 0, 128, 0.5)"
                    ],
                    
                    borderColor: [
                        "rgba(0, 100, 200, 1)", 
                        "rgba(255, 215, 0, 1)", 
                        "rgba(139, 69, 19, 1)", 
                        "rgba(128, 0, 128, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#ddd" // Light gray legend text for dark background
                        }
                    }
                }
            }
        });
    
    
    });

/////////////////////////////////////////////chart.js//////////////////////////////////////////////





/////////////////////////////////////*** ✅ Task Modal Handling //////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("taskModal");
    const overlay = document.querySelector(".modal-overlay"); // Use existing overlay
    const openModalBtn = document.querySelector(".new-task-btn");
    const closeModalBtn = modal.querySelector(".close");

    // Function to toggle modal visibility
    function toggleModal(show) {
        modal.style.display = show ? "flex" : "none";
        overlay.style.display = show ? "block" : "none";
    }

    // Event Listeners
    openModalBtn.addEventListener("click", () => toggleModal(true));
    closeModalBtn.addEventListener("click", () => toggleModal(false));
    overlay.addEventListener("click", () => toggleModal(false));

    // Close modal when clicking outside of modal content
    window.addEventListener("click", (event) => {
        if (!modal.contains(event.target) && !openModalBtn.contains(event.target)) {
            toggleModal(false);
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "flex") {
            toggleModal(false);
        }
    });
});

/////////////////////////////////////*** ✅ Task Modal Handling //////////////////////////////////







