import React, { useEffect } from 'react';
import { formatDateInput } from '../../utils/formatters';
import { DEFAULT_DATE_RANGE_DAYS } from '../../utils/constants';

const DateRangePicker = ({ dateRange, setDateRange }) => {
  // Set default date range on mount
  useEffect(() => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - DEFAULT_DATE_RANGE_DAYS);

    setDateRange({
      from: formatDateInput(pastDate),
      to: formatDateInput(today),
    });
  }, []);

  const handleFromChange = (e) => {
    setDateRange(prev => ({ ...prev, from: e.target.value }));
  };

  const handleToChange = (e) => {
    setDateRange(prev => ({ ...prev, to: e.target.value }));
  };

  const handleReset = () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - DEFAULT_DATE_RANGE_DAYS);

    setDateRange({
      from: formatDateInput(pastDate),
      to: formatDateInput(today),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Date Range:
          </label>
          
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={handleFromChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={handleToChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Reset to Last 30 Days
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;