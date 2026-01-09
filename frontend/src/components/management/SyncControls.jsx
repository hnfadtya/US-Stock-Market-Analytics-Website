import React, { useState, useEffect } from 'react';
import { triggerSync, getLastSyncTime } from '../../services/api';
import { formatRelativeTime } from '../../utils/formatters';
import { SYNC_INTERVALS, DEFAULT_SYNC_INTERVAL, SUCCESS_DISPLAY_DURATION } from '../../utils/constants';

const SyncControls = ({ onSyncComplete }) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [autoSync, setAutoSync] = useState(false);
    const [syncInterval, setSyncInterval] = useState(DEFAULT_SYNC_INTERVAL);
    const [lastSyncTime, setLastSyncTime] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Fetch last sync time on mount
    useEffect(() => {
        fetchLastSync();
    }, []);

    // Auto-sync logic
    useEffect(() => {
        if (!autoSync) {
            setCountdown(0);
            return;
        }

        // Set initial countdown
        setCountdown(syncInterval * 60);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    // Trigger sync
                    handleSync();
                    return syncInterval * 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [autoSync, syncInterval]);

    const fetchLastSync = async () => {
        try {
            const response = await getLastSyncTime();
            setLastSyncTime(response.lastSyncTime);
        } catch (err) {
            console.error('Error fetching last sync time:', err);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setError(null);

        try {
            const response = await triggerSync();
            
            if (response.success) {
                // Update last sync time
                setLastSyncTime(new Date());

                // Show success checkmark
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), SUCCESS_DISPLAY_DURATION);

                // Callback to refresh table
                if (onSyncComplete) {
                    onSyncComplete();
                }
            } else {
                throw new Error(response.message || 'Sync failed');
            }
        } catch (err) {
            console.error('Sync error:', err);
            setError(err.message || 'Sync failed. Please try again.');

            // Auto-pause on error
            if (autoSync) {
                setAutoSync(false);
            }
        } finally {
            setIsSyncing(false);
        }
    };

    const formatCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sync Controls
            </h3>

            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Left: Manual Sync Button */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing || autoSync}
                        className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors ${
                            isSyncing || autoSync
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isSyncing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Syncing...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Sync Now</span>
                            </>
                        )}
                    </button>
                    
                    {/* Success Checkmark */}
                    {showSuccess && (
                        <div className="flex items-center space-x-2 text-green-600 animate-fadeIn">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-semibold">Synced!</span>
                        </div>
                    )}

                    {/* Last Sync Time */}
                    {!showSuccess && lastSyncTime && (
                        <div className="text-sm text-gray-600">
                            Last sync: <span className="font-semibold">{formatRelativeTime(lastSyncTime)}</span>
                        </div>
                    )}
                </div>
                
                {/* Right: Auto-sync Controls */}
                <div className="flex items-center space-x-4">
                    {/* Auto-sync Switch */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                            Auto-sync:
                        </span>
                        <button
                            onClick={() => setAutoSync(!autoSync)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                autoSync ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                    autoSync ? 'transform translate-x-6' : ''
                                }`}
                            />
                        </button>
                    </div>
                        
                    {/* Interval Dropdown */}
                    {autoSync && (
                        <>
                            <select
                                value={syncInterval}
                                onChange={(e) => setSyncInterval(parseInt(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                {SYNC_INTERVALS.map(interval => (
                                    <option key={interval.value} value={interval.value}>
                                        {interval.label}
                                    </option>
                                ))}
                            </select>
                            
                            {/* Countdown Timer */}
                            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-mono text-sm font-semibold text-blue-600">
                                    {formatCountdown(countdown)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm font-semibold text-red-800">Sync Error</p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SyncControls;