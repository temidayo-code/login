document.getElementById("createBtn").addEventListener("click", function (e) {
  e.preventDefault();

  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const nationalId = document.getElementById("nationalId").value.trim();
  const terms = document.getElementById("terms").checked;

  // Validation patterns
  const nameRegex = /^[a-zA-Z\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10,}$/;
  const nationalIdRegex = /^[A-Z0-9]{7,10}$/; // Adjust based on your ID format

  // Validation messages
  let errors = [];

  // Full Name validation
  if (!fullName) {
    errors.push("Full Name is required");
  } else if (!nameRegex.test(fullName)) {
    errors.push(
      "Full Name should only contain letters and spaces (3-50 characters)"
    );
  }

  // Email validation
  if (!email) {
    errors.push("Email Address is required");
  } else if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }

  // Phone validation
  if (!phone) {
    errors.push("Phone Number is required");
  } else if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    errors.push("Please enter a valid 10-digit phone number");
  }

  // National ID validation
  if (!nationalId) {
    errors.push("National ID Number is required");
  } else if (!nationalIdRegex.test(nationalId.toUpperCase())) {
    errors.push("Please enter a valid National ID Number");
  }

  // Terms validation
  if (!terms) {
    errors.push("You must agree to the Terms and Conditions");
  }

  // Show errors if any
  if (errors.length > 0) {
    Swal.fire({
      title: "Validation Error",
      html: `
                <div class="error-details">
                    <span>Please correct the following errors:</span>
                    <ul style="text-align: left; margin-top: 10px;">
                        ${errors.map((error) => `<li>${error}</li>`).join("")}
                    </ul>
                </div>
            `,
      icon: "error",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "OK",
    });
    return;
  }

  // If validation passes, show processing state
  try {
    Swal.fire({
      title: "Processing",
      text: "Creating your Tax ID...",
      icon: "info",
      showCloseButton: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      willOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        // Show error message when manually closed
        Swal.fire({
          title: "Process Interrupted",
          text: "The Tax ID creation process was cancelled.",
          icon: "warning",
          footer: `<div class="error-details">
                        <span>Error Code: REG_001</span><br>
                        <span class="error-message">
                            The registration process was interrupted. You can:
                            <ul style="text-align: left; margin-top: 10px;">
                                <li>Try the registration process again</li>
                                <li>Contact support if you need assistance</li>
                                <li>Return to the login page</li>
                            </ul>
                        </span>
                    </div>`,
          confirmButtonColor: "#2563eb",
          confirmButtonText: "Try Again",
          showCancelButton: true,
          cancelButtonText: "Back to Login",
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = "index.html";
          }
        });
      },
    });
  } catch (error) {
    Swal.fire({
      title: "Registration Error",
      text: "An error occurred during the registration process.",
      icon: "error",
      footer: `<div class="error-details">
                <span>Error Code: REG_002</span><br>
                <span class="error-message">Please try again later or contact support.</span>
            </div>`,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Try Again",
      showCancelButton: true,
      cancelButtonText: "Back to Login",
    });
  }
});

// Optional: Format phone number as user types
document.getElementById("phone").addEventListener("input", function (e) {
  let x = e.target.value
    .replace(/\D/g, "")
    .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
  e.target.value = !x[2]
    ? x[1]
    : !x[3]
    ? `${x[1]}-${x[2]}`
    : `${x[1]}-${x[2]}-${x[3]}`;
});

// Optional: Convert National ID to uppercase as user types
document.getElementById("nationalId").addEventListener("input", function (e) {
  this.value = this.value.toUpperCase();
});
