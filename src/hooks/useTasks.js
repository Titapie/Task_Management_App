import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

const useTasks = (initialParams = {}) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Tự động fetch khi mount với initialParams
    useEffect(() => {
        if (Object.keys(initialParams).length > 0 || initialParams.page || initialParams.limit) {
            fetchTasks(initialParams);
        }
    }, []); // Chỉ chạy 1 lần khi mount

    const fetchTasks = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.getTasks(params);
            // Đảm bảo tasks luôn là array
            setTasks(Array.isArray(data.tasks) ? data.tasks : (Array.isArray(data) ? data : []));
            if (data.pagination) {
                setPagination(data.pagination);
            }
        } catch (err) {
            setError(err.message);
            setTasks([]); // Set empty array khi lỗi
        } finally {
            setLoading(false);
        }
    };

    const refetch = (params) => {
        fetchTasks(params);
    };

    return {
        tasks,
        loading,
        error,
        pagination,
        refetch
    };
};
export const useUpcomingTasks = () => {
    const [upcomingTasks, setUpcomingTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchUpcomingTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await taskService.getUpcomingTasks();
                if (mounted) {
                    setUpcomingTasks(Array.isArray(data) ? data : (data.tasks || []));
                }
            } catch (err) {
                if (mounted) {
                    console.error('Error fetching upcoming tasks:', err);
                    setError(err.message);
                    setUpcomingTasks([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchUpcomingTasks();

        return () => {
            mounted = false;
        };
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.getUpcomingTasks();
            setUpcomingTasks(Array.isArray(data) ? data : (data.tasks || []));
        } catch (err) {
            console.error('Error refetching upcoming tasks:', err);
            setError(err.message);
            setUpcomingTasks([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        upcomingTasks,
        loading,
        error,
        refetch
    };
};

// Hook để lấy tasks quá hạn
export const useOverdueTasks = () => {
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchOverdueTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await taskService.getOverdueTasks();
                if (mounted) {
                    setOverdueTasks(Array.isArray(data) ? data : (data.tasks || []));
                }
            } catch (err) {
                if (mounted) {
                    console.error('Error fetching overdue tasks:', err);
                    setError(err.message);
                    setOverdueTasks([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchOverdueTasks();

        return () => {
            mounted = false;
        };
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.getOverdueTasks();
            setOverdueTasks(Array.isArray(data) ? data : (data.tasks || []));
        } catch (err) {
            console.error('Error refetching overdue tasks:', err);
            setError(err.message);
            setOverdueTasks([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        overdueTasks,
        loading,
        error,
        refetch
    };
};

// Hook để lấy tasks gần đây
export const useRecentTasks = (limit = 5) => {
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchRecentTasks = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await taskService.getRecentTasks(limit);
                if (mounted) {
                    setRecentTasks(Array.isArray(data) ? data : (data.tasks || []));
                }
            } catch (err) {
                if (mounted) {
                    console.error('Error fetching recent tasks:', err);
                    setError(err.message);
                    setRecentTasks([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchRecentTasks();

        return () => {
            mounted = false;
        };
    }, [limit]);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await taskService.getRecentTasks(limit);
            setRecentTasks(Array.isArray(data) ? data : (data.tasks || []));
        } catch (err) {
            console.error('Error fetching recent tasks:', err);
            setError(err.message);
            setRecentTasks([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        recentTasks,
        loading,
        error,
        refetch
    };
};

// Hook kết hợp để lấy cả upcoming và overdue tasks
export const useDeadlineTasks = () => {
    const { upcomingTasks, loading: upcomingLoading, error: upcomingError, refetch: refetchUpcoming } = useUpcomingTasks();
    const { overdueTasks, loading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdueTasks();

    const refetchAll = () => {
        refetchUpcoming();
        refetchOverdue();
    };

    return {
        upcomingTasks,
        overdueTasks,
        loading: upcomingLoading || overdueLoading,
        error: upcomingError || overdueError,
        refetch: refetchAll
    };
};
export default useTasks;