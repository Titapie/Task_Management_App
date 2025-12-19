// components/stats/StatsOverview.jsx
import React from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiBarChart2 } from 'react-icons/fi';
import StatsCard from './StatsCard';
import { useOverviewStats } from '../../hooks/useStats';

const StatsOverview = () => {
    const { data, loading, error, refresh } = useOverviewStats();

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Lỗi: {error}</p>
                <button
                    onClick={refresh}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const cards = [
        {
            title: 'Tổng công việc',
            value: data?.totalTasks || 0,
            icon: <FiBarChart2 size={20} />,
            color: 'blue',
            subtitle: 'Tất cả task'
        },
        {
            title: 'Đã hoàn thành',
            value: data?.completedTasks || 0,
            icon: <FiCheckCircle size={20} />,
            color: 'green',
            subtitle: `${data?.completionRate || 0}% tổng số`
        },
        {
            title: 'Đang thực hiện',
            value: data?.inProgressTasks || 0,
            icon: <FiClock size={20} />,
            color: 'yellow',
            subtitle: 'Chưa hoàn thành'
        },
        {
            title: 'Quá hạn',
            value: data?.overdueTasks || 0,
            icon: <FiAlertTriangle size={20} />,
            color: 'red',
            subtitle: 'Cần xử lý'
        }
    ];

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Tổng quan</h2>
                <button
                    onClick={refresh}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    <FiClock size={14} />
                    Làm mới
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <StatsCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.color}
                        subtitle={card.subtitle}
                        isLoading={loading}
                    />
                ))}
            </div>
        </div>
    );
};

export default StatsOverview;