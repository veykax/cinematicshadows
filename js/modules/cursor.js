/**
 * Cursor Module - Independent custom cursor management
 */

class CursorManager {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.cursorLabel = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        this.isInitialized = false;
    }

    init() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.cursorLabel = document.querySelector('.cursor-label');

        if (!this.cursor || !this.follower) return;

        this.setupMouseTracking();
        this.setupInteractables();
        this.startFollowerAnimation();
        this.isInitialized = true;
    }

    setupMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursor.style.left = `${this.mouseX}px`;
            this.cursor.style.top = `${this.mouseY}px`;

            if (this.cursor.style.display === 'none') {
                this.cursor.style.display = 'flex';
                this.follower.style.display = 'block';
            }
        });

        document.addEventListener('mouseleave', () => this.resetCursor());
        window.addEventListener('blur', () => this.resetCursor());
        window.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
                this.resetCursor();
            }
        });
    }

    resetCursor() {
        document.body.classList.remove('cursor-view', 'cursor-active', 'cursor-on-red');
        if (this.cursorLabel) this.cursorLabel.textContent = '';
        this.cursor.style.backgroundColor = '';
        this.follower.style.borderColor = '';
        this.cursor.style.display = 'none';
        this.follower.style.display = 'none';
    }

    startFollowerAnimation() {
        const animate = () => {
            this.followerX += (this.mouseX - this.followerX) * 0.15;
            this.followerY += (this.mouseY - this.followerY) * 0.15;
            this.follower.style.left = `${this.followerX}px`;
            this.follower.style.top = `${this.followerY}px`;
            requestAnimationFrame(animate);
        };
        animate();
    }

    setupInteractables() {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .game-card');
            if (!target) return;

            document.body.classList.add('cursor-active');

            if (target.classList.contains('game-card')) {
                this.handleGameCard(target);
            }

            if (target.classList.contains('btn-primary') ||
                target.classList.contains('btn-lang') ||
                target.classList.contains('logo')) {
                document.body.classList.add('cursor-on-red');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .game-card');
            if (!target) return;

            document.body.classList.remove('cursor-active', 'cursor-view', 'cursor-on-red');
            if (this.cursorLabel) this.cursorLabel.textContent = '';
            this.cursor.style.backgroundColor = '';
            this.follower.style.borderColor = '';
        });
    }

    handleGameCard(card) {
        document.body.classList.add('cursor-view');
        if (this.cursorLabel) {
            this.cursorLabel.textContent = 'VIEW';
        }

        const gameId = card.getAttribute('data-game');
        if (gameId) {
            import('../games-data.js').then(({ gamesData }) => {
                const color = (gamesData[gameId] && gamesData[gameId].color) || '#dc2626';
                this.cursor.style.backgroundColor = color;
                this.follower.style.borderColor = color;
            }).catch(() => {
                this.cursor.style.backgroundColor = '#dc2626';
                this.follower.style.borderColor = '#dc2626';
            });
        }
    }

    updateLabel(text) {
        if (this.cursorLabel) {
            this.cursorLabel.textContent = text;
        }
    }
}

export const cursor = new CursorManager();
