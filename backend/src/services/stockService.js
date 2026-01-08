/**
 * Stock Service
 * Business logic for stock operations and sync mechanism
 */

const stockModel = require('../models/stockModel');
const syncLogModel = require('../models/syncLogModel');
const fmpService = require('./fmpService');
const { STOCK_SYMBOLS } = require('../config/constants');
const { 
  formatDate, 
  getCurrentDateEST, 
  isAfterMarketClose,
  subtractMonths 
} = require('../utils/dateUtils');

/**
 * Initial sync - Fetch historical data for all stocks
 * Called once to populate database with historical data
 * @returns {Promise<Object>} Sync result
 */
async function initialSync() {
  const startTime = Date.now();
  let totalRecords = 0;
  const errors = [];

  try {
    console.log('Starting initial sync...');
    
    const today = getCurrentDateEST();
    const oneMonthAgo = subtractMonths(today, 1);
    
    // Loop through each stock symbol
    for (const symbol of STOCK_SYMBOLS) {
      try {
        console.log(`Syncing ${symbol}...`);
        
        // 1. Get company profile (sector, industry, name)
        const profile = await fmpService.getCompanyProfile(symbol);
        
        // 2. Get historical data (1 month)
        const historicalData = await fmpService.getHistoricalEOD(
          symbol,
          oneMonthAgo,
          today
        );
        
        // 3. Insert each record
        for (const record of historicalData) {
          await stockModel.upsertStock({
            symbol: record.symbol,
            company_name: profile.companyName,
            sector: profile.sector,
            industry: profile.industry,
            open_price: record.open,
            high_price: record.high,
            low_price: record.low,
            close_price: record.close,
            volume: record.volume,
            change: record.change,
            change_percent: record.changePercent,
            date: record.date,
            is_final: true, // Historical data is always final
          });
          
          totalRecords++;
        }
        
        console.log(`${symbol}: ${historicalData.length} records synced`);
        
      } catch (error) {
        console.error(`Error syncing ${symbol}:`, error.message);
        errors.push({ symbol, error: error.message });
      }
    }
    
    // Log sync
    await syncLogModel.createSyncLog({
      sync_type: 'initial',
      records_synced: totalRecords,
      status: errors.length === 0 ? 'success' : 'partial',
      error_message: errors.length > 0 ? JSON.stringify(errors) : null,
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      success: true,
      message: `Initial sync completed in ${duration}s`,
      totalRecords,
      errors: errors.length > 0 ? errors : undefined,
    };
    
  } catch (error) {
    console.error('Initial sync failed:', error);
    
    await syncLogModel.createSyncLog({
      sync_type: 'initial',
      records_synced: totalRecords,
      status: 'failed',
      error_message: error.message,
    });
    
    throw error;
  }
}

/**
 * Regular sync - Update with latest data using Batch Quote API
 * This is THE MAIN SYNC FUNCTION!
 * @returns {Promise<Object>} Sync result
 */
async function syncStocks() {
  const startTime = Date.now();
  let totalRecords = 0;
  
  try {
    console.log('Starting regular sync...');
    
    const today = formatDate(getCurrentDateEST());
    const isMarketClosed = isAfterMarketClose();
    
    // Use Batch Quote API (1 call for all stocks!)
    const quotes = await fmpService.getBatchQuote(STOCK_SYMBOLS);
    
    if (quotes.length === 0) {
      console.log('No quote data available');
      return {
        success: false,
        message: 'No quote data available from API',
      };
    }
    
    // Get company profiles for new stocks (if needed)
    const profileCache = {};
    
    for (const quote of quotes) {
      try {
        // Get or fetch profile
        if (!profileCache[quote.symbol]) {
          // Check if we have this stock in DB
          const existingStocks = await stockModel.getStocksBySymbol(quote.symbol);
          
          if (existingStocks.length > 0) {
            // Use existing profile data
            const existing = existingStocks[0];
            profileCache[quote.symbol] = {
              companyName: existing.company_name,
              sector: existing.sector,
              industry: existing.industry,
            };
          } else {
            // Fetch new profile
            const profile = await fmpService.getCompanyProfile(quote.symbol);
            profileCache[quote.symbol] = {
              companyName: profile.companyName,
              sector: profile.sector,
              industry: profile.industry,
            };
          }
        }
        
        const profile = profileCache[quote.symbol];
        
        // Upsert stock data
        await stockModel.upsertStock({
          symbol: quote.symbol,
          company_name: profile.companyName,
          sector: profile.sector,
          industry: profile.industry,
          open_price: quote.open,
          high_price: quote.high,
          low_price: quote.low,
          close_price: quote.close,
          volume: quote.volume,
          change: quote.change,
          change_percent: quote.changePercent,
          date: today,
          is_final: isMarketClosed, // Mark as final if market closed
        });
        
        totalRecords++;
        
      } catch (error) {
        console.error(`Error syncing ${quote.symbol}:`, error.message);
      }
    }
    
    // Log sync
    await syncLogModel.createSyncLog({
      sync_type: 'manual',
      records_synced: totalRecords,
      status: 'success',
    });
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const finalStatus = isMarketClosed ? '(final)' : '(real-time)';
    
    console.log(`Sync completed: ${totalRecords} records ${finalStatus}`);
    
    return {
      success: true,
      message: `Synced ${totalRecords} stocks ${finalStatus}`,
      totalRecords,
      isFinal: isMarketClosed,
      duration: `${duration}s`,
      lastSyncTime: new Date(),
    };
    
  } catch (error) {
    console.error('Sync failed:', error);
    
    await syncLogModel.createSyncLog({
      sync_type: 'manual',
      records_synced: totalRecords,
      status: 'failed',
      error_message: error.message,
    });
    
    throw error;
  }
}

/**
 * Check if initial sync is needed
 * @returns {Promise<boolean>} True if database is empty
 */
async function needsInitialSync() {
  try {
    const stats = await stockModel.getDashboardStats();
    return stats.totalRecords === 0;
  } catch (error) {
    console.error('Error checking initial sync:', error);
    return true;
  }
}

module.exports = {
  initialSync,
  syncStocks,
  needsInitialSync,
};