document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle with animation
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        // Smooth icon transition
        this.classList.add('fa-flip');
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
        
        setTimeout(() => {
            this.classList.remove('fa-flip');
        }, 300);
    });

    // Tax Payer ID validation with improved UX
    const taxpayerId = document.getElementById('taxpayerId');
    taxpayerId.addEventListener('input', function() {
        let value = this.value.toUpperCase();
        if (value && !value.startsWith('N-') && !value.startsWith('C-')) {
            if (value.startsWith('N') || value.startsWith('C')) {
                this.value = value.charAt(0) + '-' + value.substring(1);
            } else {
                this.value = 'N-' + value;
            }
        }
    });

    // Add loading state to login button
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Simulate API call
        setTimeout(() => {
            this.disabled = false;
            this.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
        }, 2000);
    });

    // Add hover effect to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.querySelector('.verify-btn').addEventListener('click', async function() {
        try {
            // Show loading state
            const loadingAlert = Swal.fire({
                title: 'Verifying...',
                text: 'Please wait while we verify the certificate',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate server error
            throw new Error('Unable to connect to verification server');

            // If successful (this won't run due to the error above)
            await loadingAlert;
            Swal.fire({
                title: 'Verification Complete',
                text: 'Tax Clearance Certificate has been verified successfully',
                icon: 'success'
            });

        } catch (error) {
            // Error handling
            Swal.fire({
                title: 'Verification Failed',
                text: 'We encountered an error while verifying the certificate. Please try again later.',
                icon: 'error',
                footer: `<div class="error-details">
                            <span>Error Code: SVR_001</span><br>
                            <span class="error-message">${error.message}</span>
                        </div>`,
                confirmButtonText: 'Try Again',
                showCancelButton: true,
                cancelButtonText: 'Close',
                customClass: {
                    container: 'error-popup'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // If user clicks "Try Again"
                    this.click(); // Trigger the verification process again
                }
            });
        }
    });
}); 