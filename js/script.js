/**
 * Cinematic Shadows - Main Entry Point (Refactored)
 * All modules are now independent and can be modified without breaking others
 */

import { errorHandler } from './modules/error-handler.js';
import { preloader } from './modules/preloader.js';
import { cursor } from './modules/cursor.js';
import { scroll } from './modules/scroll.js';
import { localization } from './modules/localization.js';
import { navigation } from './modules/navigation.js';
import { archive } from './modules/archive.js';
import { news } from './modules/news.js';
import { gamePage } from './modules/game-page.js';
import { articlePage } from './modules/article-page.js';
import { credits } from './modules/credits.js';
import { theme } from './modules/theme.js';
import { backgrounds } from './modules/backgrounds.js';

// Initialize error handler immediately
errorHandler.init();

/**
 * Initialize all modules on DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize preloader FIRST to start animations before any rendering
    preloader.init();

    // Core modules - always initialize (wrapped in error handler)
    await errorHandler.safeExecute(() => backgrounds.init(), 'Backgrounds');
    await errorHandler.safeExecute(() => cursor.init(), 'Cursor');
    await errorHandler.safeExecute(() => scroll.init(), 'Scroll');
    await errorHandler.safeExecute(() => navigation.init(), 'Navigation');
    await errorHandler.safeExecute(() => theme.init(), 'Theme');

    // Initialize localization and get dictionary
    const dict = await errorHandler.safeExecute(() => localization.init(), 'Localization');

    // Setup localization change listeners for dynamic content
    localization.onChange((lang, dict) => {
        // Re-render page-specific content when language changes
        errorHandler.safeExecute(() => archive.render(lang, dict), 'Archive Render');
        errorHandler.safeExecute(() => news.render(lang, dict), 'News Render');
        errorHandler.safeExecute(() => gamePage.render(lang, dict), 'Game Page Render');
        errorHandler.safeExecute(() => articlePage.render(lang, dict), 'Article Page Render');
    });

    // Initialize page-specific modules
    await errorHandler.safeExecute(() => archive.init(), 'Archive Init');
    await errorHandler.safeExecute(() => news.init(), 'News Init');
    await errorHandler.safeExecute(() => gamePage.init(), 'Game Page Init');
    await errorHandler.safeExecute(() => articlePage.init(), 'Article Page Init');
    await errorHandler.safeExecute(() => credits.init(), 'Credits Init');

    // Get current language for initial render
    const currentLang = localization.getCurrentLang();

    // Render content immediately (while preloader is still visible)
    if (dict) {
        await errorHandler.safeExecute(() => archive.render(currentLang, dict), 'Archive Initial Render');
        await errorHandler.safeExecute(() => news.render(currentLang, dict), 'News Initial Render');
        await errorHandler.safeExecute(() => gamePage.render(currentLang, dict), 'Game Page Initial Render');
        await errorHandler.safeExecute(() => articlePage.render(currentLang, dict), 'Article Page Initial Render');
    }

    // Content is ready, now hide preloader on page load with minimum display time
    const minDisplayTime = 800; // Minimum time to show preloader (ms)
    const startTime = performance.now();

    const hidePreloader = () => {
        const elapsed = performance.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsed);

        setTimeout(() => preloader.hide(), remainingTime);
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
    }
});
