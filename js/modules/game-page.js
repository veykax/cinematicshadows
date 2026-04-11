/**
 * Game Page Module - Independent game detail page
 */

import { gamesData } from '../games-data.js';

class GamePageManager {
    constructor() {
        this.container = null;
        this.currentGameId = null;
    }

    init() {
        this.container = document.getElementById('game-page-content');
        if (!this.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        this.currentGameId = urlParams.get('id');
    }

    render(lang, dict) {
        if (!this.container || !this.currentGameId || !dict) return;

        const data = gamesData[this.currentGameId];
        if (!data) {
            this.container.innerHTML = '<p style="text-align: center; padding: 5rem;">Game not found</p>';
            return;
        }

        const nextData = gamesData[data.nextGame];
        const subtitle = lang === 'uk' ? data.subtitleUk : data.subtitleEn;
        const features = lang === 'uk' ? data.featuresUk : data.featuresEn;
        const reviewQuote = lang === 'uk' ? data.review.quoteUk : data.review.quoteEn;

        document.title = `${dict.doc_brand} | ${data.title}`;

        this.container.innerHTML = `
            <section class="game-detail-hero" style="background-image: url('${data.heroImage}')">
                <div class="hero-content-inner reveal active">
                    <p class="game-page-subtitle" style="color: ${data.color}">${subtitle}</p>
                    <h1 class="game-page-title">${data.title}</h1>
                </div>
            </section>

            <section class="game-info-grid">
                <div class="info-block reveal active">
                    <h2 style="border-color: ${data.color}">${dict.label_about}</h2>
                    <p class="info-text">${dict[data.descKey]}</p>
                    <h2 style="border-color: ${data.color}">${dict.label_features}</h2>
                    <div class="features-list" style="margin-bottom: 3rem;">
                        ${features.map(f => `
                            <div class="feature-item">
                                <span class="feature-dot" style="background: ${data.color}"></span>
                                ${f}
                            </div>
                        `).join('')}
                    </div>
                    <h2 style="border-color: ${data.color}">${dict.label_sysreq}</h2>
                    <div class="system-req">
                        <div style="margin-bottom: 1.5rem;">
                            <p class="meta-label">${dict.label_min}</p>
                            <p class="info-text" style="font-size: 0.95rem; margin-bottom: 0;">${data.specs.min}</p>
                        </div>
                        <div>
                            <p class="meta-label">${dict.label_rec}</p>
                            <p class="info-text" style="font-size: 0.95rem; margin-bottom: 0;">${data.specs.rec}</p>
                        </div>
                    </div>
                </div>

                <div class="info-block reveal active">
                    <div class="review-box" style="margin-bottom: 3rem; background: var(--bg-card); padding: 2.5rem; border-left: 4px solid ${data.color}; border-radius: 0 var(--radius-md) var(--radius-md) 0;">
                        <p class="meta-label">${dict.label_accolades}</p>
                        <h3 style="font-size: 2.5rem; margin: 1rem 0; color: ${data.color}; line-height: 1;">${data.review.score}</h3>
                        <p class="info-text" style="font-style: italic; margin-bottom: 1rem;">${reviewQuote}</p>
                        <p class="meta-label" style="text-align: right; color: var(--white);">${data.review.source}</p>
                    </div>

                    <div class="meta-list">
                        <div class="meta-item"><p class="meta-label">${dict.label_release}</p><p class="meta-value">${data.release}</p></div>
                        <div class="meta-item"><p class="meta-label">${dict.label_developer}</p><p class="meta-value">${data.developer}</p></div>
                        <div class="meta-item"><p class="meta-label">${dict.label_edition}</p><p class="meta-value">${data.edition}</p></div>
                        <div class="meta-item" style="margin-bottom: 0;"><p class="meta-label">${dict.label_platforms}</p><p class="meta-value">PC, PS5, XBOX</p></div>
                    </div>

                    <h2 style="border-color: ${data.color}; margin-top: 3rem;">${dict.label_gallery}</h2>
                    <div class="gallery-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem;">
                        <img src="${data.cardImage}" class="gallery-thumb" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.4s var(--ease-smooth); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);">
                        <img src="${data.heroImage}" class="gallery-thumb" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.4s var(--ease-smooth); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);">
                    </div>

                    <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem;">
                        <a href="game.html?id=${data.nextGame}" class="btn-primary" style="width: 100%; text-align: center; background: transparent; border: 1px solid ${data.color}; box-shadow: none;">
                            ${dict.btn_next}: ${nextData.title}
                        </a>
                        <a href="archive.html" class="btn-primary" style="width: 100%; text-align: center; background: ${data.color}; box-shadow: 0 10px 30px ${data.color}44;">
                            ${dict.btn_back}
                        </a>
                    </div>
                </div>
            </section>
        `;

        const root = document.documentElement;
        root.style.setProperty('--accent', data.color);
        root.style.setProperty('--glow', `${data.color}44`);

        this.initLightbox(dict);

        import('./scroll.js').then(({ scroll }) => {
            scroll.refreshObserver();
        });
    }

    initLightbox(dict) {
        const thumbs = document.querySelectorAll('.gallery-thumb');
        if (thumbs.length === 0) return;

        const altText = dict?.gallery_image_alt || 'Gallery image';

        if (!document.getElementById('lightbox')) {
            const lb = document.createElement('div');
            lb.id = 'lightbox';
            lb.className = 'lightbox';
            lb.innerHTML = `<button class="lightbox-close">&times;</button><img class="lightbox-img" src="" alt="">`;
            document.body.appendChild(lb);
        }

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        lightboxImg.setAttribute('alt', altText);
        const closeBtn = lightbox.querySelector('.lightbox-close');

        if (!lightbox.dataset.csBound) {
            lightbox.dataset.csBound = '1';
            closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) lightbox.classList.remove('active');
            });
        }

        thumbs.forEach(thumb => {
            thumb.style.cursor = 'none';
            thumb.addEventListener('mouseenter', () => {
                thumb.style.transform = 'scale(1.05) translateY(-5px)';
                thumb.style.borderColor = 'var(--accent)';
                thumb.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.6)';
            });
            thumb.addEventListener('mouseleave', () => {
                thumb.style.transform = 'scale(1)';
                thumb.style.borderColor = 'rgba(255,255,255,0.1)';
                thumb.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.4)';
            });

            thumb.addEventListener('click', () => {
                lightboxImg.src = thumb.src;
                lightbox.classList.add('active');
            });
        });
    }
}

export const gamePage = new GamePageManager();
