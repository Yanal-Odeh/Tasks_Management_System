document.addEventListener("DOMContentLoaded", function () {
    const signinForm = document.getElementById("signin-form");

    signinForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const staySignedIn = document.getElementById("stay-signed-in").checked;

        // Retrieve users from local storage
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Find the user with the entered username and password
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
        if (storedUser.role === "Student") {
            window.location.href = "DashBoard.html"; // Redirect to student dashboard
        } else {
            window.location.href = "DashBoard.html"; // Redirect to admin dashboard
        }
    });
});
