/**
 * Project Data Initialization
 * This script ensures projects are displayed even without admin panel setup
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if projects exist in localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // If no projects exist, initialize with demo data
    if (projects.length === 0) {
        const demoProjects = [
            {
                id: '1',
                title: 'Blog Prompt Generator',
                shortDescription: 'AI-powered tool to generate content ideas for bloggers and content creators',
                fullDescription: 'A web application that uses AI to generate creative and engaging blog post ideas based on keywords, topics, and target audience. Features multiple prompt templates and export options.',
                category: 'tools',
                tags: ['Web App', 'React', 'UI/UX Design'],
                images: ['assets/img/projects/blogpromptGenrator.png'],
                featured: true
            },
            {
                id: '2',
                title: 'Reels Counter - Social Media Tool',
                shortDescription: 'Analytics tool for tracking Instagram Reels performance',
                fullDescription: 'A mobile app that helps content creators track engagement statistics for Instagram Reels. Features include view counting, engagement rate calculation, and performance comparison.',
                category: 'tools',
                tags: ['Mobile App', 'React Native', 'UI/UX Design'],
                images: ['assets/img/projects/reelscounter.png'],
                featured: true
            },
            {
                id: '3',
                title: 'Daily Notes - Productivity App',
                shortDescription: 'Simple and elegant note-taking application',
                fullDescription: 'A web application for capturing and organizing daily notes with features like markdown support, tag organization, and cloud sync.',
                category: 'tools',
                tags: ['Web App', 'Vue.js', 'UI/UX Design'],
                images: ['assets/img/projects/dailynotes.png'],
                featured: true
            },
            {
                id: '4',
                title: 'CodAI Pro - AI Coding Assistant',
                shortDescription: 'AI-powered coding assistant for developers',
                fullDescription: 'A development tool that leverages AI to help programmers write better code faster. Features include code completion, refactoring suggestions, and documentation generation.',
                category: 'tools',
                tags: ['Web App', 'AI Integration', 'UI/UX Design'],
                images: ['assets/img/projects/codai-pro.png'],
                featured: true
            },
            {
                id: '5',
                title: 'Made by Craft',
                shortDescription: 'E-commerce website for handcrafted products and artisan goods',
                fullDescription: 'A comprehensive e-commerce platform designed specifically for artisans and craft makers to sell their handmade products online. Features include secure payment processing, inventory management, and customizable storefronts.',
                category: 'clients',
                tags: ['HTML/CSS', 'UI/UX Design'],
                images: ['assets/img/projects/madebycraft.in.net.png'],
                featured: false
            },
            {
                id: '6',
                title: 'Kartzon',
                shortDescription: 'E-commerce marketplace with advanced product filtering and search',
                fullDescription: 'A modern e-commerce platform with features like faceted search, personalized recommendations, and social shopping integration.',
                category: 'clients',
                tags: ['JavaScript', 'UI/UX Design'],
                images: ['assets/img/projects/kartzon.png'],
                featured: false
            },
            {
                id: '7',
                title: 'Radhika JLR',
                shortDescription: 'Jewelry store website with product catalog and custom ordering',
                fullDescription: 'A premium website for a jewelry retailer featuring high-quality product photography, custom order requests, and virtual try-on functionality.',
                category: 'clients',
                tags: ['HTML/CSS', 'UI/UX Design'],
                images: ['assets/img/projects/Radhikajlr.png'],
                featured: false
            },
            {
                id: '8',
                title: 'Taska',
                shortDescription: 'Task management application with team collaboration features',
                fullDescription: 'A productivity application that helps teams organize tasks, track progress, and collaborate efficiently with features like Kanban boards, time tracking, and integration with popular tools.',
                category: 'tools',
                tags: ['TypeScript', 'UI/UX Design'],
                images: ['assets/img/projects/Taska.png'],
                featured: false
            },
            {
                id: '9',
                title: 'WP Global',
                shortDescription: 'WordPress theme and plugin development company website',
                fullDescription: 'A professional website for a WordPress development agency featuring portfolio showcase, service descriptions, and client testimonials.',
                category: 'clients',
                tags: ['WordPress', 'UI/UX Design'],
                images: ['assets/img/projects/Wpglobal.png'],
                featured: false
            }
        ];
        
        // Store demo projects in localStorage
        localStorage.setItem('projects', JSON.stringify(demoProjects));
        
        // Initialize ID counter
        localStorage.setItem('projectIdCounter', '10');
    }
    
    // Initialize certifications if needed
    const certifications = JSON.parse(localStorage.getItem('certifications') || '[]');
    
    if (certifications.length === 0) {
        const demoCertifications = [
            {
                id: '1',
                title: 'AI and Machine Learning',
                issuer: 'Microsoft',
                date: '2024-03',
                description: 'Comprehensive certification covering machine learning principles, neural networks, and practical AI implementation',
                logo: 'microsoft',
                logoType: 'standard',
                url: '#',
                verified: true
            },
            {
                id: '2',
                title: 'Cybersecurity Fundamentals',
                issuer: 'Cisco',
                date: '2023-11',
                description: 'Detailed training on cybersecurity principles, threat detection, and security infrastructure design',
                logo: 'cisco',
                logoType: 'standard',
                url: '#',
                verified: true
            },
            {
                id: '3',
                title: 'SEO Fundamentals',
                issuer: 'Coursera',
                date: '2023-09',
                description: 'Complete course on search engine optimization, keyword research, and content strategy for digital marketing',
                logo: 'coursera',
                logoType: 'standard',
                url: '#',
                verified: true
            },
            {
                id: '4',
                title: 'Digital Marketing',
                issuer: 'Google',
                date: '2023-06',
                description: 'Certification in digital marketing fundamentals including analytics, advertising platforms, and campaign optimization',
                logo: 'google',
                logoType: 'standard',
                url: '#',
                verified: true
            }
        ];
        
        // Store demo certifications in localStorage
        localStorage.setItem('certifications', JSON.stringify(demoCertifications));
        
        // Initialize ID counter
        localStorage.setItem('certificationIdCounter', '5');
    }
}); 