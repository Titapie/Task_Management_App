// src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
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

  // Chỉ fetch 1 lần khi mount
  useEffect(() => {
    refetch(params);
  }, []);

  const handlePageChange = (newPage) => {
    const newParams = { ...params, page: newPage };
    setParams(newParams);
    refetch(newParams);
  };

  // Helper: Xóa keys có giá trị rỗng
  const cleanParams = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  };

  // CHUNG cho tất cả filters (search, status, priority, deadline)
  const handleFilterChange = (filters) => {
    // Giữ lại chỉ page và limit, loại bỏ tất cả filter cũ
    const newParams = { 
      page: 1,
      limit: params.limit,
      ...filters  // Thêm filters mới vào
    };
    
    // Clean các giá trị rỗng
    const cleaned = cleanParams(newParams);
    
    setParams(cleaned);
    refetch(cleaned);
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

      <TaskSearch onSearch={(search) => handleFilterChange({ search })} />
      <TaskFilter onFilterChange={handleFilterChange} showStatusFilter={true} />
      <TaskDeadlineFilter onFilterChange={handleFilterChange} />

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