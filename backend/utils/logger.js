// Logger utility for Enhanced Novel Crafter

class Logger {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.prefix = options.prefix || 'EnhancedNovelCrafter';
        this.enableTimestamp = options.enableTimestamp !== false;
        
        // Define log levels and their priorities
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
    }
    
    shouldLog(level) {
        return this.levels[level] >= this.levels[this.level];
    }
    
    getTimestamp() {
        if (!this.enableTimestamp) return '';
        return `[${new Date().toISOString()}]`;
    }
    
    formatMessage(level, message, data) {
        const timestamp = this.getTimestamp();
        const prefix = `${timestamp} [${this.prefix}] [${level.toUpperCase()}]`;
        
        if (data && Object.keys(data).length > 0) {
            return `${prefix} ${message} ${JSON.stringify(data)}`;
        }
        
        return `${prefix} ${message}`;
    }
    
    debug(message, data = {}) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message, data));
        }
    }
    
    info(message, data = {}) {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', message, data));
        }
    }
    
    warn(message, data = {}) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message, data));
        }
    }
    
    error(message, data = {}) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message, data));
        }
    }
}

module.exports = { Logger };