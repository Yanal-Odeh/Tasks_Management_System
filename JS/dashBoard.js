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




///////////////////////////////////// ✅ Task Modal Handling + sorting //////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("taskModal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".new-task-btn");
    const closeModalBtn = modal.querySelector(".close");
    const taskForm = document.getElementById("taskForm");
    const tableBody = document.querySelector(".tasks-table tbody");
    const sortSelect = document.getElementById("sortTasks");

    // Load tasks from Local Storage on page load
    loadTasksFromStorage();

    // Ensure the modal is hidden on page load
    modal.style.display = "none";
    overlay.style.display = "none";

    // Function to toggle modal visibility
    function toggleModal(show) {
        modal.style.display = show ? "flex" : "none";
        overlay.style.display = show ? "block" : "none";
    }

    // Open Modal
    openModalBtn.addEventListener("click", () => toggleModal(true));

    // Close Modal (X Button & Overlay Click)
    closeModalBtn.addEventListener("click", () => toggleModal(false));
    overlay.addEventListener("click", () => toggleModal(false));

    // Close Modal with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") toggleModal(false);
    });

    // ✅ Add New Task to Table & Local Storage (Appending Instead of Overwriting)
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get input values
        const project = document.getElementById("project").value;
        const taskName = document.getElementById("taskName").value;
        const description = document.getElementById("description").value;
        const assignedStudent = document.getElementById("assignedStudent").value;
        const status = document.getElementById("status").value;
        const dueDate = document.getElementById("dueDate").value;

        // Get last ID from local storage and continue from it
        let tasks = getTasksFromStorage();
        let lastTaskId = tasks.length ? Math.max(...tasks.map(task => task.id)) : 0;
        const newTaskId = lastTaskId + 1;

        // Create a new Task Object
        const newTask = { id: newTaskId, project, taskName, description, assignedStudent, status, dueDate };

        // Save to Local Storage
        tasks.push(newTask);
        saveTasksToStorage(tasks);

        // Append task to the table instead of rewriting
        addTaskToTable(newTask);

        // Reset the form & close modal
        taskForm.reset();
        toggleModal(false);
    });

    // ✅ Sorting Functionality (Preserves Table Instead of Clearing It)
    sortSelect.addEventListener("change", function () {
        const sortBy = this.value;
        let tasks = getTasksFromStorage();

        switch (sortBy) {
            case "status":
                tasks = sortByStatus(tasks);
                break;
            case "project":
                tasks = sortByProject(tasks);
                break;
            case "due-date":
                tasks = sortByDueDate(tasks);
                break;
            case "assigned-student":
                tasks = sortByAssignedStudent(tasks);
                break;
        }

        // Save sorted tasks & reload table without clearing it
        saveTasksToStorage(tasks);
        refreshTaskTable(tasks);
    });

    // ✅ Sorting Functions
    function sortByStatus(tasks) {
        return tasks.sort((a, b) => a.status.localeCompare(b.status));
    }

    function sortByProject(tasks) {
        return tasks.sort((a, b) => a.project.localeCompare(b.project));
    }

    function sortByDueDate(tasks) {
        return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    function sortByAssignedStudent(tasks) {
        return tasks.sort((a, b) => a.assignedStudent.localeCompare(b.assignedStudent));
    }

    // ✅ Load Tasks from Local Storage and Append to Table (No Overwriting)
    function loadTasksFromStorage() {
        const tasks = getTasksFromStorage();
        tasks.forEach(addTaskToTable); // Append instead of overwriting
    }

    // ✅ Append Task to Table Without Clearing
    function addTaskToTable(task) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${task.id}</td>
            <td>${task.project}</td>
            <td>${task.taskName}</td>
            <td>${task.description}</td>
            <td>${task.assignedStudent}</td>
            <td class="status ${task.status.toLowerCase()}">${task.status}</td>
            <td>${task.dueDate}</td>
        `;
        tableBody.appendChild(newRow); // Append instead of replacing
    }

    // ✅ Refresh Task Table Without Clearing Everything
    function refreshTaskTable(tasks) {
        const currentTasks = Array.from(tableBody.children);
        currentTasks.forEach(row => tableBody.removeChild(row)); // Remove rows without clearing storage

        tasks.forEach(addTaskToTable); // Append new order without resetting
    }

    // ✅ Get Tasks from Local Storage
    function getTasksFromStorage() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    // ✅ Save Tasks to Local Storage
    function saveTasksToStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});

/////////////////////////////////////✅ Task Modal Handling + sorting//////////////////////////////////



/////////////////////////////////////*** ✅ add night mode//////////////////////////////////
const mode = document.querySelector(".icon");
mode.onclick = changeMode;

function changeMode(){
    document.querySelector("header").classList.toggle("light-background");
    document.querySelector("aside").classList.toggle("light-background");
    document.querySelector("main").classList.toggle("light-background");
    document.querySelector("#myChart").classList.toggle("light-background");
    document.querySelectorAll(".data-item").forEach(element => {
        element.classList.toggle("teal-background");
    })
    document.querySelectorAll(".menu-item").forEach(element => {
        element.classList.toggle("teal-background");
    })
    document.querySelectorAll(".menu-item").forEach(element => {
        element.classList.toggle("blue-background");
    })
    document.querySelectorAll(".project-grid div").forEach(element => { 
        element.classList.toggle("teal-background");
    })
    document.querySelectorAll(".student").forEach(element => {
        element.classList.toggle("teal-background");
    })
    document.querySelector("header div p").classList.toggle("dark-text");
    document.querySelector("#datetime").classList.toggle("dark-text");
    document.querySelector(".project-controls input").classList.toggle("teal-background");
    document.querySelector(".project-controls input").classList.toggle("light-text");
    document.querySelector(".project-controls select").classList.toggle("teal-background");
    document.querySelector(".chat-part").classList.toggle("teal-background");
    document.querySelector(".message input").classList.toggle("teal-background");
    document.querySelector(".message input").classList.toggle("light-text");
    
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

/////////////////////////////////////*** ✅  project tab ///////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const projectContainer = document.getElementById("projectContainer");
    const projectForm = document.getElementById("projectForm");
    const modal = document.getElementById("projectModal");
    const overlay = document.querySelector(".modal-overlay");
    const addProjectBtn = document.querySelector(".add-project-btn");
    const closeModalBtn = document.querySelector(".modal .close");
    const projectSearch = document.getElementById("projectSearch");
    const projectStatusFilter = document.getElementById("projectStatusFilter");

    // Load projects from localStorage or use default sample projects
    let projects = JSON.parse(localStorage.getItem("projects")) || [
        {
            title: "Website Redesign",
            description: "Redesign the company website to improve user experience.",
            students: ["Student 1", "Student 2"],
            category: "Web Development",
            startDate: "2023-01-01",
            endDate: "2023-06-01",
            status: "Completed", // Ensure it matches exactly
            progress: 100,
            borderColor: "orange"
        },
        {
            title: "Mobile App Development",
            description: "Develop a mobile application for our services.",
            students: ["Student 3", "Student 4"],
            category: "Mobile Development",
            startDate: "2023-02-15",
            endDate: "2023-08-15",
            status: "Completed",
            progress: 100,
            borderColor: "orange"
        },
        {
            title: "Machine Learning Model",
            description: "Create a machine learning model for predictions.",
            students: ["Student 1", "Student 3"],
            category: "AI & ML",
            startDate: "2023-04-01",
            endDate: "2023-09-01",
            status: "In-Progress",
            progress: 50,
            borderColor: "blue"
        },
        {
            title: "AI Security System",
            description: "Build an AI system for real-time security monitoring.",
            students: ["Student 2", "Student 4"],
            category: "AI & ML",
            startDate: "2023-07-01",
            endDate: "2024-01-01",
            status: "Pending",
            progress: 0,
            borderColor: "gray"
        }
    ];
    

    // Function to save projects to localStorage
    function saveProjectsToStorage() {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    // Function to Render Projects
    function renderProjects(filteredProjects = projects) {
        projectContainer.innerHTML = ""; // Clear existing content

        if (filteredProjects.length === 0) {
            projectContainer.innerHTML = `<p style="color: white;">No projects found.</p>`;
            return;
        }

        filteredProjects.forEach((project, index) => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");
            projectCard.style.border = `2px solid ${project.borderColor}`;

            projectCard.innerHTML = `
                <h3 style="color:${project.borderColor}">${project.title}</h3>
                <p><strong>Description:</strong> ${project.description}</p>
                <p><strong>Students:</strong> ${project.students.join(", ")}</p>
                <p><strong>Category:</strong> ${project.category}</p>
                <p><strong>Status:</strong> ${project.status}</p>
                <div class="progress-bar">
                    <div class="progress" style="width:${project.progress}%">${project.progress}%</div>
                </div>
                <p>${project.startDate} &nbsp;&nbsp;&nbsp; ${project.endDate}</p>
                <button class="delete-project-btn" data-index="${index}">Delete</button>
            `;

            projectContainer.appendChild(projectCard);
        });

        // Add delete functionality
        document.querySelectorAll(".delete-project-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                projects.splice(index, 1); // Remove project from array
                saveProjectsToStorage(); // Update localStorage
                renderProjects(); // Re-render projects
            });
        });
    }

    // Function to Filter Projects Based on Search and Status
    function filterProjects() {
        const searchTerm = projectSearch.value.toLowerCase().trim();
        const selectedStatus = projectStatusFilter.value.trim(); 

        const filteredProjects = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||  project.description.toLowerCase().includes(searchTerm);

            const matchesStatus = selectedStatus === "all" || project.status.toLowerCase() === selectedStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        });

        renderProjects(filteredProjects);
    }

    // Event Listeners for Search and Filter
    projectSearch.addEventListener("input", filterProjects);
    projectStatusFilter.addEventListener("change", filterProjects);

    // Function to Handle Form Submission (Adding New Project)
    projectForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById("projectTitle").value;
        const description = document.getElementById("projectDescription").value;
        const students = Array.from(document.getElementById("studentsList").selectedOptions).map(option => option.value);
        const category = document.getElementById("projectCategory").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const status = document.getElementById("projectStatus").value.trim(); 

        if (!title || !description || students.length === 0 || category === "Select a category" || !startDate || !endDate) {
            alert("Please fill in all fields.");
            return;
        }

        const borderColor = status === "Completed" ? "orange" : status === "In-Progress" ? "blue" : "gray";
        const progress = status === "Completed" ? 100 : status === "In-Progress" ? 50 : 0;

        // Add new project to array
        projects.push({ title, description, students, category, startDate, endDate, status, progress, borderColor });

        // Save to localStorage
        saveProjectsToStorage();

        // Refresh Project List
        renderProjects();
        projectForm.reset();
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // Open/Close Modal
    addProjectBtn.addEventListener("click", function () {
        modal.style.display = "block";
        overlay.style.display = "block";
    });

    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    overlay.addEventListener("click", function () {
        modal.style.display = "none";
        overlay.style.display = "none";
    });

    // Load Projects on Page Load
    renderProjects();
});

/////////////////////////////////////*** ✅  project tab ///////////////////////




