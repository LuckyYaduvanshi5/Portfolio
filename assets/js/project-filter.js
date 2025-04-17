document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll('[data-category]');
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add click event listeners to all filter buttons
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
            
            // Filter projects based on selected category
            projectCards.forEach(card => {
                // If "all" is selected or the card has the selected category, show it
                if (selectedCategory === 'all' || card.getAttribute('data-category').includes(selectedCategory)) {
                    card.style.display = 'block';
                    // Add animation for smoother transition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    // Hide cards that don't match the category
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Trigger click on "All" button to initialize the view
    document.querySelector('[data-category="all"]').click();
}); 