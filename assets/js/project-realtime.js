/**
 * Project Real-time Updates
 * Ensures projects updates are synchronized between components
 */

document.addEventListener('DOMContentLoaded', function() {
    // Original localStorage methods
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    const originalClear = localStorage.clear;
    
    // Override localStorage.setItem
    localStorage.setItem = function(key, value) {
        // Call original implementation
        originalSetItem.apply(this, arguments);
        
        // If projects data changed, trigger update event
        if (key === 'projects') {
            console.log('Projects data changed in localStorage, triggering update event');
            const event = new CustomEvent('projects-updated');
            document.dispatchEvent(event);
        }
    };
    
    // Override localStorage.removeItem
    localStorage.removeItem = function(key) {
        // Call original implementation
        originalRemoveItem.apply(this, arguments);
        
        // If projects data removed, trigger update event
        if (key === 'projects') {
            const event = new CustomEvent('projects-updated');
            document.dispatchEvent(event);
        }
    };
    
    // Override localStorage.clear
    localStorage.clear = function() {
        // Call original implementation
        originalClear.apply(this, arguments);
        
        // Trigger update event for projects
        const event = new CustomEvent('projects-updated');
        document.dispatchEvent(event);
    };
    
    // Listen for changes to localStorage from other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'projects') {
            console.log('Projects data changed in another tab, triggering update event');
            const event = new CustomEvent('projects-updated');
            document.dispatchEvent(event);
        }
    });
    
    // Function to directly update UI components
    window.updateProjectsUI = function() {
        // Update home page projects if applicable
        if (typeof window.loadFeaturedProjects === 'function') {
            console.log('Calling loadFeaturedProjects directly');
            window.loadFeaturedProjects();
        }
        
        // Update projects page if applicable
        if (typeof window.displayPageProjects === 'function') {
            console.log('Calling displayPageProjects directly');
            window.displayPageProjects();
        }
        
        // Show success notification
        window.showProjectNotification('Projects updated');
    };
    
    // Global notification function
    window.showProjectNotification = function(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('projects-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'projects-notification';
            notification.className = 'fixed bottom-24 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform translate-y-10 opacity-0 transition-all duration-300';
            document.body.appendChild(notification);
        }
        
        // Set message
        notification.textContent = message;
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-y-10', 'opacity-0');
        }, 10);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-y-10', 'opacity-0');
        }, 3000);
    };
}); 