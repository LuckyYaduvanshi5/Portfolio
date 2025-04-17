/**
 * Project Modal Component
 * Creates a modal for displaying project details and project management
 */

class ProjectModal {
    constructor() {
        this.modalContainer = null;
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // Create modal container if it doesn't exist
        if (!this.modalContainer) {
            const modal = document.createElement('div');
            modal.id = 'project-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden';
            
            modal.innerHTML = `
                <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 class="text-2xl font-bold" id="modal-title">Project Details</h2>
                        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="p-6" id="modal-content">
                        <!-- Content will be dynamically inserted here -->
                    </div>
                    <div class="border-t p-6 flex justify-end gap-4" id="modal-actions">
                        <!-- Actions will be dynamically inserted here -->
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            this.modalContainer = modal;
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#close-modal')) {
                this.hideModal();
            }
            
            // Close when clicking outside modal content
            if (e.target === this.modalContainer) {
                this.hideModal();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }

    showProjectDetails(project) {
        // Get the modal elements
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        const modalActions = document.getElementById('modal-actions');
        
        // Set the modal title
        modalTitle.textContent = project.title;
        
        // Create the modal content
        const imageUrl = project.images && project.images.length > 0 
            ? project.images[0] 
            : 'https://via.placeholder.com/600x400?text=No+Image';
            
        let tagsHtml = '';
        if (project.tags && project.tags.length > 0) {
            tagsHtml = `
                <div class="flex flex-wrap gap-2 mb-4">
                    ${project.tags.map(tag => `
                        <span class="text-white text-xs px-3 py-1 rounded-full" style="background-color: ${
                            tag.toLowerCase().includes('ui/ux') ? '#FAAD1B' : '#344C36'
                        };">${tag}</span>
                    `).join('')}
                </div>
            `;
        }
        
        modalContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <img src="${imageUrl}" alt="${project.title}" class="w-full rounded-lg h-64 object-cover">
                </div>
                <div>
                    ${tagsHtml}
                    <h3 class="text-lg font-semibold mb-2">Description</h3>
                    <p class="text-gray-700 mb-4">${project.fullDescription || project.shortDescription}</p>
                    <div class="flex items-center">
                        <span class="mr-2 text-gray-600">Featured:</span>
                        <span class="px-2 py-1 rounded text-xs ${project.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${project.featured ? 'Yes' : 'No'}
                        </span>
                    </div>
                </div>
            </div>
        `;
        
        // Set up modal actions
        modalActions.innerHTML = `
            <button id="toggle-featured" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                ${project.featured ? 'Remove from Featured' : 'Mark as Featured'}
            </button>
            <button id="delete-project" class="px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-300 hover:bg-red-100">
                Delete Project
            </button>
            <button id="close-details" class="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700">
                Close
            </button>
        `;
        
        // Bind action events
        document.getElementById('toggle-featured').addEventListener('click', () => {
            this.toggleFeatured(project.id);
            this.hideModal();
        });
        
        document.getElementById('delete-project').addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                this.deleteProject(project.id);
                this.hideModal();
            }
        });
        
        document.getElementById('close-details').addEventListener('click', () => {
            this.hideModal();
        });
        
        // Show the modal
        this.showModal();
    }
    
    toggleFeatured(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectIndex = projects.findIndex(p => p.id === projectId);
        
        if (projectIndex !== -1) {
            // Toggle featured status
            projects[projectIndex].featured = !projects[projectIndex].featured;
            const isFeatured = projects[projectIndex].featured;
            
            // Save to localStorage
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Enforce featured limit (max 6)
            if (isFeatured) {
                const featuredProjects = projects.filter(p => p.featured);
                if (featuredProjects.length > 6) {
                    // Find the oldest featured project (excluding the one we just featured)
                    const oldestFeatured = featuredProjects
                        .filter(p => p.id !== projectId)
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id))[0];
                    
                    if (oldestFeatured) {
                        // Unfeatured the oldest
                        const oldestIndex = projects.findIndex(p => p.id === oldestFeatured.id);
                        if (oldestIndex !== -1) {
                            projects[oldestIndex].featured = false;
                            // Save again
                            localStorage.setItem('projects', JSON.stringify(projects));
                            this.showNotification(`Limited featured projects to 6. "${oldestFeatured.title}" was unfeatured.`);
                        }
                    }
                }
            }
            
            // Directly update UI without event
            if (window.loadFeaturedProjects) {
                window.loadFeaturedProjects();
            }
            if (window.displayPageProjects) {
                window.displayPageProjects();
            }
            
            // Show appropriate notification
            this.showNotification(isFeatured ? 'Project marked as featured' : 'Project removed from featured');
        }
    }
    
    deleteProject(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const updatedProjects = projects.filter(p => p.id !== projectId);
        
        // Save to localStorage
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
        
        // Refresh the UI
        this.refreshProjectsUI();
    }
    
    refreshProjectsUI() {
        // Dispatch a custom event to signal projects data has changed
        const event = new CustomEvent('projects-updated');
        document.dispatchEvent(event);
        
        // Also directly update if we're on the home page and the home projects display is available
        if (typeof loadFeaturedProjects === 'function') {
            loadFeaturedProjects();
        }
        
        // Show success notification
        this.showNotification('Project updated successfully');
    }
    
    showNotification(message) {
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
    }

    showModal() {
        this.modalContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    hideModal() {
        this.modalContainer.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Create a global instance of the modal
window.projectModal = new ProjectModal();

// Function to show project details globally
window.showProjectDetails = function(projectId) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const project = projects.find(p => p.id === projectId);
    
    if (project) {
        window.projectModal.showProjectDetails(project);
    } else {
        console.error('Project not found:', projectId);
    }
}; 