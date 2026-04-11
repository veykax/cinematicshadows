/**
 * Collection Page Script - Entry point for collection.html
 */

import { errorHandler } from './modules/error-handler.js';
import { preloader } from './modules/preloader.js';
import { cursor } from './modules/cursor.js';
import { scroll } from './modules/scroll.js';
import { localization } from './modules/localization.js';
import { navigation } from './modules/navigation.js';
import { collection } from './modules/collection.js';
import { theme } from './modules/theme.js';
import { backgrounds } from './modules/backgrounds.js';

// Initialize error handler immediately
errorHandler.init();

/**
 * Initialize all modules on DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize preloader FIRST
    preloader.init();

    // Core modules
    await errorHandler.safeExecute(() => backgrounds.init(), 'Backgrounds');
    await errorHandler.safeExecute(() => cursor.init(), 'Cursor');
    await errorHandler.safeExecute(() => scroll.init(), 'Scroll');
    await errorHandler.safeExecute(() => navigation.init(), 'Navigation');
    await errorHandler.safeExecute(() => theme.init(), 'Theme');

    // Initialize localization
    const dict = await errorHandler.safeExecute(() => localization.init(), 'Localization');

    // Setup localization change listeners
    localization.onChange((lang, dict) => {
        errorHandler.safeExecute(() => collection.render(lang, dict), 'Collection Render');
    });

    // Initialize collection module
    await errorHandler.safeExecute(() => collection.init(), 'Collection Init');

    // Get current language for initial render
    const currentLang = localization.getCurrentLang();

    // Render content
    if (dict) {
        await errorHandler.safeExecute(() => collection.render(currentLang, dict), 'Collection Initial Render');
    }

    // Hide preloader
    const minDisplayTime = 800;
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
