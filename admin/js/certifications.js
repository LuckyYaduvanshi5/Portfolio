/**
 * Certification Management JavaScript
 * Handles all certification related functionality in the admin panel
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if logged in (reusing the login check from admin.js)
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // DOM Elements
    const certificationsContainer = document.getElementById('certifications-container');
    const noCertificationsMessage = document.getElementById('no-certifications-message');
    const addCertificationBtn = document.getElementById('add-certification-btn');
    const certificationModal = document.getElementById('certification-modal');
    const closeCertificationModal = document.getElementById('close-certification-modal');
    const cancelCertificationBtn = document.getElementById('cancel-certification-btn');
    const certificationForm = document.getElementById('certification-form');
    const certificationModalTitle = document.getElementById('certification-modal-title');
    const certificationLogo = document.getElementById('certification-logo');
    const customLogoContainer = document.getElementById('custom-logo-container');
    const certificationCustomLogo = document.getElementById('certification-custom-logo');
    const logoPreviewContainer = document.getElementById('logo-preview-container');
    
    // Navigation elements
    const navLinks = document.querySelectorAll('.admin-nav a');
    const projectsSection = document.getElementById('projects-section');
    const certificationsSection = document.getElementById('certifications-section');
    
    // Current logo data
    let currentLogoUrl = '';
    let isEditMode = false;
    let currentCertificationId = null;
    
    // Initialize certifications if they don't exist in localStorage
    if (!localStorage.getItem('certifications')) {
        localStorage.setItem('certifications', JSON.stringify([]));
    }
    
    // Initialize unique ID counter if it doesn't exist
    if (!localStorage.getItem('certificationIdCounter')) {
        localStorage.setItem('certificationIdCounter', '1');
    }
    
    // Event Listeners
    addCertificationBtn.addEventListener('click', showAddCertificationModal);
    closeCertificationModal.addEventListener('click', closeCertificationModalFunc);
    cancelCertificationBtn.addEventListener('click', closeCertificationModalFunc);
    certificationForm.addEventListener('submit', saveCertification);
    certificationLogo.addEventListener('change', toggleCustomLogoUpload);
    certificationCustomLogo.addEventListener('change', handleLogoUpload);
    
    // Navigation event listeners
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show/hide sections based on the link clicked
            const targetSection = this.getAttribute('href').substring(1);
            if (targetSection === 'projects') {
                projectsSection.style.display = 'block';
                certificationsSection.style.display = 'none';
            } else if (targetSection === 'certifications') {
                projectsSection.style.display = 'none';
                certificationsSection.style.display = 'block';
                loadCertifications(); // Load certifications when switching to that tab
            }
        });
    });
    
    // Functions
    function loadCertifications() {
        const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
        
        // Clear certifications container
        while (certificationsContainer.firstChild) {
            if (certificationsContainer.firstChild !== noCertificationsMessage) {
                certificationsContainer.removeChild(certificationsContainer.firstChild);
            } else {
                break;
            }
        }
        
        if (certifications.length === 0) {
            noCertificationsMessage.style.display = 'block';
        } else {
            noCertificationsMessage.style.display = 'none';
            
            // Render certifications
            certifications.forEach(certification => {
                const certificationCard = createCertificationCard(certification);
                certificationsContainer.appendChild(certificationCard);
            });
        }
    }
    
    function createCertificationCard(certification) {
        const card = document.createElement('div');
        card.className = 'certification-card';
        card.dataset.id = certification.id;
        
        // Determine logo path based on certification data
        let logoPath = '';
        if (certification.logoType === 'custom' && certification.logoUrl) {
            logoPath = certification.logoUrl;
        } else {
            logoPath = `assets/img/logos/${certification.logo}.png`;
        }
        
        const dateObj = new Date(certification.date);
        const year = dateObj.getFullYear();
        const month = dateObj.toLocaleString('default', { month: 'long' });
        
        card.innerHTML = `
            <div class="certification-logo">
                <img src="${logoPath}" alt="${certification.issuer} Logo">
            </div>
            <div class="certification-details">
                <h3 class="certification-title">
                    ${certification.title}
                    ${certification.verified ? '<span class="certification-verified-badge">Verified</span>' : ''}
                </h3>
                <div class="certification-issuer">${certification.issuer}</div>
                <div class="certification-date">${month} ${year}</div>
                <p class="certification-description">${certification.description}</p>
                ${certification.url ? `<a href="${certification.url}" target="_blank" class="btn-primary btn-sm">View Certificate</a>` : ''}
                <div class="certification-actions">
                    <button class="action-btn edit-btn" title="Edit Certification"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Delete Certification"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => showEditCertificationModal(certification.id));
        deleteBtn.addEventListener('click', () => deleteCertification(certification.id));
        
        return card;
    }
    
    function showAddCertificationModal() {
        isEditMode = false;
        currentCertificationId = null;
        certificationModalTitle.textContent = 'Add New Certification';
        certificationForm.reset();
        logoPreviewContainer.innerHTML = '';
        currentLogoUrl = '';
        customLogoContainer.style.display = 'none';
        certificationModal.style.display = 'block';
    }
    
    function showEditCertificationModal(certificationId) {
        isEditMode = true;
        currentCertificationId = certificationId;
        certificationModalTitle.textContent = 'Edit Certification';
        
        const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
        const certification = certifications.find(c => c.id === certificationId);
        
        if (certification) {
            document.getElementById('certification-title').value = certification.title;
            document.getElementById('certification-issuer').value = certification.issuer;
            document.getElementById('certification-date').value = certification.date;
            document.getElementById('certification-description').value = certification.description;
            document.getElementById('certification-logo').value = certification.logo;
            document.getElementById('certification-url').value = certification.url || '';
            document.getElementById('certification-verified').checked = certification.verified;
            
            // Handle logo preview
            logoPreviewContainer.innerHTML = '';
            if (certification.logoType === 'custom' && certification.logoUrl) {
                currentLogoUrl = certification.logoUrl;
                customLogoContainer.style.display = 'block';
                
                const logoPreview = document.createElement('div');
                logoPreview.className = 'image-preview';
                logoPreview.innerHTML = `
                    <img src="${certification.logoUrl}" alt="Logo Preview">
                    <button type="button" class="remove-btn">&times;</button>
                `;
                logoPreviewContainer.appendChild(logoPreview);
                
                const removeBtn = logoPreview.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    currentLogoUrl = '';
                    logoPreview.remove();
                });
            } else {
                customLogoContainer.style.display = certification.logo === 'others' ? 'block' : 'none';
            }
            
            certificationModal.style.display = 'block';
        }
    }
    
    function closeCertificationModalFunc() {
        certificationModal.style.display = 'none';
    }
    
    function toggleCustomLogoUpload() {
        if (certificationLogo.value === 'others') {
            customLogoContainer.style.display = 'block';
        } else {
            customLogoContainer.style.display = 'none';
        }
    }
    
    function handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            currentLogoUrl = e.target.result;
            
            // Clear previous previews
            logoPreviewContainer.innerHTML = '';
            
            const logoPreview = document.createElement('div');
            logoPreview.className = 'image-preview';
            logoPreview.innerHTML = `
                <img src="${currentLogoUrl}" alt="Logo Preview">
                <button type="button" class="remove-btn">&times;</button>
            `;
            logoPreviewContainer.appendChild(logoPreview);
            
            const removeBtn = logoPreview.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                currentLogoUrl = '';
                logoPreview.remove();
                certificationCustomLogo.value = '';
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    function saveCertification(event) {
        event.preventDefault();
        
        // Get form values
        const title = document.getElementById('certification-title').value;
        const issuer = document.getElementById('certification-issuer').value;
        const date = document.getElementById('certification-date').value;
        const description = document.getElementById('certification-description').value;
        const logo = document.getElementById('certification-logo').value;
        const url = document.getElementById('certification-url').value;
        const verified = document.getElementById('certification-verified').checked;
        
        // Get certifications from localStorage
        const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
        
        if (isEditMode && currentCertificationId) {
            // Update existing certification
            const certificationIndex = certifications.findIndex(c => c.id === currentCertificationId);
            
            if (certificationIndex !== -1) {
                certifications[certificationIndex] = {
                    ...certifications[certificationIndex],
                    title,
                    issuer,
                    date,
                    description,
                    logo,
                    url,
                    verified,
                    logoType: logo === 'others' && currentLogoUrl ? 'custom' : 'standard',
                    logoUrl: logo === 'others' && currentLogoUrl ? currentLogoUrl : '',
                    updatedAt: new Date().toISOString()
                };
                
                localStorage.setItem('certifications', JSON.stringify(certifications));
                closeCertificationModalFunc();
                loadCertifications();
            }
        } else {
            // Add new certification
            const newCertificationId = getNextCertificationId();
            
            const newCertification = {
                id: newCertificationId,
                title,
                issuer,
                date,
                description,
                logo,
                url,
                verified,
                logoType: logo === 'others' && currentLogoUrl ? 'custom' : 'standard',
                logoUrl: logo === 'others' && currentLogoUrl ? currentLogoUrl : '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            certifications.push(newCertification);
            localStorage.setItem('certifications', JSON.stringify(certifications));
            closeCertificationModalFunc();
            loadCertifications();
        }
    }
    
    function getNextCertificationId() {
        let counter = parseInt(localStorage.getItem('certificationIdCounter') || '1');
        const nextId = `certification_${counter}`;
        localStorage.setItem('certificationIdCounter', (counter + 1).toString());
        return nextId;
    }
    
    function deleteCertification(certificationId) {
        if (confirm('Are you sure you want to delete this certification? This action cannot be undone.')) {
            const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
            const updatedCertifications = certifications.filter(certification => certification.id !== certificationId);
            
            localStorage.setItem('certifications', JSON.stringify(updatedCertifications));
            loadCertifications();
        }
    }
}); 