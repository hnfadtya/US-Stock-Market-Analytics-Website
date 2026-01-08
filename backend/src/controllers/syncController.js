/**
 * Sync Controller
 * Handles sync operations and sync history
 */

const stockService = require('../services/stockService');
const syncLogModel = require('../models/syncLogModel');
const { validatePagination } = require('../utils/validators');

/**
 * POST /api/sync
 * Trigger manual sync
 */
async function triggerSync(req, res, next) {
  try {
    console.log('📡 Manual sync triggered by user');

    // Check if initial sync is needed
    const needsInitial = await stockService.needsInitialSync();

    if (needsInitial) {
      console.log('🚀 Database is empty, running initial sync...');
      const result = await stockService.initialSync();
      return res.json(result);
    }

    // Regular sync
    const result = await stockService.syncStocks();
    res.json(result);

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Sync failed',
      message: error.message,
    });
  }
}

/**
 * GET /api/sync/logs
 * Get sync history with pagination
 */
async function getSyncLogs(req, res, next) {
  try {
    const { page, limit } = req.query;
    const pagination = validatePagination(page, limit);

    const result = await syncLogModel.getSyncLogs({
      page: pagination.page,
      limit: pagination.limit,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sync/last
 * Get last sync time
 */
async function getLastSyncTime(req, res, next) {
  try {
    const lastSyncTime = await syncLogModel.getLastSyncTime();

    res.json({
      success: true,
      lastSyncTime,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/sync/stats
 * Get sync statistics
 */
async function getSyncStats(req, res, next) {
  try {
    const stats = await syncLogModel.getSyncStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/sync/initial
 * Manually trigger initial sync (for testing)
 */
async function triggerInitialSync(req, res, next) {
  try {
    console.log('🚀 Manual initial sync triggered');
    const result = await stockService.initialSync();
    res.json(result);
  } catch (error) {
    console.error('Initial sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Initial sync failed',
      message: error.message,
    });
  }
}

module.exports = {
  triggerSync,
  getSyncLogs,
  getLastSyncTime,
  getSyncStats,
  triggerInitialSync,
};