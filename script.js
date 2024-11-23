document.addEventListener("DOMContentLoaded", function () {
  // Password visibility toggle with animation
  const togglePassword = document.getElementById("togglePassword");
  const password = document.getElementById("password");

  togglePassword.addEventListener("click", function () {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // Smooth icon transition
    this.classList.add("fa-flip");
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");

    setTimeout(() => {
      this.classList.remove("fa-flip");
    }, 300);
  });

  // Tax Payer ID validation with improved UX
  // const taxpayerId = document.getElementById('taxpayerId');
  // taxpayerId.addEventListener('input', function() {
  //     let value = this.value.toUpperCase();
  //     if (value && !value.startsWith('N-') && !value.startsWith('C-')) {
  //         this.value = 'N-' + value;
  //     }
  // });

  // Add loading state to login button
  const loginBtn = document.querySelector(".login-btn");
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Get input values
    const taxPayerValue = taxpayerId.value.trim().toUpperCase();
    const passwordValue = password.value.trim();

    // Check if fields are empty
    if (!taxPayerValue || !passwordValue) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill in all required fields",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    // Validate credentials
    if (taxPayerValue === "PENELOPE2024" && passwordValue === "Citizen") {
      // Show success message
      Swal.fire({
        title: "Login Successful",
        text: "Welcome back, IDA!",
        icon: "success",
        confirmButtonColor: "#2563eb",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      // Show error message
      let errorMessage = "";

      if (taxPayerValue !== "PENELOPE2024" && passwordValue !== "Citizen") {
        errorMessage = "Invalid Tax Payer ID and Password";
      } else if (taxPayerValue !== "PENELOPE2024") {
        errorMessage = "Invalid Tax Payer ID";
      } else {
        errorMessage = "Invalid Password";
      }

      Swal.fire({
        title: "Login Failed",
        text: errorMessage,
        icon: "error",
        footer: `<div class="error-details">
                            <span>Error Code: AUTH_001</span><br>
                            <span class="error-message">Please check your credentials and try again</span>
                        </div>`,
        confirmButtonColor: "#2563eb",
        showCancelButton: true,
        confirmButtonText: "Try Again",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the password field
          password.value = "";
          password.focus();
        }
      });
    }
  });

  // Optional: Add Enter key support
  password.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      loginBtn.click();
    }
  });

  // Add hover effect to all buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mouseover", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseout", function () {
      this.style.transform = "translateY(0)";
    });
  });

  document
    .querySelector(".verify-btn")
    .addEventListener("click", async function () {
      try {
        // Show loading state
        const loadingAlert = Swal.fire({
          title: "Verifying...",
          text: "Please wait while we verify the certificate",
          icon: "info",
          allowOutsideClick: false,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });

        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate server error
        throw new Error("Unable to connect to verification server");

        // If successful (this won't run due to the error above)
        await loadingAlert;
        Swal.fire({
          title: "Verification Complete",
          text: "Tax Clearance Certificate has been verified successfully",
          icon: "success",
        });
      } catch (error) {
        // Error handling
        Swal.fire({
          title: "Verification Failed",
          text: "We encountered an error while verifying the certificate. Please try again later.",
          icon: "error",
          footer: `<div class="error-details">
                            <span>Error Code: SVR_001</span><br>
                            <span class="error-message">${error.message}</span>
                        </div>`,
          confirmButtonText: "Try Again",
          showCancelButton: true,
          cancelButtonText: "Close",
          customClass: {
            container: "error-popup",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // If user clicks "Try Again"
            this.click(); // Trigger the verification process again
          }
        });
      }
    });
});
