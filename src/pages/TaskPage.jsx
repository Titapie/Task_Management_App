// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/task/TaskList';
import TaskFilter from '../components/task/TaskFilter';
import TaskDeadlineFilter from '../components/task/TaskDeadlineFilter';
import TaskSearch from '../components/task/TaskSearch';
import ExportButton from '../components/common/ExportButton';

const TasksPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { tasks, loading, error, pagination, refetch } = useTasks(params);

  const handlePageChange = (newPage) => {
    const newParams = { ...params, page: newPage };
    setParams(newParams);
    refetch(newParams);
  };

  const handleFilterChange = (filters) => {
    const newParams = { ...params, ...filters, page: 1 };
    setParams(newParams);
    refetch(newParams);
  };

  const handleDeadlineFilterChange = (deadlineFilters) => {
    const newParams = { ...params, ...deadlineFilters, page: 1 };
    setParams(newParams);
    refetch(newParams);
  };

  const handleSearch = (searchTerm) => {
    const newParams = { ...params, search: searchTerm, page: 1 };
    setParams(newParams);
    refetch(newParams);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Tasks</h1>
          <p className="text-gray-600 mt-2">Danh sách tất cả các task</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/tasks/create')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Tạo Task Mới
          </button>
          <ExportButton filters={params} />
        </div>
      </div>

      <TaskSearch onSearch={handleSearch} />
      <TaskFilter onFilterChange={handleFilterChange} showStatusFilter={true} />
      <TaskDeadlineFilter onFilterChange={handleDeadlineFilterChange} />

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Lỗi: {error}
        </div>
      ) : (
        <TaskList 
          tasks={tasks} 
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TasksPage;