import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getLastSyncTime } from '../../services/api';
import { formatRelativeTime } from '../../utils/formatters';

const Navbar = () => {
    const location = useLocation();
    const [lastSyncTime, setLastSyncTime] = useState(null);

    // Fetch last sync time
    useEffect(() => {
        const fetchLastSync = async () => {
            try {
                const response = await getLastSyncTime();
                setLastSyncTime(response.lastSyncTime);
            } catch (error) {
                console.error('Error fetching last sync time:', error);
            }
        };

        fetchLastSync();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchLastSync, 30000);
        return () => clearInterval(interval);
    }, []);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navLinkClass = (path) => {
        const baseClass = "px-4 py-2 rounded-md font-medium transition-colors";
        if (isActive(path)) {
            return `${baseClass} bg-blue-600 text-white`;
        }
        return `${baseClass} text-gray-700 hover:bg-blue-50 hover:text-blue-600`;
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl">📊</span>
                        <span className="text-xl font-bold text-gray-900">
                            Stock Dashboard
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        <Link to="/" className={navLinkClass('/')}>
                            Home
                        </Link>
                        <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                            Dashboard
                        </Link>
                        <Link to="/manage" className={navLinkClass('/manage')}>
                            Data Management
                        </Link>
                    </div>

                    {/* Last Sync Badge */}
                    <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                        <svg 
                            className="w-5 h-5 text-blue-600" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                        </svg>
                        <div className="text-sm">
                            <span className="text-gray-600">Last Sync:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                                {formatRelativeTime(lastSyncTime)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;