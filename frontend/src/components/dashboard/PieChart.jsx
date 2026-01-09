import React, { useState, useEffect } from 'react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getSectorDistribution } from '../../services/api';
import Loader from '../common/Loader';

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // orange
  '#EF4444', // red
  '#6366F1', // indigo
  '#EC4899', // pink
  '#14B8A6', // teal
];

const PieChart = ({ dateRange, refreshKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (dateRange.from) params.dateFrom = dateRange.from;
        if (dateRange.to) params.dateTo = dateRange.to;

        const response = await getSectorDistribution(params);
        
        // Transform data for Recharts
        const chartData = response.data.map(item => ({
          name: item.sector,
          value: parseInt(item.stock_count),
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching sector distribution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96">
        <Loader text="Loading sector distribution..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <p className="text-gray-500">No sector data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sector Distribution
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPie>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Total: {data.reduce((sum, item) => sum + item.value, 0)} stocks across {data.length} sectors
      </div>
    </div>
  );
};

export default PieChart;