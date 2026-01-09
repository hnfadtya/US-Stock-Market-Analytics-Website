import React from 'react';
import { Link } from 'react-router-dom';
import StockTicker from '../components/common/StockTicker';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Stock Ticker */}
            <StockTicker />

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Icon/Logo */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full text-white">
                            <svg 
                                className="w-12 h-12" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Stock Market Dashboard
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 mb-12">
                        Track and analyze stock market data with comprehensive insights and real-time updates
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            View Dashboard
                        </Link>

                        <Link
                            to="/manage"
                            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600"
                        >
                            Manage Data
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;