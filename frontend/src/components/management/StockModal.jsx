import React, { useState, useEffect } from 'react';
import { createStock, updateStock } from '../../services/api';
import { formatDateInput } from '../../utils/formatters';

const StockModal = ({ isOpen, onClose, onSuccess, stock = null }) => {
    const isEditMode = !!stock;

    const [formData, setFormData] = useState({
        symbol: '',
        company_name: '',
        sector: '',
        industry: '',
        open_price: '',
        high_price: '',
        low_price: '',
        close_price: '',
        volume: '',
        change: '',
        change_percent: '',
        date: formatDateInput(new Date()),
        is_final: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && stock) {
            setFormData({
                symbol: stock.symbol || '',
                company_name: stock.company_name || '',
                sector: stock.sector || '',
                industry: stock.industry || '',
                open_price: stock.open_price || '',
                high_price: stock.high_price || '',
                low_price: stock.low_price || '',
                close_price: stock.close_price || '',
                volume: stock.volume || '',
                change: stock.change || '',
                change_percent: stock.change_percent || '',
                date: stock.date || formatDateInput(new Date()),
                is_final: stock.is_final || false,
            });
        }
    }, [isEditMode, stock]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.symbol || formData.symbol.trim() === '') {
            newErrors.symbol = 'Symbol is required';
        } else if (!/^[A-Z]{1,5}$/.test(formData.symbol)) {
            newErrors.symbol = 'Symbol must be 1-5 uppercase letters';
        }

        if (!formData.company_name || formData.company_name.trim() === '') {
            newErrors.company_name = 'Company name is required';
        }

        if (!formData.sector || formData.sector.trim() === '') {
            newErrors.sector = 'Sector is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        const priceFields = ['open_price', 'high_price', 'low_price', 'close_price'];
        priceFields.forEach(field => {
            const value = parseFloat(formData[field]);
            if (!formData[field] || isNaN(value) || value <= 0) {
                newErrors[field] = 'Must be a positive number';
            }
        });

        const volume = parseInt(formData.volume);
        if (!formData.volume || isNaN(volume) || volume < 0) {
            newErrors.volume = 'Must be a non-negative integer';
        }

        if (parseFloat(formData.high_price) < parseFloat(formData.low_price)) {
            newErrors.high_price = 'High price must be >= low price';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
          // Convert strings to numbers
            const submitData = {
                ...formData,
                open_price: parseFloat(formData.open_price),
                high_price: parseFloat(formData.high_price),
                low_price: parseFloat(formData.low_price),
                close_price: parseFloat(formData.close_price),
                volume: parseInt(formData.volume),
                change: parseFloat(formData.change || 0),
                change_percent: parseFloat(formData.change_percent || 0),
            };

            if (isEditMode) {
                await updateStock(stock.id, submitData);
                onSuccess('Stock updated successfully!');
            } else {
                await createStock(submitData);
                onSuccess('Stock created successfully!');
            }

            onClose();
        } catch (error) {
            console.error('Error saving stock:', error);
            if (error.response?.data?.errors) {
                setErrors({ submit: error.response.data.errors.join(', ') });
            } else if (error.response?.data?.error) {
                setErrors({ submit: error.response.data.error });
            } else {
                setErrors({ submit: 'Failed to save stock. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Stock' : 'Add New Stock'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Symbol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Symbol *
                            </label>
                            <input
                                type="text"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                disabled={isEditMode}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.symbol ? 'border-red-500' : 'border-gray-300'
                                } ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="AAPL"
                            />
                            {errors.symbol && (
                                <p className="text-red-500 text-xs mt-1">{errors.symbol}</p>
                            )}
                        </div>
                        
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Apple Inc."
                            />
                            {errors.company_name && (
                                <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
                            )}
                        </div>
                        
                        {/* Sector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sector *
                            </label>
                            <input
                                type="text"
                                name="sector"
                                value={formData.sector}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.sector ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Technology"
                            />
                            {errors.sector && (
                                <p className="text-red-500 text-xs mt-1">{errors.sector}</p>
                            )}
                        </div>
                        
                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Industry
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Consumer Electronics"
                            />
                        </div>
                        
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                disabled={isEditMode}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.date ? 'border-red-500' : 'border-gray-300'
                                } ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                            )}
                        </div>
                        
                        {/* Open Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Open Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="open_price"
                                value={formData.open_price}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.open_price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="150.00"
                            />
                            {errors.open_price && (
                                <p className="text-red-500 text-xs mt-1">{errors.open_price}</p>
                            )}
                        </div>
                        
                        {/* High Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              High Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="high_price"
                                value={formData.high_price}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.high_price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="155.00"
                            />
                            {errors.high_price && (
                                <p className="text-red-500 text-xs mt-1">{errors.high_price}</p>
                            )}
                        </div>
                        
                        {/* Low Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Low Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="low_price"
                                value={formData.low_price}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.low_price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="148.00"
                            />
                            {errors.low_price && (
                                <p className="text-red-500 text-xs mt-1">{errors.low_price}</p>
                            )}
                        </div>
                        
                        {/* Close Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Close Price *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="close_price"
                                value={formData.close_price}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.close_price ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="152.50"
                            />
                            {errors.close_price && (
                                <p className="text-red-500 text-xs mt-1">{errors.close_price}</p>
                            )}
                        </div>
                        
                        {/* Volume */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Volume *
                            </label>
                            <input
                                type="number"
                                name="volume"
                                value={formData.volume}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.volume ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="50000000"
                            />
                            {errors.volume && (
                                <p className="text-red-500 text-xs mt-1">{errors.volume}</p>
                            )}
                        </div>
                        
                        {/* Change */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Change
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="change"
                                value={formData.change}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="2.50"
                            />
                        </div>
                        
                        {/* Change Percent */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Change %
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="change_percent"
                                value={formData.change_percent}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="1.67"
                            />
                        </div>
                        
                        {/* Is Final */}
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_final"
                                    checked={formData.is_final}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Mark as final (end-of-day data)
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                isSubmitting
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Stock' : 'Create Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};  

export default StockModal;