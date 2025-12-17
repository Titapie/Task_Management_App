// src/components/tasks/TaskFilter.jsx
import React, { useState } from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS, PRIORITY, PRIORITY_LABELS } from '../../utils/constants';

const TaskFilter = ({ onFilterChange, showStatusFilter = true, showProjectFilter = false }) => {
  const [filters, setFilters] = useState({
    Status: '',
    Priority: '',
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key]) activeFilters[key] = filters[key];
    });
    onFilterChange(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      Status: '',
      Priority: '',
    });
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Status Filter */}
        {showStatusFilter && (
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select 
              value={filters.Status}
              onChange={(e) => handleChange('Status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả</option>
              {Object.entries(TASK_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {TASK_STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Priority Filter */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Độ ưu tiên
          </label>
          <select 
            value={filters.Priority}
            onChange={(e) => handleChange('Priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            {Object.entries(PRIORITY).map(([key, value]) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handleApply}
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
  );
};

export default TaskFilter;