import React, { useState } from 'react';
import SyncControls from '../components/management/SyncControls';
import StockTable from '../components/management/StockTable';

const Management = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    // Callback when sync completes
    const handleSyncComplete = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Data Management
                    </h1>
                    <p className="text-gray-600">
                        Manage stock data, perform sync operations, and CRUD actions
                    </p>
                </div>
                
                {/* Sync Controls */}
                <SyncControls onSyncComplete={handleSyncComplete} />
                
                {/* Stock Table */}
                <StockTable refreshKey={refreshKey} />
            </div>
        </div>
    );
};

export default Management;