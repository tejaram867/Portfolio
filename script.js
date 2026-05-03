/**
 * Paidi Tejaram Portfolio - Core Logic
 * 
 * Includes:
 * - Mobile Navigation (Hamburger Menu)
 * - Scroll Reveal Animations
 * - Active Navbar State & Sliding Cursor
 * - Glow Card Spotlight Interaction
 */

// --- Global Constants ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('section, header');
const navItems = document.querySelectorAll('.nav-link');
const navLinksContainer = document.querySelector('.nav-links');
let navCursor = document.querySelector('.nav-cursor');

// --- 1. Mobile Navigation (Hamburger Menu) ---
if (hamburger) {
    hamburger.addEventListener('click', () => {
        // Toggle Menu Visibility
        navLinks.classList.toggle('nav-active');

        // Animate individual link appearance
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Icon State Animation
        hamburger.classList.toggle('toggle');
    });
}

// Close mobile menu automatically when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            navLinksItems.forEach(link => {
                link.style.animation = '';
            });
        }
    });
});

// --- 2. Scroll Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal');

const scrollObserverOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Element remains active once revealed
        }
    });
}, scrollObserverOptions);

revealElements.forEach(el => {
    scrollObserver.observe(el);
});

// --- 3. Sliding Navigation Cursor Logic ---
if (!navCursor && navLinksContainer) {
    navCursor = document.createElement('div');
    navCursor.className = 'nav-cursor';
    navLinksContainer.appendChild(navCursor);
}

/**
 * Moves the navigation cursor to the specified element
 * @param {HTMLElement} element - The target navigation link
 */
const moveCursor = (element) => {
    if (!element || !navCursor) return;
    const { width, left } = element.getBoundingClientRect();
    const containerLeft = navLinksContainer.getBoundingClientRect().left;
    
    navCursor.style.width = `${width}px`;
    navCursor.style.left = `${left - containerLeft}px`;
    navCursor.style.opacity = '1';
};

// Update cursor position on hover
navItems.forEach(link => {
    link.addEventListener('mouseenter', () => moveCursor(link));
});

// Return cursor to active link when mouse leaves navigation area
if (navLinksContainer) {
    navLinksContainer.addEventListener('mouseleave', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            moveCursor(activeLink);
        } else {
            navCursor.style.opacity = '0';
        }
    });
}

// Sync active link and cursor position on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href') === `#${current}`) {
            li.classList.add('active');
            // Automatically move cursor if user isn't actively hovering the navbar
            if (!navLinksContainer.matches(':hover')) {
                moveCursor(li);
            }
        }
    });
});

// Initialize cursor position on page load
window.addEventListener('load', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) moveCursor(activeLink);
});

// --- 4. Glow Card Spotlight Interaction ---
/**
 * Updates global CSS variables for pointer position to drive spotlight effects
 */
const syncPointer = ({ x, y }) => {
    document.documentElement.style.setProperty('--x', x.toFixed(2));
    document.documentElement.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
    document.documentElement.style.setProperty('--y', y.toFixed(2));
    document.documentElement.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
};

document.body.addEventListener('pointermove', syncPointer);
