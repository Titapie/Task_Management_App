// src/components/tasks/TaskList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS, DARK_MODE_COLORS } from '../../utils/constants';
import { TASK_ROUTES } from '../../routes/taskRoutes';
import Button from '../common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TaskList = ({ tasks, loading, pagination, onPageChange }) => {
    const navigate = useNavigate();

    if (loading) {
        return <div className={`p-4 text-center ${DARK_MODE_COLORS.TEXT_LABEL}`}>Đang tải...</div>;
    }

    const isNearDeadline = (deadline) => {
        if (!deadline) return false;
        const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 3 && days >= 0;
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className={`min-w-full ${DARK_MODE_COLORS.BG_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY}`}>
                    <thead className={DARK_MODE_COLORS.TABLE_HEADER}>
                    <tr>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Tên việc</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Mô tả</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Trạng thái</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Ưu tiên</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Hạn cuối</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left`}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(!tasks || tasks.length === 0) ? (
                        <tr>
                            <td colSpan="6" className={`px-4 py-8 text-center ${DARK_MODE_COLORS.TEXT_SECONDARY}`}>
                                Không có task phù hợp với bộ lọc
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id} className={`${DARK_MODE_COLORS.TABLE_ROW} transition-colors`}>
                                <td className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.TABLE_BORDER}`}>{task.TaskName}</td>
                                <td className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_LABEL} border ${DARK_MODE_COLORS.TABLE_BORDER}`}>{task.Description}</td>
                                <td className={`px-4 py-2 border ${DARK_MODE_COLORS.TABLE_BORDER}`}>
                                    <span className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[task.Status] || DARK_MODE_COLORS.BADGE_GRAY}`}>
                                        {TASK_STATUS_LABELS[task.Status] || task.Status}
                                    </span>
                                </td>
                                <td className={`px-4 py-2 border ${DARK_MODE_COLORS.TABLE_BORDER}`}>
                                    <span className={`px-2 py-1 rounded text-sm ${PRIORITY_COLORS[task.Priority] || DARK_MODE_COLORS.BADGE_GRAY}`}>
                                        {PRIORITY_LABELS[task.Priority] || task.Priority}
                                    </span>
                                </td>
                                <td className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.TABLE_BORDER} ${isNearDeadline(task.End_date) ? DARK_MODE_COLORS.NEAR_DEADLINE + ' font-bold' : ''}`}>
                                    {task.End_date ? new Date(task.End_date).toLocaleDateString('vi-VN') : '-'}
                                </td>
                                <td className={`px-4 py-2 border ${DARK_MODE_COLORS.TABLE_BORDER}`}>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => navigate(TASK_ROUTES.DETAIL(task.id))}
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            onClick={() => navigate(TASK_ROUTES.EDIT(task.id))}
                                            className="hover:bg-yellow-600 bg-yellow-500 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700"
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
            {pagination && tasks.length > 0 && (
                <div className="mt-4 flex justify-center gap-2">
                    <button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`px-4 py-2 border ${DARK_MODE_COLORS.BORDER_INPUT} rounded disabled:opacity-50 ${DARK_MODE_COLORS.BG_HOVER} ${DARK_MODE_COLORS.BG_PRIMARY} ${DARK_MODE_COLORS.TEXT_PRIMARY} transition`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
            {pagination.currentPage} / {pagination.totalPage}
          </span>
                    <button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPage}
                        className={`px-4 py-2 border ${DARK_MODE_COLORS.BORDER_INPUT} rounded disabled:opacity-50 ${DARK_MODE_COLORS.BG_HOVER} ${DARK_MODE_COLORS.BG_PRIMARY} ${DARK_MODE_COLORS.TEXT_PRIMARY} transition`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;