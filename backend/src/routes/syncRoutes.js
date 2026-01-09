/**
 * Sync Routes
 * Define API endpoints for sync operations
 */

const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');

// Sync operations
router.get('/', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed. Use POST to trigger sync.' });
});
router.post('/', syncController.triggerSync);
router.post('/initial', syncController.triggerInitialSync);

// Sync history
router.get('/logs', syncController.getSyncLogs);
router.get('/last', syncController.getLastSyncTime);
router.get('/stats', syncController.getSyncStats);

module.exports = router;