/**
 * Project Form Component
 * Provides UI for adding new projects
 */

class ProjectForm {
    constructor() {
        this.formContainer = null;
        this.createForm();
        this.bindEvents();
    }

    createForm() {
        // Create form container if it doesn't exist
        if (!this.formContainer) {
            const form = document.createElement('div');
            form.id = 'project-form-modal';
            form.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center hidden';
            
            form.innerHTML = `
                <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h2 class="text-2xl font-bold">Add New Project</h2>
                        <button id="close-form" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <form id="add-project-form" class="p-6">
                        <div class="mb-4">
                            <label for="project-title" class="block text-gray-700 font-medium mb-2">Project Title*</label>
                            <input type="text" id="project-title" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                        
                        <div class="mb-4">
                            <label for="project-short-desc" class="block text-gray-700 font-medium mb-2">Short Description*</label>
                            <textarea id="project-short-desc" required rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="project-full-desc" class="block text-gray-700 font-medium mb-2">Full Description*</label>
                            <textarea id="project-full-desc" required rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                        </div>
                        
                        <div class="mb-4">
                            <label for="project-category" class="block text-gray-700 font-medium mb-2">Category*</label>
                            <select id="project-category" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value="" disabled selected>Select a category</option>
                                <option value="tools">Tools</option>
                                <option value="clients">Clients</option>
                                <option value="games">Games</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <label for="project-tags" class="block text-gray-700 font-medium mb-2">Tags* (comma-separated)</label>
                            <input type="text" id="project-tags" required placeholder="Web App, JavaScript, UI/UX Design" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <p class="text-xs text-gray-500 mt-1">e.g., "UI/UX Design, Web App, React"</p>
                        </div>
                        
                        <div class="mb-4">
                            <label for="project-image-url" class="block text-gray-700 font-medium mb-2">Image URL*</label>
                            <input type="text" id="project-image-url" required placeholder="assets/img/projects/your-image.png" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <p class="text-xs text-gray-500 mt-1">Existing images: blogpromptGenrator.png, reelscounter.png, dailynotes.png, codai-pro.png, etc.</p>
                        </div>
                        
                        <div class="mb-6 flex items-center">
                            <input type="checkbox" id="project-featured" class="mr-2">
                            <label for="project-featured" class="text-gray-700">Mark as Featured</label>
                        </div>
                        
                        <div class="flex justify-end gap-3">
                            <button type="button" id="cancel-form" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button type="submit" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">Save Project</button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(form);
            this.formContainer = form;
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#close-form')) {
                this.hideForm();
            }
            
            if (e.target.closest('#cancel-form')) {
                this.hideForm();
            }
            
            // Close when clicking outside form content
            if (e.target === this.formContainer) {
                this.hideForm();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.formContainer.classList.contains('hidden')) {
                this.hideForm();
            }
        });
        
        // Form submission
        document.getElementById('add-project-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProject();
        });
    }
    
    saveProject() {
        // Get form data
        const title = document.getElementById('project-title').value;
        const shortDescription = document.getElementById('project-short-desc').value;
        const fullDescription = document.getElementById('project-full-desc').value;
        const category = document.getElementById('project-category').value;
        const tagsString = document.getElementById('project-tags').value;
        const imageUrl = document.getElementById('project-image-url').value;
        const featured = document.getElementById('project-featured').checked;
        
        // Process tags
        const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // Create project object
        const project = {
            id: this.getNextProjectId(),
            title,
            shortDescription,
            fullDescription,
            category,
            tags,
            images: [imageUrl],
            featured
        };
        
        // Get existing projects
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        // Add new project
        projects.push(project);
        
        // Save to localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Reset form
        document.getElementById('add-project-form').reset();
        
        // Hide form
        this.hideForm();
        
        // Refresh projects UI
        this.refreshProjectsUI();
    }
    
    getNextProjectId() {
        // Get current ID counter
        let counter = parseInt(localStorage.getItem('projectIdCounter') || '1');
        
        // Increment counter
        counter++;
        
        // Save updated counter
        localStorage.setItem('projectIdCounter', counter.toString());
        
        // Return ID as string
        return (counter - 1).toString();
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
        this.showNotification('Project added successfully');
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

    showForm() {
        this.formContainer.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    hideForm() {
        this.formContainer.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Create a global instance of the form
window.projectForm = new ProjectForm();

// Function to show project form globally
window.showProjectForm = function() {
    window.projectForm.showForm();
}; 