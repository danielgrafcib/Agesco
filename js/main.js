(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Header carousel
    var headerCarousel = $(".header-carousel").owlCarousel({
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: false,
        nav: true,
        animateOut: 'fadeOut',
        navText: [
            '<i class="bi bi-chevron-left" aria-hidden="true"></i>',
            '<i class="bi bi-chevron-right" aria-hidden="true"></i>'
        ],
        responsive: {
            0: { items: 1 },
            768: { items: 1 },
            992: { items: 1 }
        }
    });

    // Carousel pause/play controls
    $('#carousel-pause').click(function () {
        headerCarousel.trigger('stop.owl.autoplay');
        $(this).hide();
        $('#carousel-play').show();
    });

    $('#carousel-play').click(function () {
        headerCarousel.trigger('play.owl.autoplay', [1500]);
        $(this).hide();
        $('#carousel-pause').show();
    });

    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        headerCarousel.trigger('stop.owl.autoplay');
        $('#carousel-pause').hide();
        $('#carousel-play').show();
    }


    // Testimonials carousel
    var testimonialCarousel = $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    // Testimonial carousel controls
    $('#testimonial-prev').click(function () {
        testimonialCarousel.trigger('prev.owl.carousel');
    });

    $('#testimonial-next').click(function () {
        testimonialCarousel.trigger('next.owl.carousel');
    });

    $('#testimonial-pause').click(function () {
        testimonialCarousel.trigger('stop.owl.autoplay');
        $(this).hide();
        $('#testimonial-play').show();
    });

    $('#testimonial-play').click(function () {
        testimonialCarousel.trigger('play.owl.autoplay', [1000]);
        $(this).hide();
        $('#testimonial-pause').show();
    });

    // Keyboard navigation for testimonials
    $(document).on('keydown', function (e) {
        // FIXED: Use jQuery.contains() instead of :focus-within pseudo-selector
        const carouselElement = $('.testimonial-carousel')[0];
        const hasFocus = carouselElement && (carouselElement.contains(document.activeElement) || carouselElement === document.activeElement);
        
        if (hasFocus) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                testimonialCarousel.trigger('prev.owl.carousel');
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                testimonialCarousel.trigger('next.owl.carousel');
            }
        }
    });

    // Respect user's motion preferences for testimonials
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        testimonialCarousel.trigger('stop.owl.autoplay');
        $('#testimonial-pause').hide();
        $('#testimonial-play').show();
    }


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active').attr('aria-selected', 'false').attr('tabindex', '-1');
        $(this).addClass('active').attr('aria-selected', 'true').attr('tabindex', '0');

        portfolioIsotope.isotope({ filter: $(this).data('filter') });
    });

    // Portfolio filter keyboard navigation
    window.handleFilterKeydown = function (event) {
        const filters = $('#portfolio-flters li');
        const currentIndex = filters.index(event.target);
        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                newIndex = currentIndex > 0 ? currentIndex - 1 : filters.length - 1;
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                newIndex = currentIndex < filters.length - 1 ? currentIndex + 1 : 0;
                event.preventDefault();
                break;
            case 'Enter':
            case ' ':
                $(event.target).click();
                event.preventDefault();
                break;
            case 'Home':
                newIndex = 0;
                event.preventDefault();
                break;
            case 'End':
                newIndex = filters.length - 1;
                event.preventDefault();
                break;
        }

        if (newIndex !== currentIndex) {
            filters.eq(newIndex).focus();
        }
    };

    // Lightbox keyboard navigation
    window.handleLightboxKeydown = function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            $(event.target).closest('a')[0].click();
        }
    };

    // Enhanced lightbox accessibility
    $(document).on('click', '[data-lightbox]', function (e) {
        // Add focus management for lightbox
        setTimeout(function () {
            const lightboxContainer = $('.lightbox');
            if (lightboxContainer.length) {
                lightboxContainer.attr('role', 'dialog').attr('aria-modal', 'true');
                lightboxContainer.find('.lb-close').attr('aria-label', 'Fermer la lightbox');
                lightboxContainer.find('.lb-prev').attr('aria-label', 'Image précédente');
                lightboxContainer.find('.lb-next').attr('aria-label', 'Image suivante');
            }
        }, 100);
    });

    // Newsletter form validation and submission
    $('.newsletter-form').on('submit', function (e) {
        e.preventDefault();

        const email = $('#newsletter-email').val().trim();
        const errorDiv = $('#newsletter-error');
        const successDiv = $('#newsletter-success');

        // Reset messages
        errorDiv.hide().text('');
        successDiv.hide().text('');

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            errorDiv.text('Veuillez saisir votre adresse email.').show();
            $('#newsletter-email').focus();
            return;
        }

        if (!emailRegex.test(email)) {
            errorDiv.text('Veuillez saisir une adresse email valide.').show();
            $('#newsletter-email').focus();
            return;
        }

        // Simulate form submission (replace with actual endpoint)
        successDiv.text('Merci ! Votre inscription a été enregistrée avec succès.').show();
        $('#newsletter-email').val('');

        // Hide success message after 5 seconds
        setTimeout(function () {
            successDiv.fadeOut();
        }, 5000);
    });

    // Real-time email validation
    $('#newsletter-email').on('blur', function () {
        const email = $(this).val().trim();
        const errorDiv = $('#newsletter-error');

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorDiv.text('Format d\'email invalide.').show();
        } else {
            errorDiv.hide();
        }
    });

})(jQuery);


// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const serviceSelect = document.getElementById('contact-service');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const privacyCheckbox = document.getElementById('contact-privacy');
    const submitBtn = document.getElementById('submit-btn');
    const messageCounter = document.getElementById('message-counter');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // Validation functions
    function validateName(name) {
        return name.trim().length >= 2 && name.trim().length <= 50;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        if (!phone.trim()) return true; // Optional field
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    function validateSubject(subject) {
        return subject.trim().length >= 5 && subject.trim().length <= 100;
    }

    function validateMessage(message) {
        return message.trim().length >= 10 && message.trim().length <= 1000;
    }

    // Show validation error
    function showError(input, message) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        const errorDiv = document.getElementById(input.getAttribute('aria-describedby').split(' ')[0]);
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    // Show validation success
    function showSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        const errorDiv = document.getElementById(input.getAttribute('aria-describedby').split(' ')[0]);
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    // Clear validation
    function clearValidation(input) {
        input.classList.remove('is-invalid', 'is-valid');
        const errorDiv = document.getElementById(input.getAttribute('aria-describedby').split(' ')[0]);
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    // Real-time validation
    nameInput.addEventListener('blur', function () {
        const name = this.value.trim();
        if (!name) {
            showError(this, 'Name is required.');
        } else if (!validateName(name)) {
            showError(this, 'Name must be between 2 and 50 characters.');
        } else {
            showSuccess(this);
        }
    });

    emailInput.addEventListener('blur', function () {
        const email = this.value.trim();
        if (!email) {
            showError(this, 'Email is required.');
        } else if (!validateEmail(email)) {
            showError(this, 'Please enter a valid email address.');
        } else {
            showSuccess(this);
        }
    });

    phoneInput.addEventListener('blur', function () {
        const phone = this.value.trim();
        if (phone && !validatePhone(phone)) {
            showError(this, 'Please enter a valid phone number.');
        } else {
            clearValidation(this);
        }
    });

    subjectInput.addEventListener('blur', function () {
        const subject = this.value.trim();
        if (!subject) {
            showError(this, 'Subject is required.');
        } else if (!validateSubject(subject)) {
            showError(this, 'Subject must be between 5 and 100 characters.');
        } else {
            showSuccess(this);
        }
    });

    messageInput.addEventListener('input', function () {
        const message = this.value;
        const length = message.length;

        // Update character counter
        messageCounter.textContent = `${length}/1000 characters`;

        if (length > 800) {
            messageCounter.classList.add('text-warning');
            messageCounter.classList.remove('text-danger');
        } else {
            messageCounter.classList.remove('text-warning');
        }

        if (length > 950) {
            messageCounter.classList.add('text-danger');
            messageCounter.classList.remove('text-warning');
        } else {
            messageCounter.classList.remove('text-danger');
        }
    });

    messageInput.addEventListener('blur', function () {
        const message = this.value.trim();
        if (!message) {
            showError(this, 'Message is required.');
        } else if (!validateMessage(message)) {
            showError(this, 'Message must be between 10 and 1000 characters.');
        } else {
            showSuccess(this);
        }
    });

    privacyCheckbox.addEventListener('change', function () {
        const errorDiv = document.getElementById('privacy-error');
        if (this.checked) {
            this.classList.remove('is-invalid');
            if (errorDiv) errorDiv.textContent = '';
        } else {
            this.classList.add('is-invalid');
            if (errorDiv) errorDiv.textContent = 'You must agree to the privacy policy.';
        }
    });

    // Form submission
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Hide previous messages
        formSuccess.classList.add('d-none');
        formError.classList.add('d-none');

        // Validate all fields
        let isValid = true;

        const name = nameInput.value.trim();
        if (!name || !validateName(name)) {
            showError(nameInput, !name ? 'Name is required.' : 'Name must be between 2 and 50 characters.');
            isValid = false;
        }

        const email = emailInput.value.trim();
        if (!email || !validateEmail(email)) {
            showError(emailInput, !email ? 'Email is required.' : 'Please enter a valid email address.');
            isValid = false;
        }

        const phone = phoneInput.value.trim();
        if (phone && !validatePhone(phone)) {
            showError(phoneInput, 'Please enter a valid phone number.');
            isValid = false;
        }

        const subject = subjectInput.value.trim();
        if (!subject || !validateSubject(subject)) {
            showError(subjectInput, !subject ? 'Subject is required.' : 'Subject must be between 5 and 100 characters.');
            isValid = false;
        }

        const message = messageInput.value.trim();
        if (!message || !validateMessage(message)) {
            showError(messageInput, !message ? 'Message is required.' : 'Message must be between 10 and 1000 characters.');
            isValid = false;
        }

        if (!privacyCheckbox.checked) {
            privacyCheckbox.classList.add('is-invalid');
            const errorDiv = document.getElementById('privacy-error');
            if (errorDiv) errorDiv.textContent = 'You must agree to the privacy policy.';
            isValid = false;
        }

        if (!isValid) {
            // Focus on first invalid field
            const firstInvalid = contactForm.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.querySelector('.submit-text').classList.add('d-none');
        submitBtn.querySelector('.submit-loading').classList.remove('d-none');

        // Simulate form submission
        setTimeout(() => {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.querySelector('.submit-text').classList.remove('d-none');
            submitBtn.querySelector('.submit-loading').classList.add('d-none');

            // Show success message
            formSuccess.classList.remove('d-none');

            // Reset form
            contactForm.reset();
            messageCounter.textContent = '0/1000 characters';
            messageCounter.classList.remove('text-warning', 'text-danger');

            // Clear all validation states
            const inputs = contactForm.querySelectorAll('.form-control, .form-check-input');
            inputs.forEach(input => clearValidation(input));

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        }, 2000);
    });
}

// Google Maps Enhancement
const mapContainer = document.querySelector('.map-container');
if (mapContainer) {
    const mapIframe = document.getElementById('google-map');
    const mapLoading = document.getElementById('map-loading');
    const mapError = document.getElementById('map-error');
    const mapFullscreenBtn = document.getElementById('map-fullscreen');
    const mapDirectionsBtn = document.getElementById('map-directions');
    const mapRefreshBtn = document.getElementById('map-refresh');

    // Company coordinates
    const companyLat = 6.1666667;
    const companyLng = 1.2166667;
    const companyAddress = 'Rue du CYRUS-Ablogame N°1, Villa N°140-Zone, Lomé, TOGO';

    // Map loading handler
    if (mapIframe) {
        mapIframe.addEventListener('load', function () {
            setTimeout(() => {
                mapLoading.style.display = 'none';
            }, 1000);
        });

        mapIframe.addEventListener('error', function () {
            mapLoading.style.display = 'none';
            mapError.classList.remove('d-none');
            mapError.classList.add('d-flex');
        });
    }

    // Fullscreen functionality
    if (mapFullscreenBtn) {
        mapFullscreenBtn.addEventListener('click', function () {
            const googleMapsUrl = `https://www.google.com/maps?q=${companyLat},${companyLng}&z=15&output=embed`;
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // Directions functionality
    if (mapDirectionsBtn) {
        mapDirectionsBtn.addEventListener('click', function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        const directionsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${companyLat},${companyLng}`;
                        window.open(directionsUrl, '_blank', 'noopener,noreferrer');
                    },
                    function (error) {
                        // Fallback: open directions without user location
                        const directionsUrl = `https://www.google.com/maps/dir//${companyLat},${companyLng}`;
                        window.open(directionsUrl, '_blank', 'noopener,noreferrer');
                    },
                    {
                        timeout: 10000,
                        enableHighAccuracy: true
                    }
                );
            } else {
                // Geolocation not supported, open directions without user location
                const directionsUrl = `https://www.google.com/maps/dir//${companyLat},${companyLng}`;
                window.open(directionsUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }

    // Refresh map functionality
    if (mapRefreshBtn) {
        mapRefreshBtn.addEventListener('click', function () {
            mapLoading.style.display = 'flex';
            mapError.classList.add('d-none');
            mapError.classList.remove('d-flex');

            // Reload the iframe
            const currentSrc = mapIframe.src;
            mapIframe.src = '';
            setTimeout(() => {
                mapIframe.src = currentSrc;
            }, 100);
        });
    }

    // Keyboard navigation for map
    if (mapIframe) {
        mapIframe.addEventListener('keydown', function (e) {
            // Allow standard iframe keyboard navigation
            if (e.key === 'Tab') {
                // Let the browser handle tab navigation
                return;
            }

            // Add custom keyboard shortcuts if needed
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                mapFullscreenBtn.click();
            } else if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                mapDirectionsBtn.click();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                mapRefreshBtn.click();
            }
        });
    }

    // Handle map container resize
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            // Trigger map resize if needed
            if (mapIframe && mapIframe.contentWindow) {
                try {
                    mapIframe.contentWindow.postMessage('resize', '*');
                } catch (e) {
                    // Cross-origin restrictions may prevent this
                    console.log('Map resize message blocked by CORS policy');
                }
            }
        }
    });

    resizeObserver.observe(mapContainer);

    // Intersection Observer for lazy loading optimization
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Map is visible, ensure it's loaded
                if (mapIframe && !mapIframe.src) {
                    mapIframe.src = mapIframe.dataset.src || mapIframe.getAttribute('data-src');
                }
                mapObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    mapObserver.observe(mapContainer);

    // Handle network connectivity changes
    window.addEventListener('online', function () {
        if (mapError.classList.contains('d-flex')) {
            mapRefreshBtn.click();
        }
    });

    window.addEventListener('offline', function () {
        if (!mapError.classList.contains('d-flex')) {
            mapLoading.style.display = 'none';
            mapError.classList.remove('d-none');
            mapError.classList.add('d-flex');

            // Update error message for offline state
            const errorMessage = mapError.querySelector('p');
            if (errorMessage) {
                errorMessage.textContent = 'No internet connection. Please check your network and try again.';
            }
        }
    });
}

// ===== BATCH 2 ENHANCEMENTS =====

// Enhanced Team Navigation with Keyboard Support
document.addEventListener('DOMContentLoaded', function () {
    // Team Navigation Enhancement
    const teamNavLinks = document.querySelectorAll('.team-nav-link');
    teamNavLinks.forEach(link => {
        // Add keyboard navigation support
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add focus management
        link.addEventListener('focus', function () {
            this.setAttribute('aria-expanded', 'true');
        });

        link.addEventListener('blur', function () {
            this.setAttribute('aria-expanded', 'false');
        });
    });

    // Portfolio Filter Enhancement
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.setAttribute('aria-hidden', 'false');
                } else {
                    item.style.display = 'none';
                    item.setAttribute('aria-hidden', 'true');
                }
            });

            // Announce filter change to screen readers
            announceToScreenReader(`Showing ${filter === 'all' ? 'all' : filter} portfolio items`);
        });

        // Keyboard support for filter buttons
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Enhanced Newsletter Form Validation
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const errorDiv = form.querySelector('.invalid-feedback');

        if (emailInput && submitButton) {
            // Real-time validation
            emailInput.addEventListener('input', function () {
                validateEmailInput(this, errorDiv);
            });

            // Form submission
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                if (validateEmailInput(emailInput, errorDiv)) {
                    // Simulate form submission
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Subscribing...';

                    setTimeout(() => {
                        submitButton.innerHTML = '<i class="fas fa-check me-1"></i>Subscribed!';
                        submitButton.classList.remove('btn-primary');
                        submitButton.classList.add('btn-success');
                        emailInput.value = '';

                        announceToScreenReader('Successfully subscribed to newsletter');

                        setTimeout(() => {
                            submitButton.disabled = false;
                            submitButton.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Subscribe';
                            submitButton.classList.remove('btn-success');
                            submitButton.classList.add('btn-primary');
                        }, 3000);
                    }, 2000);
                }
            });
        }
    });

    // Enhanced Carousel Accessibility
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        // Add keyboard navigation
        carousel.addEventListener('keydown', function (e) {
            const prevBtn = this.querySelector('.carousel-control-prev');
            const nextBtn = this.querySelector('.carousel-control-next');

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (prevBtn) prevBtn.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (nextBtn) nextBtn.click();
                    break;
            }
        });

        // Pause on hover and focus
        carousel.addEventListener('mouseenter', function () {
            if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
                const bsCarousel = bootstrap.Carousel.getInstance(this);
                if (bsCarousel) bsCarousel.pause();
            }
        });

        carousel.addEventListener('mouseleave', function () {
            if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
                const bsCarousel = bootstrap.Carousel.getInstance(this);
                if (bsCarousel) bsCarousel.cycle();
            }
        });

        // Announce slide changes
        carousel.addEventListener('slide.bs.carousel', function (e) {
            const slideNumber = e.to + 1;
            const totalSlides = this.querySelectorAll('.carousel-item').length;
            announceToScreenReader(`Slide ${slideNumber} of ${totalSlides}`);
        });
    });

    // Enhanced Branch Contact Links
    const branchContactLinks = document.querySelectorAll('.branch-contact-item a');
    branchContactLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Add visual feedback for contact actions
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
                setTimeout(() => {
                    icon.classList.remove('fa-spin');
                }, 1000);
            }
        });
    });

    // Service Links Enhancement
    const serviceLinks = document.querySelectorAll('.service-link');
    serviceLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        link.addEventListener('mouseleave', function () {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Team Social Links Enhancement
    const teamSocialLinks = document.querySelectorAll('.team-social-links a');
    teamSocialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Add visual feedback
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3)';
                icon.style.transition = 'transform 0.2s ease';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }

            // Show tooltip or message
            showTooltip(this, 'Social media link not available');
        });
    });

    // Smooth Scroll Enhancement for Skip Links
    const skipLinks = document.querySelectorAll('.skip-to-content');
    skipLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                targetElement.focus();
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Add staggered animation for team cards
                if (entry.target.classList.contains('team-card') ||
                    entry.target.classList.contains('branch-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.team-card, .branch-card, .portfolio-item, .accreditation-item');
    animatedElements.forEach(el => observer.observe(el));

    // Motion Preference Detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('reduce-motion');
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                .reduce-motion *,
                .reduce-motion *::before,
                .reduce-motion *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleMotionPreference(prefersReducedMotion);
    prefersReducedMotion.addListener(handleMotionPreference);
});

// Utility Functions for Batch 2
function validateEmailInput(input, errorDiv) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        showInputError(input, errorDiv, 'Email address is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showInputError(input, errorDiv, 'Please enter a valid email address');
        return false;
    } else {
        showInputSuccess(input, errorDiv);
        return true;
    }
}

function showInputError(input, errorDiv, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    input.setAttribute('aria-invalid', 'true');
}

function showInputSuccess(input, errorDiv) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
    input.setAttribute('aria-invalid', 'false');
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        if (document.body.contains(announcement)) {
            document.body.removeChild(announcement);
        }
    }, 1000);
}

function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                document.body.removeChild(tooltip);
            }
        }, 300);
    }, 2000);
}

// Enhanced Error Handling for Batch 2
window.addEventListener('error', function (e) {
    // FIXED: Only log if there's an actual error with a message
    if (e.error && e.error.message) {
        console.error('JavaScript Error:', e.error);

        // Show user-friendly error message for critical failures
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-warning alert-dismissible fade show position-fixed';
        errorMessage.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        errorMessage.innerHTML = `
            <strong>Notice:</strong> Some interactive features may not be working properly.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        document.body.appendChild(errorMessage);

        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 5000);
    }
});

// Performance Monitoring for Batch 2
if ('performance' in window) {
    window.addEventListener('load', function () {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Batch 2 Page Load Performance:', {
                    'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    'Load Complete': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    'Total Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart)
                });
            }
        }, 0);
    });
}

// Enhanced Accessibility for Batch 2
document.addEventListener('keydown', function (e) {
    // Enhanced keyboard navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
});

// Add CSS for keyboard navigation and animations
const batch2Style = document.createElement('style');
batch2Style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #007bff !important;
        outline-offset: 2px !important;
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
    }
`;
document.head.appendChild(batch2Style);

// ===== BATCH 3 JAVASCRIPT ENHANCEMENTS - START =====

// General Conditions Page Functionality
document.addEventListener('DOMContentLoaded', function () {
    // PDF Download and Viewer Functionality
    initializePDFDownloads();

    // Health & Safety Statistics Animation
    initializeHSEStats();

    // Loss Prevention Risk Assessment
    initializeRiskAssessment();

    // P&I Claims Timeline
    initializeClaimsTimeline();

    // Enhanced Newsletter Forms for Batch 3
    initializeBatch3NewsletterForms();

    // Enhanced Carousel Accessibility for Batch 3
    initializeBatch3Carousels();

    // Team Social Media Links for Batch 3
    initializeBatch3TeamSocial();
});

// PDF Download and Viewer Functionality
function initializePDFDownloads() {
    const downloadBtns = document.querySelectorAll('.download-btn');
    const pdfViewers = document.querySelectorAll('.pdf-viewer');

    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const pdfUrl = this.getAttribute('data-pdf-url');
            const pdfTitle = this.getAttribute('data-pdf-title') || 'Document';

            if (pdfUrl) {
                // Try to open PDF in viewer
                openPDFViewer(pdfUrl, pdfTitle);
            } else {
                // Fallback download
                downloadPDF(this.href, pdfTitle);
            }
        });

        // Add keyboard support
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function openPDFViewer(pdfUrl, title) {
    try {
        // Check if PDF.js is available
        if (typeof pdfjsLib !== 'undefined') {
            displayPDFInViewer(pdfUrl, title);
        } else {
            // Fallback to iframe or download
            displayPDFInIframe(pdfUrl, title);
        }
    } catch (error) {
        console.error('Error opening PDF viewer:', error);
        showPDFError(title);
    }
}

function displayPDFInViewer(pdfUrl, title) {
    const viewerContainer = document.querySelector('.pdf-viewer-container');
    if (!viewerContainer) return;

    viewerContainer.innerHTML = `
        <div class="pdf-viewer-header">
            <h5 class="mb-0">${title}</h5>
            <div class="pdf-viewer-controls">
                <button class="btn btn-sm btn-outline-light" onclick="zoomOut()">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="btn btn-sm btn-outline-light" onclick="zoomIn()">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button class="btn btn-sm btn-outline-light" onclick="downloadPDF('${pdfUrl}', '${title}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn btn-sm btn-outline-light" onclick="closePDFViewer()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="pdf-viewer-content">
            <canvas id="pdf-canvas" style="width: 100%; height: 600px;"></canvas>
        </div>
    `;

    viewerContainer.style.display = 'block';

    // Load PDF with PDF.js
    pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
        return pdf.getPage(1);
    }).then(function (page) {
        const canvas = document.getElementById('pdf-canvas');
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);
    }).catch(function (error) {
        console.error('Error loading PDF:', error);
        showPDFError(title);
    });
}

function displayPDFInIframe(pdfUrl, title) {
    const viewerContainer = document.querySelector('.pdf-viewer-container');
    if (!viewerContainer) return;

    viewerContainer.innerHTML = `
        <div class="pdf-viewer-header">
            <h5 class="mb-0">${title}</h5>
            <div class="pdf-viewer-controls">
                <button class="btn btn-sm btn-outline-light" onclick="downloadPDF('${pdfUrl}', '${title}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-sm btn-outline-light" onclick="closePDFViewer()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
        <iframe src="${pdfUrl}" style="width: 100%; height: 600px; border: none;"></iframe>
    `;

    viewerContainer.style.display = 'block';
}

function showPDFError(title) {
    const fallbackContainer = document.querySelector('.pdf-fallback');
    if (fallbackContainer) {
        fallbackContainer.innerHTML = `
            <i class="fas fa-file-pdf"></i>
            <h5>Unable to display PDF</h5>
            <p>The PDF viewer is not available. Please download the file to view it.</p>
            <button class="btn btn-primary" onclick="downloadPDF(this.getAttribute('data-url'), '${title}')">
                <i class="fas fa-download"></i> Download ${title}
            </button>
        `;
        fallbackContainer.style.display = 'block';
    }
}

function downloadPDF(url, filename) {
    try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename + '.pdf';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Show success message
        showNotification('Download started successfully', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Download failed. Please try again.', 'error');
    }
}

function closePDFViewer() {
    const viewerContainer = document.querySelector('.pdf-viewer-container');
    if (viewerContainer) {
        viewerContainer.style.display = 'none';
    }
}

// Health & Safety Statistics Animation
function initializeHSEStats() {
    const statNumbers = document.querySelectorAll('.hse-stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateStatNumber(element) {
    const finalValue = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = finalValue / (duration / 16);
    let currentValue = 0;

    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(timer);
        }

        // Format number with commas and preserve any suffix
        const suffix = element.textContent.replace(/[\d,]/g, '');
        element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
    }, 16);
}

// Loss Prevention Risk Assessment
function initializeRiskAssessment() {
    const riskCards = document.querySelectorAll('.risk-assessment-card');

    riskCards.forEach(card => {
        // Add interactive hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add click functionality for detailed view
        card.addEventListener('click', function () {
            const riskLevel = this.querySelector('.risk-level-indicator').textContent;
            const riskTitle = this.querySelector('h5').textContent;
            showRiskDetails(riskLevel, riskTitle);
        });

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function showRiskDetails(level, title) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Risk Assessment Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h6>${title}</h6>
                    <p><strong>Risk Level:</strong> <span class="risk-level-indicator risk-level-${level.toLowerCase()}">${level}</span></p>
                    <p>Detailed risk assessment information would be displayed here.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Download Report</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

// P&I Claims Timeline
function initializeClaimsTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    timelineItems.forEach((item, index) => {
        // Initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;

        observer.observe(item);

        // Add click functionality
        item.addEventListener('click', function () {
            const step = this.querySelector('.timeline-step').textContent;
            showTimelineDetails(step);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function showTimelineDetails(step) {
    showNotification(`Detailed information for ${step} would be displayed here.`, 'info');
}

// Enhanced Newsletter Forms for Batch 3
function initializeBatch3NewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (emailInput && submitBtn) {
            // Real-time validation
            emailInput.addEventListener('input', function () {
                validateEmailInput(this);
            });

            emailInput.addEventListener('blur', function () {
                validateEmailInput(this);
            });

            // Form submission
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                handleNewsletterSubmission(this);
            });

            // Enhanced accessibility
            emailInput.setAttribute('aria-describedby', 'email-help');
            if (!form.querySelector('#email-help')) {
                const helpText = document.createElement('div');
                helpText.id = 'email-help';
                helpText.className = 'form-text';
                helpText.textContent = 'Enter your email address to subscribe to our newsletter';
                emailInput.parentNode.appendChild(helpText);
            }
        }
    });
}

function validateEmailInput(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove existing feedback
    const existingFeedback = input.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    input.classList.remove('is-valid', 'is-invalid');

    if (email === '') {
        return;
    }

    if (emailRegex.test(email)) {
        input.classList.add('is-valid');
        const feedback = document.createElement('div');
        feedback.className = 'valid-feedback';
        feedback.textContent = 'Email address is valid';
        input.parentNode.appendChild(feedback);
    } else {
        input.classList.add('is-invalid');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = 'Please enter a valid email address';
        input.parentNode.appendChild(feedback);
    }
}

function handleNewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    if (!email || !validateEmailInput(emailInput)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');

        // Reset form
        form.reset();
        emailInput.classList.remove('is-valid', 'is-invalid');
        const feedback = form.querySelector('.invalid-feedback, .valid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }, 2000);
}

// Enhanced Carousel Accessibility for Batch 3
function initializeBatch3Carousels() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        // Add ARIA labels
        carousel.setAttribute('aria-label', 'Image carousel');

        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        const items = carousel.querySelectorAll('.carousel-item');

        // Enhance indicators
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });

        // Enhance carousel items
        items.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img && !img.alt) {
                img.alt = `Carousel image ${index + 1}`;
            }

            item.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);
        });

        // Add keyboard navigation
        carousel.addEventListener('keydown', function (e) {
            const activeItem = this.querySelector('.carousel-item.active');
            const items = Array.from(this.querySelectorAll('.carousel-item'));
            const currentIndex = items.indexOf(activeItem);

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevBtn = this.querySelector('.carousel-control-prev');
                    if (prevBtn) prevBtn.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextBtn = this.querySelector('.carousel-control-next');
                    if (nextBtn) nextBtn.click();
                    break;
                case 'Home':
                    e.preventDefault();
                    const firstIndicator = this.querySelector('.carousel-indicators button:first-child');
                    if (firstIndicator) firstIndicator.click();
                    break;
                case 'End':
                    e.preventDefault();
                    const lastIndicator = this.querySelector('.carousel-indicators button:last-child');
                    if (lastIndicator) lastIndicator.click();
                    break;
            }
        });

        // Pause on hover for accessibility
        carousel.addEventListener('mouseenter', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel) {
                bsCarousel.pause();
            }
        });

        carousel.addEventListener('mouseleave', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel) {
                bsCarousel.cycle();
            }
        });
    });
}

// Team Social Media Links for Batch 3
function initializeBatch3TeamSocial() {
    const socialLinks = document.querySelectorAll('.team-social .btn');

    socialLinks.forEach(link => {
        // Add proper ARIA labels
        const platform = link.querySelector('i').className.includes('facebook') ? 'Facebook' :
            link.querySelector('i').className.includes('twitter') ? 'Twitter' :
                link.querySelector('i').className.includes('linkedin') ? 'LinkedIn' :
                    link.querySelector('i').className.includes('instagram') ? 'Instagram' : 'Social Media';

        link.setAttribute('aria-label', `Visit ${platform} profile`);

        // Add click tracking
        link.addEventListener('click', function (e) {
            const teamMember = this.closest('.team-item').querySelector('h4').textContent;
            console.log(`Social media click: ${teamMember} - ${platform}`);

            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Enhanced keyboard support
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add focus enhancement
        link.addEventListener('focus', function () {
            this.style.outline = '2px solid #fff';
            this.style.outlineOffset = '2px';
        });

        link.addEventListener('blur', function () {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Utility Functions for Batch 3
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;

    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// PDF Viewer Controls
function zoomIn() {
    const canvas = document.getElementById('pdf-canvas');
    if (canvas) {
        const currentScale = parseFloat(canvas.dataset.scale || '1.5');
        const newScale = Math.min(currentScale + 0.25, 3);
        canvas.dataset.scale = newScale;
        // Re-render PDF with new scale
        console.log('Zoom in to scale:', newScale);
    }
}

function zoomOut() {
    const canvas = document.getElementById('pdf-canvas');
    if (canvas) {
        const currentScale = parseFloat(canvas.dataset.scale || '1.5');
        const newScale = Math.max(currentScale - 0.25, 0.5);
        canvas.dataset.scale = newScale;
        // Re-render PDF with new scale
        console.log('Zoom out to scale:', newScale);
    }
}

// Enhanced Error Handling for Batch 3
window.addEventListener('error', function (e) {
    // FIXED: Only log actual errors, prevent null error logging
    if (e.error && e.error.message) {
        console.error('JavaScript error in Batch 3 functionality:', e.error);

        // Show user-friendly error message for PDF-related failures
        if (e.error.message.includes('PDF')) {
            showNotification('PDF functionality is temporarily unavailable. Please try downloading the file directly.', 'error');
        }
    }
});

// Performance Monitoring for Batch 3
if ('performance' in window) {
    window.addEventListener('load', function () {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Batch 3 Page Load Performance:', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

// ===== BATCH 3 JAVASCRIPT ENHANCEMENTS - END =====


// ===== BATCH 4 JAVASCRIPT ENHANCEMENTS - START =====

// Quality Policy Page Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all Batch 4 functionality
    initializeQualityPolicyFeatures();
    initializeRiskManagementFeatures();
    initializeSurveyServicesFeatures();
    initializeTallyInspectionFeatures();
    initializeBatch4NewsletterForms();
    initializeBatch4CarouselEnhancements();
    initializeBatch4AccessibilityFeatures();
});

// Quality Policy Page Features
function initializeQualityPolicyFeatures() {
    // Quality Management System Interactive Elements
    const qmsCards = document.querySelectorAll('.qms-card, .quality-card');

    qmsCards.forEach(card => {
        // Add interactive hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.03)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Add click functionality for detailed view
        card.addEventListener('click', function () {
            const title = this.querySelector('h4, h5, .card-title')?.textContent || 'Quality Policy';
            showQualityPolicyDetails(title, this);
        });

        // Enhanced keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Quality Standards Progress Animation
    animateQualityStandards();

    // Quality Policy Document Viewer
    initializeQualityDocumentViewer();
}

function showQualityPolicyDetails(title, element) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-certificate me-2"></i>${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="quality-policy-details">
                        <h6 class="text-primary">Quality Management Overview</h6>
                        <p>Our comprehensive quality management system ensures excellence in all aspects of our services.</p>
                        
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <h6><i class="fas fa-check-circle text-success me-2"></i>Key Features</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>ISO 9001:2015 Certified</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Continuous Improvement</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Customer Satisfaction Focus</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Risk-Based Approach</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <h6><i class="fas fa-target text-warning me-2"></i>Objectives</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Zero Defect Policy</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Timely Service Delivery</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Regulatory Compliance</li>
                                    <li><i class="fas fa-arrow-right text-primary me-2"></i>Stakeholder Satisfaction</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Close
                    </button>
                    <button type="button" class="btn btn-primary" onclick="downloadQualityDocument()">
                        <i class="fas fa-download me-1"></i>Download Policy
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

function animateQualityStandards() {
    const progressBars = document.querySelectorAll('.quality-progress, .progress-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width') || progressBar.style.width || '90%';

                progressBar.style.width = '0%';
                progressBar.style.transition = 'width 2s ease-in-out';

                setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 100);

                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => observer.observe(bar));
}

function initializeQualityDocumentViewer() {
    const documentLinks = document.querySelectorAll('.quality-document-link, .policy-document-link');

    documentLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const documentTitle = this.textContent.trim() || 'Quality Document';
            showDocumentViewer(documentTitle);
        });
    });
}

function downloadQualityDocument() {
    showBatch4Notification('Quality policy document download initiated', 'success');
}

// Risk Management Page Features
function initializeRiskManagementFeatures() {
    // Risk Assessment Cards
    const riskCards = document.querySelectorAll('.risk-card, .risk-assessment-item');

    riskCards.forEach(card => {
        // Add risk level indicator animation
        const riskLevel = card.querySelector('.risk-level, .risk-indicator');
        if (riskLevel) {
            const level = riskLevel.textContent.toLowerCase();
            card.classList.add(`risk-${level}`);
        }

        // Interactive hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Click functionality
        card.addEventListener('click', function () {
            const riskTitle = this.querySelector('h4, h5, .card-title')?.textContent || 'Risk Assessment';
            showRiskAssessmentDetails(riskTitle, this);
        });

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Risk Mitigation Steps Animation
    animateRiskMitigationSteps();

    // Risk Assessment Calculator
    initializeRiskCalculator();
}

function showRiskAssessmentDetails(title, element) {
    const riskLevel = element.querySelector('.risk-level, .risk-indicator')?.textContent || 'Medium';

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle me-2"></i>Risk Assessment: ${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="risk-assessment-details">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="risk-level-display text-center p-3 rounded bg-light">
                                    <h3 class="risk-level-indicator risk-${riskLevel.toLowerCase()}">${riskLevel}</h3>
                                    <p class="mb-0">Risk Level</p>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h6>Risk Analysis</h6>
                                <p>Comprehensive risk assessment including probability, impact, and mitigation strategies.</p>
                                
                                <div class="risk-factors mt-3">
                                    <h6>Key Risk Factors:</h6>
                                    <ul>
                                        <li>Operational risks and dependencies</li>
                                        <li>Environmental and regulatory factors</li>
                                        <li>Financial and market conditions</li>
                                        <li>Technical and infrastructure risks</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mitigation-strategies mt-4">
                            <h6>Mitigation Strategies</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="text-success">Preventive Measures</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-shield-alt text-success me-2"></i>Regular monitoring and assessment</li>
                                        <li><i class="fas fa-shield-alt text-success me-2"></i>Staff training and awareness</li>
                                        <li><i class="fas fa-shield-alt text-success me-2"></i>Process standardization</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-warning">Contingency Plans</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-exclamation-circle text-warning me-2"></i>Emergency response procedures</li>
                                        <li><i class="fas fa-exclamation-circle text-warning me-2"></i>Business continuity planning</li>
                                        <li><i class="fas fa-exclamation-circle text-warning me-2"></i>Insurance and financial protection</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Close
                    </button>
                    <button type="button" class="btn btn-danger" onclick="downloadRiskReport()">
                        <i class="fas fa-file-pdf me-1"></i>Download Report
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

function animateRiskMitigationSteps() {
    const steps = document.querySelectorAll('.mitigation-step, .risk-step');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        step.style.transition = 'all 0.6s ease';
        observer.observe(step);
    });
}

function initializeRiskCalculator() {
    const calculatorBtn = document.querySelector('.risk-calculator-btn');
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function () {
            showRiskCalculator();
        });
    }
}

function showRiskCalculator() {
    showBatch4Notification('Risk calculator feature coming soon', 'info');
}

function downloadRiskReport() {
    showBatch4Notification('Risk assessment report download initiated', 'success');
}

// Survey Services Page Features
function initializeSurveyServicesFeatures() {
    // Survey Service Cards
    const surveyCards = document.querySelectorAll('.survey-card, .service-card');

    surveyCards.forEach(card => {
        // Add service type indicator
        const serviceType = card.querySelector('.service-type, .survey-type');
        if (serviceType) {
            const type = serviceType.textContent.toLowerCase();
            card.classList.add(`survey-${type.replace(/\s+/g, '-')}`);
        }

        // Interactive effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.03)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Click functionality
        card.addEventListener('click', function () {
            const serviceTitle = this.querySelector('h4, h5, .card-title')?.textContent || 'Survey Service';
            showSurveyServiceDetails(serviceTitle, this);
        });

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Survey Benefits Animation
    animateSurveyBenefits();

    // Survey Request Form
    initializeSurveyRequestForm();
}

function showSurveyServiceDetails(title, element) {
    const serviceType = element.querySelector('.service-type, .survey-type')?.textContent || 'General Survey';

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-info text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-search me-2"></i>Survey Service: ${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="survey-service-details">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="service-type-display text-center p-3 rounded bg-light">
                                    <i class="fas fa-clipboard-check fa-3x text-info mb-3"></i>
                                    <h5>${serviceType}</h5>
                                    <p class="mb-0">Service Category</p>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h6>Service Overview</h6>
                                <p>Professional survey services tailored to meet your specific requirements with accuracy and reliability.</p>
                                
                                <div class="service-features mt-3">
                                    <h6>Key Features:</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Certified Surveyors</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Advanced Equipment</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Detailed Reporting</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>24/7 Availability</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Global Coverage</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Regulatory Compliance</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="survey-process mt-4">
                            <h6>Survey Process</h6>
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <div class="process-step">
                                        <i class="fas fa-phone fa-2x text-primary mb-2"></i>
                                        <h6>1. Contact</h6>
                                        <p class="small">Initial consultation and requirements gathering</p>
                                    </div>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="process-step">
                                        <i class="fas fa-calendar fa-2x text-primary mb-2"></i>
                                        <h6>2. Schedule</h6>
                                        <p class="small">Appointment scheduling and preparation</p>
                                    </div>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="process-step">
                                        <i class="fas fa-search fa-2x text-primary mb-2"></i>
                                        <h6>3. Survey</h6>
                                        <p class="small">Professional on-site survey execution</p>
                                    </div>
                                </div>
                                <div class="col-md-3 text-center">
                                    <div class="process-step">
                                        <i class="fas fa-file-alt fa-2x text-primary mb-2"></i>
                                        <h6>4. Report</h6>
                                        <p class="small">Comprehensive report delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Close
                    </button>
                    <button type="button" class="btn btn-info" onclick="requestSurveyQuote()">
                        <i class="fas fa-calculator me-1"></i>Request Quote
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

function animateSurveyBenefits() {
    const benefits = document.querySelectorAll('.survey-benefit, .benefit-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    benefits.forEach(benefit => {
        benefit.style.opacity = '0';
        benefit.style.transform = 'translateY(30px) scale(0.9)';
        benefit.style.transition = 'all 0.6s ease';
        observer.observe(benefit);
    });
}

function initializeSurveyRequestForm() {
    const requestBtn = document.querySelector('.survey-request-btn, .request-survey-btn');
    if (requestBtn) {
        requestBtn.addEventListener('click', function () {
            showSurveyRequestForm();
        });
    }
}

function showSurveyRequestForm() {
    showBatch4Notification('Survey request form will open shortly', 'info');
}

function requestSurveyQuote() {
    showBatch4Notification('Quote request submitted successfully', 'success');
}

// Tally Inspection Page Features
function initializeTallyInspectionFeatures() {
    // Inspection Service Cards
    const inspectionCards = document.querySelectorAll('.inspection-card, .tally-card');

    inspectionCards.forEach(card => {
        // Add inspection type indicator
        const inspectionType = card.querySelector('.inspection-type, .tally-type');
        if (inspectionType) {
            const type = inspectionType.textContent.toLowerCase();
            card.classList.add(`inspection-${type.replace(/\s+/g, '-')}`);
        }

        // Interactive effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.03)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Click functionality
        card.addEventListener('click', function () {
            const inspectionTitle = this.querySelector('h4, h5, .card-title')?.textContent || 'Tally Inspection';
            showTallyInspectionDetails(inspectionTitle, this);
        });

        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Inspection Features Animation
    animateInspectionFeatures();

    // Inspection Booking System
    initializeInspectionBooking();
}

function showTallyInspectionDetails(title, element) {
    const inspectionType = element.querySelector('.inspection-type, .tally-type')?.textContent || 'General Inspection';

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-clipboard-list me-2"></i>Tally Inspection: ${title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="tally-inspection-details">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="inspection-type-display text-center p-3 rounded bg-light">
                                    <i class="fas fa-tasks fa-3x text-success mb-3"></i>
                                    <h5>${inspectionType}</h5>
                                    <p class="mb-0">Inspection Type</p>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h6>Inspection Overview</h6>
                                <p>Professional tally and inspection services ensuring accuracy, compliance, and quality assurance for your cargo and operations.</p>
                                
                                <div class="inspection-capabilities mt-3">
                                    <h6>Our Capabilities:</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Cargo Tally Services</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Quality Inspections</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Damage Assessments</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-check text-success me-2"></i>Documentation Services</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Compliance Verification</li>
                                                <li><i class="fas fa-check text-success me-2"></i>Real-time Reporting</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="inspection-benefits mt-4">
                            <h6>Key Benefits</h6>
                            <div class="row">
                                <div class="col-md-4 text-center">
                                    <div class="benefit-item">
                                        <i class="fas fa-accuracy fa-2x text-primary mb-2"></i>
                                        <h6>Accuracy</h6>
                                        <p class="small">Precise counting and measurement with minimal discrepancies</p>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="benefit-item">
                                        <i class="fas fa-clock fa-2x text-primary mb-2"></i>
                                        <h6>Efficiency</h6>
                                        <p class="small">Streamlined processes reducing turnaround time</p>
                                    </div>
                                </div>
                                <div class="col-md-4 text-center">
                                    <div class="benefit-item">
                                        <i class="fas fa-shield-alt fa-2x text-primary mb-2"></i>
                                        <h6>Reliability</h6>
                                        <p class="small">Consistent quality and dependable service delivery</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="professional-approach mt-4">
                            <h6>Our Professional Approach</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="text-primary">Pre-Inspection</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-arrow-right text-primary me-2"></i>Requirements analysis</li>
                                        <li><i class="fas fa-arrow-right text-primary me-2"></i>Resource planning</li>
                                        <li><i class="fas fa-arrow-right text-primary me-2"></i>Safety protocols</li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-success">Post-Inspection</h6>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-arrow-right text-success me-2"></i>Detailed reporting</li>
                                        <li><i class="fas fa-arrow-right text-success me-2"></i>Quality verification</li>
                                        <li><i class="fas fa-arrow-right text-success me-2"></i>Follow-up support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-1"></i>Close
                    </button>
                    <button type="button" class="btn btn-success" onclick="bookInspectionService()">
                        <i class="fas fa-calendar-plus me-1"></i>Book Service
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.addEventListener('hidden.bs.modal', function () {
        document.body.removeChild(modal);
    });
}

function animateInspectionFeatures() {
    const features = document.querySelectorAll('.inspection-feature, .tally-feature');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
                observer.unobserve(entry.target);


            }
        });
    }, { threshold: 0.3 });

    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px) scale(0.9)';
        feature.style.transition = 'all 0.6s ease';
        observer.observe(feature);
    });
}

function initializeInspectionBooking() {
    const bookingBtn = document.querySelector('.inspection-booking-btn, .book-inspection-btn');
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function () {
            showInspectionBookingForm();
        });
    }
}

function showInspectionBookingForm() {
    showBatch4Notification('Inspection booking form will open shortly', 'info');
}

function bookInspectionService() {
    showBatch4Notification('Inspection service booking request submitted', 'success');
}

// Enhanced Newsletter Forms for Batch 4
function initializeBatch4NewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="submit"]');

        if (emailInput && submitBtn) {
            // Enhanced real-time validation
            emailInput.addEventListener('input', function () {
                validateBatch4EmailInput(this);
            });

            emailInput.addEventListener('blur', function () {
                validateBatch4EmailInput(this);
            });

            // Enhanced form submission
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                handleBatch4NewsletterSubmission(this);
            });

            // Add ARIA attributes for better accessibility
            emailInput.setAttribute('aria-describedby', 'newsletter-help');
            if (!form.querySelector('#newsletter-help')) {
                const helpText = document.createElement('div');
                helpText.id = 'newsletter-help';
                helpText.className = 'form-text text-muted';
                helpText.textContent = 'Subscribe to receive updates about our services and industry insights';
                emailInput.parentNode.appendChild(helpText);
            }
        }
    });
}

function validateBatch4EmailInput(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove existing feedback
    const existingFeedback = input.parentNode.querySelector('.invalid-feedback, .valid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    input.classList.remove('is-valid', 'is-invalid');
    input.setAttribute('aria-invalid', 'false');

    if (email === '') {
        return true; // Empty is valid (not required to show feedback)
    }

    if (emailRegex.test(email)) {
        input.classList.add('is-valid');
        const feedback = document.createElement('div');
        feedback.className = 'valid-feedback';
        feedback.textContent = 'Email address looks good!';
        input.parentNode.appendChild(feedback);
        return true;
    } else {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = 'Please enter a valid email address';
        input.parentNode.appendChild(feedback);
        return false;
    }
}

function handleBatch4NewsletterSubmission(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim();

    if (!email || !validateBatch4EmailInput(emailInput)) {
        showBatch4Notification('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }

    // Show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Subscribing...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        // Show success message
        showBatch4Notification('Successfully subscribed to our newsletter!', 'success');

        // Reset form
        form.reset();
        emailInput.classList.remove('is-valid', 'is-invalid');
        const feedback = form.querySelector('.invalid-feedback, .valid-feedback');
        if (feedback) {
            feedback.remove();
        }

        // Announce to screen readers
        announceToScreenReader('Successfully subscribed to newsletter');
    }, 2000);
}

// Enhanced Carousel Accessibility for Batch 4
function initializeBatch4CarouselEnhancements() {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        // Ensure unique IDs for Batch 4 carousels
        if (!carousel.id) {
            carousel.id = 'carousel-' + Math.random().toString(36).substr(2, 9);
        }

        // Add comprehensive ARIA labels
        carousel.setAttribute('aria-label', 'Image carousel with navigation controls');
        carousel.setAttribute('aria-roledescription', 'carousel');

        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-control-prev');
        const nextBtn = carousel.querySelector('.carousel-control-next');

        // Enhance indicators with better labels
        indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-label', `Go to slide ${index + 1} of ${items.length}`);
            indicator.setAttribute('aria-describedby', `${carousel.id}-slide-${index + 1}`);
        });

        // Enhance carousel items
        items.forEach((item, index) => {
            item.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);
            item.id = `${carousel.id}-slide-${index + 1}`;

            const img = item.querySelector('img');
            if (img && (!img.alt || img.alt.trim() === '')) {
                img.alt = `Carousel image ${index + 1}: ${item.querySelector('.carousel-caption h5')?.textContent || 'Image description'}`;
            }
        });

        // Enhance control buttons
        if (prevBtn) {
            prevBtn.setAttribute('aria-label', 'Go to previous slide');
            prevBtn.setAttribute('title', 'Previous slide');
        }
        if (nextBtn) {
            nextBtn.setAttribute('aria-label', 'Go to next slide');
            nextBtn.setAttribute('title', 'Next slide');
        }

        // Add enhanced keyboard navigation
        carousel.addEventListener('keydown', function (e) {
            const activeItem = this.querySelector('.carousel-item.active');
            const items = Array.from(this.querySelectorAll('.carousel-item'));
            const currentIndex = items.indexOf(activeItem);

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (prevBtn) {
                        prevBtn.click();
                        announceToScreenReader(`Moved to slide ${currentIndex === 0 ? items.length : currentIndex}`);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (nextBtn) {
                        nextBtn.click();
                        announceToScreenReader(`Moved to slide ${currentIndex === items.length - 1 ? 1 : currentIndex + 2}`);
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    const firstIndicator = this.querySelector('.carousel-indicators button:first-child');
                    if (firstIndicator) {
                        firstIndicator.click();
                        announceToScreenReader('Moved to first slide');
                    }
                    break;
                case 'End':
                    e.preventDefault();
                    const lastIndicator = this.querySelector('.carousel-indicators button:last-child');
                    if (lastIndicator) {
                        lastIndicator.click();
                        announceToScreenReader('Moved to last slide');
                    }
                    break;
                case 'Space':
                case 'Enter':
                    e.preventDefault();
                    // Toggle play/pause
                    const bsCarousel = bootstrap.Carousel.getInstance(this);
                    if (bsCarousel) {
                        if (this.classList.contains('carousel-paused')) {
                            bsCarousel.cycle();
                            this.classList.remove('carousel-paused');
                            announceToScreenReader('Carousel resumed');
                        } else {
                            bsCarousel.pause();
                            this.classList.add('carousel-paused');
                            announceToScreenReader('Carousel paused');
                        }
                    }
                    break;
            }
        });

        // Enhanced pause/resume on hover and focus
        carousel.addEventListener('mouseenter', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel && !this.classList.contains('carousel-paused')) {
                bsCarousel.pause();
            }
        });

        carousel.addEventListener('mouseleave', function () {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel && !this.classList.contains('carousel-paused')) {
                bsCarousel.cycle();
            }
        });

        // Announce slide changes to screen readers
        carousel.addEventListener('slide.bs.carousel', function (e) {
            const slideNumber = e.to + 1;
            const totalSlides = this.querySelectorAll('.carousel-item').length;
            setTimeout(() => {
                announceToScreenReader(`Now showing slide ${slideNumber} of ${totalSlides}`);
            }, 100);
        });
    });
}

// Enhanced Accessibility Features for Batch 4
function initializeBatch4AccessibilityFeatures() {
    // Skip to content links enhancement
    const skipLinks = document.querySelectorAll('.skip-to-content, .skip-link');
    skipLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Set focus with proper tabindex management
                const originalTabIndex = targetElement.getAttribute('tabindex');
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();

                // Restore original tabindex after focus
                targetElement.addEventListener('blur', function () {
                    if (originalTabIndex !== null) {
                        this.setAttribute('tabindex', originalTabIndex);
                    } else {
                        this.removeAttribute('tabindex');
                    }
                }, { once: true });

                announceToScreenReader(`Navigated to ${targetElement.textContent || targetId} section`);
            }
        });
    });

    // Enhanced focus management
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });

    // High contrast mode detection
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    function handleHighContrast(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    handleHighContrast(highContrastQuery);
    highContrastQuery.addListener(handleHighContrast);

    // Reduced motion preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function handleReducedMotion(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('reduce-motion');
            // Disable autoplay on carousels
            const carousels = document.querySelectorAll('.carousel');
            carousels.forEach(carousel => {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel);
                if (bsCarousel) {
                    bsCarousel.pause();
                }
            });
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }
    handleReducedMotion(reducedMotionQuery);
    reducedMotionQuery.addListener(handleReducedMotion);
}

// Utility Functions for Batch 4
function showBatch4Notification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.batch4-notification-toast');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `batch4-notification-toast alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 320px;
        max-width: 400px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-radius: 8px;
        animation: slideInRight 0.3s ease-out;
    `;

    const iconMap = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };

    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="${iconMap[type] || iconMap.info} me-2"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);

    // Announce to screen readers
    announceToScreenReader(message);
}

function showDocumentViewer(title) {
    showBatch4Notification(`${title} document viewer will open shortly`, 'info');
}

// Enhanced Error Handling for Batch 4
window.addEventListener('error', function (e) {
    // FIXED: Only log actual errors with messages, prevent null error logging
    if (e.error && e.error.message) {
        console.error('JavaScript error in Batch 4 functionality:', e.error);

        // Show user-friendly error message for critical failures
        const errorType = e.error.message.toLowerCase();
        if (errorType.includes('modal') || errorType.includes('bootstrap')) {
            showBatch4Notification('Some interactive features may not be working properly. Please refresh the page.', 'warning');
        } else if (errorType.includes('network') || errorType.includes('fetch')) {
            showBatch4Notification('Network connection issue detected. Please check your internet connection.', 'error');
        }
    }
});

// Performance Monitoring for Batch 4
if ('performance' in window) {
    window.addEventListener('load', function () {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Batch 4 Page Load Performance:', {
                    'Page Load Time': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms',
                    'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
                    'Total Load Time': Math.round(perfData.loadEventEnd - perfData.fetchStart) + 'ms',
                    'First Paint': Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0) + 'ms'
                });
            }
        }, 0);
    });
}

// Add CSS animations for notifications
const batch4Style = document.createElement('style');
batch4Style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 3px solid #007bff !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 1px #fff !important;
    }
    
    .high-contrast {
        filter: contrast(150%);
    }
    
    .reduce-motion *,
    .reduce-motion *::before,
    .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    .risk-high {
        border-left: 4px solid #dc3545;
    }
    
    .risk-medium {
        border-left: 4px solid #ffc107;
    }
    
    .risk-low {
        border-left: 4px solid #28a745;
    }
    
    .survey-cargo,
    .survey-nautical,
    .survey-technical {
        position: relative;
        overflow: hidden;
    }
    
    .survey-cargo::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(45deg, #007bff, #0056b3);
    }
    
    .survey-nautical::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(45deg, #17a2b8, #138496);
    }
    
    .survey-technical::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(45deg, #28a745, #1e7e34);
    }
    
    .inspection-general,
    .inspection-cargo,
    .inspection-quality {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .inspection-general:hover,
    .inspection-cargo:hover,
    .inspection-quality:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(batch4Style);

// ===== BATCH 4 JAVASCRIPT ENHANCEMENTS - END =====
