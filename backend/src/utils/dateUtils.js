/**
 * Date utility functions
 * Handles date formatting, market hours checking, and date calculations
 */

/**
 * Convert Date object to YYYY-MM-DD (e.g. "2025-01-08")
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Parse date string to Date object
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @returns {Date} Date object
 */
function parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00Z');
}

/**
 * Get current date in EST timezone
 * @returns {Date} Current date in EST
*/
function getCurrentDateEST() {
    return new Date(new Date().toLocaleString('en-US', { 
        timeZone: 'America/New_York' 
    }));
}

/**
 * Check if market is closed (after 5 PM EST)
 * Data from FMP API is available after market close + processing time
 * @returns {boolean} True if market is closed and data is available
*/
function isAfterMarketClose() {
    const estDate = getCurrentDateEST();
    const hour = estDate.getHours();
    
    // Market closes at 4 PM EST, data available after 5 PM EST
    return hour >= 17 || hour < 9; // After 5 PM or before 9 AM (next day)
}

/**
 * Check if date is a weekend
 * @param {Date} date - Date to check
 * @returns {boolean} True if weekend
 */
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Subtract days from date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to subtract
 * @returns {Date} New date
 */
function subtractDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
}

/**
 * Add days to date
 * @param {Date} date - Starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
}

/**
 * Subtract months from date
 * @param {Date} date - Starting date
 * @param {number} months - Number of months to subtract
 * @returns {Date} New date
 */
function subtractMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
}

/**
 * Get date range for last N days (excluding weekends)
 * @param {number} days - Number of trading days
 * @returns {Object} { from: Date, to: Date }
 */
function getTradingDaysRange(days) {
    const today = getCurrentDateEST();
    let tradingDays = 0;
    let currentDate = new Date(today);
    
    while (tradingDays < days) {
        currentDate = subtractDays(currentDate, 1);
        if (!isWeekend(currentDate)) {
            tradingDays++;
        }
    }

    return {
        from: currentDate,
        to: today
    };
}

/**
 * Format datetime to ISO string
 * @param {Date} date - Date object
 * @returns {string} ISO string
 */
function toISOString(date) {
    return date.toISOString();
}

module.exports = {
    formatDate,
    parseDate,
    getCurrentDateEST,
    isAfterMarketClose,
    isWeekend,
    subtractDays,
    addDays,
    subtractMonths,
    getTradingDaysRange,
    toISOString,
};