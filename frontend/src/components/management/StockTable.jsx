import React, { useState, useEffect } from 'react';
import { getStocks } from '../../services/api';
import { formatCurrency, formatVolume, formatPercent, formatDate, getChangeColor } from '../../utils/formatters';
import { SECTORS, DEFAULT_PAGE_SIZE, PAGE_SIZES } from '../../utils/constants';
import Loader from '../common/Loader';
import StockModal from './StockModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Toast from '../common/Toast';

const StockTable = ({ refreshKey }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    
    // Filters
    const [search, setSearch] = useState('');
    const [sector, setSector] = useState('All');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('desc');

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    // Toast
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchStocks();
    }, [page, limit, search, sector, sortBy, sortOrder, refreshKey]);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            
            const params = {
                page,
                limit,
                sortBy,
                sortOrder,
            };

            if (search) params.search = search;
            if (sector !== 'All') params.sector = sector;

            const response = await getStocks(params);
            setStocks(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            showToast('Failed to load stocks', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const handleEdit = (stock) => {
        setSelectedStock(stock);
        setIsEditModalOpen(true);
    };

    const handleDelete = (stock) => {
        setSelectedStock(stock);
        setIsDeleteModalOpen(true);
    };

    const handleModalSuccess = (message) => {
        showToast(message, 'success');
        fetchStocks();
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }

        return sortOrder === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header with Search & Filters */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Stock Records
                        </h3>

                        {/* Add Stock Button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Add Stock</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by symbol or company name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg 
                                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Sector Filter */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">
                                Sector:
                            </label>
                            <select
                                value={sector}
                                onChange={(e) => setSector(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {SECTORS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Page Size */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">
                                Show:
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(parseInt(e.target.value));
                                    setPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {PAGE_SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <Loader text="Loading stocks..." />
                ) : stocks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No stocks found
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th 
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('symbol')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Symbol</span>
                                                {getSortIcon('symbol')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Sector
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('close_price')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Price</span>
                                                {getSortIcon('close_price')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('change_percent')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Change</span>
                                                {getSortIcon('change_percent')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('volume')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Volume</span>
                                                {getSortIcon('volume')}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('date')}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>Date</span>
                                                {getSortIcon('date')}
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stocks.map((stock) => (
                                        <tr key={stock.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-semibold text-gray-900">
                                                    {stock.symbol}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-gray-900">
                                                    {stock.company_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {stock.sector}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="font-semibold text-gray-900">
                                                    {formatCurrency(stock.close_price)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`font-semibold ${getChangeColor(stock.change_percent)}`}>
                                                    {formatPercent(stock.change_percent)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {formatVolume(stock.volume)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(stock.date)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => handleEdit(stock)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(stock)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                            
                        {/* Pagination */}
                        {pagination && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {stocks.length} of {pagination.totalRecords} stocks
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={!pagination.hasPrev}
                                        className={`px-3 py-1 rounded ${
                                            pagination.hasPrev
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    <span className="text-sm text-gray-600">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>
                                    
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={!pagination.hasNext}
                                        className={`px-3 py-1 rounded ${
                                            pagination.hasNext
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* Modals */}
            <StockModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleModalSuccess}
            />

            <StockModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedStock(null);
                }}
                onSuccess={handleModalSuccess}
                stock={selectedStock}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedStock(null);
                }}
                onSuccess={handleModalSuccess}
                stock={selectedStock}
            />

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default StockTable;