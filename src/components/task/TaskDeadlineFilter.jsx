// src/components/tasks/TaskDeadlineFilter.jsx
import React, { useState } from 'react';

const TaskDeadlineFilter = ({ onFilterChange }) => {
  const [deadlineRange, setDeadlineRange] = useState({
    deadline_from: '',
    deadline_to: ''
  });

  // Quick filter presets
  const getQuickFilterDates = (type) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    switch (type) {
      case 'today':
        return {
          deadline_from: formatDate(today),
          deadline_to: formatDate(today)
        };
      case '3days':
        const threeDays = new Date(today);
        threeDays.setDate(today.getDate() + 3);
        return {
          deadline_from: formatDate(today),
          deadline_to: formatDate(threeDays)
        };
      case 'week':
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        return {
          deadline_from: formatDate(today),
          deadline_to: formatDate(endOfWeek)
        };
      default:
        return { deadline_from: '', deadline_to: '' };
    }
  };

  const handleQuickFilter = (type) => {
    const dates = getQuickFilterDates(type);
    setDeadlineRange(dates);
    onFilterChange(dates);
  };

  const handleDateChange = (field, value) => {
    const newRange = { ...deadlineRange, [field]: value };
    setDeadlineRange(newRange);
  };

  const handleApplyCustom = () => {
    const activeFilters = {};
    if (deadlineRange.deadline_from) activeFilters.deadline_from = deadlineRange.deadline_from;
    if (deadlineRange.deadline_to) activeFilters.deadline_to = deadlineRange.deadline_to;
    onFilterChange(activeFilters);
  };

  const handleReset = () => {
    setDeadlineRange({ deadline_from: '', deadline_to: '' });
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Quick Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ⚡ Lọc nhanh
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickFilter('today')}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
          >
            📅 Hôm nay
          </button>
          <button
            onClick={() => handleQuickFilter('3days')}
            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition text-sm"
          >
            ⏰ 3 ngày tới
          </button>
          <button
            onClick={() => handleQuickFilter('week')}
            className="px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-sm"
          >
            📆 Tuần này
          </button>
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🗓️ Khoảng thời gian tùy chỉnh
        </label>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-[200px]">
            <label className="block text-xs text-gray-600 mb-1">Từ ngày</label>
            <input 
              type="date"
              value={deadlineRange.deadline_from}
              onChange={(e) => handleDateChange('deadline_from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="min-w-[200px]">
            <label className="block text-xs text-gray-600 mb-1">Đến ngày</label>
            <input 
              type="date"
              value={deadlineRange.deadline_to}
              onChange={(e) => handleDateChange('deadline_to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleApplyCustom}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Áp dụng
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDeadlineFilter;