const tabs = document.querySelectorAll(".menu-item");


    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove("active"));
           
            

            // Add active class to clicked tab and corresponding content
            this.classList.add("active");
            
            
            
        });
    });
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
                        "rgba(47, 138, 230, 0.1)",    // Blue for Projects
                        "rgba(216, 189, 39, 0.1)",    // Gold/Yellow for Students
                        "rgba(139, 69, 19, 0.1)",    // Brown for Tasks
                        "rgba(128, 0, 128, 0.1)"     // Purple for Finished Projects
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
