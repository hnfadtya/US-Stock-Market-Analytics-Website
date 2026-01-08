/**
 * Utility functions for formatting data
 */

/**
 * Format number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

/**
 * Format number with commas
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
    if (value === null || value === undefined) return '-';
    
    return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format volume (millions, billions)
 * @param {number} value - Volume number
 * @returns {string} Formatted volume string
 */
export const formatVolume = (value) => {
    if (value === null || value === undefined) return '-';
    
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(2)}K`;
    }

    return value.toString();
};

/**
 * Format percentage
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value) => {
    if (value === null || value === undefined) return '-';
    
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    if (!date) return '-';
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateInput = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};

/**
 * Format relative time (e.g., "5 mins ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

/**
 * Get color class based on value (red/green)
 * @param {number} value - Value to check
 * @returns {string} Tailwind color class
 */
export const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
};

/**
 * Get arrow icon based on value
 * @param {number} value - Value to check
 * @returns {string} Arrow character
 */
export const getChangeArrow = (value) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
};