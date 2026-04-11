/**
 * News Module - Independent news rendering
 */

import { newsData } from '../news-data.js';

class NewsManager {
    constructor() {
        this.grid = null;
    }

    init() {
        this.grid = document.getElementById('news-grid');
    }

    render(lang, dict) {
        if (!this.grid || !dict) return;

        try {
            this.grid.innerHTML = newsData.map(news => {
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

            setTimeout(() => {
                import('./scroll.js').then(({ scroll }) => {
                    scroll.refreshObserver();
                }).catch(err => console.error('Failed to refresh scroll observer:', err));
            }, 100);
        } catch (error) {
            console.error('News render error:', error);
            this.grid.innerHTML = '<p style="text-align: center; padding: 3rem;">Failed to load news</p>';
        }
    }
}

export const news = new NewsManager();
