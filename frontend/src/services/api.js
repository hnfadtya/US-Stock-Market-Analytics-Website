/**
 * API Service
 * Handles all HTTP requests to backend
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 120000, // 2 minutes for sync operations
});

// ================== STOCK ENDPOINTS ==================

// Get all stocks with filters and pagination
export const getStocks = async (params = {}) => {
    const response = await api.get('/stocks', { params });
    return response.data;
};

// Get stock by ID
export const getStockById = async (id) => {
    const response = await api.get(`/stocks/${id}`);
    return response.data;
};

// Create new stock
export const createStock = async (stockData) => {
    const response = await api.post('/stocks', stockData);
    return response.data;
};

// Update stock
export const updateStock = async (id, stockData) => {
    const response = await api.put(`/stocks/${id}`, stockData);
    return response.data;
};

// Delete stock
export const deleteStock = async (id) => {
    const response = await api.delete(`/stocks/${id}`);
    return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
    const response = await api.get('/stocks/dashboard/stats');
    return response.data;
};

// Get sector distribution (for Pie Chart)
export const getSectorDistribution = async (params = {}) => {
    const response = await api.get('/stocks/dashboard/sector-distribution', { params });
    return response.data;
};

// Get price timeline (for Column Chart)
export const getPriceTimeline = async (params = {}) => {
    const response = await api.get('/stocks/dashboard/price-timeline', { params });
    return response.data;
};

// ================== SYNC ENDPOINTS ==================

// Trigger sync (manual or auto)
export const triggerSync = async () => {
    const response = await api.post('/sync');
    return response.data;
};

// Get sync logs
export const getSyncLogs = async (params = {}) => {
    const response = await api.get('/sync/logs', { params });
    return response.data;
};

// Get last sync time
export const getLastSyncTime = async () => {
    const response = await api.get('/sync/last');
    return response.data;
};

// Get sync statistics
export const getSyncStats = async () => {
    const response = await api.get('/sync/stats');
    return response.data;
};

export default api;