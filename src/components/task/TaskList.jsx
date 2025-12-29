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
        return <div className={`p-4 text-center ${DARK_MODE_COLORS.TEXT_LABEL} animate-fade-in`}>Đang tải...</div>;
    }

    const isNearDeadline = (deadline) => {
        if (!deadline) return false;
        const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 3 && days >= 0;
    };

    return (
        <div className="animate-fade-in">
            <div className="overflow-x-auto">
                <table className={`min-w-full ${DARK_MODE_COLORS.BG_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY}`}>
                    <thead className={DARK_MODE_COLORS.TABLE_HEADER}>
                    <tr>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-[20%]`}>Tên việc</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-[30%]`}>Mô tả</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-auto`}>Trạng thái</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-auto`}>Ưu tiên</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-auto`}>Hạn cuối</th>
                        <th className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.BORDER_PRIMARY} text-left w-[15%]`}>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(!tasks || tasks.length === 0) ? (
                        <tr>
                            <td colSpan="6" className={`px-4 py-8 text-center ${DARK_MODE_COLORS.TEXT_SECONDARY} animate-fade-in`}>
                                Không có task phù hợp với bộ lọc
                            </td>
                        </tr>
                    ) : (
                        tasks.map((task) => (
                            <tr key={task.id} className={`${DARK_MODE_COLORS.TABLE_ROW} transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 animate-slide-up`}>
                                <td className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY} border ${DARK_MODE_COLORS.TABLE_BORDER}`}>{task.TaskName}</td>
                                <td className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_LABEL} border ${DARK_MODE_COLORS.TABLE_BORDER}`}>{task.Description}</td>
                                <td className={`px-4 py-2 border ${DARK_MODE_COLORS.TABLE_BORDER}`}>
                                    <span className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[task.Status] || DARK_MODE_COLORS.BADGE_GRAY} transition-transform hover:scale-110 inline-block`}>
                                        {TASK_STATUS_LABELS[task.Status] || task.Status}
                                    </span>
                                </td>
                                <td className={`px-4 py-2 border ${DARK_MODE_COLORS.TABLE_BORDER}`}>
                                    <span className={`px-2 py-1 rounded text-sm ${PRIORITY_COLORS[task.Priority] || DARK_MODE_COLORS.BADGE_GRAY} transition-transform hover:scale-110 inline-block`}>
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
                                            className="transition-transform hover:scale-105"
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            onClick={() => navigate(TASK_ROUTES.EDIT(task.id))}
                                            className="hover:bg-yellow-600 bg-yellow-500 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-transform hover:scale-105"
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
                <div className="mt-4 flex justify-center gap-2 animate-fade-in">
                    <button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`px-4 py-2 border ${DARK_MODE_COLORS.BORDER_INPUT} rounded disabled:opacity-50 ${DARK_MODE_COLORS.BG_HOVER} ${DARK_MODE_COLORS.BG_PRIMARY} ${DARK_MODE_COLORS.TEXT_PRIMARY} transition-all duration-200 hover:scale-110 disabled:hover:scale-100`}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className={`px-4 py-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
            {pagination.currentPage} / {pagination.totalPage}
          </span>
                    <button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage >= pagination.totalPage}
                        className={`px-4 py-2 border ${DARK_MODE_COLORS.BORDER_INPUT} rounded disabled:opacity-50 ${DARK_MODE_COLORS.BG_HOVER} ${DARK_MODE_COLORS.BG_PRIMARY} ${DARK_MODE_COLORS.TEXT_PRIMARY} transition-all duration-200 hover:scale-110 disabled:hover:scale-100`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;