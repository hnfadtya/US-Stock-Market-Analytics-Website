import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/api';
import { formatNumber, formatDate } from '../../utils/formatters';
import Loader from '../common/Loader';

const StatsCards = ({ dateRange, refreshKey }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dateRange, refreshKey]);

  if (loading) {
    return <Loader text="Loading statistics..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        No statistics available
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Stocks',
      value: formatNumber(stats.totalStocks),
      icon: '📈',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Records',
      value: formatNumber(stats.totalRecords),
      icon: '📊',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Sectors',
      value: formatNumber(stats.totalSectors),
      icon: '🏢',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Latest Date',
      value: formatDate(stats.latestDate),
      icon: '📅',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;