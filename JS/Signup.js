document.getElementById('student').addEventListener('change', function() {
    const universityIdGroup = document.getElementById('university-id-group');
    if (this.checked) {
        universityIdGroup.style.display = 'block';
    } else {
        universityIdGroup.style.display = 'none';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Fetch users from localStorage or initialize as an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Select the sign-up form
    const signUpForm = document.querySelector("#signup-form");
  
    // Handle form submission
    signUpForm.addEventListener("submit", (event) => {
  
      event.preventDefault();
  
      // Get values from input fields
      const fullName = document.getElementById("fullname").value.trim();
      const userName = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
  
      // Validate input fields
      if (!fullName || !userName || !password) {
        alert("All fields are required!");
        return;
      }
  
      // Create new user object
      const newUser = {
        userName: userName,
        userFullName: fullName,
        userPassword: password,
        userImage: "../imgs/user.png", // Default user image
      };
  
      // Push new user to users array
      users.push(newUser);
  
      // Update localStorage
      localStorage.setItem("users", JSON.stringify(users));
  
      // Redirect to user login page
      window.location.assign("../HTML/userLogin.html");
    });
  });