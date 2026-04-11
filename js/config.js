/**
 * Site Configuration
 * Centralized configuration for easy maintenance
 */

export const config = {
    // Default language
    defaultLang: 'uk',

    // Animation timings
    animations: {
        preloaderDelay: 600,
        cardTransitionDelay: 50,
        scrollRevealThreshold: 0.1,
        cursorFollowSpeed: 0.15
    },

    // Default colors
    colors: {
        accent: '#dc2626',
        fallback: '#dc2626'
    },

    // Lightbox settings
    lightbox: {
        closeOnBackdrop: true,
        animationDuration: 400
    },

    // Credits animation
    credits: {
        animationDuration: 1100,
        observerThreshold: 0.2
    },

    // Search settings
    search: {
        debounceDelay: 0,
        animationDelay: 300
    }
};
