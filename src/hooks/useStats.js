import { useState, useCallback} from 'react';
import statsService from "../services/statsService.js";

const useStats = () => {
    const [overview, setOverview] = useState(null);
    const [loadingOverview, setLoadingOverview  ] = useState(false);
    const [overviewError, setOverviewError] = useState(null);

    const [progressChart, setProgressChart ] = useState(null);
    const [loadingProgressChart, setLoadingProgressChart ] = useState(false);
    const [progressChartError, setProgressChartError] = useState(null);

    const [taskStatus, setTaskStatus] = useState(null);
    const [loadingTaskStatus, setLoadingTaskStatus] = useState(false);
    const [taskStatusError, setTaskStatusError] = useState(null);

    const [projectSummary, setProjectSummary] = useState(null);
    const [loadingProjectsSummary, setLoadingProjectsSummary] = useState(false);
    const [projectSummaryError, setProjectSummaryError] = useState(null);

    const [userPerformance, setUserPerformance] = useState(null);
    const [loadingUsersPerformance, setLoadingUsersPerformance] = useState(false);
    const [userPerformanceError, setUserPerformanceError] = useState(null);

    const fetchOverview = useCallback(async () => {
        setLoadingOverview(true);
        setOverviewError(null);
        try{
            const data = await statsService.getOverview();
            setOverview(data.overview);
        }catch (error){
            setOverviewError(error.message);
            console.error(error);
        }finally {
            setLoadingOverview(false);
        }
    }, [])

    const fetchProgressChart = useCallback(async (period = 'week') => {
        setLoadingProgressChart(true);
        setOverviewError(null);
        try{
            const data = await statsService.getProgressChart(period);
            setProgressChart(data.data);
        }catch (error) {
            setProgressChartError(error.message);
            console.error(error);
        } finally {
            setLoadingProgressChart(false);
        }
    }, [])

    const fetchTaskStatus = useCallback(async () => {
        setLoadingTaskStatus(true);
        setTaskStatusError(null);
        try {
            const data = await statsService.getTaskStatus();
            setTaskStatus(data.stats);
        } catch (error) {
            setTaskStatusError(error.message);
            console.error(error);
        } finally {
            setLoadingTaskStatus(false);
        }
    }, []);

    const fetchProjectSummary = useCallback(async () => {
        setLoadingProjectsSummary(true);
        setProjectSummaryError(null);
        try {
            const data = await statsService.getProjectSummary();
            setProjectSummary(data.stats);
        } catch (error) {
            setProjectSummaryError(error.message);
            console.error(error);
        } finally {
            setLoadingProjectsSummary(false);
        }
    }, []);

    const fetchUserPerformance = useCallback(async () => {
        setLoadingUsersPerformance(true);
        setUserPerformanceError(null);
        try {
            const data = await statsService.getUserPerformance();
            setUserPerformance(data.stats);
        } catch (error) {
            setUserPerformanceError(error.message);
            console.error(error);
        } finally {
            setLoadingUsersPerformance(false);
        }
    }, []);

    const refreshStats = useCallback(async () => {
        await Promise.all([
            fetchOverview(),
            fetchProgressChart(),
            fetchTaskStatus(),
            fetchProjectSummary(),
        ]);
    }, [fetchOverview, fetchProgressChart, fetchTaskStatus, fetchProjectSummary]);

    const resetErrors = useCallback(() => {
        setOverviewError(null);
        setProgressChartError(null);
        setTaskStatusError(null);
        setProjectSummaryError(null);
        setUserPerformanceError(null);
    }, []);
    return {
        overview,
        loadingOverview,
        overviewError,
        fetchOverview,

        progressChart,
        loadingProgressChart,
        progressChartError,
        fetchProgressChart,

        taskStatus,
        loadingTaskStatus,
        taskStatusError,
        fetchTaskStatus,

        projectSummary,
        loadingProjectsSummary,
        projectSummaryError,
        fetchProjectSummary,

        userPerformance,
        loadingUsersPerformance,
        userPerformanceError,
        fetchUserPerformance,

        refreshStats,
        resetErrors,
    };
};
export default useStats;
