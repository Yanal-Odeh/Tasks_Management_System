document.addEventListener("DOMContentLoaded", function () {
    ///////////////////////// Sidebar Navigation /////////////////////////
    const buttons = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".content-section");
    const sidebar = document.querySelector("aside");
    const menuToggle = document.querySelector(".menu-toggle");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            // Remove "active" class from all buttons and sections
            buttons.forEach(btn => btn.classList.remove("active"));
            sections.forEach(section => section.classList.remove("active"));

            // Add "active" class to the clicked button
            this.classList.add("active");

            // Show the matching section
            const sectionId = this.textContent.trim().toLowerCase() + "Content";
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add("active");
            }

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
            }
        });
    });

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

    document.addEventListener("click", function (event) {
        if (window.innerWidth <= 768 && sidebar.classList.contains("active")) {
            if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        }
    });

    window.addEventListener("resize", function () {
        sidebar.classList.toggle("active", window.innerWidth > 768);
    });

    ///////////////////////// Date & Time /////////////////////////
    function updateDateTime() {
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        }).replace(',', ''); // Removes comma after weekday

        const dateTimeEl = document.getElementById('datetime');
        if (dateTimeEl) dateTimeEl.textContent = formattedDate;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();

    ///////////////////////// User Session Handling /////////////////////////
    const userData = sessionStorage.getItem("session") || localStorage.getItem("session");
    if (!userData) {
        window.location.assign("../Signin.html");
        return;
    }

    const user = JSON.parse(userData);
    const isAdmin = user.role === "Admin";

    // Dynamic Dashboard Updates
    const projectCountEl = document.querySelector(".data-item:nth-child(1) p");
    const studentCountEl = document.querySelector(".data-item:nth-child(2)");
    const taskCountEl = document.querySelector(".data-item:nth-child(3) p");
    const finishedProjectCountEl = document.querySelector(".data-item:nth-child(4) p");

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const students = users.filter(user => user.role === "Student");
    const finishedProjects = projects.filter(project => project.status.toLowerCase() === "completed");

    if (isAdmin) {
        projectCountEl.textContent = projects.length;
        studentCountEl.style.display = "block";
        studentCountEl.querySelector("p").textContent = students.length;
        taskCountEl.textContent = tasks.length;
        finishedProjectCountEl.textContent = finishedProjects.length;
    } else {
        const studentProjects = projects.filter(project => project.students.includes(user.username));
        projectCountEl.textContent = studentProjects.length;
        studentCountEl.style.display = "none";
        taskCountEl.textContent = tasks.filter(task => task.assignedStudent === user.username).length;
        finishedProjectCountEl.textContent = studentProjects.filter(project => project.status.toLowerCase() === "completed").length;
    }

    ///////////////////////// Chart.js Visualization /////////////////////////
    const ctx = document.getElementById("myChart")?.getContext("2d");

    if (ctx) {
        let chartLabels, chartData;

        if (isAdmin) {
            chartLabels = ["Projects", "Students", "Tasks", "Completed Projects"];
            chartData = [projects.length, students.length, tasks.length, finishedProjects.length];
        } else {
            const studentProjects = projects.filter(project => project.students.includes(user.username));
            const studentTasks = tasks.filter(task => task.assignedStudent.toLowerCase() === user.username.toLowerCase());
            const studentFinishedProjects = studentProjects.filter(project => project.status.toLowerCase() === "completed");

            chartLabels = ["Projects", "Tasks", "Completed Projects"];
            chartData = [studentProjects.length, studentTasks.length, studentFinishedProjects.length];
        }

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: chartLabels,
                datasets: [{
                    label: "Count",
                    data: chartData,
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
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { labels: { color: "#ddd" } }
                }
            }
        });
    }
});


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










document.addEventListener("DOMContentLoaded", function () {
    ///////////////////////////////////// ✅ Task Modal Handling + Sorting //////////////////////////////////
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
        window.location.assign("../Signin.html");
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

        if (tasks.some(task => task.taskName.toLowerCase() === taskName.toLowerCase())) {
            alert("⚠️ A task with this name already exists.");
            return;
        }

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
        addTaskToTable(task);
        taskForm.reset();
        toggleModal(false);
    });

    sortSelect.addEventListener("change", function () {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const sortBy = this.value;
        tasks.sort((a, b) => {
            if (sortBy === "status") return statusPriority[a.status] - statusPriority[b.status];
            if (sortBy === "project") return a.project.localeCompare(b.project);
            if (sortBy === "due-date") return new Date(a.dueDate) - new Date(b.dueDate);
            if (sortBy === "assigned-student") return a.assignedStudent.localeCompare(b.assignedStudent);
        });
        refreshTable(tasks);
    });

    function refreshTable(tasks) {
        tableBody.innerHTML = "";
        tasks.forEach(addTaskToTable);
    }

    function addTaskToTable(task) {
        tableBody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${task.id}</td>
                <td>${task.project}</td>
                <td>${task.taskName}</td>
                <td>${task.description}</td>
                <td>${task.assignedStudent}</td>
                <td class="status ${task.status}">${task.status}</td>
                <td>${task.dueDate}</td>
            </tr>
        `);
    }

    function loadStudents() {
        assignedStudentSelect.innerHTML = '<option value="">Select a student</option>';
        const allUsers = JSON.parse(localStorage.getItem("users")) || [];

        (isAdmin ? allUsers.filter(u => u.role === "Student") : [{ username: user.username }])
            .forEach(student => {
                assignedStudentSelect.innerHTML += `<option value="${student.username}">${student.username}</option>`;
            });

        if (!isAdmin) assignedStudentSelect.disabled = true;
    }

    function loadProjects() {
        projectSelect.innerHTML = '<option value="">Select a project</option>';
        const allProjects = JSON.parse(localStorage.getItem("projects")) || [];
        (isAdmin ? allProjects : allProjects.filter(p => p.students.includes(user.username)))
            .forEach(project => {
                projectSelect.innerHTML += `<option value="${project.title}">${project.title}</option>`;
            });
    }

    ///////////////////////////////////// ✅ Night Mode Handling //////////////////////////////////
    const modeToggle = document.querySelector(".icon");
    modeToggle.addEventListener("click", () => {
        document.body.classList.toggle("night-mode");

        // Select and toggle multiple elements at once
        [
            "#tasksContent", ".tasks-table-container", ".tasks-header",
            "#sortTasks", ".new-task-btn", ".tasks-table",
            "header", "aside", "main", "#myChart"
        ].forEach(selector => {
            document.querySelector(selector)?.classList.toggle("light-background");
        });

        // Table elements
        document.querySelectorAll(".tasks-table th, .tasks-table td").forEach(el => {
            el.classList.toggle("dark-text");
        });

        // Status elements
        document.querySelectorAll(".status").forEach(el => {
            el.classList.toggle("dark-text");
        });

        // Additional UI elements
        [
            ".project-controls input", ".project-controls select",
            ".chat-part", ".message input"
        ].forEach(selector => {
            document.querySelector(selector)?.classList.toggle("teal-background");
        });

        // Modal inputs
        document.querySelectorAll(".modal input, .modal select, .modal textarea")
            .forEach(el => el.classList.toggle("light-background"));
    });

    ///////////////////////////////////// ✅ Dragging Task Modal //////////////////////////////////
    const taskModalHeader = modal.querySelector("h2");
    let isDragging = false, offsetX = 0, offsetY = 0;

    taskModalHeader.addEventListener("mousedown", (event) => {
        isDragging = true;
        offsetX = event.clientX - modal.offsetLeft;
        offsetY = event.clientY - modal.offsetTop;
        modal.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;
        modal.style.left = `${event.clientX - offsetX}px`;
        modal.style.top = `${event.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        modal.style.cursor = "default";
    });
});






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

