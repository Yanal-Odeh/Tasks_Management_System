document.addEventListener("DOMContentLoaded", () => {
  // Fetch users from localStorage or initialize as an empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Select the sign-up form and input fields
  const signUpForm = document.getElementById("signup-form");
  const userNameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const studentCheckbox = document.getElementById("student");
  const universityIdGroup = document.getElementById("university-id-group");
  const universityIdInput = document.getElementById("university-id");

  // Toggle University ID field based on student checkbox
  studentCheckbox.addEventListener("change", () => {
      universityIdGroup.style.display = studentCheckbox.checked ? "block" : "none";
  });

  // Handle form submission
  signUpForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get values from input fields
      const userName = userNameInput.value.trim();
      const password = passwordInput.value.trim();
      const isStudent = studentCheckbox.checked;
      const universityId = isStudent ? universityIdInput.value.trim() : null;

      // Validate input fields
      if (!userName || !password || (isStudent && !universityId)) {
          showError("All required fields must be filled out.");
          return;
      }

      // Check if username already exists
      const userExists = users.some(user => user.userName === userName);
      if (userExists) {
          showError("Username already exists. Choose a different one.");
          return;
      }

      // Hash the password using bcrypt.js
      const hashedPassword = await hashPassword(password);

      // Create new user object
      const newUser = {
          userName: userName,
          userPassword: hashedPassword, // Hashed password
          isStudent: isStudent,
          universityId: universityId || null, // Store university ID if applicable
      };

      // Save the new user to localStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Redirect to login page
      window.location.assign("../HTML/userLogin.html");
  });

  // Function to hash password using bcrypt.js
  async function hashPassword(password) {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
  }

  // Function to show error messages
  function showError(message) {
      alert(message); // Can be improved to display errors dynamically in UI
  }
});
