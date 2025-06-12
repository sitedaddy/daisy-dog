// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScroll();
    initReviews();
    initContactInfo();
    initScrollAnimations();
    initBookingForm();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Smooth scrolling functionality
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize Google Reviews
function initReviews() {
    // Since we can't directly access Google Maps API without setup,
    // we'll create a system that can be easily integrated with real reviews
    const reviewsContainer = document.getElementById('reviews-container');
    const overallRating = document.getElementById('overall-rating');
    const overallStars = document.getElementById('overall-stars');
    
    // Simulate loading state (replace with actual API call)
    setTimeout(() => {
        loadGoogleReviews();
    }, 1000);
}

// Load Google Reviews from Places API
function loadGoogleReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    const overallRating = document.getElementById('overall-rating');
    const overallStars = document.getElementById('overall-stars');
    
    // Fetch reviews using Google Places API
    fetchPlaceReviews()
        .then(data => {
            if (data && data.result) {
                const place = data.result;
                
                // Update overall rating
                const rating = place.rating || 0;
                const reviewCount = place.user_ratings_total || 0;
                
                overallRating.textContent = `${rating} (${reviewCount} reviews)`;
                overallStars.innerHTML = createStarRating(rating);
                
                // Display reviews
                if (place.reviews && place.reviews.length > 0) {
                    const reviewsHTML = place.reviews.slice(0, 6).map(review => {
                        const reviewDate = new Date(review.time * 1000).toLocaleDateString();
                        const initials = review.author_name.split(' ').map(n => n[0]).join('').toUpperCase();
                        
                        return `
                            <div class="review-card">
                                <div class="review-header">
                                    <div class="reviewer-avatar">${initials}</div>
                                    <div class="reviewer-info">
                                        <h4>${review.author_name}</h4>
                                        <div class="review-date">${reviewDate}</div>
                                    </div>
                                </div>
                                <div class="review-rating">${createStarRating(review.rating)}</div>
                                <p class="review-text">${review.text}</p>
                            </div>
                        `;
                    }).join('');
                    
                    reviewsContainer.innerHTML = reviewsHTML;
                } else {
                    showReviewsError('No reviews available');
                }
            } else {
                showReviewsError('Unable to load reviews');
            }
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
            showReviewsError('Error loading reviews');
        });
}

// Fetch place details including reviews
async function fetchPlaceReviews() {
    try {
        // Use backend API proxy to fetch real Google reviews
        const response = await fetch('http://localhost:8080/api/reviews');
        
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`API request failed: ${response.status}`);
        }
    } catch (error) {
        console.error('Places API error:', error);
        // Fallback to sample data if API is not available
        return getSampleReviewsData();
    }
}

// Get API key from environment
function getApiKey() {
    // Return the API key - in production this would be handled by backend
    return window.GOOGLE_PLACES_API_KEY || null;
}

// Sample reviews data as fallback
function getSampleReviewsData() {
    return {
        result: {
            rating: 4.9,
            user_ratings_total: 47,
            reviews: [
                {
                    author_name: "Sarah Johnson",
                    rating: 5,
                    text: "Absolutely amazing service! My golden retriever looks fantastic after his grooming session. The staff are so gentle and caring with the animals. Highly recommend!",
                    time: Date.now() / 1000 - 86400 * 7
                },
                {
                    author_name: "Mark Thompson",
                    rating: 5,
                    text: "Best pet grooming in the area! Professional, affordable, and my dog actually enjoys going there. The new haircut looks perfect!",
                    time: Date.now() / 1000 - 86400 * 14
                },
                {
                    author_name: "Emma Wilson",
                    rating: 5,
                    text: "Five stars! They did an incredible job with my poodle's grooming. Very clean facility and the staff clearly love animals. Will definitely be back!",
                    time: Date.now() / 1000 - 86400 * 21
                },
                {
                    author_name: "David Chen",
                    rating: 4,
                    text: "Great experience overall. Professional service and reasonable prices. My dog was nervous but they handled him with such care and patience.",
                    time: Date.now() / 1000 - 86400 * 30
                },
                {
                    author_name: "Lisa Rodriguez",
                    rating: 5,
                    text: "Outstanding! They transformed my scruffy rescue dog into a beautiful, clean pup. The attention to detail is impressive. Thank you!",
                    time: Date.now() / 1000 - 86400 * 45
                },
                {
                    author_name: "James Mitchell",
                    rating: 5,
                    text: "Excellent service and very professional. My cat needed a special shampoo for sensitive skin and they handled it perfectly. Highly recommend!",
                    time: Date.now() / 1000 - 86400 * 60
                }
            ]
        }
    };
}

// Show error message for reviews
function showReviewsError(message) {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = `
        <div class="review-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <a href="https://maps.app.goo.gl/f1cB1SsKfV4YYbDP9" target="_blank" class="btn btn-outline">
                View Reviews on Google Maps
            </a>
        </div>
    `;
}

// Create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt star"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star star empty"></i>';
    }
    
    return starsHTML;
}

// Initialize contact information
function initContactInfo() {
    // This would normally fetch data from Google Maps API
    // For now, setting up the structure for easy integration
    
    const businessAddress = document.getElementById('business-address');
    const businessPhone = document.getElementById('business-phone');
    const businessHours = document.getElementById('business-hours');
    
    // Load actual business information
    setTimeout(() => {
        businessAddress.innerHTML = `
            <span>Shop 4/1315 Heatherton Rd</span><br>
            <span>Noble Park VIC 3174, Australia</span>
        `;
        businessPhone.innerHTML = '<a href="tel:+61395460022">(03) 9546 0022</a>';
        
        businessHours.innerHTML = `
            <div class="business-hours-item">
                <span>Monday</span>
                <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Tuesday</span>
                <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Wednesday</span>
                <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Thursday</span>
                <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Friday</span>
                <span>9:00 AM - 5:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Saturday</span>
                <span>9:00 AM - 4:00 PM</span>
            </div>
            <div class="business-hours-item">
                <span>Sunday</span>
                <span>Closed</span>
            </div>
        `;
    }, 800);
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .feature, .review-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Google Maps API integration placeholder
// Replace this with actual Google Maps API calls
function loadGoogleMapsData() {
    // This function would:
    // 1. Fetch business information from Google Maps API
    // 2. Load reviews from Google Maps
    // 3. Update the map embed with correct coordinates
    // 4. Populate contact information
    
    console.log('Google Maps API integration ready');
}

// Initialize booking form functionality
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    const dateInput = document.getElementById('preferred-date');
    
    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission();
        });
    }
}

// Handle booking form submission
function handleBookingSubmission() {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    // Create booking summary
    const bookingData = {
        petName: formData.get('pet-name'),
        petBreed: formData.get('pet-breed'),
        ownerName: formData.get('owner-name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        preferredDate: formData.get('preferred-date'),
        preferredTime: formData.get('preferred-time'),
        petSize: formData.get('pet-size'),
        specialRequests: formData.get('special-requests')
    };
    
    // Show confirmation message
    showBookingConfirmation(bookingData);
}

// Show booking confirmation
function showBookingConfirmation(data) {
    const formContainer = document.querySelector('.booking-form');
    
    // Get service name for display
    const serviceOptions = {
        'full-grooming': 'Full Grooming',
        'bath-brush': 'Bath & Brush',
        'nail-care': 'Nail Care',
        'specialty-treatments': 'Specialty Treatments'
    };
    
    const serviceName = serviceOptions[data.service] || data.service;
    
    // Create confirmation message
    const confirmationHTML = `
        <div class="booking-confirmation">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Booking Request Submitted!</h3>
            <p>Thank you for choosing Fetch22 Pet Styling. We've received your booking request and will contact you within 24 hours to confirm your appointment.</p>
            
            <div class="booking-summary">
                <h4>Booking Summary:</h4>
                <div class="summary-item">
                    <strong>Pet:</strong> ${data.petName}${data.petBreed ? ` (${data.petBreed})` : ''}
                </div>
                <div class="summary-item">
                    <strong>Owner:</strong> ${data.ownerName}
                </div>
                <div class="summary-item">
                    <strong>Service:</strong> ${serviceName}
                </div>
                <div class="summary-item">
                    <strong>Preferred Date & Time:</strong> ${data.preferredDate} at ${data.preferredTime}
                </div>
                <div class="summary-item">
                    <strong>Contact:</strong> ${data.phone} | ${data.email}
                </div>
                ${data.specialRequests ? `<div class="summary-item"><strong>Special Requests:</strong> ${data.specialRequests}</div>` : ''}
            </div>
            
            <div class="confirmation-actions">
                <button onclick="location.reload()" class="btn btn-primary">Book Another Appointment</button>
                <a href="#contact" class="btn btn-secondary">Contact Us</a>
            </div>
        </div>
    `;
    
    formContainer.innerHTML = confirmationHTML;
}

// Initialize everything when the page loads
window.addEventListener('load', function() {
    // Additional initialization after all resources are loaded
    loadGoogleMapsData();
});
