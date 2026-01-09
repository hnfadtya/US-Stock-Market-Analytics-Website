require('dotenv').config();

module.exports = {
    // API Configuration
    FMP_API_KEY: process.env.FMP_API_KEY,
    FMP_BASE_URL: 'https://financialmodelingprep.com/stable',
    
    // Stock Symbols
    STOCK_SYMBOLS: (process.env.STOCK_SYMBOLS || 'AAPL,MSFT,GOOGL,JPM,JNJ,TSLA,XOM,PG,BA,DIS').split(','),
    
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Market Hours (EST)
    MARKET_OPEN_HOUR: 9,    // 9:30 AM EST
    MARKET_CLOSE_HOUR: 16,  // 4:00 PM EST
    DATA_AVAILABLE_HOUR: 17, // 5:00 PM EST (after market close)
    
    // Pagination
    DEFAULT_PAGE_SIZE: 50,
    MAX_PAGE_SIZE: 100,
};