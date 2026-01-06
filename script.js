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

// Experience Carousel Pagination
const experienceScrollContainer = document.querySelector('.experience-scroll-container');
const experienceCardsContainer = document.querySelector('.experience-cards');
const experienceDotsContainer = document.querySelector('.experience-dots');
const allExperienceCards = document.querySelectorAll('.experience-card');

let numberOfDots = 0;
let currentPage = 0;

function calculatePagination() {
    if (!experienceScrollContainer || !experienceCardsContainer) return;

    const totalCards = allExperienceCards.length;

    // Get actual dimensions from the DOM
    const visibleWidth = experienceScrollContainer.clientWidth;
    const totalScrollWidth = experienceScrollContainer.scrollWidth;

    // If everything fits (no scrolling needed), hide dots
    if (totalScrollWidth <= visibleWidth) {
        numberOfDots = 0;
        return { cardsPerPage: totalCards, numberOfDots };
    }

    // Get actual computed padding from the element
    const computedStyle = window.getComputedStyle(experienceScrollContainer);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const totalPadding = paddingLeft + paddingRight;

    const cardWidth = 280;
    const gap = 32;

    // Calculate how many cards fit in the visible area
    const effectiveVisibleWidth = visibleWidth - totalPadding;

    // Count cards with at least 70% visible (threshold between floor and round)
    const exactCards = (effectiveVisibleWidth + gap) / (cardWidth + gap);
    const cardsPerPage = Math.max(1, Math.floor(exactCards + 0.3));

    // Calculate number of pages needed
    numberOfDots = Math.ceil(totalCards / cardsPerPage);

    return { cardsPerPage, numberOfDots };
}

function createDots() {
    if (!experienceDotsContainer) return;

    experienceDotsContainer.innerHTML = '';
    const { numberOfDots: dots } = calculatePagination();

    // Hide dots if all cards fit (0 dots) or only 1 page needed
    if (dots === 0 || dots === 1) {
        experienceDotsContainer.style.display = 'none';
        return;
    }

    experienceDotsContainer.style.display = 'flex';

    for (let i = 0; i < dots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('experience-dot');
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            scrollToPage(i);
        });

        experienceDotsContainer.appendChild(dot);
    }
}

function scrollToPage(pageIndex) {
    if (!experienceScrollContainer) return;

    const maxScroll = experienceScrollContainer.scrollWidth - experienceScrollContainer.clientWidth;
    const dots = experienceDotsContainer.querySelectorAll('.experience-dot');

    // Calculate scroll position based on which dot was clicked
    // Distribute scroll range evenly across dots
    let scrollAmount;

    if (pageIndex === 0) {
        scrollAmount = 0;
    } else if (pageIndex === dots.length - 1) {
        scrollAmount = maxScroll;
    } else {
        scrollAmount = (maxScroll / (dots.length - 1)) * pageIndex;
    }

    experienceScrollContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function updateActiveDot() {
    if (!experienceScrollContainer || !experienceDotsContainer) return;

    const scrollLeft = experienceScrollContainer.scrollLeft;
    const maxScroll = experienceScrollContainer.scrollWidth - experienceScrollContainer.clientWidth;
    const dots = experienceDotsContainer.querySelectorAll('.experience-dot');

    if (dots.length <= 1) return;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    // Determine which dot should be active based on scroll position
    // Divide the scroll range into equal segments for each dot
    if (scrollProgress >= 0.95) {
        // Near the end, activate last dot
        currentPage = dots.length - 1;
    } else if (scrollProgress <= 0.05) {
        // Near the start, activate first dot
        currentPage = 0;
    } else {
        // In between, calculate based on segments
        const segmentSize = 1 / (dots.length - 1);
        currentPage = Math.round(scrollProgress / segmentSize);
    }

    // Update active dot
    dots.forEach((dot, index) => {
        if (index === currentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Initialize pagination
if (experienceScrollContainer) {
    createDots();

    // Update dots on scroll
    experienceScrollContainer.addEventListener('scroll', updateActiveDot);

    // Recreate dots on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createDots();
            updateActiveDot();
        }, 250);
    });
}

// Skills Carousel Pagination
const skillsScrollContainer = document.querySelector('.skills-scroll-container');
const skillsCardsContainer = document.querySelector('.skills-cards');
const skillsDotsContainer = document.querySelector('.skills-dots');
const allSkillCards = document.querySelectorAll('.skill-category');

let skillsNumberOfDots = 0;
let skillsCurrentPage = 0;

function calculateSkillsPagination() {
    if (!skillsScrollContainer || !skillsCardsContainer) return;

    const totalCards = allSkillCards.length;

    // Get actual dimensions from the DOM
    const visibleWidth = skillsScrollContainer.clientWidth;
    const totalScrollWidth = skillsScrollContainer.scrollWidth;

    // If everything fits (no scrolling needed), hide dots
    if (totalScrollWidth <= visibleWidth) {
        skillsNumberOfDots = 0;
        return { cardsPerPage: totalCards, numberOfDots: skillsNumberOfDots };
    }

    // Get actual computed padding from the element
    const computedStyle = window.getComputedStyle(skillsScrollContainer);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const totalPadding = paddingLeft + paddingRight;

    const cardWidth = 315; // Square skill cards
    const gap = 32;

    // Calculate how many cards fit in the visible area
    const effectiveVisibleWidth = visibleWidth - totalPadding;

    // Count cards with at least 70% visible (threshold between floor and round)
    const exactCards = (effectiveVisibleWidth + gap) / (cardWidth + gap);
    const cardsPerPage = Math.max(1, Math.floor(exactCards + 0.3));

    // Calculate number of pages needed
    skillsNumberOfDots = Math.ceil(totalCards / cardsPerPage);

    return { cardsPerPage, numberOfDots: skillsNumberOfDots };
}

function createSkillsDots() {
    if (!skillsDotsContainer) return;

    skillsDotsContainer.innerHTML = '';
    const { numberOfDots: dots } = calculateSkillsPagination();

    // Hide dots if all cards fit (0 dots) or only 1 page needed
    if (dots === 0 || dots === 1) {
        skillsDotsContainer.style.display = 'none';
        return;
    }

    skillsDotsContainer.style.display = 'flex';

    for (let i = 0; i < dots; i++) {
        const dot = document.createElement('div');
        dot.classList.add('skills-dot');
        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            scrollSkillsToPage(i);
        });

        skillsDotsContainer.appendChild(dot);
    }
}

function scrollSkillsToPage(pageIndex) {
    if (!skillsScrollContainer) return;

    const maxScroll = skillsScrollContainer.scrollWidth - skillsScrollContainer.clientWidth;
    const dots = skillsDotsContainer.querySelectorAll('.skills-dot');

    // Calculate scroll position based on which dot was clicked
    let scrollAmount;

    if (pageIndex === 0) {
        scrollAmount = 0;
    } else if (pageIndex === dots.length - 1) {
        scrollAmount = maxScroll;
    } else {
        scrollAmount = (maxScroll / (dots.length - 1)) * pageIndex;
    }

    skillsScrollContainer.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function updateSkillsActiveDot() {
    if (!skillsScrollContainer || !skillsDotsContainer) return;

    const scrollLeft = skillsScrollContainer.scrollLeft;
    const maxScroll = skillsScrollContainer.scrollWidth - skillsScrollContainer.clientWidth;
    const dots = skillsDotsContainer.querySelectorAll('.skills-dot');

    if (dots.length <= 1) return;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    // Determine which dot should be active based on scroll position
    if (scrollProgress >= 0.95) {
        skillsCurrentPage = dots.length - 1;
    } else if (scrollProgress <= 0.05) {
        skillsCurrentPage = 0;
    } else {
        const segmentSize = 1 / (dots.length - 1);
        skillsCurrentPage = Math.round(scrollProgress / segmentSize);
    }

    // Update active dot
    dots.forEach((dot, index) => {
        if (index === skillsCurrentPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Initialize skills pagination
if (skillsScrollContainer) {
    createSkillsDots();

    // Update dots on scroll
    skillsScrollContainer.addEventListener('scroll', updateSkillsActiveDot);

    // Recreate dots on window resize
    let skillsResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(skillsResizeTimeout);
        skillsResizeTimeout = setTimeout(() => {
            createSkillsDots();
            updateSkillsActiveDot();
        }, 250);
    });
}

// Project Sections Accordion Functionality
document.querySelectorAll('.featured-project').forEach(project => {
    const sectionHeaders = project.querySelectorAll('.section-header');

    // Initialize max-height for sections that are already active on page load
    project.querySelectorAll('.project-section-collapsible.active').forEach(activeSection => {
        const content = activeSection.querySelector('.section-content');
        content.style.maxHeight = content.scrollHeight + 'px';
    });

    sectionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const content = section.querySelector('.section-content');
            const isActive = section.classList.contains('active');

            // Close all sections in this project (accordion behavior)
            project.querySelectorAll('.project-section-collapsible').forEach(s => {
                const sContent = s.querySelector('.section-content');
                s.classList.remove('active');
                sContent.style.maxHeight = '0px';
                const icon = s.querySelector('.toggle-icon');
                if (icon) icon.textContent = '▸';
            });

            // If the clicked section wasn't active, open it
            if (!isActive) {
                section.classList.add('active');
                // Set max-height to actual scrollHeight for smooth animation
                content.style.maxHeight = content.scrollHeight + 'px';
                const icon = header.querySelector('.toggle-icon');
                if (icon) icon.textContent = '▾';
            }
        });
    });
});

// Dynamic Line Numbers for Hero Section
function updateHeroLineNumbers() {
    const lineNumbersContainer = document.getElementById('lineNumbers');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');

    if (!lineNumbersContainer || !heroTitle) return;

    // Helper function to calculate number of lines and get styling
    function getElementInfo(element) {
        const computedStyle = window.getComputedStyle(element);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const elementHeight = element.offsetHeight;
        const marginBottom = parseFloat(computedStyle.marginBottom);

        const lineCount = Math.round(elementHeight / lineHeight);

        return {
            lineCount,
            lineHeight,
            marginBottom
        };
    }

    // Get info for each element
    const titleInfo = getElementInfo(heroTitle);
    const subtitleInfo = heroSubtitle ? getElementInfo(heroSubtitle) : null;
    const descriptionInfo = heroDescription ? getElementInfo(heroDescription) : null;
    const ctaInfo = heroCta ? getElementInfo(heroCta) : null;

    // Generate line numbers with proper heights and spacing
    lineNumbersContainer.innerHTML = '';
    let lineNumber = 1;

    // Helper to create line number spans for an element
    function createLineNumbers(info, isLast = false) {
        if (!info) return;

        for (let i = 0; i < info.lineCount; i++) {
            const span = document.createElement('span');
            span.textContent = lineNumber++;
            span.style.height = info.lineHeight + 'px';
            span.style.lineHeight = info.lineHeight + 'px';

            lineNumbersContainer.appendChild(span);
        }
    }

    // Helper to create blank line numbers for spacing
    function createBlankLineNumber(marginBottom, lineHeight) {
        const span = document.createElement('span');
        span.textContent = lineNumber++;
        span.style.height = marginBottom + 'px';
        span.style.lineHeight = marginBottom + 'px';
        span.style.display = 'flex';
        span.style.alignItems = 'center';
        span.style.justifyContent = 'flex-end';
        lineNumbersContainer.appendChild(span);
    }

    // Create line numbers for each element with blank lines between
    createLineNumbers(titleInfo, false);
    if (titleInfo && subtitleInfo) {
        createBlankLineNumber(titleInfo.marginBottom, titleInfo.lineHeight);
    }
    createLineNumbers(subtitleInfo, false);
    if (subtitleInfo && descriptionInfo) {
        createBlankLineNumber(subtitleInfo.marginBottom, subtitleInfo.lineHeight);
    }
    createLineNumbers(descriptionInfo, true);
}

// Initialize and update on resize
if (document.getElementById('lineNumbers')) {
    // Initial calculation after page load
    window.addEventListener('load', updateHeroLineNumbers);

    // Update on resize with debouncing
    let heroResizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(heroResizeTimeout);
        heroResizeTimeout = setTimeout(updateHeroLineNumbers, 100);
    });
}
