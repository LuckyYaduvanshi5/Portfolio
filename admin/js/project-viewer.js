document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const featuredProjectsContainer = document.getElementById('featured-projects');
    const allProjectsContainer = document.getElementById('all-projects');
    const projectCategoryFilter = document.getElementById('project-category-filter');
    const projectTagFilter = document.getElementById('project-tag-filter');
    const projectSearch = document.getElementById('project-search');
    
    // Certification container
    const certificationsContainer = document.getElementById('certifications');
    
    // Load projects on page load
    loadProjects();
    
    // Load certifications if container exists
    if (certificationsContainer) {
        loadCertifications();
    }
    
    // Event listeners for filters if they exist
    if (projectCategoryFilter) {
        projectCategoryFilter.addEventListener('change', filterProjects);
    }
    
    if (projectTagFilter) {
        projectTagFilter.addEventListener('change', filterProjects);
    }
    
    if (projectSearch) {
        projectSearch.addEventListener('input', filterProjects);
    }
    
    // Functions
    function loadProjects(filterCategory = 'all', filterTag = 'all', searchTerm = '') {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        // Sort projects: featured first, then by createdAt date (newest first)
        const sortedProjects = projects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // Filter projects
        let filteredProjects = sortedProjects;
        
        if (filterCategory !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.category === filterCategory);
        }
        
        if (filterTag !== 'all') {
            filteredProjects = filteredProjects.filter(project => {
                const projectTags = project.tags.map(tag => tag.toLowerCase());
                return projectTags.includes(filterTag.toLowerCase());
            });
        }
        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredProjects = filteredProjects.filter(project => 
                project.title.toLowerCase().includes(searchLower) || 
                project.shortDescription.toLowerCase().includes(searchLower) ||
                project.fullDescription.toLowerCase().includes(searchLower)
            );
        }
        
        // Separate featured projects
        const featuredProjects = filteredProjects.filter(project => project.featured);
        
        // Display featured projects if container exists
        if (featuredProjectsContainer) {
            displayFeaturedProjects(featuredProjects);
        }
        
        // Display all projects if container exists
        if (allProjectsContainer) {
            displayAllProjects(filteredProjects);
        }
        
        // Update filter options
        updateFilterOptions(projects);
    }
    
    function displayFeaturedProjects(projects) {
        // Clear container
        featuredProjectsContainer.innerHTML = '';
        
        if (projects.length === 0) {
            featuredProjectsContainer.innerHTML = '<p class="no-projects">No featured projects found.</p>';
            return;
        }
        
        // Create project cards for featured projects
        projects.forEach(project => {
            const projectCard = createProjectCard(project, true);
            featuredProjectsContainer.appendChild(projectCard);
        });
    }
    
    function displayAllProjects(projects) {
        // Clear container
        allProjectsContainer.innerHTML = '';
        
        if (projects.length === 0) {
            allProjectsContainer.innerHTML = '<p class="no-projects">No projects found.</p>';
            return;
        }
        
        // Create project cards for all projects
        projects.forEach(project => {
            const projectCard = createProjectCard(project, false);
            allProjectsContainer.appendChild(projectCard);
        });
    }
    
    function createProjectCard(project, isFeatured) {
        const card = document.createElement('div');
        card.className = 'project-card';
        if (isFeatured) {
            card.classList.add('featured-project');
        }
        
        const imageUrl = project.images.length > 0 ? project.images[0] : 'https://via.placeholder.com/300x200?text=No+Image';
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title}" loading="lazy">
                ${project.featured && !isFeatured ? '<div class="project-featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-details">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-category">${project.category.charAt(0).toUpperCase() + project.category.slice(1)}</div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-description">${project.shortDescription}</p>
                <button class="view-project-btn" data-id="${project.id}">View Details</button>
            </div>
        `;
        
        // Add event listener to view button
        const viewBtn = card.querySelector('.view-project-btn');
        viewBtn.addEventListener('click', () => showProjectModal(project.id));
        
        return card;
    }
    
    function showProjectModal(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (!project) return;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('project-view-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'project-view-modal';
            modal.className = 'project-modal';
            document.body.appendChild(modal);
        }
        
        // Set modal content
        modal.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <h3>${project.title}</h3>
                    <button class="close-modal-btn">&times;</button>
                </div>
                <div class="project-modal-body">
                    <div class="project-modal-images">
                        ${project.images.map(imageUrl => `
                            <div class="project-modal-image">
                                <img src="${imageUrl}" alt="${project.title}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                    <div class="project-modal-info">
                        <div class="project-modal-tags">
                            <span class="project-modal-category">${project.category.charAt(0).toUpperCase() + project.category.slice(1)}</span>
                            ${project.tags.map(tag => `<span class="project-modal-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="project-modal-description">
                            <h4>Description</h4>
                            <p>${project.fullDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add event listener to close button
        const closeBtn = modal.querySelector('.close-modal-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    function updateFilterOptions(projects) {
        // Update filter options if they exist
        if (projectCategoryFilter && projectTagFilter) {
            // Get unique categories and tags
            const categories = ['all', ...new Set(projects.map(project => project.category))];
            const tags = ['all'];
            
            projects.forEach(project => {
                project.tags.forEach(tag => {
                    if (!tags.includes(tag.toLowerCase())) {
                        tags.push(tag.toLowerCase());
                    }
                });
            });
            
            // Clear current options except the first one
            while (projectCategoryFilter.options.length > 1) {
                projectCategoryFilter.remove(1);
            }
            
            while (projectTagFilter.options.length > 1) {
                projectTagFilter.remove(1);
            }
            
            // Add categories to select
            categories.forEach(category => {
                if (category !== 'all') {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    projectCategoryFilter.appendChild(option);
                }
            });
            
            // Add tags to select
            tags.forEach(tag => {
                if (tag !== 'all') {
                    const option = document.createElement('option');
                    option.value = tag;
                    option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                    projectTagFilter.appendChild(option);
                }
            });
        }
    }
    
    function filterProjects() {
        const categoryValue = projectCategoryFilter ? projectCategoryFilter.value : 'all';
        const tagValue = projectTagFilter ? projectTagFilter.value : 'all';
        const searchValue = projectSearch ? projectSearch.value : '';
        
        loadProjects(categoryValue, tagValue, searchValue);
    }
    
    function loadCertifications() {
        // Get certifications from localStorage
        const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
        
        // Clear container if it exists and has content
        if (certificationsContainer) {
            // Get certification cards container if it exists
            const cardsContainer = certificationsContainer.querySelector('.grid');
            
            if (cardsContainer) {
                // Clear existing certification cards
                cardsContainer.innerHTML = '';
                
                if (certifications.length > 0) {
                    // Sort certifications by date (newest first)
                    const sortedCertifications = certifications.sort((a, b) => {
                        return new Date(b.date) - new Date(a.date);
                    });
                    
                    // Create certification cards for the website
                    sortedCertifications.forEach(certification => {
                        const certCard = createWebsiteCertificationCard(certification);
                        cardsContainer.appendChild(certCard);
                    });
                } else {
                    // If no certifications, display a message
                    const noMessage = document.createElement('div');
                    noMessage.className = 'col-span-full text-center p-8 bg-white rounded-xl shadow-sm';
                    noMessage.textContent = 'No certifications available yet.';
                    cardsContainer.appendChild(noMessage);
                }
            }
        }
    }
    
    function createWebsiteCertificationCard(certification) {
        // Create the certification card for the website
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1';
        
        // Determine logo path
        let logoPath = '';
        if (certification.logoType === 'custom' && certification.logoUrl) {
            logoPath = certification.logoUrl;
        } else {
            logoPath = `assets/img/logos/${certification.logo}.png`;
        }
        
        // Format date
        const dateObj = new Date(certification.date);
        const year = dateObj.getFullYear();
        
        // Create HTML structure for certification card
        card.innerHTML = `
            <div class="p-1" style="background-color: #344C36;">
                <div class="h-36 flex items-center justify-center" style="background-color: #f8f8f8;">
                    <img src="${logoPath}" alt="${certification.issuer} Logo" class="h-16 object-contain">
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-bold mb-2 text-gray-800">${certification.issuer} Certification</h3>
                <p class="text-gray-600 mb-3 text-sm">${certification.title}</p>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm">${year}</span>
                    ${certification.verified ? '<span class="px-3 py-1 text-xs rounded-full text-white" style="background-color: #FAAD1B;">Verified</span>' : ''}
                </div>
                ${certification.url ? `
                <div class="mt-4 pt-4 border-t border-gray-100">
                    <a href="${certification.url}" target="_blank" class="text-sm font-medium flex items-center" style="color: #344C36;">
                        View Certificate
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                </div>` : ''}
            </div>
        `;
        
        return card;
    }
}); 