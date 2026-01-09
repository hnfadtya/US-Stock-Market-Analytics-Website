const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PORT } = require('./config/constants');
const errorHandler = require('./middleware/errorHandler');

// Routes
const stockRoutes = require('./routes/stockRoutes');
const syncRoutes = require('./routes/syncRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'stock-dashboard-backend' 
    });
});

// API Routes
app.use('/api/stocks', stockRoutes);
app.use('/api/sync', syncRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Timezone: ${process.env.TZ || 'UTC'}`);
});

module.exports = app;