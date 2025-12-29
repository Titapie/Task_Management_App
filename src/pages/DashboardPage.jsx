// pages/DashboardPage.jsx
import React from 'react';
import StatsOverview from '../components/dashboard/StatsOverview';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import ProgressChart from '../components/dashboard/ProgressChart';
import DeadlineAlert from '../components/dashboard/DeadlineAlert';
import RecentTask from '../components/dashboard/RecentTask';
import {DARK_MODE_COLORS} from "../utils/constants.js";

const DashboardPage = () => {
    return (

        <div className={`w-full md:p-6 space-y-6 ${DARK_MODE_COLORS.BG_SECONDARY}`}>
            {/* Tổng quan - Card lớn và Grid 2x2 */}
            <StatsOverview showPieChart={false} />

            {/* Layout chính: 2 cột */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: ProgressChart và RecentTask */}
                <div className="lg:col-span-2 space-y-6">
                    <ProgressChart />
                    <RecentTask />
                </div>

                {/* Cột phải: PieChart (từ StatsOverview), TaskStatusChart, và DeadlineAlert */}
                <div className="lg:col-span-1 space-y-6">
                    <TaskStatusChart />
                    <DeadlineAlert />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;