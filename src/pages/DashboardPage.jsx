// pages/DashboardPage.jsx
import React from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProgressChart from '../components/dashboard/ProgressChart';
import DeadlineAlert from '../components/dashboard/DeadlineAlert';
import RecentTask from '../components/dashboard/RecentTask';

const DashboardPage = () => {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Tổng quan hiệu suất và công việc của bạn</p>
            </div>

            {/* Tổng quan */}
            <StatsOverview />

            {/* Hai cột chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Biểu đồ */}
                <div className="lg:col-span-2 space-y-6">
                    <ProgressChart />
                    <TaskStatusChart />
                </div>

                {/* Cột phải: Cảnh báo và task */}
                <div className="lg:col-span-1 space-y-6">
                    <DeadlineAlert />
                    <RecentTask />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;