// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');

function setActiveLink() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// Smooth Scroll (backup for browsers that don't support CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add shadow to nav on scroll
const nav = document.querySelector('.nav');
let lastScrollY = window.pageYOffset;

window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > 50) {
        nav.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }

    lastScrollY = currentScrollY;
});

// Experience Modal Functionality
const modal = document.getElementById('experienceModal');
const modalOverlay = modal.querySelector('.modal-overlay');
const modalClose = modal.querySelector('.modal-close');
const experienceCards = document.querySelectorAll('.experience-card');

function openModal(cardElement) {
    const hiddenData = cardElement.querySelector('.card-hidden');

    // Populate modal with data
    modal.querySelector('.modal-year').textContent = cardElement.querySelector('.card-year').textContent;
    modal.querySelector('.modal-title').textContent = cardElement.querySelector('.card-title').textContent;
    modal.querySelector('.modal-company').textContent = cardElement.querySelector('.card-company').textContent;

    // Get location from hidden data
    const locationElement = hiddenData.querySelector('.card-location');
    if (locationElement) {
        modal.querySelector('.modal-location').textContent = locationElement.textContent;
        modal.querySelector('.modal-location').style.display = 'block';
    } else {
        modal.querySelector('.modal-location').style.display = 'none';
    }

    modal.querySelector('.modal-industry').textContent = hiddenData.querySelector('.card-industry').textContent;

    // Populate achievements
    const achievements = hiddenData.querySelectorAll('.card-achievements li');
    const modalAchievements = modal.querySelector('.modal-achievements');
    modalAchievements.innerHTML = '';
    achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement.textContent;
        modalAchievements.appendChild(li);
    });

    // Populate tags
    const tags = hiddenData.querySelectorAll('.card-tags span');
    const modalTags = modal.querySelector('.modal-tags');
    modalTags.innerHTML = '';
    tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag.textContent;
        modalTags.appendChild(span);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Add click listeners to experience cards
experienceCards.forEach(card => {
    card.addEventListener('click', () => openModal(card));
});

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on close button click
modalClose.addEventListener('click', closeModal);

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Add dynamic year to footer (if needed)
const currentYear = new Date().getFullYear();
const footer = document.querySelector('.footer p');
if (footer && footer.textContent.includes('2025')) {
    footer.textContent = footer.textContent.replace('2025', currentYear);
}

// Handle external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});
