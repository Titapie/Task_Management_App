// components/stats/TaskStatusChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FiCircle, FiActivity, FiCheckCircle, FiPauseCircle, FiXCircle } from 'react-icons/fi';
import { useTaskStatusStats } from '../../hooks/useStats';
import { TASK_STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

const TaskStatusChart = () => {
    const { data, loading, error } = useTaskStatusStats();

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border h-80 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
                <div className="flex justify-center items-center h-48">
                    <div className="h-40 w-40 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <p className="text-red-600">Lỗi: {error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <p className="text-gray-500">Không có dữ liệu</p>
            </div>
        );
    }

    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = Object.entries(data).map(([status, count]) => ({
        name: TASK_STATUS_LABELS[status] || status,
        value: count,
        status: status
    })).filter(item => item.value > 0);
    const inProgress = (data.initial || 0) + (data.doing || 0) + (data.pending || 0);
    const totalTasks = chartData.reduce((sum, item) => sum + item.value, 0);

    // Icon theo trạng thái
    const statusIcons = {
        initial: <FiCircle className="text-gray-400" />,
        doing: <FiActivity className="text-blue-500" />,
        pending: <FiPauseCircle className="text-yellow-500" />,
    };

    return (
        <div className="bg-white p-3 rounded-xl shadow-sm border dark:bg-slate-600">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 dark:text-white">
                Phân bố trạng thái công việc
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 dark:bg-slate-600">
                {/* Biểu đồ */}
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#9CA3AF'} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} task`, 'Số lượng']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Danh sách chi tiết */}
                <div>
                    <div className="mb-9">
                        <p className="text-sm text-gray-600 dark:text-white">Task đang thực hiện::</p>
                        <p className="text-2xl text-gray-700 font-bold dark:text-white">{inProgress}</p>
                    </div>

                    <div className="space-y-3">
                        {chartData.map((item) => (
                            <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg">
                                        {statusIcons[item.status]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.status === 'finish'
                                                ? `${((item.value / totalTasks) * 100).toFixed(1)}% tổng số`
                                                : `${inProgress > 0 ? ((item.value / inProgress) * 100).toFixed(1) : 0}% `
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold">{item.value}</p>
                                    <div
                                        className="h-2 rounded-full bg-gray-200 mt-1"
                                        style={{ width: '100px' }}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(item.value / totalTasks) * 100}%`,
                                                backgroundColor: STATUS_COLORS[item.status]
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskStatusChart;