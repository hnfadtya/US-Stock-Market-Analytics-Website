/**
 * Financial Modeling Prep (FMP) API Service
 * Handles all external API calls to FMP
 */

const { FMP_API_KEY, FMP_BASE_URL } = require('../config/constants');
const { formatDate } = require('../utils/dateUtils');

/**
 * Fetch data from FMP API
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} API response data
 */
async function fetchFromFMP(endpoint) {
    const url = `${FMP_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`FMP API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('FMP API Error:', error.message);
        throw error;
    }
}

/**
 * Get company profile (includes sector, industry, name)
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company profile data
 */
async function getCompanyProfile(symbol) {
    try {
        const endpoint = `/profile?symbol=${symbol}&apikey=${FMP_API_KEY}`;
        const data = await fetchFromFMP(endpoint);
        
        if (!data || data.length === 0) {
            throw new Error(`No profile data found for ${symbol}`);
        }

        const profile = data[0];

        return {
            symbol: profile.symbol,
            companyName: profile.companyName,
            sector: profile.sector || 'Unknown',
            industry: profile.industry || 'Unknown',
            exchange: profile.exchange,
            currency: profile.currency,
        };
    } catch (error) {
        console.error(`Error fetching profile for ${symbol}:`, error.message);
        throw error;
    }
}

/**
 * Get historical EOD (End of Day) data
 * Used for initial sync to get historical data
 * @param {string} symbol - Stock symbol
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {Promise<Array>} Array of historical data
 */
async function getHistoricalEOD(symbol, fromDate, toDate) {
    try {
        const from = formatDate(fromDate);
        const to = formatDate(toDate);
        
        const endpoint = `/historical-price-eod/full?symbol=${symbol}&from=${from}&to=${to}&apikey=${FMP_API_KEY}`;
        const data = await fetchFromFMP(endpoint);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.warn(`No historical data found for ${symbol}`);
            return [];
        }

        console.log(`Fetched ${data.length} records for ${symbol}`);

        // Transform FMP data to valid format
        return data.map(record => ({
            symbol: symbol,
            date: record.date,
            open: record.open,
            high: record.high,
            low: record.low,
            close: record.close,
            volume: record.volume,
            change: record.change || 0,
            changePercent: record.changePercent || 0,
        }));
    } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error.message);
        throw error;
    }
}

/**
 * Get batch quote for multiple symbols (real-time data)
 * @param {Array<string>} symbols - Array of stock symbols
 * @returns {Promise<Array>} Array of quote data
 */
async function getBatchQuote(symbols) {
    try {
        const symbolsParam = symbols.join(',');
        const endpoint = `/batch-quote?symbols=${symbolsParam}&apikey=${FMP_API_KEY}`;
        const data = await fetchFromFMP(endpoint);

        if (!data || data.length === 0) {
            console.warn('No quote data returned');
            return [];
        }

        // Transform quote data to valid format
        return data.map(quote => ({
            symbol: quote.symbol,
            open: quote.open,
            high: quote.dayHigh,
            low: quote.dayLow,
            close: quote.price, // Current/close price
            volume: quote.volume,
            change: quote.change || 0,
            changePercent: quote.changesPercentage || 0,
            timestamp: quote.timestamp,
        }));
    } catch (error) {
        console.error('Error fetching batch quote:', error.message);
        throw error;
    }
}   

/**
 * Get single stock quote
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
async function getSingleQuote(symbol) {
    try {
        const endpoint = `/quote?symbol=${symbol}&apikey=${FMP_API_KEY}`;
        const data = await fetchFromFMP(endpoint);

        if (!data || data.length === 0) {
            throw new Error(`No quote data found for ${symbol}`);
        }

        const quote = data[0];

        return {
            symbol: quote.symbol,
            open: quote.open,
            high: quote.dayHigh,
            low: quote.dayLow,
            close: quote.price,
            volume: quote.volume,
            change: quote.change || 0,
            changePercent: quote.changesPercentage || 0,
            timestamp: quote.timestamp,
        };
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error.message);
        throw error;
    }
}   

module.exports = {
    getCompanyProfile,
    getHistoricalEOD,
    getBatchQuote,
    getSingleQuote,
};