document.addEventListener('DOMContentLoaded', function() {
    // Get all links with hash (#) in the href
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is not just "#"
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                // Get the target element
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                // If target element exists
                if(targetElement) {
                    // Calculate position to scroll to (with offset for fixed header)
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('text-secondary');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector('nav a[href="#' + sectionId + '"]');
                if(activeLink) {
                    activeLink.classList.add('text-secondary');
                }
            }
        });
    });
}); 