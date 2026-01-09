import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getPriceTimeline } from '../../services/api';
import { formatCurrency, formatDate, formatVolume } from '../../utils/formatters';
import Loader from '../common/Loader';

const ColumnChart = ({ dateRange, refreshKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (dateRange.from) params.dateFrom = dateRange.from;
        if (dateRange.to) params.dateTo = dateRange.to;

        const response = await getPriceTimeline(params);
        
        // Transform data for Recharts
        const chartData = response.data.map(item => ({
          date: formatDate(item.date),
          avgPrice: parseFloat(item.avg_close),
          volume: parseInt(item.total_volume),
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching price timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96">
        <Loader text="Loading price timeline..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900 mb-1">
            {payload[0].payload.date}
          </p>
          <p className="text-sm text-blue-600">
            Avg Price: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-green-600">
            Volume: {formatVolume(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Price Timeline
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            label={{ value: 'Avg Price ($)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="avgPrice" 
            fill="#3B82F6" 
            name="Average Price"
          />
          <Bar 
            yAxisId="right"
            dataKey="volume" 
            fill="#10B981" 
            name="Total Volume"
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {data.length} trading days
      </div>
    </div>
  );
};

export default ColumnChart;