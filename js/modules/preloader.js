/**
 * Preloader Module - Clean implementation with forced animation restart
 */

class PreloaderManager {
    constructor() {
        this.preloader = null;
        this.logoText = null;
        this.barFill = null;
        this.isHiding = false;
    }

    init() {
        this.preloader = document.getElementById('preloader');
        if (!this.preloader) return;

        this.logoText = this.preloader.querySelector('.preloader-logo-text');
        this.barFill = this.preloader.querySelector('.preloader-bar-fill');

        // Ensure preloader is visible
        this.preloader.style.visibility = 'visible';
        this.preloader.style.opacity = '1';

        // Force animation restart
        this.startAnimation();
    }

    startAnimation() {
        // Remove animation class if exists (for page reloads)
        if (this.logoText) {
            this.logoText.classList.remove('preloader-animate');
        }
        if (this.barFill) {
            this.barFill.classList.remove('preloader-animate');
        }

        // Force reflow to reset animation state
        if (this.logoText) this.logoText.offsetHeight;
        if (this.barFill) this.barFill.offsetHeight;

        // Add animation class in next frame to ensure clean start
        requestAnimationFrame(() => {
            if (this.logoText) {
                this.logoText.classList.add('preloader-animate');
            }
            if (this.barFill) {
                this.barFill.classList.add('preloader-animate');
            }
        });
    }

    hide() {
        if (this.preloader && !this.isHiding) {
            this.isHiding = true;
            this.preloader.style.opacity = '0';
            setTimeout(() => {
                this.preloader.style.visibility = 'hidden';
                this.preloader.style.display = 'none';
            }, 400);
        }
    }
}

export const preloader = new PreloaderManager();
