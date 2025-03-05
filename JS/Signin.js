document.addEventListener("DOMContentLoaded", () => {
    // Hardcoded admin credentials (for security, consider hashing passwords)
    const admins = [
        { userName: "admin1", password: "AdminPass123" },
        { userName: "admin2", password: "SecurePass456" },
        {userName: "Ali", password: "1234"}
    ];

    // Select the sign-in form and input fields
    const adminSignInForm = document.getElementById("signin-form");
    const adminUserNameInput = document.getElementById("username");
    const adminPasswordInput = document.getElementById("password");
    const staySignedInCheckbox = document.getElementById("stay-signed-in");

    // Handle form submission
    adminSignInForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get input values
        const userName = adminUserNameInput.value.trim();
        const password = adminPasswordInput.value.trim();

        // Validate input fields
        if (!userName || !password) {
            showError("Please enter both username and password.");
            return;
        }

        // Check if the provided credentials match an admin
        const admin = admins.find(admin => admin.userName === userName && admin.password === password);
        if (!admin) {
            showError("Invalid username or password.");
            return;
        }

        // Store admin login session
        if (staySignedInCheckbox.checked) {
            localStorage.setItem("currentAdmin", JSON.stringify(admin)); // Persistent login
        } else {
            sessionStorage.setItem("currentAdmin", JSON.stringify(admin)); // Session-only login
        }

        // Redirect to the admin dashboard
        window.location.assign("../DashBoard.html"); // Change this to your actual admin dashboard page
    });

    // Function to show error messages dynamically
    function showError(message) {
        alert(message); // Can be replaced with a UI error message display
    }
});
