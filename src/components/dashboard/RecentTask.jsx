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
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Công việc gần đây</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                    {recentTasks.length} task
                </span>
            </div>

            {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <FiFolder className="mx-auto text-4xl mb-2 text-gray-300" />
                    <p>Chưa có công việc nào</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {recentTasks.map((task) => {
                        const priority = task.Priority?.toLowerCase() || 'low';
                        const status = task.Status?.toLowerCase() || 'initial';
                        const priorityStyle = priorityConfig[priority] || priorityConfig.low;
                        const statusStyle = getStatusConfig(status);

                        // Tạo tên thành viên từ TaskMembers array
                        const memberNames = task.TaskMembers && task.TaskMembers.length > 0
                            ? task.TaskMembers.map(m => `${m.FirstName} ${m.LastName}`).join(', ')
                            : 'Chưa gán';

                        return (
                            <div
                                key={task.id}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        <div className={`p-2 rounded-lg ${statusStyle.bg}`}>
                                            {statusIcons[status] || statusIcons.initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-800 truncate">
                                                {task.TaskName || 'Chưa có tên'}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <FiFolder size={14} />
                                                    {task.ParentProject?.Name || 'Chưa có dự án'}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-gray-500 truncate">
                                                    <FiUser size={14} />
                                                    {memberNames}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1 ml-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${priorityStyle.bg} ${priorityStyle.text}`}>
                                            {priorityStyle.label}
                                        </span>
                                        {task.End_date && (
                                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(task.End_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                        {TASK_STATUS_LABELS[status] || status}
                                    </span>

                                    <Link
                                        to={`/tasks/${task.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                    >
                                        Xem chi tiết →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {recentTasks.length > 0 && (
                <div className="mt-6 text-center">
                    <Link
                        to="/tasks"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Xem tất cả công việc
                        <FiChevronRight />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RecentTask;