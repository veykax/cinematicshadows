/**
 * Localization Module - Independent language management
 */

class LocalizationManager {
    constructor() {
        this.currentLang = localStorage.getItem('site-lang') || 'uk';
        this.dictionary = null;
        this.listeners = [];
    }

    async init() {
        try {
            const response = await fetch('js/languages.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.dictionary = await response.json();
            this.applyLanguage(this.currentLang);
            this.setupToggle();
            return this.dictionary[this.currentLang];
        } catch (error) {
            console.error('Localization init error:', error);
            // Return fallback dictionary
            return this.getFallbackDict();
        }
    }

    getFallbackDict() {
        return {
            site_logo: 'CINEMATIC SHADOWS',
            nav_home: 'Home',
            nav_archive: 'Archive',
            nav_news: 'News',
            nav_credits: 'Credits',
            btn_read_more: 'Read More',
            doc_brand: 'Cinematic Shadows'
        };
    }

    applyLanguage(lang) {
        if (!this.dictionary || !this.dictionary[lang]) return;

        this.currentLang = lang;
        const dict = this.dictionary[lang];

        document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (!dict[key]) return;

            const attr = el.getAttribute('data-lang-attr');
            if (attr) {
                el.setAttribute(attr, dict[key]);
            } else {
                el.textContent = dict[key];
            }
        });

        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.textContent = lang === 'uk' ? 'ENG' : 'UKR';
        }

        localStorage.setItem('site-lang', lang);

        this.notifyListeners(lang, dict);
    }

    setupToggle() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'lang-toggle') {
                const newLang = this.currentLang === 'uk' ? 'en' : 'uk';
                this.applyLanguage(newLang);
            }
        });
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(lang, dict) {
        this.listeners.forEach(callback => callback(lang, dict));
    }

    getCurrentLang() {
        return this.currentLang;
    }

    getDict() {
        return this.dictionary ? this.dictionary[this.currentLang] : null;
    }
}

export const localization = new LocalizationManager();
