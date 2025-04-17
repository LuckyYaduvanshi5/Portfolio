/**
 * Projects Page Display
 * Displays and filters all projects on the projects.html page
 */

// Declare displayProjects in the global scope
window.displayPageProjects = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get projects grid container
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error('Projects grid not found on projects page');
        return;
    }
    
    // Get filter buttons
    const filterButtons = document.querySelectorAll('[data-category]');
    
    // Add New Project button
    const addProjectButton = document.createElement('button');
    addProjectButton.className = 'fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition-colors';
    addProjectButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
    `;
    addProjectButton.title = 'Add New Project';
    addProjectButton.addEventListener('click', () => {
        if (window.showProjectForm) {
            window.showProjectForm();
        } else {
            alert('Project form functionality not available');
        }
    });
    document.body.appendChild(addProjectButton);
    
    // Store current active category
    let currentCategory = 'all';
    
    // Function to display projects based on filter
    function displayProjects(category = 'all') {
        // Update current category
        currentCategory = category;
        
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        console.log(`Displaying projects with filter: ${category}, found ${projects.length} total projects`);
        
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Filter projects based on category
        const filteredProjects = category === 'all' 
            ? projects 
            : projects.filter(project => {
                // Check if project tags include the selected category
                if (project.tags) {
                    return project.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()));
                }
                // Check if project category matches
                return project.category && project.category.toLowerCase() === category.toLowerCase();
            });
        
        console.log(`Filtered to ${filteredProjects.length} projects matching "${category}" category`);
        
        if (filteredProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500 text-lg">No projects found. Add your first project using the + button.</p>
                </div>
            `;
            return;
        }
        
        // Display projects
        filteredProjects.forEach(project => {
            const imageUrl = project.images && project.images.length > 0 
                ? project.images[0] 
                : 'https://via.placeholder.com/300x180?text=No+Image';
            
            // Create tags HTML
            const tagsHtml = project.tags ? project.tags.map(tag => {
                return `<span class="text-white text-xs px-3 py-1 rounded-full" style="background-color: ${
                    tag.toLowerCase().includes('ui/ux') ? '#FAAD1B' : '#344C36'
                };">${tag}</span>`;
            }).join('') : '';
            
            // Create project card
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md';
            projectCard.dataset.category = project.category || '';
            projectCard.id = project.id;
            
            projectCard.innerHTML = `
                <div class="relative overflow-hidden">
                    <img src="${imageUrl}" alt="${project.title}" class="w-full h-52 object-cover">
                    ${project.featured ? '<div class="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">Featured</div>' : ''}
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2 text-gray-800">${project.title}</h3>
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${tagsHtml}
                    </div>
                    <p class="text-gray-600 mb-4 line-clamp-2">${project.shortDescription || ''}</p>
                    <div class="flex justify-end">
                        <a href="#${project.id}" class="text-secondary flex items-center justify-end project-details-link">
                            <div class="h-10 w-10 rounded-full flex items-center justify-center" style="background-color: #344C36;">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            
            // Add to grid
            projectsGrid.appendChild(projectCard);
            
            // Add click event to project card itself to show details
            projectCard.addEventListener('click', function(e) {
                // Don't trigger for the details button
                if (!e.target.closest('.project-details-link')) {
                    if (window.showProjectDetails) {
                        window.showProjectDetails(project.id);
                        e.preventDefault();
                    }
                }
            });
            
            // Add click event to show more details to the details button
            const detailsLink = projectCard.querySelector('.project-details-link');
            detailsLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Show project details using modal
                if (window.showProjectDetails) {
                    window.showProjectDetails(project.id);
                } else {
                    // Fallback if modal not available
                    alert(`${project.title}\n\n${project.fullDescription || project.shortDescription}`);
                }
            });
        });
        
        // Set initial opacity for animation
        setTimeout(() => {
            const cards = projectsGrid.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 50);
    }
    
    // Expose function globally
    window.displayPageProjects = displayProjects;
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-200');
            });
            
            // Add active class to clicked button
            this.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-200');
            this.classList.add('bg-primary', 'text-white');
            
            // Get the selected category
            const selectedCategory = this.getAttribute('data-category');
            
            // Display filtered projects
            displayProjects(selectedCategory);
        });
    });
    
    // Listen for projects-updated event
    document.addEventListener('projects-updated', function() {
        console.log('Projects page received projects-updated event, redisplaying with filter:', currentCategory);
        // Re-display projects with the current filter
        displayProjects(currentCategory);
    });
    
    // Display all projects initially
    displayProjects();
    
    // Activate "All" filter button by default
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
        allButton.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-200');
        allButton.classList.add('bg-primary', 'text-white');
    }
    
    // Check if there's a hash in the URL for direct linking to a project
    if (window.location.hash) {
        const projectId = window.location.hash.substring(1);
        const project = JSON.parse(localStorage.getItem('projects') || '[]').find(p => p.id === projectId);
        
        if (project) {
            setTimeout(() => {
                const projectElement = document.getElementById(projectId);
                if (projectElement) {
                    projectElement.scrollIntoView({ behavior: 'smooth' });
                    projectElement.classList.add('highlight-project');
                    
                    // Remove highlight after animation
                    setTimeout(() => {
                        projectElement.classList.remove('highlight-project');
                    }, 2000);
                    
                    // Show project details
                    if (window.showProjectDetails) {
                        window.showProjectDetails(projectId);
                    }
                }
            }, 500);
        }
    }
}); 