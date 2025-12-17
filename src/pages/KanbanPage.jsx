import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskSearch from '../components/task/TaskSearch';
import TaskFilter from '../components/task/TaskFilter';
import TaskDeadlineFilter from '../components/task/TaskDeadlineFilter';

const KanbanPage = () => {
  const [filters, setFilters] = useState({});

  // Helper: Xóa keys có giá trị rỗng
  const cleanFilters = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  };

  const handleFilterChange = (newFilters) => {
    // Chỉ giữ lại filters mới, không merge với filters cũ
    const cleaned = cleanFilters(newFilters);
    setFilters(cleaned);
  };

  const handleResetAll = () => {
    setFilters({});
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">📋 Kanban Board</h1>
          <Link
            to="/tasks"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            ← Về danh sách
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <TaskSearch
            onSearch={(search) => handleFilterChange({ ...filters, search })}
            placeholder="Tìm theo tên task..."
          />
        </div>

        {/* Task Filter - Hide Status (vì đã có columns) */}
        <TaskFilter 
          onFilterChange={(newFilters) => handleFilterChange({ ...filters, ...newFilters })}
          showStatusFilter={false}
        />

        {/* Deadline Filter */}
        <TaskDeadlineFilter 
          onFilterChange={(newFilters) => handleFilterChange({ ...filters, ...newFilters })}
        />

        {/* Reset All */}
        <div className="mb-4">
          <button
            onClick={handleResetAll}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            🔄 Reset tất cả bộ lọc
          </button>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          💡 <strong>Hướng dẫn:</strong> Kéo thả card giữa các cột để thay đổi trạng thái task.
        </div>
      </div>

      {/* Kanban Board - FULL WIDTH */}
      <div className="w-full">
        <KanbanBoard filters={filters} />
      </div>
    </div>
  );
};

export default KanbanPage;