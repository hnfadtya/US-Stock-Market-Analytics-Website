/**
 * Stock Model
 * Handles all database operations for stocks table
 */

const pool = require('../config/database');

/**
 * Get all stocks with optional filters, sorting, and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} { data: Array, pagination: Object }
 */
async function getAllStocks(options = {}) {
  try {
    const {
      page = 1,
      limit = 50,
      symbol,
      sector,
      dateFrom,
      dateTo,
      sortBy = 'updated_at',
      sortOrder = 'DESC',
      search,
    } = options;

    // Build WHERE clause
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (symbol) {
      conditions.push(`symbol = $${paramCount++}`);
      params.push(symbol);
    }

    if (sector) {
      conditions.push(`sector = $${paramCount++}`);
      params.push(sector);
    }

    if (dateFrom) {
      conditions.push(`date >= $${paramCount++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`date <= $${paramCount++}`);
      params.push(dateTo);
    }

    if (search) {
      conditions.push(`(symbol ILIKE $${paramCount} OR company_name ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Valid sort columns
    const validSortColumns = ['date', 'symbol', 'close_price', 'volume', 'change_percent', 'updated_at'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'updated_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count total records
    const countQuery = `SELECT COUNT(*) FROM stocks ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalRecords = parseInt(countResult.rows[0].count);

    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch data
    const dataQuery = `
      SELECT 
        id, symbol, company_name, sector, industry,
        open_price, high_price, low_price, close_price, volume,
        change, change_percent, date, is_final,
        created_at, updated_at
      FROM stocks
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    params.push(limit, offset);
    const dataResult = await pool.query(dataQuery, params);

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error in getAllStocks:', error);
    throw error;
  }
}

/**
 * Get stock by ID
 * @param {number} id - Stock ID
 * @returns {Promise<Object|null>} Stock data or null
 */
async function getStockById(id) {
  try {
    const query = 'SELECT * FROM stocks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getStockById:', error);
    throw error;
  }
}

/**
 * Get stocks by symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} Array of stock records
 */
async function getStocksBySymbol(symbol) {
  try {
    const query = 'SELECT * FROM stocks WHERE symbol = $1 ORDER BY date DESC';
    const result = await pool.query(query, [symbol]);
    return result.rows;
  } catch (error) {
    console.error('Error in getStocksBySymbol:', error);
    throw error;
  }
}

/**
 * Get last date for a symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<string|null>} Last date or null
 */
async function getLastDateForSymbol(symbol) {
  try {
    const query = 'SELECT MAX(date) as last_date FROM stocks WHERE symbol = $1';
    const result = await pool.query(query, [symbol]);
    return result.rows[0]?.last_date || null;
  } catch (error) {
    console.error('Error in getLastDateForSymbol:', error);
    throw error;
  }
}

/**
 * Create new stock record
 * @param {Object} stockData - Stock data
 * @returns {Promise<Object>} Created stock record
 */
async function createStock(stockData) {
  try {
    const {
      symbol,
      company_name,
      sector,
      industry,
      open_price,
      high_price,
      low_price,
      close_price,
      volume,
      change,
      change_percent,
      date,
      is_final = false,
    } = stockData;

    const query = `
      INSERT INTO stocks (
        symbol, company_name, sector, industry,
        open_price, high_price, low_price, close_price, volume,
        change, change_percent, date, is_final
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      symbol, company_name, sector, industry,
      open_price, high_price, low_price, close_price, volume,
      change, change_percent, date, is_final,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createStock:', error);
    throw error;
  }
}

/**
 * Update stock record
 * @param {number} id - Stock ID
 * @param {Object} stockData - Updated stock data
 * @returns {Promise<Object>} Updated stock record
 */
async function updateStock(id, stockData) {
  try {
    const {
      open_price,
      high_price,
      low_price,
      close_price,
      volume,
      change,
      change_percent,
      is_final,
    } = stockData;

    const query = `
      UPDATE stocks
      SET 
        open_price = $1,
        high_price = $2,
        low_price = $3,
        close_price = $4,
        volume = $5,
        change = $6,
        change_percent = $7,
        is_final = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      open_price, high_price, low_price, close_price, volume,
      change, change_percent, is_final, id,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateStock:', error);
    throw error;
  }
}

/**
 * Upsert stock record (insert or update if exists)
 * @param {Object} stockData - Stock data
 * @returns {Promise<Object>} Stock record
 */
async function upsertStock(stockData) {
  try {
    const {
      symbol,
      company_name,
      sector,
      industry,
      open_price,
      high_price,
      low_price,
      close_price,
      volume,
      change,
      change_percent,
      date,
      is_final = false,
    } = stockData;

    const query = `
      INSERT INTO stocks (
        symbol, company_name, sector, industry,
        open_price, high_price, low_price, close_price, volume,
        change, change_percent, date, is_final
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (symbol, date)
      DO UPDATE SET
        open_price = EXCLUDED.open_price,
        high_price = EXCLUDED.high_price,
        low_price = EXCLUDED.low_price,
        close_price = EXCLUDED.close_price,
        volume = EXCLUDED.volume,
        change = EXCLUDED.change,
        change_percent = EXCLUDED.change_percent,
        is_final = EXCLUDED.is_final,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      symbol, company_name, sector, industry,
      open_price, high_price, low_price, close_price, volume,
      change, change_percent, date, is_final,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in upsertStock:', error);
    throw error;
  }
}

/**
 * Delete stock record
 * @param {number} id - Stock ID
 * @returns {Promise<boolean>} True if deleted
 */
async function deleteStock(id) {
  try {
    const query = 'DELETE FROM stocks WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  } catch (error) {
    console.error('Error in deleteStock:', error);
    throw error;
  }
}

/**
 * Get sector distribution (for Pie Chart)
 * @param {Object} options - Date filter options
 * @returns {Promise<Array>} Sector distribution data
 */
async function getSectorDistribution(options = {}) {
  try {
    const { dateFrom, dateTo } = options;
    
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (dateFrom) {
      conditions.push(`date >= $${paramCount++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`date <= $${paramCount++}`);
      params.push(dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        sector,
        COUNT(DISTINCT symbol) as stock_count,
        AVG(close_price) as avg_price,
        SUM(volume) as total_volume
      FROM stocks
      ${whereClause}
      GROUP BY sector
      ORDER BY stock_count DESC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error in getSectorDistribution:', error);
    throw error;
  }
}

/**
 * Get price timeline (for Column Chart)
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Timeline data
 */
async function getPriceTimeline(options = {}) {
  try {
    const { dateFrom, dateTo, symbol } = options;
    
    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (symbol) {
      conditions.push(`symbol = $${paramCount++}`);
      params.push(symbol);
    }

    if (dateFrom) {
      conditions.push(`date >= $${paramCount++}`);
      params.push(dateFrom);
    }

    if (dateTo) {
      conditions.push(`date <= $${paramCount++}`);
      params.push(dateTo);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        date,
        AVG(close_price) as avg_close,
        SUM(volume) as total_volume,
        COUNT(DISTINCT symbol) as stock_count
      FROM stocks
      ${whereClause}
      GROUP BY date
      ORDER BY date ASC
    `;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error in getPriceTimeline:', error);
    throw error;
  }
}

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
async function getDashboardStats() {
  try {
    const queries = {
      totalStocks: 'SELECT COUNT(DISTINCT symbol) as count FROM stocks',
      totalRecords: 'SELECT COUNT(*) as count FROM stocks',
      latestDate: 'SELECT MAX(date) as date FROM stocks',
      sectors: 'SELECT COUNT(DISTINCT sector) as count FROM stocks',
    };

    const results = await Promise.all([
      pool.query(queries.totalStocks),
      pool.query(queries.totalRecords),
      pool.query(queries.latestDate),
      pool.query(queries.sectors),
    ]);

    return {
      totalStocks: parseInt(results[0].rows[0].count),
      totalRecords: parseInt(results[1].rows[0].count),
      latestDate: results[2].rows[0].date,
      totalSectors: parseInt(results[3].rows[0].count),
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
}

module.exports = {
  getAllStocks,
  getStockById,
  getStocksBySymbol,
  getLastDateForSymbol,
  createStock,
  updateStock,
  upsertStock,
  deleteStock,
  getSectorDistribution,
  getPriceTimeline,
  getDashboardStats,
};