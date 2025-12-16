import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskSearch from '../components/task/TaskSearch';

const KanbanPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    Priority: '',
  });

  const handleSearchChange = (searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  };

  const handlePriorityChange = (e) => {
    setFilters((prev) => ({ ...prev, Priority: e.target.value }));
  };

  const handleReset = () => {
    setFilters({ search: '', Priority: '' });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">📋 Kanban Board</h1>
          <Link
            to="/tasks"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            ← Về danh sách
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <TaskSearch
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Tìm theo tên task..."
              />
            </div>

            {/* Priority Filter */}
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Độ ưu tiên
              </label>
              <select
                value={filters.Priority}
                onChange={handlePriorityChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          💡 <strong>Hướng dẫn:</strong> Kéo thả card giữa các cột để thay đổi trạng thái task.
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard filters={filters} />
    </div>
  );
};

export default KanbanPage;