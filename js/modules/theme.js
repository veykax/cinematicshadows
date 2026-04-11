/**
 * Theme Utility - Dynamic color application for game cards
 * Eliminates need for repetitive CSS rules
 */

import { gamesData } from '../games-data.js';

class ThemeManager {
    constructor() {
        this.styleElement = null;
    }

    init() {
        this.injectDynamicStyles();
        this.observeCards();
    }

    injectDynamicStyles() {
        // Create dynamic stylesheet for game-specific colors
        if (!document.getElementById('dynamic-game-styles')) {
            this.styleElement = document.createElement('style');
            this.styleElement.id = 'dynamic-game-styles';
            document.head.appendChild(this.styleElement);
        } else {
            this.styleElement = document.getElementById('dynamic-game-styles');
        }

        this.updateStyles();
    }

    updateStyles() {
        if (!this.styleElement) return;

        const styles = Object.keys(gamesData).map(gameId => {
            const game = gamesData[gameId];
            const color = game.color;
            const rgb = this.hexToRgb(color);

            return `
                .game-card[data-game="${gameId}"] {
                    --accent: ${color};
                    --accent-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                                box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                                border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
                                opacity 0.3s ease;
                }
                .game-card[data-game="${gameId}"]:hover {
                    border-color: ${color};
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7),
                                0 0 25px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6);
                }
                .game-card[data-game="${gameId}"]:hover .game-title {
                    color: ${color};
                }
            `;
        }).join('\n');

        this.styleElement.textContent = styles;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 220, g: 38, b: 38 };
    }

    observeCards() {
        // Apply colors to dynamically added cards
        const observer = new MutationObserver(() => {
            this.updateStyles();
        });

        const gamesGrid = document.getElementById('games-grid');
        if (gamesGrid) {
            observer.observe(gamesGrid, { childList: true });
        }
    }

    applyThemeColor(gameId) {
        const game = gamesData[gameId];
        if (!game) return;

        const root = document.documentElement;
        root.style.setProperty('--accent', game.color);
        root.style.setProperty('--glow', `${game.color}44`);
    }

    resetThemeColor() {
        const root = document.documentElement;
        root.style.setProperty('--accent', '#dc2626');
        root.style.setProperty('--glow', '#dc262644');
    }
}

export const theme = new ThemeManager();
