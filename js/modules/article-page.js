/**
 * Article Page Module - Independent article detail page
 */

import { newsData } from '../news-data.js';

class ArticlePageManager {
    constructor() {
        this.container = null;
        this.currentArticleId = null;
    }

    init() {
        this.container = document.getElementById('article-page-content');
        if (!this.container) return;

        const urlParams = new URLSearchParams(window.location.search);
        this.currentArticleId = urlParams.get('id');
    }

    render(lang, dict) {
        if (!this.container || !this.currentArticleId || !dict) return;

        const newsItem = newsData.find(n => n.id === this.currentArticleId);
        if (!newsItem) {
            this.container.innerHTML = '<p style="text-align: center; padding: 5rem;">Article not found</p>';
            return;
        }

        const title = lang === 'uk' ? newsItem.titleUk : newsItem.titleEn;
        const content = lang === 'uk' ? newsItem.contentUk : newsItem.contentEn;

        document.title = `${dict.doc_brand} | ${title}`;

        this.container.innerHTML = `
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

        setTimeout(() => {
            import('./scroll.js').then(({ scroll }) => {
                scroll.refreshObserver();
            });
        }, 100);
    }
}

export const articlePage = new ArticlePageManager();
