/**
 * Background Images Module - Apply backgrounds via data attributes
 * Eliminates inline style= attributes for better separation of concerns
 */

class BackgroundManager {
    constructor() {
        this.backgrounds = {
            'hero': 'linear-gradient(to bottom, rgba(10, 10, 12, 0.4), var(--bg-main)), url(assets/hero-bg.jpg)',
            're-poster': 'url(assets/re-poster.jpg)',
            'tlou-poster': 'url(assets/tlou-poster.jpg)',
            'cyber-poster': 'url(assets/cyber-poster.jpg)'
        };
    }

    init() {
        this.applyBackgrounds();
        this.observeNewElements();
    }

    applyBackgrounds() {
        document.querySelectorAll('[data-bg]').forEach(el => {
            const bgKey = el.getAttribute('data-bg');
            if (this.backgrounds[bgKey]) {
                el.style.backgroundImage = this.backgrounds[bgKey];
            }
        });
    }

    observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.hasAttribute && node.hasAttribute('data-bg')) {
                            const bgKey = node.getAttribute('data-bg');
                            if (this.backgrounds[bgKey]) {
                                node.style.backgroundImage = this.backgrounds[bgKey];
                            }
                        }
                        // Check children
                        node.querySelectorAll && node.querySelectorAll('[data-bg]').forEach(el => {
                            const bgKey = el.getAttribute('data-bg');
                            if (this.backgrounds[bgKey]) {
                                el.style.backgroundImage = this.backgrounds[bgKey];
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    addBackground(key, value) {
        this.backgrounds[key] = value;
    }
}

export const backgrounds = new BackgroundManager();
