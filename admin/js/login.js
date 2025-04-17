document.addEventListener('DOMContentLoaded', function() {
    // Default password - in a real application, this would be securely stored
    const defaultPassword = 'Lucky123';
    
    // Check if user is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        window.location.href = 'panel.html';
    }
    
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        
        if (password === defaultPassword) {
            // Set login state in localStorage
            localStorage.setItem('adminLoggedIn', 'true');
            
            // Set a timestamp for the login session (expires in 24 hours)
            const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('loginExpiry', expiryTime);
            
            // Redirect to admin panel
            window.location.href = 'panel.html';
        } else {
            // Show error message
            loginMessage.textContent = 'Incorrect password. Please try again.';
            loginMessage.classList.add('error');
            
            // Clear the password field
            document.getElementById('password').value = '';
        }
    });
}); 