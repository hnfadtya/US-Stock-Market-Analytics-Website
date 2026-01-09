/**
 * Sync Log Model
 * Handles database operations for sync_logs table
 */

const pool = require('../config/database');

/**
 * Create sync log entry
 * @param {Object} logData - Log data
 * @returns {Promise<Object>} Created log entry
 */
async function createSyncLog(logData) {
  try {
    const {
      sync_type,
      records_synced = 0,
      status,
      error_message = null,
    } = logData;

    const query = `
      INSERT INTO sync_logs (sync_type, records_synced, status, error_message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [sync_type, records_synced, status, error_message];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  } catch (error) {
    console.error('Error in createSyncLog:', error);
    throw error;
  }
}

/**
 * Get sync logs with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} { data: Array, pagination: Object }
 */
async function getSyncLogs(options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    
    // Count total
    const countQuery = 'SELECT COUNT(*) FROM sync_logs';
    const countResult = await pool.query(countQuery);
    const totalRecords = parseInt(countResult.rows[0].count);
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(totalRecords / limit);
    
    // Fetch data
    const dataQuery = `
      SELECT * FROM sync_logs
      ORDER BY synced_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const dataResult = await pool.query(dataQuery, [limit, offset]);
    
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
    console.error('Error in getSyncLogs:', error);
    throw error;
  }
}

/**
 * Get last sync time
 * @returns {Promise<Date|null>} Last sync timestamp
 */
async function getLastSyncTime() {
  try {
    const query = `
      SELECT synced_at 
      FROM sync_logs 
      WHERE status = 'success'
      ORDER BY synced_at DESC 
      LIMIT 1
    `;
    
    const result = await pool.query(query);
    return result.rows[0]?.synced_at || null;
  } catch (error) {
    console.error('Error in getLastSyncTime:', error);
    throw error;
  }
}

/**
 * Get sync statistics
 * @returns {Promise<Object>} Sync stats
 */
async function getSyncStats() {
  try {
    const queries = {
      totalSyncs: 'SELECT COUNT(*) as count FROM sync_logs',
      successfulSyncs: "SELECT COUNT(*) as count FROM sync_logs WHERE status = 'success'",
      failedSyncs: "SELECT COUNT(*) as count FROM sync_logs WHERE status = 'failed'",
      totalRecordsSynced: 'SELECT SUM(records_synced) as total FROM sync_logs WHERE status = \'success\'',
      lastSync: 'SELECT synced_at FROM sync_logs ORDER BY synced_at DESC LIMIT 1',
    };

    const results = await Promise.all([
      pool.query(queries.totalSyncs),
      pool.query(queries.successfulSyncs),
      pool.query(queries.failedSyncs),
      pool.query(queries.totalRecordsSynced),
      pool.query(queries.lastSync),
    ]);

    return {
      totalSyncs: parseInt(results[0].rows[0].count),
      successfulSyncs: parseInt(results[1].rows[0].count),
      failedSyncs: parseInt(results[2].rows[0].count),
      totalRecordsSynced: parseInt(results[3].rows[0].total) || 0,
      lastSyncTime: results[4].rows[0]?.synced_at || null,
    };
  } catch (error) {
    console.error('Error in getSyncStats:', error);
    throw error;
  }
}

module.exports = {
  createSyncLog,
  getSyncLogs,
  getLastSyncTime,
  getSyncStats,
};