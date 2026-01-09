import React, { useState, useEffect } from 'react';
import { getStocks } from '../../services/api';
import { formatCurrency, formatPercent, getChangeColor, getChangeArrow } from '../../utils/formatters';

const StockTicker = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                // Get latest stocks (group by symbol, get most recent)
                const response = await getStocks({
                    sortBy: 'updated_at',
                    sortOrder: 'desc',
                    limit: 100,
                });
            
                // Get unique stocks (latest for each symbol)
                const uniqueStocks = [];
                const seenSymbols = new Set();
            
                for (const stock of response.data) {
                    if (!seenSymbols.has(stock.symbol)) {
                        uniqueStocks.push(stock);
                        seenSymbols.add(stock.symbol);
                    }
                }
                
                setStocks(uniqueStocks);
            } catch (error) {
                console.error('Error fetching ticker data:', error);
            }
        };
        
        fetchStocks();
        
        // Refresh every 60 seconds
        const interval = setInterval(fetchStocks, 60000);
        return () => clearInterval(interval);
    }, []);

    if (stocks.length === 0) {
        return (
            <div className="bg-gray-900 text-white py-3 overflow-hidden">
                <div className="text-center text-sm text-gray-400">
                    Loading stock data...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white py-3 overflow-hidden relative">
            <div className="ticker-wrapper">
                <div className="ticker-content">
                    {/* Duplicate array for seamless loop */}
                    {[...stocks, ...stocks].map((stock, index) => (
                        <div
                            key={`${stock.symbol}-${index}`}
                            className="inline-flex items-center mx-6 whitespace-nowrap"
                        >
                            {/* Symbol */}
                            <span className="font-bold text-lg mr-2">
                                {stock.symbol}
                            </span>

                            {/* Price */}
                            <span className="text-base mr-2">
                                {formatCurrency(stock.close_price)}
                            </span>

                            {/* Change */}
                            <span className={`text-sm font-semibold flex items-center ${
                                stock.change_percent > 0 ? 'text-green-400' : 
                                stock.change_percent < 0 ? 'text-red-400' : 
                                'text-gray-400'
                            }`}>
                                <span className="mr-1">
                                    {getChangeArrow(stock.change_percent)}
                                </span>
                                {formatPercent(stock.change_percent)}
                            </span>
                            
                            {/* Separator */}
                            <span className="mx-4 text-gray-600">|</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Add CSS animation via inline style for simplicity */}
            <style>{`
                .ticker-wrapper {
                    width: 100%;
                    overflow: hidden;
                }

                .ticker-content {
                    display: inline-flex;
                    animation: scroll 30s linear infinite;
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .ticker-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default StockTicker;