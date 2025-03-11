document.addEventListener("DOMContentLoaded", function () {
    const studentCheckbox = document.getElementById("student");
    const universityIdGroup = document.getElementById("university-id-group");
    const signupForm = document.getElementById("signup-form");

    // Show or hide university ID field based on checkbox state
    studentCheckbox.addEventListener("change", function () {
        universityIdGroup.style.display = studentCheckbox.checked ? "block" : "none";
    });

    // Handle form submission
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const isStudent = studentCheckbox.checked;
        const universityId = document.getElementById("university-id").value.trim();

        // Retrieve existing users or initialize an empty array
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if username already exists
        const existingUser = users.find(user => user.username.toLowerCase() === username.toLowerCase());
        if (existingUser) {
            alert("Username already exists! Please choose a different username.");
            return;
        }

        // If the user is a student, ensure the university ID is unique
        if (isStudent) {
            const existingUniId = users.find(user => user.universityId === universityId);
            if (existingUniId) {
                alert("University ID already exists! Please enter a unique university ID.");
                return;
            }

            if (!universityId) {
                alert("University ID is required for students.");
                return;
            }
        }

        // Create new user object
        const newUser = {
            username: username,
            password: password, // ⚠️ Storing plain text passwords is not secure in real applications
            role: isStudent ? "Student" : "Admin",
            universityId: isStudent ? universityId : null
        };

        // Add the new user to the users array
        users.push(newUser);

        // Save updated users list to local storage
        localStorage.setItem("users", JSON.stringify(users));

        alert("Sign-up successful! User data saved.");
        signupForm.reset();
        universityIdGroup.style.display = "none"; // Hide university ID field after submission
    });
});
