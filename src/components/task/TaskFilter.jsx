// src/components/tasks/TaskFilter.jsx
import React, { useState } from 'react';
import { TASK_STATUS, PRIORITY } from '../../utils/constants';

const TaskFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    Status: '',
    Priority: '',
    deadline_from: '',
    deadline_to: ''
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
    console.log('Filters áp dụng:', activeFilters);
    onFilterChange(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      Status: '',
      Priority: '',
      deadline_from: '',
      deadline_to: ''
    });
    onFilterChange({});
  };

  return (
    <div className="bg-gray-50 p-4 rounded mb-4">
      <h3 className="font-bold mb-3">Bộ lọc</h3>
      
      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-sm mb-1">Trạng thái</label>
          <select 
            value={filters.Status}
            onChange={(e) => handleChange('Status', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Tất cả</option>
            {Object.values(TASK_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Ưu tiên</label>
          <select 
            value={filters.Priority}
            onChange={(e) => handleChange('Priority', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">Tất cả</option>
            {Object.values(PRIORITY).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Từ ngày</label>
          <input 
            type="date"
            value={filters.deadline_from}
            onChange={(e) => handleChange('deadline_from', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Đến ngày</label>
          <input 
            type="date"
            value={filters.deadline_to}
            onChange={(e) => handleChange('deadline_to', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button 
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Áp dụng
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;