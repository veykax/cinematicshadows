/**
 * Cinematic Shadows - Core Logic
 */
import { gamesData } from './games-data.js';
import { newsData } from './news-data.js';

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCursor();
    initScrollReveal();
    initLocalization();
    initGameDetails();
    initCardNavigation();
    initSearch();
    initParallax();
    fetch('js/languages.json')
        .then(res => res.json())
        .then(data => {
            renderNewsCards('uk', data['uk']);
        });
});

/* --- 0. Preloader --- */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Keep very brief for a non-annoying cinematic flash
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 300);
        });
    }
}

/* --- 1. Custom Dual Cursor --- */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const cursorLabel = document.querySelector('.cursor-label');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const resetCursor = () => {
        document.body.classList.remove('cursor-view', 'cursor-active', 'cursor-on-red');
        if (cursorLabel) cursorLabel.textContent = '';
        cursor.style.backgroundColor = '';
        follower.style.borderColor = '';
        cursor.style.display = 'none';
        follower.style.display = 'none';
    };

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
        if (cursor.style.display === 'none') {
            cursor.style.display = 'flex';
            follower.style.display = 'block';
        }
    });

    document.addEventListener('mouseleave', resetCursor);
    window.addEventListener('blur', resetCursor);
    window.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') resetCursor();
    });

    function renderFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        requestAnimationFrame(renderFollower);
    }
    renderFollower();

    const updateInteractables = () => {
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, .game-card');
            if (!target) return;

            document.body.classList.add('cursor-active');
            if (target.classList.contains('game-card')) {
                document.body.classList.add('cursor-view');
                if (cursorLabel) cursorLabel.textContent = 'VIEW';
                const game = target.getAttribute('data-game');
                const color = (gamesData[game] && gamesData[game].color) || '#dc2626';
                cursor.style.backgroundColor = color;
                follower.style.borderColor = color;
            }
            if (target.classList.contains('btn-primary') || target.classList.contains('btn-lang') || target.classList.contains('logo')) {
                document.body.classList.add('cursor-on-red');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, .game-card');
            if (!target) return;
            document.body.classList.remove('cursor-active', 'cursor-view', 'cursor-on-red');
            if (cursorLabel) cursorLabel.textContent = '';
            cursor.style.backgroundColor = '';
            follower.style.borderColor = '';
        });
    };
    updateInteractables();
}

/* --- 2. Scroll Reveal --- */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* --- 3. Localization --- */
async function initLocalization() {
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('site-lang') || 'uk';
    try {
        const response = await fetch('js/languages.json');
        const dictionary = await response.json();
        const updateContent = (lang) => {
            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.getAttribute('data-lang-key');
                if (dictionary[lang] && dictionary[lang][key]) el.textContent = dictionary[lang][key];
            });
            const creditsTitle = document.querySelector('.credits-section .section-title');
            if (creditsTitle && dictionary[lang].credits_title_white) {
                creditsTitle.innerHTML = `<span class="white">${dictionary[lang].credits_title_white}</span> <span class="red">${dictionary[lang].credits_title_red}</span>`;
            }
            if (langToggle) langToggle.textContent = lang === 'uk' ? 'ENG' : 'UKR';
            localStorage.setItem('site-lang', lang);
            const gameContainer = document.getElementById('game-page-content');
            if (gameContainer) {
                const urlParams = new URLSearchParams(window.location.search);
                const gameId = urlParams.get('id');
                if (gameId && gamesData[gameId]) renderGamePage(gameId, dictionary[lang], lang);
            }
            const articleContainer = document.getElementById('article-page-content');
            if (articleContainer) {
                const urlParams = new URLSearchParams(window.location.search);
                const newsId = urlParams.get('id');
                const newsItem = newsData.find(n => n.id === newsId);
                if (newsItem) renderArticlePage(newsItem, lang);
            }
            renderArchiveCards();
            renderNewsCards(lang, dictionary[lang]);
        };
        updateContent(currentLang);
        document.addEventListener('click', (e) => {
            if (e.target.id === 'lang-toggle') {
                currentLang = currentLang === 'uk' ? 'en' : 'uk';
                updateContent(currentLang);
            }
        });
    } catch (error) { console.error('Localization Error:', error); }
}

/* --- 4. Archive Cards Rendering --- */
function renderArchiveCards() {
    const grid = document.getElementById('games-grid');
    if (!grid) return;

    grid.innerHTML = Object.keys(gamesData).map(id => {
        const game = gamesData[id];
        return `
            <article class="game-card reveal" data-game="${id}">
                <div class="card-image" style="background-image: url('${game.cardImage}')"></div>
                <div class="card-info">
                    <h3 class="game-title">${game.title}</h3>
                    <p class="game-desc" data-lang-key="${game.descKey}">${game.subtitle}</p>
                </div>
            </article>
        `;
    }).join('');
    
    // Re-init reveal observer for new elements
    setTimeout(() => initScrollReveal(), 100);
}

/* --- 4.5 News Rendering --- */
function renderNewsCards(lang, dict) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    if (!dict) return; // Wait until dict is available

    grid.innerHTML = newsData.map(news => {
        const title = lang === 'uk' ? news.titleUk : news.titleEn;
        const desc = lang === 'uk' ? news.descUk : news.descEn;
        
        return `
            <article class="news-article reveal active" data-news="${news.id}" style="cursor: none;">
                <div class="news-image" style="background-image: url('${news.image}')"></div>
                <div class="news-content">
                    <p class="news-date">${news.date}</p>
                    <h3 class="news-title">${title}</h3>
                    <p class="news-desc">${desc}</p>
                    <button class="news-btn">${dict.btn_read_more}</button>
                </div>
            </article>
        `;
    }).join('');
    
    setTimeout(() => initScrollReveal(), 100);
}

/* --- 5. Card Navigation --- */
function initCardNavigation() {
    document.addEventListener('click', (e) => {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const gameId = gameCard.getAttribute('data-game');
            if (gameId && gamesData[gameId]) {
                const cardImg = gameCard.querySelector('.card-image');
                if (cardImg) cardImg.style.viewTransitionName = 'active-game-hero';
                setTimeout(() => {
                    window.location.href = `game.html?id=${gameId}`;
                }, 50);
            }
        }

        const newsCard = e.target.closest('.news-article');
        if (newsCard) {
            const newsId = newsCard.getAttribute('data-news');
            if (newsId) {
                const newsImg = newsCard.querySelector('.news-image');
                if (newsImg) newsImg.style.viewTransitionName = 'active-news-hero';
                setTimeout(() => {
                    window.location.href = `article.html?id=${newsId}`;
                }, 50);
            }
        }
    });
}

/* --- 5.5 Live Search --- */
function initSearch() {
    const searchInput = document.getElementById('game-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.game-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.game-title').textContent.toLowerCase();
            const desc = card.querySelector('.game-desc').textContent.toLowerCase();
            
            if (title.includes(term) || desc.includes(term)) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
                setTimeout(() => card.style.transform = 'translateZ(0) scale(1)', 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateZ(0) scale(0.9)';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
}


/* --- 5. Game Details Loading --- */
function initGameDetails() {
    const container = document.getElementById('game-page-content');
    if (!container) return;
}

function renderGamePage(gameId, dict, lang) {
    const container = document.getElementById('game-page-content');
    const data = gamesData[gameId];
    if (!data) return;
    const nextData = gamesData[data.nextGame];

    document.title = `Cinematic Shadows | ${data.title}`;

    container.innerHTML = `
        <section class="game-detail-hero" style="background-image: url('${data.heroImage}')">
            <div class="hero-content-inner reveal active">
                <p class="game-page-subtitle" style="color: ${data.color}">${data.subtitle}</p>
                <h1 class="game-page-title">${data.title}</h1>
            </div>
        </section>

        <section class="game-info-grid">
            <div class="info-block reveal active">
                <h2 style="border-color: ${data.color}">${dict.label_about}</h2>
                <p class="info-text">${dict[data.descKey]}</p>
                <h2 style="border-color: ${data.color}">${dict.label_features}</h2>
                <div class="features-list" style="margin-bottom: 3rem;">
                    ${data.features.map(f => `
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
                    <p class="info-text" style="font-style: italic; margin-bottom: 1rem;">${data.review.quote}</p>
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
                    <img src="${data.cardImage}" class="gallery-thumb" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
                    <img src="${data.heroImage}" class="gallery-thumb" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease;">
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
    // Inject Thematic Colors
    const root = document.documentElement;
    root.style.setProperty('--accent', data.color);
    root.style.setProperty('--glow', `${data.color}44`);
    
    initScrollReveal();
    initLightbox();
}

function initLightbox() {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    if (thumbs.length === 0) return;

    // Create lightbox element if it doesn't exist
    if (!document.getElementById('lightbox')) {
        const lb = document.createElement('div');
        lb.id = 'lightbox';
        lb.className = 'lightbox';
        lb.innerHTML = '<button class="lightbox-close">&times;</button><img class="lightbox-img" src="" alt="Gallery Image">';
        document.body.appendChild(lb);
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    thumbs.forEach(thumb => {
        thumb.style.cursor = 'none'; // Keeps custom cursor vibe
        thumb.addEventListener('mouseenter', () => {
            thumb.style.transform = 'scale(1.05)';
            thumb.style.borderColor = 'var(--accent)';
        });
        thumb.addEventListener('mouseleave', () => {
            thumb.style.transform = 'scale(1)';
            thumb.style.borderColor = 'rgba(255,255,255,0.1)';
        });

        thumb.addEventListener('click', () => {
            lightboxImg.src = thumb.src;
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });
}

/* --- 6. Article Details Loading --- */
function renderArticlePage(newsItem, lang) {
    const container = document.getElementById('article-page-content');
    if (!container) return;

    const title = lang === 'uk' ? newsItem.titleUk : newsItem.titleEn;
    const content = lang === 'uk' ? newsItem.contentUk : newsItem.contentEn;

    document.title = `Cinematic Shadows | ${title}`;

    container.innerHTML = `
        <section class="article-hero" style="background-image: url('${newsItem.image}')">
            <div class="article-hero-content reveal active">
                <span class="article-date">${newsItem.date}</span>
                <h1 class="article-title">${title}</h1>
            </div>
        </section>
        <section class="article-body reveal active">
            ${content}
        </section>
    `;
    
    setTimeout(() => initScrollReveal(), 100);
}

/* --- 7. Global Parallax --- */
function initGlobalParallax() {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        const heroBg = document.querySelector('.hero-bg');
        const gameHero = document.querySelector('.game-detail-hero');
        
        if (heroBg) heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
        if (gameHero) gameHero.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
    });
}

