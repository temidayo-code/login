document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    if(e.keyCode == 123) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
}

document.getElementById('resetBtn').addEventListener('click', async function() {
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        Swal.fire({
            title: 'Error',
            text: 'Please enter your email address',
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

    try {
        const loadingAlert = Swal.fire({
            title: 'Processing',
            text: 'Verifying your email address...',
            icon: 'info',
            showCloseButton: true,
            showConfirmButton: false,
            allowOutsideClick: true,
            allowEscapeKey: true,
            willOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                Swal.fire({
                    title: 'Process Interrupted',
                    text: 'The password reset process was cancelled. No reset email has been sent.',
                    icon: 'warning',
                    footer: `<div class="error-details">
                        <span>Error Code: USR_002</span><br>
                        <span class="error-message">
                            The process was manually interrupted. You can:
                            <ul style="text-align: left; margin-top: 10px;">
                                <li>Try the password reset process again</li>
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
                        document.getElementById('email').value = '';
                    }
                });
            }
        });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('REQUEST_TIMEOUT'));
            }, 90000);
        });

        await timeoutPromise;

    } catch (error) {
        if (error.message === 'REQUEST_TIMEOUT') {
            Swal.fire({
                title: 'Request Timeout',
                text: 'The password reset process is taking longer than expected.',
                icon: 'error',
                footer: `<div class="error-details">
                    <span>Error Code: TIMEOUT_002</span><br>
                    <span class="error-message">
                        Our password reset service is experiencing delays. Please try:
                        <ul style="text-align: left; margin-top: 10px;">
                            <li>Checking your internet connection</li>
                            <li>Refreshing the page</li>
                            <li>Trying again in a few minutes</li>
                        </ul>
                    </span>
                </div>`,
                confirmButtonColor: '#2563eb',
                showCancelButton: true,
                confirmButtonText: 'Try Again',
                cancelButtonText: 'Back to Login'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.cancel) {
                    window.location.href = 'index.html';
                } else if (result.isConfirmed) {
                    document.getElementById('email').value = '';
                }
            });
        }
    }
}); 