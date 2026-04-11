/**
 * Error Handler Module - Centralized error handling
 * Prevents one module's failure from breaking the entire site
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.isProduction = true; // Set to false for development
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError('Global Error', event.error);
            event.preventDefault();
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
            event.preventDefault();
        });
    }

    logError(context, error) {
        const errorInfo = {
            context,
            message: error?.message || String(error),
            stack: error?.stack,
            timestamp: new Date().toISOString()
        };

        this.errors.push(errorInfo);

        if (!this.isProduction) {
            console.error(`[${context}]`, error);
        }

        // Keep only last 50 errors
        if (this.errors.length > 50) {
            this.errors.shift();
        }
    }

    async safeExecute(fn, context = 'Unknown') {
        try {
            return await fn();
        } catch (error) {
            this.logError(context, error);
            return null;
        }
    }

    wrap(fn, context = 'Unknown') {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.logError(context, error);
                return null;
            }
        };
    }

    getErrors() {
        return [...this.errors];
    }

    clearErrors() {
        this.errors = [];
    }
}

export const errorHandler = new ErrorHandler();
