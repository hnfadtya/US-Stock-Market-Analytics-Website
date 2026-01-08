import React, { useState, useEffect } from 'react';
import StatsCards from '../components/dashboard/StatsCards';
import DateRangePicker from '../components/dashboard/DateRangePicker';
import PieChart from '../components/dashboard/PieChart';
import ColumnChart from '../components/dashboard/ColumnChart';
import { DASHBOARD_REFRESH_INTERVAL } from '../utils/constants';

const Dashboard = () => {
    const [dateRange, setDateRange] = useState({
        from: '',
        to: '',
    });

    const [refreshKey, setRefreshKey] = useState(0);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, DASHBOARD_REFRESH_INTERVAL);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Dashboard Analytics
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive stock market insights and visualizations
                    </p>
                </div>

                {/* Date Range Picker */}
                <DateRangePicker 
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />

                {/* Stats Cards */}
                <StatsCards 
                    dateRange={dateRange}
                    refreshKey={refreshKey}
                />

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <PieChart 
                        dateRange={dateRange}
                        refreshKey={refreshKey}
                    />
                    <ColumnChart 
                        dateRange={dateRange}
                        refreshKey={refreshKey}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;