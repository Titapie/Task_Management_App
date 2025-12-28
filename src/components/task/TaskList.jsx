// src/components/tasks/TaskList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import { TASK_ROUTES } from '../../routes/taskRoutes';
import Button from '../common/Button';

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
                        <th className="px-4 py-2 text-black border text-left">Tên việc</th>
                        <th className="px-4 py-2 text-black border text-left">Mô tả</th>
                        <th className="px-4 py-2 text-black border text-left">Trạng thái</th>
                        <th className="px-4 py-2 text-black border text-left">Ưu tiên</th>
                        <th className="px-4 py-2 text-black border text-left">Hạn cuối</th>
                        <th className="px-4 py-2 text-black border text-left">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(!tasks || tasks.length === 0) ? (
                        <tr>
                            <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                Không có task phù hợp với bộ lọc
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-black border">{task.TaskName}</td>
                                <td className="px-4 py-2 text-black border">{task.Description}</td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[task.Status] || 'bg-gray-100'}`}>
                                        {TASK_STATUS_LABELS[task.Status] || task.Status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 border">
                                    <span className={`px-2 py-1 rounded text-sm ${PRIORITY_COLORS[task.Priority] || 'bg-gray-100'}`}>
                                        {PRIORITY_LABELS[task.Priority] || task.Priority}
                                    </span>
                                </td>
                                <td className={`px-4 py-2 text-black border ${isNearDeadline(task.End_date) ? 'bg-red-100 font-bold' : ''}`}>
                                    {task.End_date ? new Date(task.End_date).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td className="px-4 py-2 border">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => navigate(TASK_ROUTES.DETAIL(task.id))}
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            onClick={() => navigate(TASK_ROUTES.EDIT(task.id))}
                                            className="hover:bg-yellow-600 bg-yellow-500 text-white"
                                        >
                                            Sửa
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
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