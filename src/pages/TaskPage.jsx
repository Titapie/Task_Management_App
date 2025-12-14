import React, { useState } from 'react';
import useTasks from '../hooks/useTasks';
import TaskList from '../components/task/TaskList';

const TasksPage = () => {
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const { tasks, loading, error, pagination, refetch } = useTasks(params);

  const handlePageChange = (newPage) => {
    const newParams = { ...params, page: newPage };
    setParams(newParams);
    refetch(newParams);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý Tasks</h1>
        <p className="text-gray-600 mt-2">Danh sách tất cả các task</p>
      </div>

      <TaskList 
        tasks={tasks} 
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TasksPage;