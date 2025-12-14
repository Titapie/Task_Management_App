// src/components/tasks/TaskList.jsx
import React from 'react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskList = ({ tasks, loading, pagination, onPageChange }) => {
  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
  }

  if (!tasks || tasks.length === 0) {
    return <div className="p-4 text-center text-gray-500">Không có task nào</div>;
  }

  const isNearDeadline = (deadline) => {
    if (!deadline) return false;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-left">Tên Task</th>
              <th className="px-4 py-2 border text-left">Mô tả</th>
              <th className="px-4 py-2 border text-left">Trạng thái</th>
              <th className="px-4 py-2 border text-left">Ưu tiên</th>
              <th className="px-4 py-2 border text-left">Dự án</th>
              <th className="px-4 py-2 border text-left">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{task.TaskName}</td>
                <td className="px-4 py-2 border">{task.Description}</td>
                <td className="px-4 py-2 border">
                  <span className="px-2 py-1 rounded text-sm bg-blue-100">
                    {TASK_STATUS_LABELS[task.Status] || task.Status}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  <span className="px-2 py-1 rounded text-sm bg-gray-100">
                    {PRIORITY_LABELS[task.Priority] || task.Priority}
                  </span>
                </td>
                <td className="px-4 py-2 border">{task.project_name || '-'}</td>
                <td className={`px-4 py-2 border ${isNearDeadline(task.End_date) ? 'bg-red-100 font-bold' : ''}`}>
                  {task.End_date ? new Date(task.End_date).toLocaleDateString('vi-VN') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;