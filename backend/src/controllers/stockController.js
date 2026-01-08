/**
 * Stock Controller
 * Handles HTTP requests for stock operations (CRUD)
 */

const stockModel = require('../models/stockModel');
const { validateStockData, validatePagination, validateSortOrder } = require('../utils/validators');

/**
 * GET /api/stocks
 * Get all stocks with filters, sorting, pagination
 */
async function getAllStocks(req, res, next) {
  try {
    const {
      page,
      limit,
      symbol,
      sector,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
      search,
    } = req.query;

    const pagination = validatePagination(page, limit);
    const order = validateSortOrder(sortOrder);

    const options = {
      page: pagination.page,
      limit: pagination.limit,
      symbol,
      sector,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder: order,
      search,
    };

    const result = await stockModel.getAllStocks(options);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stocks/:id
 * Get stock by ID
 */
async function getStockById(req, res, next) {
  try {
    const { id } = req.params;
    const stock = await stockModel.getStockById(id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: 'Stock not found',
      });
    }

    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/stocks
 * Create new stock record
 */
async function createStock(req, res, next) {
  try {
    const stockData = req.body;

    // Validate data
    const validation = validateStockData(stockData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    const newStock = await stockModel.createStock(stockData);

    res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: newStock,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Stock record already exists for this symbol and date',
      });
    }
    next(error);
  }
}

/**
 * PUT /api/stocks/:id
 * Update stock record
 */
async function updateStock(req, res, next) {
  try {
    const { id } = req.params;
    const stockData = req.body;

    // Check if stock exists
    const existingStock = await stockModel.getStockById(id);
    if (!existingStock) {
      return res.status(404).json({
        success: false,
        error: 'Stock not found',
      });
    }

    // Validate data (partial validation for update)
    const {
      open_price,
      high_price,
      low_price,
      close_price,
      volume,
    } = stockData;

    if (high_price < low_price) {
      return res.status(400).json({
        success: false,
        error: 'high_price must be greater than or equal to low_price',
      });
    }

    const updatedStock = await stockModel.updateStock(id, stockData);

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedStock,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/stocks/:id
 * Delete stock record
 */
async function deleteStock(req, res, next) {
  try {
    const { id } = req.params;

    // Check if stock exists
    const existingStock = await stockModel.getStockById(id);
    if (!existingStock) {
      return res.status(404).json({
        success: false,
        error: 'Stock not found',
      });
    }

    await stockModel.deleteStock(id);

    res.json({
      success: true,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stocks/dashboard/stats
 * Get dashboard statistics
 */
async function getDashboardStats(req, res, next) {
  try {
    const stats = await stockModel.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stocks/dashboard/sector-distribution
 * Get sector distribution for Pie Chart
 */
async function getSectorDistribution(req, res, next) {
  try {
    const { dateFrom, dateTo } = req.query;

    const options = {};
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;

    const distribution = await stockModel.getSectorDistribution(options);

    res.json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/stocks/dashboard/price-timeline
 * Get price timeline for Column Chart
 */
async function getPriceTimeline(req, res, next) {
  try {
    const { dateFrom, dateTo, symbol } = req.query;

    const options = {};
    if (dateFrom) options.dateFrom = dateFrom;
    if (dateTo) options.dateTo = dateTo;
    if (symbol) options.symbol = symbol;

    const timeline = await stockModel.getPriceTimeline(options);

    res.json({
      success: true,
      data: timeline,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getDashboardStats,
  getSectorDistribution,
  getPriceTimeline,
};