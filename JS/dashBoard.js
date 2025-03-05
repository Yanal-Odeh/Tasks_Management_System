///////////////////////////////////////////aside///////////////////////////////////////////////

    document.addEventListener("DOMContentLoaded", function () {
        // Sidebar Navigation Handling
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
    
                // Close sidebar on mobile after clicking a menu item
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove("active");
                }
            });
        });
    
        // Hamburger Menu Toggle for Mobile
        const menuToggle = document.querySelector(".menu-toggle");
        const sidebar = document.querySelector("aside");
    
        if (menuToggle && sidebar) {
            menuToggle.addEventListener("click", function () {
                sidebar.classList.toggle("active");
            });
        }
    
        // Close sidebar when clicking outside (for mobile view)
        document.addEventListener("click", function (event) {
            if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
                if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                    sidebar.classList.remove("active");
                }
            }
        });
    
        // Ensure sidebar resets on window resize
        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                sidebar.classList.add("active"); // Keep sidebar open on larger screens
            } else {
                sidebar.classList.remove("active"); // Keep sidebar closed on small screens
            }
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
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".new-task-btn");
    const closeModalBtn = modal.querySelector(".close");

    // Ensure the modal is hidden on page load
    modal.style.display = "none";
    overlay.style.display = "none";

    // Function to toggle modal visibility
    function toggleModal(show) {
        if (show) {
            modal.style.display = "flex";
            overlay.style.display = "block";
        } else {
            modal.style.display = "none";
            overlay.style.display = "none";
        }
    }

    // Open Modal only when clicking the button
    openModalBtn.addEventListener("click", () => toggleModal(true));

    // Close Modal (X Button)
    closeModalBtn.addEventListener("click", () => toggleModal(false));

    // Close Modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (modal.style.display === "flex" && !modal.contains(event.target) && !openModalBtn.contains(event.target)) {
            toggleModal(false);
        }
    });

    // Close Modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "flex") {
            toggleModal(false);
        }
    });
});

/////////////////////////////////////*** ✅ Task Modal Handling //////////////////////////////////



/////////////////////////////////////*** ✅ sorting table//////////////////////////////////

document.getElementById("sortTasks").addEventListener("change", function () {
    const sortBy = this.value;
    const tableBody = document.querySelector(".tasks-table tbody");
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((rowA, rowB) => {
        let cellA, cellB;

        switch (sortBy) {
            case "status":
                cellA = rowA.querySelector(".status").textContent.trim().toLowerCase();
                cellB = rowB.querySelector(".status").textContent.trim().toLowerCase();
                return cellA.localeCompare(cellB); // Alphabetical sorting

            case "project":
                cellA = rowA.cells[1].textContent.trim().toLowerCase();
                cellB = rowB.cells[1].textContent.trim().toLowerCase();
                return cellA.localeCompare(cellB);

            case "due-date":
                cellA = Date.parse(rowA.cells[6].textContent.trim()); // Convert to timestamp
                cellB = Date.parse(rowB.cells[6].textContent.trim());
                return cellA - cellB; // Sort from earliest to latest

            case "assigned-student":
                cellA = rowA.cells[4].textContent.trim().toLowerCase();
                cellB = rowB.cells[4].textContent.trim().toLowerCase();
                return cellA.localeCompare(cellB);
        }
    });

    // Clear and append sorted rows back to the table
    tableBody.innerHTML = "";
    rows.forEach(row => tableBody.appendChild(row));
});

/////////////////////////////////////*** ✅ sorting table//////////////////////////////////




/////////////////////////////////////*** ✅ add data task daynamiclly///////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("taskModal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".new-task-btn");
    const closeModalBtn = modal.querySelector(".close");
    const taskForm = document.getElementById("taskForm");
    const tableBody = document.querySelector(".tasks-table tbody");

    modal.style.display = "none";
    overlay.style.display = "none";

    function toggleModal(show) {
        if (show) {
            modal.style.display = "flex";
            overlay.style.display = "block";
        } else {
            modal.style.display = "none";
            overlay.style.display = "none";
        }
    }

    openModalBtn.addEventListener("click", () => toggleModal(true));
    closeModalBtn.addEventListener("click", () => toggleModal(false));

    window.addEventListener("click", (event) => {
        if (modal.style.display === "flex" && !modal.contains(event.target) && !openModalBtn.contains(event.target)) {
            toggleModal(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.style.display === "flex") {
            toggleModal(false);
        }
    });

    // ✅ Add New Task to Table Dynamically
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from reloading the page

        // Get input values
        const project = document.getElementById("project").value;
        const taskName = document.getElementById("taskName").value;
        const description = document.getElementById("description").value;
        const assignedStudent = document.getElementById("assignedStudent").value;
        const status = document.getElementById("status").value;
        const dueDate = document.getElementById("dueDate").value;

        // Generate a new Task ID
        const newTaskId = tableBody.rows.length + 1;

        // Create a new row
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${newTaskId}</td>
            <td>${project}</td>
            <td>${taskName}</td>
            <td>${description}</td>
            <td>${assignedStudent}</td>
            <td class="status ${status.toLowerCase()}">${status}</td>
            <td>${dueDate}</td>
        `;

        // Append the new row to the table
        tableBody.appendChild(newRow);

        // Reset the form
        taskForm.reset();

        // Close the modal after submitting
        toggleModal(false);
    });
});

/////////////////////////////////////*** ✅ add data task daynamiclly//////////////////////////////////


/////////////////////////////////////*** ✅ add night mode//////////////////////////////////
const mode = document.querySelector(".icon");
mode.onclick = changeMode;

function changeMode(){
    document.querySelector("header").classList.toggle("mode");
    
    
    
}



/////////////////////////////////////*** ✅ add night mode//////////////////////////////////


/////////////////////////////////////*** ✅ add admin span name//////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    // Get admin details from sessionStorage or localStorage
    const adminData = sessionStorage.getItem("currentAdmin") || localStorage.getItem("currentAdmin");

    if (!adminData) {
        // If no admin is logged in, redirect to the sign-in page
        window.location.assign("../Signin.html"); // Adjust the path as needed
        return;
    }

    // Parse admin data
    const admin = JSON.parse(adminData);

    // Select the admin name element and update it dynamically
    const adminNameSpan = document.querySelector(".header-top span");
    if (adminNameSpan) {
        adminNameSpan.textContent = admin.userName; // Display logged-in admin's username
    }

    // Handle logout button click
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("currentAdmin");
        localStorage.removeItem("currentAdmin"); // Clears persistent login too
        window.location.assign("../Signin.html"); // Redirect to sign-in page
    });
});

/////////////////////////////////////*** ✅ add admin span name//////////////////////////////////


/////////////////////////////////////*** ✅ project Modal Handling //////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("projectModal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".add-project-btn");
    const closeModalBtn = document.querySelector(".modal .close");

    // Open modal
    openModalBtn.addEventListener("click", function () {
        modal.style.display = "block";
        overlay.style.display = "block";
    });

    // Close modal
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // Close modal when clicking outside
    overlay.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });
});


/////////////////////////////////////*** ✅ Project Modal Handling //////////////////////////////////

/////////////////////////////////////*** ✅ add data project daynamiclly///////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const projectContainer = document.getElementById("projectContainer");
    const projectForm = document.getElementById("projectForm");
    const modal = document.getElementById("projectModal");
    const overlay = document.querySelector(".modal-overlay");
    const addProjectBtn = document.querySelector(".add-project-btn");
    const closeModalBtn = document.querySelector(".modal .close");

    // Sample Projects Data
    let projects = [
        {
            title: "Website Redesign",
            description: "Redesign the company website to improve user experience.",
            students: ["Student 1", "Student 2"],
            category: "Web Development",
            startDate: "2023-01-01",
            endDate: "2023-06-01",
            progress: 100,
            borderColor: "blue"
        },
        {
            title: "Mobile App Development",
            description: "Develop a mobile application for our services.",
            students: ["Student 3", "Student 4"],
            category: "Mobile Development",
            startDate: "2023-02-15",
            endDate: "2023-08-15",
            progress: 100,
            borderColor: "orange"
        },
        {
            title: "Data Analysis Project",
            description: "Analyze data from the last quarter to find insights.",
            students: ["Student 5"],
            category: "Data Science",
            startDate: "2023-03-01",
            endDate: "2023-05-01",
            progress: 100,
            borderColor: "blue"
        },
        {
            title: "Machine Learning Model",
            description: "Create a machine learning model for predictions.",
            students: ["Student 1", "Student 3"],
            category: "Machine Learning",
            startDate: "2023-04-01",
            endDate: "2023-09-01",
            progress: 100,
            borderColor: "gray"
        },
        {
            title: "Machine Learning Model",
            description: "Create a machine learning model for predictions 2.",
            students: ["Student 1", "Student 3"],
            category: "Machine Learning",
            startDate: "2023-04-01",
            endDate: "2026-09-01",
            progress: 56,
            borderColor: "gray"
        }
    ];

    // Function to Render Projects
    function renderProjects() {
        projectContainer.innerHTML = ""; // Clear existing content

        projects.forEach((project, index) => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            projectCard.style.border = `2px solid ${project.borderColor}`;

            projectCard.innerHTML = `
                <h3 style="color:${project.borderColor}">${project.title}</h3>
                <p><strong>Description:</strong> ${project.description}</p>
                <p><strong>Students:</strong> ${project.students.join(", ")}</p>
                <p><strong>Category:</strong> ${project.category}</p>
                <div class="progress-bar">
                    <div class="progress" style="width:${project.progress}%">${project.progress}%</div>
                </div>
                <p>${project.startDate} &nbsp;&nbsp;&nbsp; ${project.endDate}</p>
                
            `;

            projectContainer.appendChild(projectCard);
        });

        // Attach event listeners to delete buttons
        
    }

    // Function to Handle Form Submission (Adding New Project)
    projectForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById("projectTitle").value;
        const description = document.getElementById("projectDescription").value;
        const students = Array.from(document.getElementById("studentsList").selectedOptions).map(option => option.value);
        const category = document.getElementById("projectCategory").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const status = document.getElementById("projectStatus").value;

        if (!title || !description || students.length === 0 || category === "Select a category" || !startDate || !endDate) {
            alert("Please fill in all fields.");
            return;
        }

        const borderColor = status === "Completed" ? "orange" : status === "In Progress" ? "blue" : "gray";
        const progress = status === "Completed" ? 100 : status === "In Progress" ? 50 : 0;

        // Add new project to array
        projects.push({ title, description, students, category, startDate, endDate, progress, borderColor });

        renderProjects(); // Update project list
        projectForm.reset(); // Clear form
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // Open Modal
    addProjectBtn.addEventListener("click", function () {
        modal.style.display = "block";
        overlay.style.display = "block";
    });

    // Close Modal
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    overlay.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    renderProjects(); // Load initial projects when page loads
});


/////////////////////////////////////*** ✅ add data project daynamiclly///////////////////////

