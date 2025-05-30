document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const closeNavToggle = document.getElementById('close-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    navToggle.addEventListener('click', () => {
        mobileNavMenu.classList.toggle('translate-x-full');
        mobileMenuOverlay.classList.toggle('hidden');
        document.body.style.overflow = mobileNavMenu.classList.contains('translate-x-full') ? '' : 'hidden';
    });

    closeNavToggle.addEventListener('click', () => {
        mobileNavMenu.classList.add('translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    });

    mobileMenuOverlay.addEventListener('click', () => {
        mobileNavMenu.classList.add('translate-x-full');
        mobileMenuOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    });

    document.querySelectorAll('[data-close-menu]').forEach(link => {
        link.addEventListener('click', () => {
            mobileNavMenu.classList.add('translate-x-full');
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });

    // Hero Carousel
    const carousel = document.getElementById('hero-carousel');
    const slides = carousel.children;
    const indicators = document.getElementById('carousel-indicators');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    let currentSlide = 0;
    let carouselInterval;

    for (let i = 0; i < slides.length; i++) {
        const indicator = document.createElement('button');
        indicator.classList.add('w-3', 'h-3', 'rounded-full', 'bg-white', 'bg-opacity-50', 'hover:bg-opacity-75', 'transition');
        if (i === 0) indicator.classList.add('bg-opacity-100');
        indicator.addEventListener('click', () => goToSlide(i));
        indicators.appendChild(indicator);
    }

    function goToSlide(index) {
        currentSlide = index;
        carousel.style.transform = `translateX(-${currentSlide * 100 / slides.length}%)`;
        updateIndicators();
        resetCarouselInterval();
    }

    function updateIndicators() {
        Array.from(indicators.children).forEach((indicator, i) => {
            indicator.classList.toggle('bg-opacity-100', i === currentSlide);
            indicator.classList.toggle('bg-opacity-50', i !== currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }

    function startCarouselInterval() {
        carouselInterval = setInterval(nextSlide, 5000);
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        startCarouselInterval();
    }

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    startCarouselInterval();

    // ScrollReveal Animations
    ScrollReveal().reveal('.reveal-bottom', {
        origin: 'bottom',
        distance: '30px',
        duration: 1000,
        easing: 'ease-in-out',
    });

    ScrollReveal().reveal('.reveal-section', {
        distance: '20px',
        duration: 800,
        easing: 'ease-in-out',
        afterReveal: el => el.classList.add('revealed'),
    });

    ScrollReveal().reveal('.reveal-left', {
        origin: 'left',
        distance: '20px',
        duration: 800,
        easing: 'ease-in-out',
        afterReveal: el => el.classList.add('revealed'),
    });

    ScrollReveal().reveal('.reveal-right', {
        origin: 'right',
        distance: '20px',
        duration: 800,
        easing: 'ease-in-out',
        afterReveal: el => el.classList.add('revealed'),
    });

    // Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => {
                btn.classList.remove('text-amber-400', 'border-amber-400');
                btn.classList.add('text-gray-300', 'border-transparent');
            });
            button.classList.add('text-amber-400', 'border-amber-400');
            button.classList.remove('text-gray-300', 'border-transparent');

            tabPanes.forEach(pane => pane.classList.add('hidden'));
            document.getElementById(button.dataset.tab).classList.remove('hidden');
        });
    });

    // Map and Itinerary
    const map = L.map('map').setView([25.2, 55.3], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-icon',
        html: '<i class="fas fa-map-marker-alt text-amber-600 text-2xl"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const locations = [
        { name: 'Burj Khalifa', coords: [25.1972, 55.2744], category: 'Attractions', description: 'The tallest building in the world with stunning views.' },
        { name: 'Dubai Museum', coords: [25.2631, 55.2972], category: 'Culture', description: 'Explore Dubai’s rich history and heritage.' },
        { name: 'Pierchic', coords: [25.1412, 55.1914], category: 'Dining', description: 'Award-winning seafood restaurant with ocean views.' },
        { name: 'Palm Jumeirah', coords: [25.1120, 55.1393], category: 'Attractions', description: 'Iconic man-made island with luxury resorts.' },
        { name: 'Al Fahidi', coords: [25.2634, 55.2993], category: 'Culture', description: 'Historic district with traditional architecture.' },
        { name: 'Zuma', coords: [25.2138, 55.2798], category: 'Dining', description: 'Contemporary Japanese cuisine in a chic setting.' }
    ];

    const itineraryItems = [];
    const locationList = document.getElementById('location-list');
    const itinerarySidebar = document.getElementById('itinerary-sidebar');
    const itineraryList = document.getElementById('itinerary-items');
    const closeItinerary = document.getElementById('close-itinerary');
    const toggleItinerary = document.getElementById('toggle-itinerary');

    function renderLocations(filter = 'All') {
        locationList.innerHTML = '';
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });

        locations.forEach((location, index) => {
            if (filter === 'All' || location.category === filter) {
                const marker = L.marker(location.coords, { icon: customIcon }).addTo(map);
                marker.bindPopup(`
                    <b>${location.name}</b>
                    <p>${location.description}</p>
                    <button class="add-to-itinerary" data-index="${index}">Add to Itinerary</button>
                `);

                const card = document.createElement('div');
                card.classList.add('location-card', 'reveal-right');
                card.innerHTML = `
                    <h4 class="font-semibold text-gray-800">${location.name}</h4>
                    <p class="text-sm text-gray-600">${location.description}</p>
                    <button class="add-to-itinerary bg-amber-600 text-white px-3 py-1 rounded-full text-sm hover:bg-amber-700" data-index="${index}">Add to Itinerary</button>
                `;
                locationList.appendChild(card);
            }
        });

        document.querySelectorAll('.add-to-itinerary').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                if (!itineraryItems.includes(locations[index])) {
                    itineraryItems.push(locations[index]);
                    renderItinerary();
                    itinerarySidebar.classList.remove('translate-x-full');
                }
            });
        });

        ScrollReveal().reveal('.reveal-right', {
            origin: 'right',
            distance: '20px',
            duration: 800,
            easing: 'ease-in-out',
            afterReveal: el => el.classList.add('revealed'),
        });
    }

    function renderItinerary() {
        itineraryList.innerHTML = '';
        itineraryItems.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('itinerary-item');
            div.innerHTML = `
                <span>${item.name}</span>
                <button class="remove-itinerary text-red-500" data-index="${index}">×</button>
            `;
            itineraryList.appendChild(div);
        });

        document.querySelectorAll('.remove-itinerary').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.dataset.index;
                itineraryItems.splice(index, 1);
                renderItinerary();
            });
        });
    }

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-amber-600', 'text-white', 'hover:bg-amber-700');
                btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            });
            button.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            button.classList.add('bg-amber-600', 'text-white', 'hover:bg-amber-700');
            renderLocations(button.textContent);
        });
    });

    toggleItinerary.addEventListener('click', () => {
        itinerarySidebar.classList.toggle('translate-x-full');
    });

    closeItinerary.addEventListener('click', () => {
        itinerarySidebar.classList.add('translate-x-full');
    });

    renderLocations();

    // Contact Form
    const contactSubmit = document.getElementById('contact-submit');
    const formFeedback = document.getElementById('form-feedback');

    contactSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            formFeedback.classList.remove('hidden', 'text-red-400');
            formFeedback.classList.add('text-green-400');
            formFeedback.textContent = 'Message sent successfully!';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
            setTimeout(() => {
                formFeedback.classList.add('hidden');
            }, 3000);
        } else {
            formFeedback.classList.remove('hidden', 'text-green-400');
            formFeedback.classList.add('text-red-400');
            formFeedback.textContent = 'Please fill in all fields.';
        }
    });

    // Set Current Year
    document.getElementById('current-year').textContent = new Date().getFullYear();
});