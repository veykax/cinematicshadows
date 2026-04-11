/**
 * Archive Module - Independent game archive rendering
 */

import { gamesData } from '../games-data.js';

class ArchiveManager {
    constructor() {
        this.grid = null;
        this.searchInput = null;
    }

    init() {
        this.grid = document.getElementById('games-grid');
        this.searchInput = document.getElementById('game-search');

        if (this.searchInput) {
            this.setupSearch();
        }
    }

    render(lang, dict) {
        if (!this.grid || !dict) return;

        try {
            this.grid.innerHTML = Object.keys(gamesData).map(id => {
                const game = gamesData[id];
                const desc = dict[game.descKey] || '';
                return `
                    <article class="game-card reveal" data-game="${id}">
                        <div class="card-image" style="background-image: url('${game.cardImage}')"></div>
                        <div class="card-info">
                            <h3 class="game-title">${game.title}</h3>
                            <p class="game-desc">${desc}</p>
                        </div>
                    </article>
                `;
            }).join('');

            setTimeout(() => {
                import('./scroll.js').then(({ scroll }) => {
                    scroll.refreshObserver();
                }).catch(err => console.error('Failed to refresh scroll observer:', err));
            }, 100);
        } catch (error) {
            console.error('Archive render error:', error);
            this.grid.innerHTML = '<p style="text-align: center; padding: 3rem;">Failed to load games</p>';
        }
    }

    setupSearch() {
        this.searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.game-card');

            cards.forEach((card, index) => {
                const title = card.querySelector('.game-title')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('.game-desc')?.textContent?.toLowerCase() || '';

                if (title.includes(term) || desc.includes(term)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-8px) scale(0.98)';
                    setTimeout(() => card.style.display = 'none', 250);
                }
            });
        });
    }
}

export const archive = new ArchiveManager();
