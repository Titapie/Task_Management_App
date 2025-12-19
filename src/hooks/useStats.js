// hooks/useStats.js
import { useState, useEffect, useCallback } from 'react';
import statsService from '../services/statsService';

// Helper extract data từ response
const extractData = (response) => {
    if (!response) return null;
    // Response từ controller: { success, message, data/overview/stats }
    if (response.success !== undefined) {
        return response.data || response.overview || response.stats || response;
    }
    // Đã được service xử lý
    return response;
};

// Export chính
export function useStats(period = 'month') {
    const [stats, setStats] = useState({
        overview: null,
        progressChart: null,
        taskStatus: null,
        projectSummary: null
    });
    const [loading, setLoading] = useState({
        all: true,
        overview: false,
        progressChart: false,
        taskStatus: false,
        projectSummary: false
    });
    const [errors, setErrors] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    // Format dữ liệu
    const formatOverview = (data) => ({
        totalTasks: data?.total || 0,
        completedTasks: data?.completed || 0,
        failedTasks: data?.failed || 0,
        inProgressTasks: data?.in_progress || 0,
        overdueTasks: data?.overdue || 0,
        completionRate: data?.completion_rate || 0
    });

    const formatTaskStatus = (data) => ({
        initial: data?.initial || 0,
        doing: data?.doing || 0,
        finish: data?.finish || 0,
        pending: data?.pending || 0,
        notFinish: data?.notFinish || 0
    });

    // Fetch tất cả
    const fetchAll = useCallback(async (chartPeriod = period) => {
        setLoading(prev => ({ ...prev, all: true }));
        try {
            const [overviewRes, progressRes, taskStatusRes, projectSummaryRes] = await Promise.all([
                statsService.getOverview(),
                statsService.getProgressChart(chartPeriod),
                statsService.getTaskStatusStats(),
                statsService.getProjectSummary()
            ]);

            const newStats = {
                overview: extractData(overviewRes),
                progressChart: extractData(progressRes),
                taskStatus: extractData(taskStatusRes),
                projectSummary: extractData(projectSummaryRes)
            };

            setStats(newStats);
            setErrors({});
            setLastUpdated(new Date());
            return newStats;
        } catch (error) {
            console.error('Fetch stats error:', error);
            setErrors({ all: error.message });
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, all: false }));
        }
    }, [period]);

    // Refresh từng loại
    const refresh = useCallback(async (type, options = {}) => {
        if (!type || type === 'all') return fetchAll(options.period || period);

        setLoading(prev => ({ ...prev, [type]: true }));
        try {
            let response;
            switch (type) {
                case 'overview':
                    response = await statsService.getOverview();
                    break;
                case 'progressChart':
                    response = await statsService.getProgressChart(options.period || period);
                    break;
                case 'taskStatus':
                    response = await statsService.getTaskStatusStats();
                    break;
                case 'projectSummary':
                    response = await statsService.getProjectSummary();
                    break;
                default:
                    throw new Error(`Unknown type: ${type}`);
            }

            const data = extractData(response);
            setStats(prev => ({ ...prev, [type]: data }));
            setErrors(prev => ({ ...prev, [type]: null }));
            setLastUpdated(new Date());
            return data;
        } catch (error) {
            console.error(`Refresh ${type} error:`, error);
            setErrors(prev => ({ ...prev, [type]: error.message }));
            throw error;
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    }, [period, fetchAll]);

    // Format dữ liệu cho component
    const formattedStats = {
        overview: formatOverview(stats.overview),
        progressChart: stats.progressChart,
        taskStatus: formatTaskStatus(stats.taskStatus),
        projectSummary: stats.projectSummary
    };

    // Initialize
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        // Formatted data cho UI
        stats: formattedStats,
        // Raw data từ API
        rawStats: stats,
        loading,
        errors,
        lastUpdated,

        // Actions
        refresh,
        refreshAll: () => refresh('all'),

        // Helpers
        isLoading: loading.all,
        hasErrors: Object.keys(errors).length > 0
    };
}

// Hook riêng cho từng loại
export function useOverviewStats() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await statsService.getOverview();
            const extracted = extractData(response);
            setData(extracted);
            return extracted;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data: data ? {
            totalTasks: data.total || 0,
            completedTasks: data.completed || 0,
            failedTasks: data.failed || 0,
            inProgressTasks: data.in_progress || 0,
            overdueTasks: data.overdue || 0,
            completionRate: data.completion_rate || 0
        } : null,
        rawData: data,
        loading,
        error,
        refresh: fetchData
    };
}

// THÊM HOOK CHO PROGRESS CHART
export function useProgressChart(initialPeriod = 'month') {
    const [period, setPeriod] = useState(initialPeriod);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (chartPeriod = period) => {
        setLoading(true);
        setError(null);

        try {
            const response = await statsService.getProgressChart(chartPeriod);
            console.log('ProgressChart API response:', response); // Debug log

            const extracted = extractData(response);
            console.log('Extracted data:', extracted); // Debug log

            setData(extracted);
            return extracted;
        } catch (err) {
            console.error('Error fetching progress chart:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [period]);

    const changePeriod = useCallback(async (newPeriod) => {
        setPeriod(newPeriod);
        await fetchData(newPeriod);
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        period,
        changePeriod,
        refresh: fetchData
    };
}

// THÊM HOOK CHO TASK STATUS STATS
export function useTaskStatusStats() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await statsService.getTaskStatusStats();
            const extracted = extractData(response);
            setData(extracted);
            return extracted;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refresh: fetchData
    };
}

// Hook đơn giản cho dashboard
export function useDashboardStats(period = 'month') {
    const { stats, loading, errors, refresh, lastUpdated } = useStats(period);

    return {
        overview: stats.overview,
        progressChart: stats.progressChart,
        taskStatus: stats.taskStatus,
        projectSummary: stats.projectSummary,
        loading,
        errors,
        refresh,
        lastUpdated,
        hasData: stats.overview && stats.taskStatus
    };
}

export default useStats;