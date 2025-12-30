import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Bar,
    AreaChart,
    Legend,
    Area,
} from 'recharts';
import statsService from '../../services/statsService';
import userService from '../../services/userService';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import {CHART_COLORS} from "../../utils/constants.js";
const AdminStats = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [overview, setOverview] = useState(null);
    const [userPerformance, setUserPerformance] = useState([]);
    const [taskStatus, setTaskStatus] = useState(null);
    const [projectSummary, setProjectSummary] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    // Fetch all stats
    const fetchAllStats = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch overview stats
            const overviewData = await statsService.getOverview();
            setOverview(overviewData);

            // Fetch task status
            const taskStatusData = await statsService.getTaskStatusStats();
            setTaskStatus(taskStatusData);

            // Fetch project summary
            const projectSummaryData = await statsService.getProjectSummary();
            setProjectSummary(projectSummaryData);

            // Fetch user performance
            try {
                const performanceData = await statsService.getUserPerformance();
                setUserPerformance(performanceData || []);
            } catch (err) {
                console.warn('Cannot fetch user performance:', err);
                setUserPerformance([]);
            }

            // Fetch all users
            try {
                const usersResponse = await userService.getAllUsers();
                if (usersResponse.success) {
                    setAllUsers(usersResponse.data || []);
                }
            } catch (err) {
                console.warn('Cannot fetch users:', err);
                setAllUsers([]);
            }

            // Fetch all projects
            try {
                const projectsResponse = await projectService.getAllProjectsNoPagination();
                if (projectsResponse.success) {
                    setAllProjects(projectsResponse.projects || []);
                }
            } catch (err) {
                console.warn('Cannot fetch projects:', err);
                setAllProjects([]);
            }

            // Fetch all tasks
            try {
                const tasksResponse = await taskService.getTasks({ limit: 1000 });
                if (tasksResponse.success) {
                    setAllTasks(tasksResponse.tasks || []);
                }
            } catch (err) {
                console.warn('Cannot fetch tasks:', err);
                setAllTasks([]);
            }

        } catch (err) {
            setError(err.message || 'Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllStats();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAllStats();
        setRefreshing(false);
    };

    // Calculate user stats
    const userStats = {
        total: allUsers.length,
        admins: allUsers.filter(u => u.Role === 'admin').length,
        regularUsers: allUsers.filter(u => u.Role === 'user').length
    };

    // Calculate project stats
    const projectStats = {
        total: allProjects.length,
        active: allProjects.filter(p => p.in_progress_tasks > 0).length,
        completed: allProjects.filter(p =>
            p.total_tasks > 0 && p.completed_tasks === p.total_tasks
        ).length,
        onHold: allProjects.filter(p =>
            p.total_tasks >= 0 && p.in_progress_tasks === 0 && p.completed_tasks < p.total_tasks
        ).length,
        overdue: allProjects.filter(p => {
            const endDate = new Date(p.End_date);
            const today = new Date();
            const isOverdue = endDate < today;
            const isNotCompleted = p.total_tasks === 0 || p.completed_tasks < p.total_tasks;
            return isOverdue && isNotCompleted;
        }).length,
    };

    // Calculate task stats
    const calculateTaskStats = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let stats = {
            initial: 0,
            doing: 0,
            finish: 0,
            pending: 0,
            overdue: 0,
        };

        allTasks.forEach(task => {
            const status = task.Status?.toLowerCase().trim();
            let isOverdue = false;
            if (task.End_date) {
                const endDate = new Date(task.End_date);
                endDate.setHours(0, 0, 0, 0);
                isOverdue = endDate < today && status !== 'finish';
            }

            if (isOverdue) {
                stats.overdue++;
            } else {
                switch (status) {
                    case 'finish':
                        stats.finish++;
                        break;
                    case 'doing':
                        stats.doing++;
                        break;
                    case 'initial':
                        stats.initial++;
                        break;
                    case 'pending':
                    case 'notfinish':
                        stats.pending++;
                        break;
                    default:
                        break;
                }
            }
        });

        return stats;
    };

    const taskStats = allTasks.length > 0 ? calculateTaskStats() : {
        initial: taskStatus?.initial || 0,
        doing: taskStatus?.doing || 0,
        finish: taskStatus?.finish || 0,
        pending: taskStatus?.pending || 0,
        overdue: 0,
    };

    // Prepare chart data
    const getTaskStatusChartData = () => {
        if (!taskStatus) return [];
        return [
            { name: 'Hoàn thành', value: taskStats.finish || 0, color: CHART_COLORS.SUCCESS },
            { name: 'Đang làm', value: taskStats.doing || 0, color: CHART_COLORS.PRIMARY },
            { name: 'Chờ xử lý', value: taskStats.pending || 0, color: CHART_COLORS.WARNING },
            { name: 'Khởi tạo', value: taskStats.initial || 0, color: CHART_COLORS.GRAY },
            { name: 'Quá hạn', value: taskStats.overdue || 0, color: CHART_COLORS.DANGER },
        ];
    };

    const getProjectChartData = () => {
        if (!projectSummary) return [];
        return [
            { name: 'Active', value: projectStats.active || 0, color: CHART_COLORS.PRIMARY },
            { name: 'Completed', value: projectStats.completed || 0, color: CHART_COLORS.SUCCESS },
            { name: 'On Hold', value: projectStats.onHold || 0, color: CHART_COLORS.WARNING },
            { name: 'Overdue', value: projectStats.overdue || 0, color: CHART_COLORS.DANGER }
        ];
    };

    const getTopPerformersData = () => {
        return userPerformance.slice(0, 5).map(user => ({
            name: user.userName?.split(' ').slice(-1)[0] || 'User',
            completed: user.completedTasks || 0,
            inProgress: user.inProgressTasks || 0,
            total: user.totalTasks || 0
        }));
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">
                        Số lượng: <span className="font-bold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <LucideIcons.Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thống kê...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <LucideIcons.AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header with Refresh Button */}
            <div className="flex items-center justify-end">
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
                >
                    <LucideIcons.RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <LucideIcons.Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Tổng Users</h3>
                    <p className="text-3xl font-bold text-gray-900">{userStats.total}</p>
                </div>

                {/* Total Projects */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <LucideIcons.Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Tổng Projects</h3>
                    <p className="text-3xl font-bold text-gray-900">{projectStats.total}</p>
                </div>

                {/* Total Tasks */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <LucideIcons.ListTodo className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Tổng Tasks</h3>
                    <p className="text-3xl font-bold text-gray-900">{overview?.total || 0}</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <LucideIcons.Target className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-1">Tỷ lệ hoàn thành</h3>
                    <p className="text-3xl font-bold text-gray-900">
                        {overview?.completion_rate ? `${overview.completion_rate}%` : '0%'}
                    </p>
                </div>
            </div>

            {/* Task Status Distribution */}
            {taskStatus && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        Phân bố trạng thái Tasks
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* PieChart */}
                        <div>
                            <ResponsiveContainer width="100%" height={300}>
                                <RechartsPieChart>
                                    <Pie
                                        data={getTaskStatusChartData()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={90}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {getTaskStatusChartData().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats Cards */}
                        <div className="flex flex-col justify-center space-y-3">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                    <LucideIcons.CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Hoàn thành</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.finish}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <LucideIcons.Clock className="w-8 h-8 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Đang thực hiện</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.doing}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex items-center">
                                    <LucideIcons.AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Chờ xử lý</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.pending}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center">
                                    <LucideIcons.FileText className="w-8 h-8 text-gray-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Khởi tạo</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.initial}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center">
                                    <LucideIcons.CalendarX2 className="w-8 h-8 text-red-600 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-600">Quá hạn</p>
                                        <p className="text-2xl font-bold text-gray-900">{taskStats.overdue}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Overview */}
            {allProjects.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        Tổng quan Projects
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getProjectChartData()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {getProjectChartData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                            <p className="text-2xl font-bold text-blue-600">{projectStats.active}</p>
                            <p className="text-xs text-gray-500 mt-1">Đang có tasks thực hiện</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
                            <p className="text-xs text-gray-500 mt-1">Tất cả tasks hoàn thành</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-gray-600 mb-1">On Hold</p>
                            <p className="text-2xl font-bold text-yellow-600">{projectStats.onHold}</p>
                            <p className="text-xs text-gray-500 mt-1">Chưa hoàn thành, không có task đang làm</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-gray-600 mb-1">Overdue</p>
                            <p className="text-2xl font-bold text-red-600">{projectStats.overdue}</p>
                            <p className="text-xs text-gray-500 mt-1">Đã quá thời hạn</p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Performance */}
            {userPerformance && userPerformance.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                            Top 5 Performers - Tasks Performance
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={getTopPerformersData()}>
                                <defs>
                                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS.SUCCESS} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={CHART_COLORS.SUCCESS} stopOpacity={0.1}/>
                                    </linearGradient>
                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS.PRIMARY} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={CHART_COLORS.PRIMARY} stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="completed"
                                    stroke={CHART_COLORS.SUCCESS}
                                    fillOpacity={1}
                                    fill="url(#colorCompleted)"
                                    name="Hoàn thành"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke={CHART_COLORS.PRIMARY}
                                    fillOpacity={1}
                                    fill="url(#colorProgress)"
                                    name="Tổng task"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Top performers theo số lượng tasks hoàn thành
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Task</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks hoàn thành</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ hoàn thành</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {userPerformance.slice(0, 10).map((user, index) => {
                                const completionRate = user.totalTasks > 0
                                    ? Math.round((user.completedTasks / user.totalTasks) * 100)
                                    : 0;

                                return (
                                    <tr key={user.userId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {index === 0 && <LucideIcons.Award className="w-5 h-5 text-yellow-500 mr-2" />}
                                                {index === 1 && <LucideIcons.Award className="w-5 h-5 text-gray-400 mr-2" />}
                                                {index === 2 && <LucideIcons.Award className="w-5 h-5 text-orange-500 mr-2" />}
                                                <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                                                    {user.userName?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.userName || 'Unknown'}</div>
                                                    <div className="text-sm text-gray-500">{user.userEmail || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <LucideIcons.ClipboardList className="w-4 h-4 text-blue-500 mr-2" />
                                                <span className="text-sm font-bold text-blue-600">{user.totalTasks || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <LucideIcons.CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                                <span className="text-sm font-bold text-green-600">{user.completedTasks || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-full max-w-xs">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-700">{completionRate}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                completionRate >= 80 ? 'bg-green-500' :
                                                                    completionRate >= 50 ? 'bg-blue-500' :
                                                                        completionRate >= 30 ? 'bg-yellow-500' :
                                                                            'bg-red-500'
                                                            }`}
                                                            style={{ width: `${completionRate}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStats;