// components/stats/ProgressChart.jsx
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import {CHART_COLORS, DARK_MODE_COLORS} from '../../utils/constants';
import statsService from "../../services/statsService.js";

const ProgressChart = () => {
    const [period, setPeriod] = useState('month');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ created: 0, completed: 0 });
    useEffect(() => {
        fetchChartData();
    }, [period]);
    // Fetch data từ API
    const fetchChartData = async (selectedPeriod = period) => {
        setLoading(true);
        setError(null);

        try {
            const response = await statsService.getProgressChart(selectedPeriod);

            // Xử lý response - có thể là response.data hoặc trực tiếp response
            const data = response.data || response;

            if (!data || !data.labels || !data.created || !data.completed) {
                throw new Error('Dữ liệu biểu đồ không hợp lệ');
            }

            // Format data cho recharts
            const formattedData = data.labels.map((label, index) => ({
                name: label,
                created: data.created[index] || 0,
                completed: data.completed[index] || 0
            }));

            setChartData(formattedData);

            // Tính tổng
            const totalCreated = data.created.reduce((a, b) => a + b, 0);
            const totalCompleted = data.completed.reduce((a, b) => a + b, 0);
            setStats({ created: totalCreated, completed: totalCompleted });

        } catch (err) {
            console.error('Error loading chart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = async (newPeriod) => {
        setPeriod(newPeriod);
    };

    const refreshChart = () => {
        fetchChartData();
    };



    if (loading && chartData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && chartData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="text-center py-8">
                    <FiRefreshCw className="mx-auto text-3xl text-gray-400 mb-3" />
                    <p className="text-red-600 mb-3">Lỗi: {error}</p>
                    <button
                        onClick={refreshChart}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className={`text-lg font-semibold  flex items-center gap-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                        <FiTrendingUp className={`text-blue-500 ${DARK_MODE_COLORS.TEXT_PRIMARY}`} />
                        Tiến độ công việc
                    </h3>
                    <p className={`text-sm  ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Thống kê theo thời gian</p>
                </div>

                <div className="flex items-center gap-2 ">
                    <div className={`flex gap-1  p-1 rounded-lg ${DARK_MODE_COLORS.BG_PRIMARY}`}>
                        {['week', 'month', 'year'].map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePeriodChange(p)}
                                className={`px-3 py-1  text-sm rounded transition ${
                                    period === p
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-indigo-600  hover:text-gray-800'
                                }`}
                            >
                                {p === 'week' ? 'Tuần' : p === 'month' ? 'Tháng' : 'Năm'}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={refreshChart}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                        title="Làm mới"
                        disabled={loading}
                    >
                        <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="mb-6" style={{ width: '100%', height: '350px' }}>
                {chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis
                                dataKey="name"
                                stroke="#6B7280"
                                fontSize={12}
                                tick={{ fill: '#6B7280' }}
                            />
                            <YAxis
                                stroke="#6B7280"
                                fontSize={12}
                                allowDecimals={false}
                                tick={{ fill: '#6B7280' }}
                                domain={[0, 'auto']}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value) => [`${value} task`, 'Số lượng']}
                                labelFormatter={(label) => `Thời gian: ${label}`}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ paddingBottom: '20px' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="created"
                                name="Task mới"
                                stroke={CHART_COLORS.PRIMARY}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="completed"
                                name="Task hoàn thành"
                                stroke={CHART_COLORS.SUCCESS}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <p className="text-gray-500 mb-3">Không có dữ liệu để hiển thị</p>
                        <button
                            onClick={refreshChart}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                        >
                            Tải dữ liệu
                        </button>
                    </div>
                )}
            </div>

            {/* Thống kê tổng */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 font-medium">Tổng task mới</p>
                        <div className="p-2 bg-white rounded-lg">
                            <div className="h-2 w-16 bg-blue-200 rounded-full">
                                <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: '70%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.created}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Trong {period === 'week' ? '7 ngày' : period === 'month' ? '30 ngày' : '12 tháng'}
                    </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 font-medium">Tổng task hoàn thành</p>
                        <div className="p-2 bg-white rounded-lg">
                            <div className="h-2 w-16 bg-green-200 rounded-full">
                                <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: '85%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">
                        {stats.completed}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Tỷ lệ: {stats.created > 0 ? Math.round((stats.completed / stats.created) * 100) : 0}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProgressChart;