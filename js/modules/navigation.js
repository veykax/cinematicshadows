/**
 * Navigation Module - Independent navigation management
 */

class NavigationManager {
    constructor() {
        this.currentPage = '';
    }

    init() {
        this.updateActiveNav();
        this.setupCardNavigation();
    }

    updateActiveNav() {
        let currentFile = window.location.pathname.split('/').pop() || 'index.html';
        currentFile = currentFile.split('?')[0].split('#')[0];
        if (currentFile === '') currentFile = 'index.html';

        this.currentPage = currentFile;

        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const linkFile = href.split('?')[0].split('#')[0];
            if (linkFile === currentFile) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupCardNavigation() {
        document.addEventListener('click', (e) => {
            const gameCard = e.target.closest('.game-card');
            if (gameCard) {
                this.handleGameCardClick(gameCard);
                return;
            }

            const newsCard = e.target.closest('.news-article');
            if (newsCard) {
                this.handleNewsCardClick(newsCard);
            }
        });
    }

    handleGameCardClick(card) {
        const gameId = card.getAttribute('data-game');
        if (!gameId) return;

        const cardImg = card.querySelector('.card-image');
        if (cardImg) {
            cardImg.style.viewTransitionName = 'active-game-hero';
        }

        setTimeout(() => {
            window.location.href = `game.html?id=${gameId}`;
        }, 50);
    }

    handleNewsCardClick(card) {
        const newsId = card.getAttribute('data-news');
        if (!newsId) return;

        const newsImg = card.querySelector('.news-image');
        if (newsImg) {
            newsImg.style.viewTransitionName = 'active-news-hero';
        }

        setTimeout(() => {
            window.location.href = `article.html?id=${newsId}`;
        }, 50);
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

export const navigation = new NavigationManager();
