// components/stats/RecentTask.jsx
import React from 'react';
import { FiClock, FiUser, FiFolder, FiCheckCircle, FiActivity, FiAlertCircle, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useRecentTasks } from '../../hooks/useTasks';
import { TASK_STATUS_LABELS } from "../../utils/constants";

const RecentTask = () => {
    const { recentTasks, loading, error } = useRecentTasks(5);

    const statusIcons = {
        initial: <FiClock className="text-gray-400" />,
        doing: <FiActivity className="text-blue-500" />,
        finish: <FiCheckCircle className="text-green-500" />,
        pending: <FiClock className="text-yellow-500" />,
        notFinish: <FiAlertCircle className="text-red-500" />
    };

    const priorityConfig = {
        high: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cao' },
        medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Trung bình' },
        low: { bg: 'bg-green-100', text: 'text-green-800', label: 'Thấp' }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);

        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hôm nay';
        if (diffDays === 1) return 'Ngày mai';
        if (diffDays === -1) return 'Hôm qua';
        if (diffDays < 0) return `${Math.abs(diffDays)} ngày trước`;
        return `Còn ${diffDays} ngày`;
    };

    const getStatusConfig = (status) => {
        const configs = {
            finish: { bg: 'bg-green-100', text: 'text-green-800' },
            doing: { bg: 'bg-blue-100', text: 'text-blue-800' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            initial: { bg: 'bg-gray-100', text: 'text-gray-800' },
            notFinish: { bg: 'bg-red-100', text: 'text-red-800' }
        };
        return configs[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[320px] h-48 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-600">
                        <FiAlertCircle />
                        <p>Lỗi: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border dark:bg-slate-600">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Công việc gần đây</h3>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        {recentTasks.length} task
                    </span>
                    <Link
                        to="/tasks"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 dark:text-white"
                    >
                        Xem tất cả
                        <FiChevronRight size={16} />
                    </Link>
                </div>
            </div>

            {recentTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <FiFolder className="mx-auto text-5xl mb-3 text-gray-300" />
                    <p>Chưa có công việc nào</p>
                </div>
            ) : (
                /* ✅ HORIZONTAL SCROLL CONTAINER */
                <div className="overflow-x-auto pb-4 -mx-2 px-2">
                    <div className="flex gap-4 min-w-min">
                        {recentTasks.map((task) => {
                            const priority = task.Priority?.toLowerCase() || 'low';
                            const status = task.Status?.toLowerCase() || 'initial';
                            const priorityStyle = priorityConfig[priority] || priorityConfig.low;
                            const statusStyle = getStatusConfig(status);

                            const memberNames = task.TaskMembers && task.TaskMembers.length > 0
                                ? task.TaskMembers.map(m => `${m.FirstName} ${m.LastName}`).join(', ')
                                : 'Chưa gán';

                            return (
                                /* ✅ TASK CARD - Fixed width for horizontal layout */
                                <div
                                    key={task.id}
                                    className=" dark:bg-slate-400 flex-shrink-0 w-80 p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white"
                                >
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-4 ">
                                        <div className={`p-2.5 rounded-lg ${statusStyle.bg} flex-shrink-0`}>
                                            {statusIcons[status] || statusIcons.initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-800 line-clamp-2 mb-2 dark:text-white">
                                                {task.TaskName || 'Chưa có tên'}
                                            </h4>
                                            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                                {TASK_STATUS_LABELS[status] || status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project & Members */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiFolder size={14} className="flex-shrink-0 dark:text-white" />
                                            <span className="truncate dark:text-white">
                                                {task.ParentProject?.Name || 'Chưa có dự án'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FiUser size={14} className="flex-shrink-0 dark:text-white" />
                                            <span className="truncate dark:text-white">
                                                {memberNames}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${priorityStyle.bg} ${priorityStyle.text} inline-block w-fit`}>
                                                {priorityStyle.label}
                                            </span>
                                            {task.End_date && (
                                                <span className="text-xs text-gray-500 dark:text-white">
                                                    📅 {formatDate(task.End_date)}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            to={`/tasks/${task.id}`}
                                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition"
                                        >
                                            <FiChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentTask;