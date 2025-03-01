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
        second: '2-digit'
    });
    document.getElementById('datetime').textContent = formattedDate;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();





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
        second: '2-digit'
    });
    document.getElementById('datetime').textContent = formattedDate;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();

document.addEventListener("DOMContentLoaded", function () {
    // Live Date & Time
    function updateDateTime() {
        const now = new Date();
        document.getElementById("datetime").textContent = now.toLocaleString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();

    // Chart Data
    const ctx = document.getElementById("myChart").getContext("2d");

    const myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Projects", "Students", "Tasks", "Finished Projects"],
            datasets: [
                {
                    label: "Dashboard Overview",
                    data: [5, 20, 10, 2], // Your stats
                    backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"], // Colors for each bar
                    borderColor: "#ffffff",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                    },
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 14,
                        },
                    },
                },
                x: {
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                    },
                    ticks: {
                        color: "#ffffff",
                        font: {
                            size: 14,
                        },
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "#ffffff",
                        font: {
                            size: 14,
                        },
                    },
                },
            },
        },
    });
});
