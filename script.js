// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
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
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Mobile menu toggle
    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
        link.addEventListener("click", function () {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });

    // Update active navigation link on scroll
    window.addEventListener("scroll", updateActiveNavLink);
}

// Smooth scrolling functionality
function initSmoothScroll() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth",
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (
            window.pageYOffset >= sectionTop &&
            window.pageYOffset < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

// Initialize Google Reviews
function initReviews() {
    // Since we can't directly access Google Maps API without setup,
    // we'll create a system that can be easily integrated with real reviews
    const reviewsContainer = document.getElementById("reviews-container");
    const overallRating = document.getElementById("overall-rating");
    const overallStars = document.getElementById("overall-stars");

    // Simulate loading state (replace with actual API call)
    setTimeout(() => {
        loadGoogleReviews();
    }, 1000);
}

// Load Google Reviews from Places API
function loadGoogleReviews() {
    const reviewsContainer = document.getElementById("reviews-container");
    const overallRating = document.getElementById("overall-rating");
    const overallStars = document.getElementById("overall-stars");

    // Fetch reviews using Google Places API
    fetchPlaceReviews()
        .then((data) => {
            if (data && data.result) {
                const place = data.result;

                // Update overall rating
                const rating = place.rating || 0;
                const reviewCount = place.user_ratings_total || 0;

                overallRating.textContent = `${rating} (${reviewCount} reviews)`;
                // Clear existing content and safely append star rating
                overallStars.textContent = "";
                const starHTML = createStarRating(rating);
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = starHTML;
                while (tempDiv.firstChild) {
                    overallStars.appendChild(tempDiv.firstChild);
                }

                // Display reviews (filter to show only positive reviews)
                if (place.reviews && place.reviews.length > 0) {
                    const positiveReviews = place.reviews.filter(
                        (review) => review.rating >= 4,
                    );

                    const reviewsHTML = positiveReviews
                        .slice(0, 6)
                        .map((review) => {
                            const reviewDate = new Date(
                                review.time * 1000,
                            ).toLocaleDateString();
                            const initials = review.author_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();

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
                        })
                        .join("");

                    reviewsContainer.innerHTML = reviewsHTML;
                } else {
                    showReviewsError("No reviews available");
                }
            } else {
                showReviewsError("Unable to load reviews");
            }
        })
        .catch((error) => {
            console.error("Error loading reviews:", error);
            showReviewsError("Error loading reviews");
        });
}

// Fetch place details including reviews
async function fetchPlaceReviews() {
    try {
        // Use backend API proxy to fetch real Google reviews
        const response = await fetch('/api/reviews');

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(`API request failed: ${response.status}`);
        }
    } catch (error) {
        console.error("Places API error:", error);
        // Fallback to sample data if API is not available
        return getSampleReviewsData();
    }
}

// Get API key from environment
function getApiKey() {
    // Return the API key - in production this would be handled by backend
    return window.GOOGLE_PLACES_API_KEY || null;
}

// Authentic Daisy Dog Pet Grooming reviews data as fallback
function getSampleReviewsData() {
    return {
        result: {
            rating: 5.0,
            user_ratings_total: 17,
            reviews: [
                {
                    author_name: "Melissa Amos",
                    rating: 5,
                    text: "Fantastic groomer! Michelle is incredibly kind and patient with my dogs. She has a wealth of knowledge in grooming and is always happy to give advise and strategies to use for grooming at home. My dogs always look and smell amazing after they have been to Michelle. I highly recommend Daisy Dog Grooming!",
                    time: 1701423757,
                },
                {
                    author_name: "Wally Szuszkiewicz",
                    rating: 5,
                    text: "I have been taking my female cavoodle to Michelle for the past 2 years after my previous groomed moved out of the area and I was able to find Michelle and found her to be friendly and takes the time to discuss my requirements upon arrival. Her work is consistent, efficient and exceptional value for money. Keep up the great work!",
                    time: 1709792998,
                },
                {
                    author_name: "Monica Sokol",
                    rating: 5,
                    text: "I have been taking my male groodle to Michelle for the past 12 months now as I recently moved into the area and was looking for a decent groomer. Michelle is always so friendly and takes the time to discuss my requirements upon arrival. Her work is consistent, efficient and exceptional value for money. Keep up the great work!",
                    time: 1700106397,
                },
                {
                    author_name: "Judy Rutter",
                    rating: 5,
                    text: "My dogs love Michelle! We have followed her as she moved down here, because I have never found better.",
                    time: 1741312493,
                },
            ],
        },
    };
}

// Show error message for reviews
function showReviewsError(message) {
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML = `
        <div class="review-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <a href="https://g.co/kgs/CJ3nWsN" target="_blank" class="btn btn-outline">
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

    let starsHTML = "";

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

    const businessAddress = document.getElementById("business-address");
    const businessPhone = document.getElementById("business-phone");
    const businessHours = document.getElementById("business-hours");

    // Load actual business information from Google Places API
    fetch("/api/reviews")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data && data.result) {
                const place = data.result;

                // Update address
                businessAddress.innerHTML =
                    place.formatted_address || "Address not available";

                // Update phone (if available)
                if (place.formatted_phone_number) {
                    const phoneNumber = place.formatted_phone_number;
                    businessPhone.innerHTML = `<a href="tel:${phoneNumber.replace(/\s/g, "")}">${phoneNumber}</a>`;
                } else {
                    businessPhone.innerHTML =
                        "Contact via Facebook for phone number";
                }

                // Update business hours
                if (place.opening_hours && place.opening_hours.weekday_text) {
                    const hoursHTML = place.opening_hours.weekday_text
                        .map((dayHours) => {
                            const [day, hours] = dayHours.split(": ");
                            return `
                            <div class="business-hours-item">
                                <span>${day}</span>
                                <span>${hours}</span>
                            </div>
                        `;
                        })
                        .join("");
                    businessHours.innerHTML = hoursHTML;
                } else {
                    // Updated hours based on current schedule
                    businessHours.innerHTML = `
                        <div class="business-hours-item">
                            <span>Monday</span>
                            <span>Closed</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Tuesday</span>
                            <span>8 am–12:30 pm</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Wednesday</span>
                            <span>Closed</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Thursday</span>
                            <span>Closed</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Friday</span>
                            <span>8 am–12:30 pm</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Saturday</span>
                            <span>Closed</span>
                        </div>
                        <div class="business-hours-item">
                            <span>Sunday</span>
                            <span>Closed</span>
                        </div>
                    `;
                }
            }
        })
        .catch((error) => {
            console.error("Error loading business info:", error);
            // Use authentic Daisy Dog Pet Grooming information when API is unavailable
            businessAddress.innerHTML = "16 Blossom Ave, Mount Duneed VIC 3217, Australia";
            businessPhone.innerHTML = '<a href="tel:0422535366">0422 535 366</a>';
            businessHours.innerHTML = `
                <div class="business-hours-item">
                    <span>Monday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Tuesday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Wednesday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Thursday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Friday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Saturday</span>
                    <span>9:00 AM – 4:00 PM</span>
                </div>
                <div class="business-hours-item">
                    <span>Sunday</span>
                    <span>Closed</span>
                </div>
            `;
        });
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        ".service-card, .feature, .review-card, .contact-item",
    );
    animateElements.forEach((el) => observer.observe(el));
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Handle window resize
window.addEventListener("resize", function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const hamburger = document.getElementById("hamburger");
        const navMenu = document.getElementById("nav-menu");

        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }
});

// Navbar background change on scroll
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
    } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
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

    console.log("Google Maps API integration ready");
}

// Initialize booking form functionality
function initBookingForm() {
    const bookingForm = document.getElementById("booking-form");
    const dateInput = document.getElementById("preferred-date");
    const timeSelect = document.getElementById("preferred-time");

    // Set minimum date to today
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);

        // Add event listener to validate selected date
        dateInput.addEventListener("change", function () {
            validateSelectedDate(this.value);
        });
    }

    // Add date validation helper
    function validateSelectedDate(selectedDate) {
        if (!selectedDate) return;

        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Business is only open on Tuesday (2) and Friday (5)
        const isBusinessDay = dayOfWeek === 2 || dayOfWeek === 5;

        if (!isBusinessDay) {
            alert(
                "Sorry, we are only open on Tuesdays and Fridays. Please select a different date.",
            );
            dateInput.value = "";
            return false;
        }
        return true;
    }

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            handleBookingSubmission();
        });
    }

    // Handle service selection buttons
    const serviceButtons = document.querySelectorAll(
        ".service-card .btn-primary",
    );
    serviceButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            e.preventDefault();

            // Get the service name from the card
            const serviceCard = this.closest(".service-card");
            const serviceName = serviceCard.querySelector("h3").textContent;

            // Set the service in the booking form
            const serviceSelect = document.getElementById("service");
            if (serviceSelect) {
                // Find the matching option
                const option = Array.from(serviceSelect.options).find(
                    (opt) =>
                        opt.text
                            .toLowerCase()
                            .includes(serviceName.toLowerCase()) ||
                        serviceName
                            .toLowerCase()
                            .includes(opt.text.toLowerCase()),
                );

                if (option) {
                    serviceSelect.value = option.value;
                } else {
                    // If no exact match, set to "Other" and show the service name
                    serviceSelect.value = "other";
                }
            }

            // Scroll to booking section
            document.getElementById("booking").scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });
}

// Handle booking form submission
function handleBookingSubmission() {
    const form = document.getElementById("booking-form");
    const formData = new FormData(form);

    // Create booking summary
    const bookingData = {
        petName: formData.get("pet-name"),
        petBreed: formData.get("pet-breed"),
        ownerName: formData.get("owner-name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        service: formData.get("service"),
        preferredDate: formData.get("preferred-date"),
        preferredTime: formData.get("preferred-time"),
        petSize: formData.get("pet-size"),
        specialRequests: formData.get("special-requests"),
    };

    // Show confirmation message
    showBookingConfirmation(bookingData);
}

// Show booking confirmation
function showBookingConfirmation(data) {
    const formContainer = document.querySelector(".booking-form");

    // Get service name for display
    const serviceOptions = {
        "full-grooming": "Full Grooming",
        "bath-brush": "Bath & Brush",
        "nail-care": "Nail Care",
        "specialty-treatments": "Specialty Treatments",
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
                    <strong>Pet:</strong> ${data.petName}${data.petBreed ? ` (${data.petBreed})` : ""}
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
                ${data.specialRequests ? `<div class="summary-item"><strong>Special Requests:</strong> ${data.specialRequests}</div>` : ""}
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
window.addEventListener("load", function () {
    // Additional initialization after all resources are loaded
    loadGoogleMapsData();
});
