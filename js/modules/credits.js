/**
 * Credits Module - Independent credits page stats animation
 */

class CreditsManager {
    constructor() {
        this.root = null;
        this.isAnimated = false;
    }

    init() {
        this.root = document.querySelector('[data-credits-stats]');
        if (!this.root) return;

        this.setupObserver();
    }

    setupObserver() {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.isAnimated) {
                        this.animateStats();
                        io.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );
        io.observe(this.root);
    }

    animateStats() {
        if (this.isAnimated) return;
        this.isAnimated = true;

        const nodes = this.root.querySelectorAll('[data-stat-target]');
        nodes.forEach(el => this.animateValue(el));
    }

    animateValue(el) {
        const raw = el.getAttribute('data-stat-target');
        const target = parseInt(raw, 10);
        if (Number.isNaN(target)) return;

        const duration = 1100;
        const t0 = performance.now();

        const step = (now) => {
            const t = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = String(Math.round(eased * target));

            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = String(target);
            }
        };

        requestAnimationFrame(step);
    }
}

export const credits = new CreditsManager();
