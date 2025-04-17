/**
 * Theme Switcher JavaScript
 * Handles dark/light theme switching and persistent theme preferences
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('portfolioAdminTheme');
    
    // Apply saved theme or default to light
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        
        // Update toggle switch state
        if (savedTheme === 'dark') {
            themeToggle.checked = true;
        }
    }
    
    // Listen for toggle changes
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Switch to dark theme
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolioAdminTheme', 'dark');
            
            // Add smooth transition animation
            animateThemeChange('light', 'dark');
        } else {
            // Switch to light theme
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('portfolioAdminTheme', 'light');
            
            // Add smooth transition animation
            animateThemeChange('dark', 'light');
        }
    });
    
    /**
     * Animate the theme change with a subtle transition effect
     * @param {string} fromTheme - The theme we're switching from
     * @param {string} toTheme - The theme we're switching to
     */
    function animateThemeChange(fromTheme, toTheme) {
        // Create a temporary overlay for transition effect
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = toTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        // Add overlay to body
        document.body.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => {
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }, 200);
        }, 10);
    }
    
    // Function to check if user prefers dark mode in their OS
    function checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
            localStorage.setItem('portfolioAdminTheme', 'dark');
        }
    }
    
    // Only check system preference if no theme is saved
    if (!savedTheme) {
        checkSystemPreference();
    }
    
    // Watch for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('portfolioAdminTheme')) {
                if (e.matches) {
                    htmlElement.setAttribute('data-theme', 'dark');
                    themeToggle.checked = true;
                } else {
                    htmlElement.setAttribute('data-theme', 'light');
                    themeToggle.checked = false;
                }
            }
        });
    }
}); 