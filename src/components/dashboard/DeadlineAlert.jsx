// components/stats/DeadlineAlert.jsx
import React from 'react';
import { FiAlertCircle, FiClock, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useDeadlineTasks } from '../../hooks/useTasks';

const DeadlineAlert = () => {
    const { upcomingTasks, overdueTasks, loading, error } = useDeadlineTasks();

    const priorityColors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-yellow-100 text-yellow-800',
        low: 'bg-green-100 text-green-800'
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
        if (diffDays < 0) return `Quá ${Math.abs(diffDays)} ngày`;
        return `Còn ${diffDays} ngày`;
    };

    const getPriorityLabel = (priority) => {
        const labels = {
            high: 'Cao',
            medium: 'Trung bình',
            low: 'Thấp'
        };
        return labels[priority] || priority;
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 text-red-600">
                    <FiAlertCircle />
                    <p>Lỗi: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Task sắp đến hạn */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Sắp đến hạn (3 ngày)</h3>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                        {upcomingTasks.length} task
                    </span>
                </div>

                {upcomingTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Không có task sắp đến hạn</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${priorityColors[task.Priority?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                                        <FiClock />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{task.TaskName}</p>
                                        <p className="text-sm text-gray-500">
                                            {task.ParentProject?.Name || 'Chưa có dự án'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-gray-600 block">
                                            {formatDate(task.End_date)}
                                        </span>
                                        <span className={`text-xs ${priorityColors[task.Priority?.toLowerCase()] || 'text-gray-600'}`}>
                                            {getPriorityLabel(task.Priority?.toLowerCase())}
                                        </span>
                                    </div>
                                    <FiChevronRight className="text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Task quá hạn */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FiAlertCircle className="text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Quá hạn</h3>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                        {overdueTasks.length} task
                    </span>
                </div>

                {overdueTasks.length === 0 ? (
                    <p className="text-green-600 text-center py-4">🎉 Không có task quá hạn!</p>
                ) : (
                    <div className="space-y-3">
                        {overdueTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                        <FiAlertCircle />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{task.TaskName}</p>
                                        <p className="text-sm text-gray-500">
                                            {task.ParentProject?.Name || 'Chưa có dự án'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-sm font-medium text-red-600 block">
                                            {formatDate(task.End_date)}
                                        </span>
                                        <span className="text-xs text-red-500">
                                            {getPriorityLabel(task.Priority?.toLowerCase())}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/tasks/${task.id}`}
                                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                    >
                                        Xử lý
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Link đến tasks */}
            <Link
                to="/tasks"
                className="block p-4 bg-blue-500 text-white rounded-xl text-base shadow-sm hover:text-gray-700 transition text-center"
            >
                <div className="flex items-center justify-center gap-2">
                    <FiChevronRight className="rotate-180" />
                    <span className="font-medium">Xem tất cả công việc</span>
                    <FiChevronRight />
                </div>
            </Link>
        </div>
    );
};

export default DeadlineAlert;