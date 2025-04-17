document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if login has expired
    const expiryTime = localStorage.getItem('loginExpiry');
    if (expiryTime && new Date().getTime() > parseInt(expiryTime)) {
        logout();
        return;
    }
    
    // DOM Elements
    const projectsContainer = document.getElementById('projects-container');
    const noProjectsMessage = document.getElementById('no-projects-message');
    const addProjectBtn = document.getElementById('add-project-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const projectForm = document.getElementById('project-form');
    const modalTitle = document.getElementById('modal-title');
    const projectImages = document.getElementById('project-images');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const filterCategory = document.getElementById('filter-category');
    const filterTag = document.getElementById('filter-tag');
    const searchProjects = document.getElementById('search-projects');
    
    // Current image data
    let currentImages = [];
    let isEditMode = false;
    let currentProjectId = null;
    
    // Initialize projects if they don't exist in localStorage
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify([]));
    }
    
    // Initialize unique ID counter if it doesn't exist
    if (!localStorage.getItem('projectIdCounter')) {
        localStorage.setItem('projectIdCounter', '1');
    }
    
    // Event Listeners
    logoutBtn.addEventListener('click', logout);
    addProjectBtn.addEventListener('click', showAddProjectModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    projectForm.addEventListener('submit', saveProject);
    projectImages.addEventListener('change', handleImageUpload);
    filterCategory.addEventListener('change', filterProjects);
    filterTag.addEventListener('change', filterProjects);
    searchProjects.addEventListener('input', filterProjects);
    
    // Load projects on page load
    loadProjects();
    
    // Functions
    function logout() {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('loginExpiry');
        window.location.href = 'login.html';
    }
    
    function loadProjects(filterCategory = 'all', filterTag = 'all', searchTerm = '') {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        // Clear projects container
        while (projectsContainer.firstChild) {
            if (projectsContainer.firstChild !== noProjectsMessage) {
                projectsContainer.removeChild(projectsContainer.firstChild);
            } else {
                break;
            }
        }
        
        // Filter projects
        let filteredProjects = projects;
        
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
        
        if (filteredProjects.length === 0) {
            noProjectsMessage.style.display = 'block';
        } else {
            noProjectsMessage.style.display = 'none';
            
            // Render projects
            filteredProjects.forEach(project => {
                const projectCard = createProjectCard(project);
                projectsContainer.appendChild(projectCard);
            });
        }
        
        // Update filter options based on available projects
        updateFilterOptions(projects);
    }
    
    function updateFilterOptions(projects) {
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
        while (filterCategory.options.length > 1) {
            filterCategory.remove(1);
        }
        
        while (filterTag.options.length > 1) {
            filterTag.remove(1);
        }
        
        // Add categories to select
        categories.forEach(category => {
            if (category !== 'all') {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                filterCategory.appendChild(option);
            }
        });
        
        // Add tags to select
        tags.forEach(tag => {
            if (tag !== 'all') {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
                filterTag.appendChild(option);
            }
        });
    }
    
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        
        // Fix image path by adding a relative path prefix if it doesn't have http or data:
        let imageUrl = project.images.length > 0 ? project.images[0] : 'https://via.placeholder.com/300x180?text=No+Image';
        
        // Add proper path prefix for images that aren't already absolute URLs or data URLs
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageUrl = '../' + imageUrl; // Add relative path to fix admin panel reference
        }
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title}">
                ${project.featured ? '<div class="project-featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-details">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-category">${project.category.charAt(0).toUpperCase() + project.category.slice(1)}</div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p>${project.shortDescription}</p>
                <div class="project-actions">
                    <button class="action-btn edit-btn" title="Edit Project"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete Project"><i class="fas fa-trash-alt"></i></button>
                    <button class="action-btn featured-btn ${project.featured ? 'active' : ''}" title="${project.featured ? 'Remove from Featured' : 'Mark as Featured'}">
                        <i class="fas fa-star"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        const featuredBtn = card.querySelector('.featured-btn');
        
        editBtn.addEventListener('click', () => showEditProjectModal(project.id));
        deleteBtn.addEventListener('click', () => deleteProject(project.id));
        featuredBtn.addEventListener('click', () => toggleFeatured(project.id));
        
        return card;
    }
    
    function showAddProjectModal() {
        isEditMode = false;
        currentProjectId = null;
        modalTitle.textContent = 'Add New Project';
        projectForm.reset();
        imagePreviewContainer.innerHTML = '';
        currentImages = [];
        projectModal.style.display = 'block';
    }
    
    function showEditProjectModal(projectId) {
        isEditMode = true;
        currentProjectId = projectId;
        modalTitle.textContent = 'Edit Project';
        
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const project = projects.find(p => p.id === projectId);
        
        if (project) {
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-short-desc').value = project.shortDescription;
            document.getElementById('project-full-desc').value = project.fullDescription;
            document.getElementById('project-category').value = project.category;
            document.getElementById('project-tags').value = project.tags.join(', ');
            document.getElementById('project-featured').checked = project.featured;
            
            // Display current images
            imagePreviewContainer.innerHTML = '';
            currentImages = [...project.images];
            
            currentImages.forEach((imageUrl, index) => {
                // Fix image preview path by adding a relative path prefix if needed
                let displayUrl = imageUrl;
                if (displayUrl && !displayUrl.startsWith('http') && !displayUrl.startsWith('data:')) {
                    displayUrl = '../' + displayUrl; // Add relative path to fix admin panel reference
                }
                
                const imagePreview = document.createElement('div');
                imagePreview.className = 'image-preview';
                imagePreview.innerHTML = `
                    <img src="${displayUrl}" alt="Preview">
                    <button type="button" class="remove-btn" data-index="${index}">&times;</button>
                `;
                imagePreviewContainer.appendChild(imagePreview);
                
                const removeBtn = imagePreview.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    currentImages.splice(index, 1);
                    imagePreview.remove();
                    // Reindex remove buttons
                    const removeBtns = imagePreviewContainer.querySelectorAll('.remove-btn');
                    removeBtns.forEach((btn, i) => {
                        btn.dataset.index = i;
                    });
                });
            });
            
            projectModal.style.display = 'block';
        }
    }
    
    function closeModal() {
        projectModal.style.display = 'none';
    }
    
    function handleImageUpload(event) {
        const files = event.target.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                currentImages.push(imageUrl);
                
                const imagePreview = document.createElement('div');
                imagePreview.className = 'image-preview';
                imagePreview.innerHTML = `
                    <img src="${imageUrl}" alt="Preview">
                    <button type="button" class="remove-btn" data-index="${currentImages.length - 1}">&times;</button>
                `;
                imagePreviewContainer.appendChild(imagePreview);
                
                const removeBtn = imagePreview.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    currentImages.splice(index, 1);
                    imagePreview.remove();
                    // Reindex remove buttons
                    const removeBtns = imagePreviewContainer.querySelectorAll('.remove-btn');
                    removeBtns.forEach((btn, i) => {
                        btn.dataset.index = i;
                    });
                });
            };
            
            reader.readAsDataURL(file);
        }
        
        // Clear the file input
        event.target.value = '';
    }
    
    function saveProject(event) {
        event.preventDefault();
        
        // Get form values
        const title = document.getElementById('project-title').value;
        const shortDescription = document.getElementById('project-short-desc').value;
        const fullDescription = document.getElementById('project-full-desc').value;
        const category = document.getElementById('project-category').value;
        const tagsString = document.getElementById('project-tags').value;
        const featured = document.getElementById('project-featured').checked;
        
        // Process tags
        const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        
        if (isEditMode && currentProjectId) {
            // Update existing project
            const projectIndex = projects.findIndex(p => p.id === currentProjectId);
            
            if (projectIndex !== -1) {
                projects[projectIndex] = {
                    ...projects[projectIndex],
                    title,
                    shortDescription,
                    fullDescription,
                    category,
                    tags,
                    featured,
                    images: currentImages,
                    updatedAt: new Date().toISOString()
                };
                
                localStorage.setItem('projects', JSON.stringify(projects));
                closeModal();
                loadProjects(filterCategory.value, filterTag.value, searchProjects.value);
            }
        } else {
            // Add new project
            const newProjectId = getNextProjectId();
            
            const newProject = {
                id: newProjectId,
                title,
                shortDescription,
                fullDescription,
                category,
                tags,
                featured,
                images: currentImages,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            projects.push(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            closeModal();
            loadProjects(filterCategory.value, filterTag.value, searchProjects.value);
        }
    }
    
    function getNextProjectId() {
        let counter = parseInt(localStorage.getItem('projectIdCounter') || '1');
        const nextId = `project_${counter}`;
        localStorage.setItem('projectIdCounter', (counter + 1).toString());
        return nextId;
    }
    
    function deleteProject(projectId) {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const updatedProjects = projects.filter(project => project.id !== projectId);
            
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            loadProjects(filterCategory.value, filterTag.value, searchProjects.value);
        }
    }
    
    function toggleFeatured(projectId) {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectIndex = projects.findIndex(project => project.id === projectId);
        
        if (projectIndex !== -1) {
            projects[projectIndex].featured = !projects[projectIndex].featured;
            localStorage.setItem('projects', JSON.stringify(projects));
            loadProjects(filterCategory.value, filterTag.value, searchProjects.value);
        }
    }
    
    function filterProjects() {
        const categoryValue = filterCategory.value;
        const tagValue = filterTag.value;
        const searchValue = searchProjects.value;
        
        loadProjects(categoryValue, tagValue, searchValue);
    }
}); 