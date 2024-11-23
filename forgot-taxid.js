document.getElementById('recoverBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;  // Assumes 10-digit phone number

    if (!email || !phone) {
        Swal.fire({
            title: 'Error',
            text: 'Please fill in all fields',
            icon: 'error',
            confirmButtonColor: '#2563eb'
        });
        return;
    }
    
    if (!emailRegex.test(email)) {
        Swal.fire({
            title: 'Invalid Email',
            text: 'Please enter a valid email address',
            icon: 'error',
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        Swal.fire({
            title: 'Invalid Phone Number',
            text: 'Please enter a valid 10-digit phone number',
            icon: 'error',
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    try {
        // Show loading state with close button
        const loadingAlert = Swal.fire({
            title: 'Processing',
            text: 'Verifying your information...',
            icon: 'info',
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
                    title: 'Process Interrupted',
                    text: 'The verification process was cancelled. Your information has not been verified.',
                    icon: 'warning',
                    footer: `<div class="error-details">
                        <span>Error Code: USR_001</span><br>
                        <span class="error-message">
                            The process was manually interrupted. You can:
                            <ul style="text-align: left; margin-top: 10px;">
                                <li>Try the verification process again</li>
                                <li>Contact support if you need assistance</li>
                                <li>Return to the login page</li>
                            </ul>
                        </span>
                    </div>`,
                    confirmButtonColor: '#2563eb',
                    confirmButtonText: 'Try Again',
                    showCancelButton: true,
                    cancelButtonText: 'Back to Login'
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        window.location.href = 'index.html';
                    } else if (result.isConfirmed) {
                        // Clear the form for a new attempt
                        document.getElementById('email').value = '';
                        document.getElementById('phone').value = '';
                    }
                });
            }
        });

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('REQUEST_TIMEOUT'));
            }, 90000); // 90 seconds
        });

        // Wait for timeout
        await timeoutPromise;

    } catch (error) {
        if (error.message === 'REQUEST_TIMEOUT') {
            Swal.fire({
                title: 'Request Timeout',
                text: 'The verification process is taking longer than expected.',
                icon: 'error',
                footer: `<div class="error-details">
                    <span>Error Code: TIMEOUT_001</span><br>
                    <span class="error-message">
                        Our servers are experiencing high traffic. Please try:
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Checking your internet connection</li>
                            <li>Refreshing the page</li>
                            <li>Trying again in a few minutes</li>
                        </ul>
                    </span>
                </div>`,
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Try Again',
                showCancelButton: true,
                cancelButtonText: 'Back to Login'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = 'index.html';
                }
            });
        } else {
            // Error scenarios
            const errorMessages = [
                {
                    title: 'Verification Failed',
                    text: 'Unable to verify your information. Please check your details and try again.',
                    code: 'VRF_001'
                },
                {
                    title: 'Service Unavailable',
                    text: 'The Tax ID recovery service is temporarily unavailable.',
                    code: 'SVR_002'
                },
                {
                    title: 'Account Not Found',
                    text: 'No account found with the provided email and phone number.',
                    code: 'ACC_001'
                }
            ];

            // Pick a random error message
            const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];

            Swal.fire({
                title: randomError.title,
                text: randomError.text,
                icon: 'error',
                footer: `<div class="error-details">
                            <span>Error Code: ${randomError.code}</span><br>
                            <span class="error-message">Technical Details: ${error.message}</span>
                        </div>`,
                confirmButtonColor: '#2563eb',
                showCancelButton: true,
                confirmButtonText: 'Try Again',
                cancelButtonText: 'Back to Login'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = 'index.html';
                }
            });
        }
    }
});

// Optional: Format phone number as user types
document.getElementById('phone').addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : !x[3] ? `${x[1]}-${x[2]}` : `${x[1]}-${x[2]}-${x[3]}`;
}); 