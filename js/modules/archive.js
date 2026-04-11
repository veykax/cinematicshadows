/**
 * Archive Module - Independent game archive rendering
 */

import { gamesData } from '../games-data.js';
import { collectionsData } from '../collections-data.js';

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
            // Get IDs of games that are in collections
            const collectionGameIds = new Set();
            Object.values(collectionsData).forEach(col => {
                col.games.forEach(gameId => collectionGameIds.add(gameId));
            });

            // Render collections first
            const collectionsHTML = Object.keys(collectionsData).map(id => {
                const collection = collectionsData[id];
                const desc = lang === 'uk' ? collection.descriptionUk : collection.descriptionEn;
                const gamesCount = collection.games.length;
                return `
                    <article class="game-card reveal collection-card" data-collection="${id}">
                        <div class="collection-badge">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            ${gamesCount} ${dict.label_games || 'games'}
                        </div>
                        <div class="card-image" style="background-image: url('${collection.cardImage}')"></div>
                        <div class="card-info">
                            <h3 class="game-title">${collection.title}</h3>
                            <p class="game-desc">${desc}</p>
                        </div>
                    </article>
                `;
            }).join('');

            // Render standalone games (games not in collections)
            const standaloneGamesHTML = Object.keys(gamesData)
                .filter(id => !collectionGameIds.has(id))
                .map(id => {
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

            this.grid.innerHTML = collectionsHTML + standaloneGamesHTML;

            // Add click handlers
            this.grid.querySelectorAll('.collection-card').forEach(card => {
                card.addEventListener('click', () => {
                    const collectionId = card.dataset.collection;
                    window.location.href = `collection.html?id=${collectionId}`;
                });
            });

            this.grid.querySelectorAll('.game-card:not(.collection-card)').forEach(card => {
                card.addEventListener('click', () => {
                    const gameId = card.dataset.game;
                    window.location.href = `game.html?id=${gameId}`;
                });
            });

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
