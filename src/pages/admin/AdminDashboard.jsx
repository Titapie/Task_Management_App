import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Calendar,
    Loader2,
    AlertCircle
} from 'lucide-react';
import statsService from '../../services/statsService';
import AdminStats from "../../components/admin/AdminStats.jsx";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Stats data for charts only
    const [userPerformance, setUserPerformance] = useState([]);
    const [taskStatus, setTaskStatus] = useState(null);
    const [projectSummary, setProjectSummary] = useState(null);

    // Fetch data for charts only (AdminStats will handle basic stats)
    const fetchChartData = async () => {
        try {
            setLoading(true);
            setError(null);

            const taskStatusData = await statsService.getTaskStatusStats();
            setTaskStatus(taskStatusData);

            const projectSummaryData = await statsService.getProjectSummary();
            setProjectSummary(projectSummaryData);

            try {
                const performanceData = await statsService.getUserPerformance();
                setUserPerformance(performanceData || []);
            } catch (err) {
                console.warn('Cannot fetch user performance:', err);
                setUserPerformance([]);
            }
        } catch (err) {
            setError(err.message || 'Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [refreshKey]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshKey(prev => prev + 1); // Trigger refresh in AdminStats too
        await fetchChartData();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Đang tải thống kê...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 overflow-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-purple-500 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                    </div>
                </div>

                {/* Admin Stats Component */}
                <AdminStats key={refreshKey} />
            </div>
        </div>
    );
};

export default AdminDashboard;