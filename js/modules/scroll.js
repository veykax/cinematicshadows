/**
 * Scroll Module - Independent scroll effects
 */

class ScrollManager {
    constructor() {
        this.progressBar = null;
        this.observer = null;
    }

    init() {
        this.initProgressBar();
        this.initReveal();
    }

    initProgressBar() {
        this.progressBar = document.querySelector('.scroll-progress');
        if (!this.progressBar) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            this.progressBar.style.width = `${progress}%`;
        }, { passive: true });
    }

    initReveal() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.01, rootMargin: '50px' });

        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => {
            // Remove any existing transition delay
            el.style.transitionDelay = '';

            if (this.observer) {
                this.observer.observe(el);
            }
        });
    }

    refreshObserver() {
        if (this.observer) {
            this.observer.disconnect();
            this.observeElements();
        }
    }
}

export const scroll = new ScrollManager();
