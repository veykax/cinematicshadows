/**
 * Collection Module - Display game series/collections
 */

import { collectionsData } from '../collections-data.js';
import { gamesData } from '../games-data.js';

class CollectionManager {
    constructor() {
        this.container = null;
        this.currentCollectionId = null;
    }

    init() {
        this.container = document.getElementById('collection-content');
        if (!this.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        this.currentCollectionId = urlParams.get('id');
    }

    render(lang, dict) {
        if (!this.container || !this.currentCollectionId || !dict) return;

        const collection = collectionsData[this.currentCollectionId];
        if (!collection) {
            this.container.innerHTML = '<p style="text-align: center; padding: 5rem;">Collection not found</p>';
            return;
        }

        const description = lang === 'uk' ? collection.descriptionUk : collection.descriptionEn;
        document.title = `${dict.doc_brand} | ${collection.title}`;

        this.container.innerHTML = `
            <section class="collection-hero" style="background-image: url('${collection.heroImage}')">
                <div class="hero-content-inner reveal active">
                    <p class="collection-subtitle">${collection.genre}</p>
                    <h1 class="collection-title">${collection.title}</h1>
                    <p class="collection-description">${description}</p>
                    <span class="collection-count">${collection.games.length} ${dict.label_games || 'Games'}</span>
                </div>
            </section>

            <section class="collection-games-grid">
                ${collection.games.map(gameId => {
                    const game = gamesData[gameId];
                    if (!game) return '';

                    return `
                        <article class="collection-game-card reveal" data-game="${gameId}">
                            <div class="collection-card-image" style="background-image: url('${game.cardImage}')"></div>
                            <div class="collection-card-info">
                                <h3 class="collection-game-title">${game.title}</h3>
                                <p class="collection-game-year">${game.release}</p>
                                <p class="collection-game-desc">${dict[game.descKey] || ''}</p>
                            </div>
                        </article>
                    `;
                }).join('')}
            </section>

            <section class="collection-back-section">
                <a href="archive.html" class="btn-primary" style="background: var(--accent); box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.3);">
                    ${dict.btn_back || 'Back to Archive'}
                </a>
            </section>
        `;

        const root = document.documentElement;
        root.style.setProperty('--accent', collection.color);
        root.style.setProperty('--glow', `${collection.color}44`);

        // Add click handlers to game cards
        const cards = document.querySelectorAll('.collection-game-card');
        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const gameId = card.dataset.game;
                window.location.href = `game.html?id=${gameId}`;
            });
        });

        import('./scroll.js').then(({ scroll }) => {
            scroll.refreshObserver();
        });
    }
}

export const collection = new CollectionManager();
