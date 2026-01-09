import React, { useState } from 'react';
import { deleteStock } from '../../services/api';

const DeleteConfirmModal = ({ isOpen, onClose, onSuccess, stock }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await deleteStock(stock.id);
            onSuccess('Stock deleted successfully!');
            onClose();
        } catch (err) {
            console.error('Error deleting stock:', err);
            setError(err.response?.data?.error || 'Failed to delete stock. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !stock) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Delete Stock
                            </h3>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to delete this stock record?
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Symbol:</div>
                            <div className="font-semibold text-gray-900">{stock.symbol}</div>

                            <div className="text-gray-600">Company:</div>
                            <div className="font-semibold text-gray-900">{stock.company_name}</div>

                            <div className="text-gray-600">Date:</div>
                            <div className="font-semibold text-gray-900">{stock.date}</div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </div>
                
                {/* Actions */}
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            isDeleting
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;