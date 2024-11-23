document.addEventListener("DOMContentLoaded", function () {
  // Hide preloader after content is loaded
  setTimeout(function () {
    const preloader = document.querySelector(".preloader");
    preloader.classList.add("fade-out");

    // Remove preloader from DOM after fade out
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 5000); // Changed to 5000ms (5 seconds)
});

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
  loginBtn.addEventListener("click", async function () {
    const taxpayerId = document.getElementById("taxpayerId").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!taxpayerId || !password) {
      Swal.fire({
        title: "Error",
        text: "Please enter both Tax Payer ID and Password",
        icon: "error",
        confirmButtonColor: "#024d41",
      });
      return;
    }

    try {
      const loadingAlert = Swal.fire({
        title: "Logging in",
        text: "Please wait...",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check for the three specific formats
      const validTaxpayerIds = ['penelope2024', 'PENELOPE2024', 'Penelope2024'];
      if (validTaxpayerIds.includes(taxpayerId) && password === "Citizen") {
        await Swal.fire({
          title: "Success",
          text: "Login successful!",
          icon: "success",
          confirmButtonColor: "#024d41",
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect to resume-alt.html
        window.location.href = "resume-alt.html";
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Invalid Tax Payer ID or Password",
        icon: "error",
        confirmButtonColor: "#024d41",
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
