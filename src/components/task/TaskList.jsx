// src/components/tasks/TaskList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskList = ({ tasks, loading, pagination, onPageChange }) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="p-4 text-center">Đang tải...</div>;
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
              <th className="px-4 py-2 border text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {/* LUÔN RENDER TBODY - Không check tasks.length */}
            {(!tasks || tasks.length === 0) ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  Không có task phù hợp với bộ lọc
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
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
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/tasks/${task.id}`)}
                        className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => navigate(`/tasks/edit/${task.id}`)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition"
                      >
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPage > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Trước
          </button>
          <span className="px-4 py-2">
            Trang {pagination.currentPage} / {pagination.totalPage}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPage}
            className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;