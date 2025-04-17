/**
 * Home Projects Display
 * Displays featured projects on the homepage
 */

// Declare loadFeaturedProjects in the global scope
window.loadFeaturedProjects = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get projects grid container - update selector to match index.html
    const projectsGrid = document.querySelector('#projects .grid.grid-cols-1.md\\:grid-cols-2');
    
    if (!projectsGrid) {
        console.error('Projects grid not found on home page');
        return;
    }
    
    // Function to load and display featured projects
    function loadFeaturedProjects() {
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        // Filter featured projects
        const featuredProjects = projects.filter(project => project.featured);
        
        // If we have featured projects, display them
        if (featuredProjects.length > 0) {
            // Clear existing content
            projectsGrid.innerHTML = '';
            
            // Display up to 6 featured projects (changed from 4)
            const projectsToShow = featuredProjects.slice(0, 6);
            
            projectsToShow.forEach(project => {
                const imageUrl = project.images && project.images.length > 0 
                    ? project.images[0] 
                    : 'https://via.placeholder.com/600x400?text=No+Image';
                
                // Create tags HTML
                const tagsHtml = project.tags.map(tag => {
                    return `<span class="text-white text-xs px-3 py-1 rounded-full" style="background-color: ${
                        tag.toLowerCase().includes('ui/ux') ? '#FAAD1B' : '#344C36'
                    };">${tag}</span>`;
                }).join('');
                
                // Create project card
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md';
                projectCard.dataset.id = project.id;
                projectCard.innerHTML = `
                    <div class="relative overflow-hidden rounded-t-lg">
                        <img src="${imageUrl}" alt="${project.title}" class="w-full h-48 object-cover">
                    </div>
                    <div class="p-6 bg-white rounded-b-lg">
                        <h3 class="text-xl font-bold mb-2 text-gray-800">${project.title}</h3>
                        <div class="flex flex-wrap gap-2 mb-3">
                            ${tagsHtml}
                        </div>
                        <p class="text-gray-600 mb-4 line-clamp-2">${project.shortDescription || ''}</p>
                        <a href="projects.html#${project.id}" class="text-secondary font-semibold flex items-center mt-2 hover:text-primary transition-colors">
                            View Details
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    </div>
                `;
                
                // Add click event to show details when clicking on the card
                projectCard.addEventListener('click', (e) => {
                    // Don't trigger when clicking the "View" button
                    if (!e.target.closest('a')) {
                        if (window.showProjectDetails) {
                            window.showProjectDetails(project.id);
                            e.preventDefault();
                        }
                    }
                });
                
                // Add to grid
                projectsGrid.appendChild(projectCard);
                
                // Set opacity for animation
                setTimeout(() => {
                    projectCard.style.opacity = '1';
                    projectCard.style.transform = 'translateY(0)';
                }, 50);
            });
        } else {
            // No featured projects found
            projectsGrid.innerHTML = `
                <div class="col-span-2 text-center py-12">
                    <p class="text-gray-500 text-lg">No featured projects found.</p>
                    <a href="projects.html" class="inline-block mt-4 px-6 py-2 rounded-full bg-primary text-white hover:bg-opacity-90 transition-colors">View All Projects</a>
                </div>
            `;
        }
    }
    
    // Expose the function globally so it can be called from other scripts
    window.loadFeaturedProjects = loadFeaturedProjects;
    
    // Initial load
    loadFeaturedProjects();
    
    // Listen for projects-updated event
    document.addEventListener('projects-updated', function() {
        console.log('Home page received projects-updated event');
        loadFeaturedProjects();
    });
    
    // Add project management button if on index page
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        const addProjectButton = document.createElement('button');
        addProjectButton.className = 'fixed bottom-6 right-6 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition-colors';
        addProjectButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
        `;
        addProjectButton.title = 'Manage Projects';
        addProjectButton.addEventListener('click', () => {
            if (window.showProjectForm) {
                window.showProjectForm();
            } else {
                window.location.href = 'projects.html';
            }
        });
        document.body.appendChild(addProjectButton);
    }
}); 