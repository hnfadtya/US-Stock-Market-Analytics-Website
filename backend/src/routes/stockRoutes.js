/**
 * Stock Routes
 * Define API endpoints for stock operations
 */

const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// Stock CRUD operations
router.get('/', stockController.getAllStocks);
router.get('/:id', stockController.getStockById);
router.post('/', stockController.createStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);

// Dashboard endpoints
router.get('/dashboard/stats', stockController.getDashboardStats);
router.get('/dashboard/sector-distribution', stockController.getSectorDistribution);
router.get('/dashboard/price-timeline', stockController.getPriceTimeline);

module.exports = router;