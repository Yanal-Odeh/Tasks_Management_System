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




document.addEventListener("DOMContentLoaded", function () {
// Get user data
const userData = sessionStorage.getItem("session") || localStorage.getItem("session");
if (!userData) {
    window.location.assign("../Signin.html"); // Redirect if not logged in
    return;
}

const user = JSON.parse(userData);
const isAdmin = user.role === "Admin";

// Elements for dynamic count updates
const projectCountEl = document.querySelector(".data-item:nth-child(1) p");
const studentCountEl = document.querySelector(".data-item:nth-child(2)");
const taskCountEl = document.querySelector(".data-item:nth-child(3) p");
const finishedProjectCountEl = document.querySelector(".data-item:nth-child(4) p");

// Get data from localStorage
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Filter students only
let students = users.filter(user => user.role === "Student");

// Filter finished projects
let finishedProjects = projects.filter(project => project.status.toLowerCase() === "completed");

// Update dashboard stats dynamically
if (isAdmin) {
    projectCountEl.textContent = projects.length;
    studentCountEl.style.display = "block";
    studentCountEl.querySelector("p").textContent = students.length;
    taskCountEl.textContent = tasks.length;
    finishedProjectCountEl.textContent = finishedProjects.length;
} else {
    projectCountEl.textContent = projects.filter(project => project.students.includes(user.username)).length;
    studentCountEl.style.display = "none"; // Hide student count for students
    taskCountEl.textContent = tasks.filter(task => task.assignedStudent === user.username).length;
    finishedProjectCountEl.textContent = finishedProjects.filter(project => project.students.includes(user.username)).length;
}
});


/////////////////////////////////////////////chart.js//////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user session
    const userData = sessionStorage.getItem("session") || localStorage.getItem("session");
    
    if (!userData) {
        window.location.assign("../Signin.html"); // Redirect if not logged in
        return;
    }
    
    const user = JSON.parse(userData);
    const isAdmin = user.role === "Admin";
    
    // Retrieve data from localStorage
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    // For admin: Get total student count
    let students = users.filter(user => user.role === "Student");
    
    // For admin: Get completed projects
    let finishedProjects = projects.filter(project => project.status.toLowerCase() === "completed");
    
    let chartLabels, chartData;
    
    if (isAdmin) {
        // Admin sees everything
        chartLabels = ["Number of Projects", "Number of Students", "Number of Tasks", "Number of Finished Projects"];
        chartData = [projects.length, students.length, tasks.length, finishedProjects.length];
    } else {
        // Student sees only their assigned projects and tasks
        let studentProjects = projects.filter(project => project.students.includes(user.username));
        let studentTasks = tasks.filter(task => task.assignedStudent.toLowerCase() === user.username.toLowerCase());
        let studentFinishedProjects = studentProjects.filter(project => project.status.toLowerCase() === "completed");
    
        chartLabels = ["Number of Projects", "Number of Tasks", "Number of Finished Projects"];
        chartData = [studentProjects.length, studentTasks.length, studentFinishedProjects.length];
    }
    
    // Chart Data
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: chartLabels, // Dynamic labels based on role
            datasets: [{
                label: "Count",
                data: chartData, // Dynamic data based on role
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


///////////////////////////////////// ✅ edit task ///////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector(".tasks-table tbody");
    const editTaskBtn = document.querySelector(".edit-task-btn");
    const editTaskModal = document.getElementById("editTaskModal");
    const closeEditModal = editTaskModal.querySelector(".close");
    const modalOverlay = document.querySelector(".modal-overlay");
    let selectedTaskId = null;
    let selectedRow = null;
    editTaskModal.style.display = "none";
    modalOverlay.style.display = "none";

    // Function to Load Projects & Students into Edit Modal
    function loadProjectsAndStudentsForEdit() {
        let projectSelect = document.getElementById("editProject");
        let studentSelect = document.getElementById("editAssignedStudent");

        // Load projects from localStorage
        let projects = JSON.parse(localStorage.getItem("projects")) || [];
        projectSelect.innerHTML = '<option selected disabled value="">Select a project</option>';
        projects.forEach(project => {
            let option = document.createElement("option");
            option.value = project.title;
            option.textContent = project.title;
            projectSelect.appendChild(option);
        });

        // Load students from localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let students = users.filter(user => user.role === "Student");
        studentSelect.innerHTML = '<option selected disabled value="">Select a student</option>';
        students.forEach(student => {
            let option = document.createElement("option");
            option.value = student.username;
            option.textContent = student.username;
            studentSelect.appendChild(option);
        });
    }

    // Select task row and enable "Edit Task" button
    tableBody.addEventListener("click", function (event) {
        const row = event.target.closest("tr");
        if (!row) return;

        document.querySelectorAll(".tasks-table tbody tr").forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
        editTaskBtn.removeAttribute("disabled");

        selectedTaskId = parseInt(row.cells[0].textContent);
        selectedRow = row;
    });

    // Open "Edit Task" Modal
    editTaskBtn.addEventListener("click", function () {
        if (!selectedTaskId || !selectedRow) return;

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        let selectedTask = tasks.find(task => task.id === selectedTaskId);
        if (!selectedTask) return;

        // Load projects & students before showing modal
        loadProjectsAndStudentsForEdit();

        // Open modal
        editTaskModal.style.display = "flex";
        modalOverlay.style.display = "block";

        // Pre-fill modal fields
        document.getElementById("editProject").value = selectedTask.project;
        document.getElementById("editTaskName").value = selectedTask.taskName;
        document.getElementById("editDescription").value = selectedTask.description;
        document.getElementById("editAssignedStudent").value = selectedTask.assignedStudent;
        document.getElementById("editStatus").value = selectedTask.status;
        document.getElementById("editDueDate").value = selectedTask.dueDate;

        document.getElementById("editTaskForm").setAttribute("data-editing-id", selectedTaskId);
    });

    // Close "Edit Task" Modal
    closeEditModal.addEventListener("click", function () {
        editTaskModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    // Handle "Edit Task" Form Submission
    document.getElementById("editTaskForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const editingId = document.getElementById("editTaskForm").getAttribute("data-editing-id");

        const updatedTask = {
            id: parseInt(editingId),
            project: document.getElementById("editProject").value,
            taskName: document.getElementById("editTaskName").value,
            description: document.getElementById("editDescription").value,
            assignedStudent: document.getElementById("editAssignedStudent").value,
            status: document.getElementById("editStatus").value,
            dueDate: document.getElementById("editDueDate").value
        };

        // Update localStorage
        let taskIndex = tasks.findIndex(task => task.id === parseInt(editingId));
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        // Update the selected row in the table instantly
        if (selectedRow) {
            selectedRow.cells[1].textContent = updatedTask.project;
            selectedRow.cells[2].textContent = updatedTask.taskName;
            selectedRow.cells[3].textContent = updatedTask.description;
            selectedRow.cells[4].textContent = updatedTask.assignedStudent;
            selectedRow.cells[5].textContent = updatedTask.status;
            selectedRow.cells[6].textContent = updatedTask.dueDate;

            selectedRow.classList.remove("selected");
            selectedRow = null;
        }

        // Disable the "Edit Task" button after editing
        editTaskBtn.setAttribute("disabled", "true");

        // Close Modal
        editTaskModal.style.display = "none";
        modalOverlay.style.display = "none";
    });

    // Ensure table updates when page loads
    function loadTasksFromStorage() {
        tableBody.innerHTML = ""; // Clear the table
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(task => {
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
            tableBody.appendChild(newRow);
        });
    }

    // Load tasks initially
    loadTasksFromStorage();
});












///////////////////////////////////// ✅ Task Modal Handling + sorting //////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("taskModal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".new-task-btn");
    const closeModalBtn = modal.querySelector(".close");
    const taskForm = document.getElementById("taskForm");
    const tableBody = document.querySelector(".tasks-table tbody");
    const sortSelect = document.getElementById("sortTasks");
    const assignedStudentSelect = document.getElementById("assignedStudent");
    const projectSelect = document.getElementById("project");
    const userData = sessionStorage.getItem("session") || localStorage.getItem("session");
    if (!userData) {
        window.location.assign("../Signin.html"); // Redirect if not logged in
        return;
    }
    const user = JSON.parse(userData);
    const isAdmin = user.role === "Admin";

    const statusPriority = {
        "completed": 1,    
        "in-progress": 2,  
        "pending": 3,      
        "on-hold": 4,      
        "cancelled": 5     
    };

    modal.style.display = "none";
    overlay.style.display = "none";


    function toggleModal(show) {
        modal.style.display = show ? "flex" : "none";
        overlay.style.display = show ? "block" : "none";
    }


    openModalBtn.addEventListener("click", () => {
        taskForm.reset();
        loadStudents();
        loadProjects();
        toggleModal(true);
    });

    closeModalBtn.addEventListener("click", () => toggleModal(false));
    overlay.addEventListener("click", () => toggleModal(false));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") toggleModal(false);
    });

    function loadTasks() {
        tableBody.innerHTML = ""; 
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));

        localStorage.setItem("tasks", JSON.stringify(tasks));
        tasks.forEach(addTaskToTable);
    }
    loadTasks();
    loadStudents();
    loadProjects();

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        const taskName = document.getElementById("taskName").value.trim();
        const description = document.getElementById("description").value.trim();
        const assignedStudent = assignedStudentSelect.value;
        const project = projectSelect.value;
        const status = document.getElementById("status").value;
        const dueDate = document.getElementById("dueDate").value;

        if (!taskName || !description || !assignedStudent || !project || !status || !dueDate) {
            alert("⚠️ Please fill in all fields.");
            return;
        }

        // Check if a task with the same name already exists
        if (tasks.some(task => task.taskName.toLowerCase() === taskName.toLowerCase())) {
            alert("⚠️ A task with this name already exists. Please choose a different name.");
            return;
        }

        // Prevent adding tasks with a past due date
        if (new Date(dueDate) < new Date()) {
            alert("⚠️ Due date cannot be in the past.");
            return;
        }

        const task = {
            id: tasks.length + 1,
            project,
            taskName,
            description,
            assignedStudent,
            status,
            dueDate
        };

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // ✅ Instantly add the new task to the table
        addTaskToTable(task);

        taskForm.reset();
        toggleModal(false);
    });

    sortSelect.addEventListener("change", function () {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const sortBy = this.value;
        if (sortBy === "status") {
            tasks.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
        } else if (sortBy === "project") {
            tasks.sort((a, b) => a.project.localeCompare(b.project));
        } else if (sortBy === "due-date") {
            tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === "assigned-student") {
            tasks.sort((a, b) => a.assignedStudent.localeCompare(b.assignedStudent));
        }
        refreshTable(tasks);
    });

    function refreshTable(tasks) {
        tableBody.innerHTML = "";
        tasks.forEach(addTaskToTable);
    }

    function addTaskToTable(task) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.project}</td>
            <td>${task.taskName}</td>
            <td>${task.description}</td>
            <td>${task.assignedStudent}</td>
            <td class="status ${task.status}">${task.status}</td>
            <td>${task.dueDate}</td>
        `;
        tableBody.appendChild(row);
    }

    function loadStudents() {
        assignedStudentSelect.innerHTML = '<option value="">Select a student</option>';
        const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    
        if (user.role === "Admin") {
            // Admins see all students
            allUsers
                .filter(user => user.role === "Student")
                .forEach(student => {
                    assignedStudentSelect.innerHTML += `<option value="${student.username}">${student.username}</option>`;
                });
        } else {
            // Students only see their own name
            assignedStudentSelect.innerHTML = `<option value="${user.username}" selected>${user.username}</option>`;
            assignedStudentSelect.disabled = true; // Optional: Prevents selection change
        }
    }
    

    function loadProjects() {
        projectSelect.innerHTML = '<option value="">Select a project</option>';
        const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    
        if (user.role === "Admin") {
            // Admins see all projects
            allProjects.forEach(project => {
                projectSelect.innerHTML += `<option value="${project.title}">${project.title}</option>`;
            });
        } else {
            // Students only see projects they are assigned to
            const studentProjects = allProjects.filter(project => project.students.includes(user.username));
    
            if (studentProjects.length === 0) {
                projectSelect.innerHTML = '<option value="">No assigned projects</option>';
            } else {
                studentProjects.forEach(project => {
                    projectSelect.innerHTML += `<option value="${project.title}">${project.title}</option>`;
                });
            }
        }
    }
    
});

/////////////////////////////////////✅ Task Modal Handling + sorting//////////////////////////////////



/////////////////////////////////////dragging task model//////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Modals & Overlays
    const taskModal = document.getElementById("taskModal");
    const editTaskModal = document.getElementById("editTaskModal");
    const overlay = document.querySelector(".modal-overlay");

    // Buttons
    const openTaskModalBtn = document.querySelector(".new-task-btn");
    const closeTaskModalBtn = taskModal.querySelector(".close");
    const openEditTaskModalBtn = document.querySelector(".edit-task-btn");
    const closeEditTaskModalBtn = editTaskModal.querySelector(".close");

    // Headers for dragging
    const taskModalHeader = taskModal.querySelector("h2");
    const editTaskModalHeader = editTaskModal.querySelector("h2");

    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    let activeModal = null; // Track the active modal being dragged

    // ✅ Function to start dragging (for both modals)
    function startDragging(event, modal) {
        isDragging = true;
        activeModal = modal;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;
        modal.style.cursor = "grabbing";
    }

    // ✅ Function to move modal while dragging
    function dragModal(event) {
        if (!isDragging || !activeModal) return;

        let newX = event.clientX - offsetX;
        let newY = event.clientY - offsetY;

        activeModal.style.left = `${newX}px`;
        activeModal.style.top = `${newY}px`;
    }

    // ✅ Function to stop dragging
    function stopDragging() {
        isDragging = false;
        if (activeModal) activeModal.style.cursor = "default";
        activeModal = null;
    }

    // ✅ Add dragging functionality to both modals
    taskModalHeader.addEventListener("mousedown", (event) => startDragging(event, taskModal));
    editTaskModalHeader.addEventListener("mousedown", (event) => startDragging(event, editTaskModal));

    document.addEventListener("mousemove", dragModal);
    document.addEventListener("mouseup", stopDragging);

    // ✅ Function to toggle modal visibility
    function toggleModal(modal, show) {
        if (show) {
            modal.style.display = "flex";
            overlay.style.display = "block";
        } else {
            modal.style.display = "none";
            overlay.style.display = "none";
        }
    }

    // ✅ Open & Close "Create New Task" Modal
    openTaskModalBtn.addEventListener("click", () => toggleModal(taskModal, true));
    closeTaskModalBtn.addEventListener("click", () => toggleModal(taskModal, false));

    // ✅ Open & Close "Edit Task" Modal
    openEditTaskModalBtn.addEventListener("click", () => toggleModal(editTaskModal, true));
    closeEditTaskModalBtn.addEventListener("click", () => toggleModal(editTaskModal, false));

    // ✅ Close modals when clicking on overlay
    overlay.addEventListener("click", () => {
        toggleModal(taskModal, false);
        toggleModal(editTaskModal, false);
    });

    // ✅ Close modals with Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            toggleModal(taskModal, false);
            toggleModal(editTaskModal, false);
        }
    });
});



/////////////////////////////////////dragging task model//////////////////////////////////



/////////////////////////////////////*** ✅ add night mode//////////////////////////////////

const mode = document.querySelector(".icon");
mode.onclick = changeMode;

function changeMode() {
document.querySelector("#tasksContent").classList.toggle("light-background");
document.querySelector(".tasks-table-container").classList.toggle("light-background");
document.querySelector(".tasks-header").classList.toggle("light-background");
document.querySelector("#sortTasks").classList.toggle("light-text");
document.querySelector(".new-task-btn").classList.toggle("light-background");

document.querySelector(".tasks-table").classList.toggle("light-background");
document.querySelector(".tasks-table-container").classList.toggle("light-background");

document.querySelectorAll(".tasks-table th").forEach(element => {
    element.classList.toggle("light-background");
    element.classList.toggle("dark-text");
});

document.querySelectorAll(".tasks-table td").forEach(element => {
    element.classList.toggle("dark-text");
});

document.querySelectorAll(".tasks-table tbody tr:nth-child(even)").forEach(element => {
    element.classList.toggle("light-background");
});

document.querySelectorAll(".tasks-table tbody tr:hover").forEach(element => {
    element.classList.toggle("light-background");
});

document.querySelectorAll(".status").forEach(element => {
    element.classList.toggle("dark-text");
});

document.querySelector("header").classList.toggle("light-background");
document.querySelector("aside").classList.toggle("light-background");
document.querySelector("main").classList.toggle("light-background");
document.querySelector("#myChart").classList.toggle("light-background");

document.querySelectorAll(".data-item").forEach(element => {
    element.classList.toggle("teal-background");
});

document.querySelectorAll(".menu-item").forEach(element => {
    element.classList.toggle("teal-background");
});

document.querySelectorAll(".menu-item").forEach(element => {
    element.classList.toggle("blue-background");
});

document.querySelectorAll(".project-grid div").forEach(element => { 
    element.classList.toggle("teal-background");
});

document.querySelectorAll(".student").forEach(element => {
    element.classList.toggle("teal-background");
});

document.querySelectorAll(".modal input").forEach(element => { 
    element.classList.toggle("light-background");
});

document.querySelectorAll(".modal select").forEach(element => { 
    element.classList.toggle("light-background");
});

document.querySelectorAll(".modal textarea").forEach(element => { 
    element.classList.toggle("light-background");
});

document.querySelector("header div p").classList.toggle("dark-text");
document.querySelector("#datetime").classList.toggle("dark-text");

document.querySelector(".project-controls input").classList.toggle("teal-background");
document.querySelector(".project-controls input").classList.toggle("light-text");

document.querySelector(".project-controls select").classList.toggle("teal-background");

document.querySelector(".chat-part").classList.toggle("teal-background");
document.querySelector(".message input").classList.toggle("teal-background");
document.querySelector(".message input").classList.toggle("light-text");

document.querySelector(".modal").classList.toggle("light-background");

// ✅ Toggle Light/Night Mode for Table Header & Borders
document.querySelector(".tasks-table-container").classList.toggle("night-mode");
document.querySelector(".tasks-table").classList.toggle("night-mode");

// ✅ Toggle Light/Night Mode for "Sort By" Label
document.querySelector("label[for='sortTasks']").classList.toggle("night-mode");

}


/////////////////////////////////////*** ✅ add night mode//////////////////////////////////








/////////////////////////////////////*** ✅ add span name//////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
// Get current user details from sessionStorage or localStorage
const userData = sessionStorage.getItem("session") || localStorage.getItem("session");

if (!userData) {
    // If no user is logged in, redirect to the sign-in page
    window.location.assign("../Signin.html"); // Adjust the path as needed
    return;
}

// Parse user data
const user = JSON.parse(userData);

// Select the user name element and update it dynamically
const userNameSpan = document.querySelector(".header-top span");
if (userNameSpan) {
    userNameSpan.textContent = `${user.role}: ${user.username}`; // Example: "Student: JohnDoe" or "Admin: AdminUser"
}

// Handle logout button click
const logoutBtn = document.querySelector(".logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("session");
        localStorage.removeItem("session"); // Clears persistent login too
        window.location.assign("../Signin.html"); // Redirect to sign-in page
    });
}
});



/////////////////////////////////////*** ✅ add span name//////////////////////////////////


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
    const studentsList = document.getElementById("studentsList");

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Filter only students
    const students = users.filter(user => user.role === "Student");

    // Populate the students dropdown list
    if (students.length > 0) {
        studentsList.innerHTML = "";
        students.forEach(student => {
            const option = document.createElement("option");
            option.textContent = student.username;
            option.value = student.username;
            studentsList.appendChild(option);
        });
    } else {
        studentsList.innerHTML = "<option>No students registered</option>";
    }

    // Load projects from localStorage
    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Function to save projects to localStorage
    function saveProjectsToStorage() {
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    // Function to delete a project AND its related tasks
    function deleteProject(index) {
        if (confirm("Are you sure you want to delete this project? All related tasks will also be removed.")) {
            const deletedProjectTitle = projects[index].title;

            // Remove project from the array
            projects.splice(index, 1);

            // Update localStorage for projects
            saveProjectsToStorage();

            // Delete tasks related to this project
            deleteTasksForProject(deletedProjectTitle);

            // Re-render projects and tasks
            renderProjects();
        }
    }

    // Function to delete all tasks related to a deleted project
    function deleteTasksForProject(projectTitle) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        
        // Filter out tasks related to the deleted project
        tasks = tasks.filter(task => task.project !== projectTitle);

        // Save updated tasks back to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Refresh tasks UI (if applicable)
        if (typeof loadTasks === "function") {
            loadTasks();
        }
    }

    // Function to render projects
    function renderProjects(filteredProjects = projects) {
        projectContainer.innerHTML = "";

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
                <button class="delete-btn" data-index="${index}">❌ Delete</button>
            `;

            projectContainer.appendChild(projectCard);
        });

        // Add event listeners for delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteProject(index);
            });
        });
    }

    // Function to filter projects based on search and status
    function filterProjects() {
        const searchTerm = projectSearch.value.toLowerCase().trim();
        const selectedStatus = projectStatusFilter.value.trim();

        const filteredProjects = projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) || project.description.toLowerCase().includes(searchTerm);
            const matchesStatus = selectedStatus === "all" || project.status.toLowerCase() === selectedStatus.toLowerCase();
            return matchesSearch && matchesStatus;
        });

        renderProjects(filteredProjects);
    }

    // Event listeners for search and filter
    projectSearch.addEventListener("input", filterProjects);
    projectStatusFilter.addEventListener("change", filterProjects);

    // Function to handle form submission (adding new project)
    projectForm.addEventListener("submit", function (event) {
        event.preventDefault();

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

    // Load projects on page load
    renderProjects();
});



/////////////////////////////////////*** ✅  project tab ///////////////////////








///////////////////////////////////// ✅ delete task ///////////////////////

document.addEventListener("DOMContentLoaded", function () {
const tableBody = document.querySelector(".tasks-table tbody");
const deleteTaskBtn = document.querySelector(".delete-task-btn");

let selectedTask = null; // Stores the selected row for deletion

// ✅ Function to Select a Task Row on Left Click (Does Not Deselect)
tableBody.addEventListener("click", function (event) {
    const row = event.target.closest("tr"); // Get the clicked row
    if (!row || row === selectedTask) return; // Prevent reselecting the same row

    // Remove previous selection
    document.querySelectorAll(".tasks-table tbody tr").forEach(r => r.classList.remove("selected"));

    // Highlight the selected row
    row.classList.add("selected");
    selectedTask = row;
    deleteTaskBtn.removeAttribute("disabled"); // Enable delete button
});

// ✅ Function to Deselect a Task Row on Right Click ONLY
tableBody.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // Prevents the default right-click menu

    // Remove selection
    document.querySelectorAll(".tasks-table tbody tr").forEach(r => r.classList.remove("selected"));
    selectedTask = null;

    // Disable delete button if no row is selected
    deleteTaskBtn.setAttribute("disabled", "true");
});

// ✅ Function to Delete a Selected Task and Reassign IDs
deleteTaskBtn.addEventListener("click", function () {
    if (!selectedTask) return;

    const confirmDelete = confirm("⚠️ Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const taskId = parseInt(selectedTask.cells[0].textContent); // Get Task ID

    // Remove from UI
    selectedTask.remove();

    // Remove from Local Storage
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.id !== taskId);

    // Reassign task IDs starting from 1
    tasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));

    // Save updated task list
    saveTasksToStorage(tasks);

    // Refresh the table with updated IDs
    loadTasksFromStorage();

    // ✅ Auto-deselect after deleting (User must select a new row)
    selectedTask = null;
    deleteTaskBtn.setAttribute("disabled", "true");
});

// ✅ Function to Load Tasks from Local Storage and Reassign IDs
function loadTasksFromStorage() {
    const tableBody = document.querySelector(".tasks-table tbody");
    tableBody.innerHTML = ""; 

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Assign task IDs starting from 1
    tasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));

    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasks.forEach(addTaskToTable);
}


// ✅ Function to Add a Task to the Table
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
    tableBody.appendChild(newRow);
}

// ✅ Get Tasks from Local Storage
function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// ✅ Save Tasks to Local Storage
function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks on page load
loadTasksFromStorage();
});

///////////////////////////////////// ✅ delete task ///////////////////////




///////////////////////////////////// opcity smooth  ///////////////////////

document.addEventListener("DOMContentLoaded", function () {
const modal = document.getElementById("taskModal");
const modalOverlay = document.querySelector(".modal-overlay");
const openModalBtn = document.querySelector(".new-task-btn");
const closeModalBtn = document.querySelector(".modal .close");

// Function to open modal
function openModal() {
    modal.classList.add("active");
    modalOverlay.style.display = "block";
    setTimeout(() => {
        modal.style.opacity = "1";
        modalOverlay.style.opacity = "1";
    }, 10); // Delay for smooth fade-in effect
}

// Function to close modal
function closeModal() {
    modal.style.opacity = "0";
    modalOverlay.style.opacity = "0";
    setTimeout(() => {
        modal.classList.remove("active");
        modalOverlay.style.display = "none";
    }, 300); // Delay to match CSS transition
}

// Open modal when clicking the button
openModalBtn.addEventListener("click", openModal);

// Close modal when clicking the close button
closeModalBtn.addEventListener("click", closeModal);

// Close modal when clicking outside the modal (overlay)
modalOverlay.addEventListener("click", closeModal);
});


///////////////////////////////////// opcity smooth  ///////////////////////


///////////////////////////////////// ✅ sign is as a student ///////////////////////
document.addEventListener("DOMContentLoaded", function () {
// Get logged-in user details
const userData = sessionStorage.getItem("session") || localStorage.getItem("session");
if (!userData) {
    window.location.assign("../Signin.html"); // Redirect if not logged in
    return;
}

const user = JSON.parse(userData);
const isAdmin = user.role === "Admin";

// Hide "Add Project" button for students
const addProjectBtn = document.querySelector(".add-project-btn");
if (!isAdmin && addProjectBtn) {
    addProjectBtn.style.display = "none";
}

// Filter Projects by Assigned Students
function filterProjects() {
    const projectContainer = document.getElementById("projectContainer");
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    
    if (!isAdmin) {
        projects = projects.filter(project => project.students.includes(user.username));
    }
    
    renderProjects(projects);
}

function renderProjects(filteredProjects) {
    const projectContainer = document.getElementById("projectContainer");
    projectContainer.innerHTML = "";
    
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
            <p>${project.startDate} - ${project.endDate}</p>
        `;
        
        if (isAdmin) {
            projectCard.innerHTML += `<button class="delete-project-btn" data-index="${index}">Delete</button>`;
        }
        
        projectContainer.appendChild(projectCard);
    });
}

// Filter Tasks by Assigned Student
function filterTasks() {
    const tableBody = document.querySelector(".tasks-table tbody");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (!isAdmin) {
        // Ensure usernames are case-insensitive and match exactly
        tasks = tasks.filter(task => task.assignedStudent.toLowerCase() === user.username.toLowerCase());
    }

    renderTasks(tasks);
}


function renderTasks(filteredTasks) {
    const tableBody = document.querySelector(".tasks-table tbody");
    tableBody.innerHTML = ""; // Clear old tasks before rendering

    filteredTasks.forEach(task => {
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
        tableBody.appendChild(newRow);
    });
}



// Initial Filtering
filterProjects();
filterTasks();
});









///////////////////////////////////// ✅ sign is as a student ///////////////////////


document.addEventListener("DOMContentLoaded", function () {
const projectCards = document.querySelectorAll(".project-card");

// Create the details panel dynamically and append it to the body
const detailsPanel = document.createElement("div");
detailsPanel.classList.add("details-panel");
document.body.appendChild(detailsPanel);

// Close button (X)
const closeButton = document.createElement("span");
closeButton.innerHTML = "&times;";
closeButton.classList.add("close-button");

// Event listener to hide the details panel when clicking the close button
closeButton.addEventListener("click", function () {
    detailsPanel.style.display = "none"; // Hide the panel
});

// Ensure close button is always inside the details panel
detailsPanel.appendChild(closeButton);

projectCards.forEach(card => {
    card.addEventListener("click", function () {
        const projectTitle = card.querySelector("h3").textContent.trim();
        displayProjectDetails(projectTitle);
    });
});

function displayProjectDetails(projectTitle) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Find the selected project
    const project = projects.find(proj => proj.title === projectTitle);
    if (!project) return;

    // Filter tasks related to the project
    const relatedTasks = tasks.filter(task => task.project === projectTitle);

    // Clear previous content but keep the close button
    detailsPanel.textContent = "";
    detailsPanel.appendChild(closeButton); // Keep close button at the top

        // Generate HTML for project details
        let detailsHTML = `
            <h2>${project.title}</h2>
            <p><strong>Description:</strong> ${project.description}</p>
            <p><strong>Category:</strong> ${project.category}</p>
            <p><strong>Students:</strong> ${project.students.join(", ")}</p>
            <p><strong>Start Date:</strong> ${project.startDate}</p>
            <p><strong>End Date:</strong> ${project.endDate}</p>
            <h3>Tasks</h3>
        `;

    // Append task details
    if (relatedTasks.length > 0) {
        relatedTasks.forEach(task => {
            detailsHTML += `
                <div class="task-card">
                    <p><strong>Task ID:</strong> ${task.id}</p>
                    <p><strong>Task Name:</strong> ${task.taskName}</p>
                    <p><strong>Description:</strong> ${task.description}</p>
                    <p><strong>Assigned Student:</strong> ${task.assignedStudent}</p>
                    <p><strong>Status:</strong> ${task.status}</p>
                </div>
            `;
        });
    } else {
        detailsHTML += `<p>No tasks found for this project.</p>`;
    }

    // Append the new content **AFTER** the close button
    detailsPanel.insertAdjacentHTML("beforeend", detailsHTML);
    detailsPanel.style.display = "block"; // Show details panel
}
});


///////////////////////////////////// ✅ sign is as a student ///////////////////////



///////////////////////////////////// delete role project ///////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const studentCheckbox = document.getElementById("student");
    const universityIdGroup = document.getElementById("university-id-group");
    const signupForm = document.getElementById("signup-form");

    // Show or hide university ID field based on checkbox state
    studentCheckbox.addEventListener("change", function () {
        universityIdGroup.style.display = studentCheckbox.checked ? "block" : "none";
    });

    // Handle sign-up form submission
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const isStudent = studentCheckbox.checked;
        const universityId = document.getElementById("university-id").value.trim();

        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if username already exists
        if (users.some(user => user.username.toLowerCase() === username.toLowerCase())) {
            alert("Username already exists! Please choose a different username.");
            return;
        }

        // If the user is a student, ensure the university ID is unique
        if (isStudent) {
            if (!universityId) {
                alert("University ID is required for students.");
                return;
            }

            if (users.some(user => user.universityId === universityId)) {
                alert("University ID already exists! Please enter a unique university ID.");
                return;
            }
        }

        // Create new user object
        const newUser = {
            username: username,
            password: password, // ⚠️ Never store passwords in plain text in real apps
            role: isStudent ? "Student" : "Admin",
            universityId: isStudent ? universityId : null
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Sign-up successful! Redirecting to Sign In page...");
        window.location.href = "Signin.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");

    signinForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const staySignedIn = document.getElementById("stay-signed-in").checked;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user with the entered credentials
        const storedUser = users.find(user => user.username === username && user.password === password);

        if (!storedUser) {
            alert("Invalid username or password. Please try again.");
            return;
        }

        alert(`Sign-in successful! Welcome, ${storedUser.role}.`);

        // Store session data
        const sessionData = { username: storedUser.username, role: storedUser.role };

        if (staySignedIn) {
            localStorage.setItem("session", JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem("session", JSON.stringify(sessionData));
        }

        // Redirect based on role
        window.location.href = "DashBoard.html";
    });
});

// Hide "Delete Project" button if user is a student
document.addEventListener("DOMContentLoaded", function () {
    const deleteProjectBtn = document.querySelector(".delete-project-btn");

    // Get session data from localStorage or sessionStorage
    const sessionData = JSON.parse(localStorage.getItem("session")) || JSON.parse(sessionStorage.getItem("session"));

    if (sessionData && sessionData.role === "Student") {
        deleteProjectBtn.style.display = "none";
    }
});

///////////////////////////////////// delete role project ///////////////////////





