/**
 * Input validation utilities
 */

/**
 * Validate stock symbol
 * @param {string} symbol - Stock symbol to validate
 * @returns {boolean} True if valid
 */
function isValidSymbol(symbol) {
    if (!symbol || typeof symbol !== 'string') return false;
    
    // Stock symbols: 1-5 uppercase letters
    const symbolRegex = /^[A-Z]{1,5}$/;
    return symbolRegex.test(symbol);
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} True if valid
 */
function isValidDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return false;
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) return false;
    
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
}

/**
 * Validate price (positive decimal)
 * @param {number} price - Price to validate
 * @returns {boolean} True if valid
 */
function isValidPrice(price) {
    return typeof price === 'number' && price > 0 && isFinite(price);
}

/**
 * Validate volume (positive integer)
 * @param {number} volume - Volume to validate
 * @returns {boolean} True if valid
 */
function isValidVolume(volume) {
    return Number.isInteger(volume) && volume >= 0;
}

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} { valid: boolean, page: number, limit: number }
 */
function validatePagination(page, limit) {
    const validPage = Math.max(1, parseInt(page) || 1);
    const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    
    return {
        valid: true,
        page: validPage,
        limit: validLimit,
    };
}

/**
 * Validate sort order
 * @param {string} order - Sort order (asc/desc)
 * @returns {string} Valid sort order
 */
function validateSortOrder(order) {
    const normalizedOrder = (order || '').toLowerCase();
    return ['asc', 'desc'].includes(normalizedOrder) ? normalizedOrder : 'desc';
}

/**
 * Validate stock data object for creation/update
 * @param {Object} data - Stock data to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateStockData(data) {
    const errors = [];
    
    if (!isValidSymbol(data.symbol)) {
        errors.push('Invalid symbol: must be 1-5 uppercase letters');
    }

    if (!isValidDate(data.date)) {
        errors.push('Invalid date: must be YYYY-MM-DD format');
    }

    if (!isValidPrice(data.open_price)) {
        errors.push('Invalid open_price: must be positive number');
    }

    if (!isValidPrice(data.high_price)) {
        errors.push('Invalid high_price: must be positive number');
    }

    if (!isValidPrice(data.low_price)) {
        errors.push('Invalid low_price: must be positive number');
    }

    if (!isValidPrice(data.close_price)) {
        errors.push('Invalid close_price: must be positive number');
    }

    if (!isValidVolume(data.volume)) {
        errors.push('Invalid volume: must be non-negative integer');
    }

    // Validate price relationships
    if (data.high_price < data.low_price) {
        errors.push('high_price must be greater than or equal to low_price');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

module.exports = {
    isValidSymbol,
    isValidDate,
    isValidPrice,
    isValidVolume,
    validatePagination,
    validateSortOrder,
    validateStockData,
};