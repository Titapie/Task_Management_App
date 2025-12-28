// ProjectDetail.jsx - Modern UI Redesign
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import projectService from '../../services/projectService';
import ProjectForm from './ProjectForm';
import { jwtDecode } from 'jwt-decode';
import { tokenStore } from "../../utils/api.js";
import taskService from "../../services/taskService.js";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [taskFilter, setTaskFilter] = useState('all');
    const [taskSearch, setTaskSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [showActions, setShowActions] = useState(false);

    // User state
    const [currentUser, setCurrentUser] = useState({
        id: null,
        Role: null,
        Email: ''
    });

    // States for Edit Form
    const [showEditForm, setShowEditForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Decode token to get user info
    useEffect(() => {
        const getUserFromToken = () => {
            try {
                const token = tokenStore.getAccessToken();
                if (token) {
                    const decoded = jwtDecode(token);
                    setCurrentUser({
                        id: decoded.userId || decoded.id || decoded.sub,
                        Role: decoded.role || decoded.Role || 'user',
                        Email: decoded.Email || decoded.email || ''
                    });
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        };
        getUserFromToken();
    }, []);

    // Fetch project details and tasks
    const fetchProjectDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const projectResponse = await projectService.getProject(id);
            if (projectResponse.success) {
                const projectData = projectResponse.project || projectResponse.data;

                if (projectData.ProjectMembers && currentUser.id) {
                    const userMember = projectData.ProjectMembers.find(
                        member => member.id === currentUser.id
                    );
                    projectData.currentUserRole = userMember?.role || null;
                }

                setProject(projectData);
            }

            try {
                const tasksResponse = await taskService.getTasks({
                    project_id: id,
                    limit: 100
                });

                if (tasksResponse.success) {
                    setTasks(tasksResponse.tasks || tasksResponse.data || []);
                } else if (tasksResponse.tasks) {
                    setTasks(tasksResponse.tasks);
                } else {
                    setTasks([]);
                }
            } catch {
                const fallbackTasks = projectResponse.projects?.Tasks ||
                    projectResponse.projects?.tasks || [];
                setTasks(fallbackTasks);
            }
        } catch (err) {
            setError(err.message || 'Không thể tải thông tin dự án');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && currentUser.id) {
            fetchProjectDetail();
        }
    }, [id, currentUser.id]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Get current user role
    const getCurrentUserRole = () => {
        if (!project) return null;
        if (project.currentUserRole) return project.currentUserRole;
        if (project.ProjectMembers && currentUser.id) {
            const userMember = project.ProjectMembers.find(
                member => member.id === currentUser.id
            );
            return userMember?.role || 'Không có vai trò';
        }
        return 'Không có vai trò';
    };

    // Check permissions
    const getPermissions = () => {
        const userRole = getCurrentUserRole();
        const isAdmin = currentUser.Role === 'admin';
        const isLead = userRole === 'lead';
        const isManager = project?.Manager_id === currentUser.id;

        return {
            canEdit: isAdmin || isLead || isManager,
            canDelete: isAdmin || isManager,
            canAddMembers: isAdmin || isLead || isManager,
            canView: true
        };
    };

    const permissions = getPermissions();

    // Calculate completion rate
    const getCompletionRate = () => {
        if (!project) return 0;
        const total = parseInt(project.total_tasks) ||
            parseInt(project.totalTasks) ||
            tasks.length || 0;
        const completed = parseInt(project.completed_tasks) ||
            parseInt(project.completedTasks) ||
            tasks.filter(t => t.Status === 'finish').length || 0;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // Get progress color
    const getProgressColor = (rate) => {
        if (rate >= 80) return 'bg-green-500';
        if (rate >= 50) return 'bg-blue-500';
        if (rate >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Check if overdue
    const isOverdue = () => {
        if (!project?.End_date) return false;
        const endDate = new Date(project.End_date);
        const today = new Date();
        return endDate < today && getCompletionRate() < 100;
    };

    // Get manager name
    const getManagerName = () => {
        if (!project) return 'Chưa có';
        return project.ProjectManager
            ? `${project.ProjectManager.FirstName} ${project.ProjectManager.LastName}`
            : project.manager_name || 'Chưa có';
    };

    // Filter tasks
    const getFilteredTasks = () => {
        let filtered = tasks;

        if (taskFilter !== 'all') {
            filtered = filtered.filter(task => {
                if (taskFilter === 'finish') return task.Status === 'finish';
                if (taskFilter === 'doing') return task.Status === 'doing';
                if (taskFilter === 'pending') return task.Status === 'pending';
                if (taskFilter === 'initial') return task.Status === 'initial';
                return true;
            });
        }

        if (taskSearch) {
            filtered = filtered.filter(task =>
                task.TaskName?.toLowerCase().includes(taskSearch.toLowerCase()) ||
                task.Description?.toLowerCase().includes(taskSearch.toLowerCase())
            );
        }

        return filtered;
    };

    // Get task status badge
    const getStatusBadge = (status) => {
        const badges = {
            finish: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' },
            doing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang thực hiện' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ xử lý' }
        };
        const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
        return (
            <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded-full`}>
                {badge.label}
            </span>
        );
    };

    // Get priority badge
    const getPriorityBadge = (priority) => {
        const badges = {
            high: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cao' },
            medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Trung bình' },
            low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Thấp' }
        };
        const badge = badges[priority] || { bg: 'bg-gray-100', text: 'text-gray-700', label: priority };
        return (
            <span className={`px-2 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded`}>
                {badge.label}
            </span>
        );
    };

    // Handlers
    const handleEdit = () => setShowEditForm(true);

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setDeletingId(id);
            const response = await projectService.deleteProject(id);

            if (response.success) {
                alert('Xóa dự án thành công!');
                navigate('/projects');
            } else {
                throw new Error(response.message || 'Không thể xóa dự án');
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            alert(err.message || 'Không thể xóa dự án');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await projectService.updateProject(id, data);

            if (response.success) {
                alert('Cập nhật dự án thành công!');
                setShowEditForm(false);
                await fetchProjectDetail();
            } else {
                throw new Error(response.message || 'Không thể cập nhật dự án');
            }
        } catch (err) {
            console.error('Error updating project:', err);
            alert(err.message || 'Có lỗi xảy ra khi cập nhật dự án');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMembers = () => navigate(`/projects/${id}/add-members`);
    const handleCreateTask = () => navigate(`/tasks/create`);
    const handleTaskClick = (taskId) => navigate(`/tasks/${taskId}`);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <LucideIcons.Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải thông tin dự án...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !project) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LucideIcons.AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error || 'Không tìm thấy dự án'}</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const completionRate = getCompletionRate();
    const filteredTasks = getFilteredTasks();

    // Render Edit Form Modal
    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="max-w-2xl w-full">
                    <ProjectForm
                        project={project}
                        mode="edit"
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowEditForm(false)}
                        isLoading={isSubmitting}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Overdue Alert */}
                {isOverdue() && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
                        <div className="flex items-start gap-3">
                            <LucideIcons.AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-red-800">Dự án đã quá hạn!</p>
                                <p className="text-sm text-red-600 mt-1">
                                    Hạn chót: {formatDate(project.End_date)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.Name}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <LucideIcons.Users className="w-4 h-4" />
                                        <span className="text-sm">Quản lý: {getManagerName()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Tiến độ hoàn thành</span>
                                    <span className="text-2xl font-bold bg-black bg-clip-text text-transparent">
                                        {completionRate}%
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={`h-full ${getProgressColor(completionRate)} rounded-full transition-all duration-500 shadow-sm`}
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {getCurrentUserRole() !== 'member' && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowActions(!showActions)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <LucideIcons.MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>

                                {showActions && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                                        {permissions.canEdit && (
                                            <button
                                                onClick={handleEdit}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <LucideIcons.Edit className="w-4 h-4" />
                                                Chỉnh sửa
                                            </button>
                                        )}
                                        {permissions.canAddMembers && (
                                            <button
                                                onClick={handleAddMembers}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <LucideIcons.UserPlus className="w-4 h-4" />
                                                Thêm thành viên
                                            </button>
                                        )}
                                        {permissions.canDelete && (
                                            <>
                                                <div className="border-t border-gray-200 my-1"></div>
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    disabled={deletingId === id}
                                                >
                                                    {deletingId === id ? (
                                                        <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <LucideIcons.Trash2 className="w-4 h-4" />
                                                    )}
                                                    Xóa dự án
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <LucideIcons.ListTodo className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {project.total_tasks || project.totalTasks || tasks.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Tổng tasks đang tham gia</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <LucideIcons.CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {project.completed_tasks || project.completedTasks || tasks.filter(t => t.Status === 'finish').length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Hoàn thành</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <LucideIcons.Target className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {project.in_progress_tasks || project.inProgressTasks || tasks.filter(t => t.Status === 'doing').length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Đang thực hiện</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <LucideIcons.AlertCircle className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-800 mb-1">
                            {project.not_finish_tasks || project.notFinishTasks || tasks.filter(t => t.Status === 'initial').length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Chưa hoàn thành</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-1 p-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'overview'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <LucideIcons.BarChart3 className="w-4 h-4" />
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                                    activeTab === 'tasks'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <LucideIcons.ListTodo className="w-4 h-4" />
                                Danh sách Tasks ({tasks.length})
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'overview' ? (
                            <div className="space-y-6">
                                {/* Project Information */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <LucideIcons.BarChart3 className="w-5 h-5 text-blue-600" />
                                        Thông tin dự án
                                    </h3>
                                    <div className="space-y-4">
                                        {project.Description && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-2">Mô tả</p>
                                                <p className="text-gray-800 bg-white rounded-lg p-4">{project.Description}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <LucideIcons.Calendar className="w-4 h-4" />
                                                    Ngày bắt đầu
                                                </p>
                                                <p className="text-gray-800 font-semibold">{formatDate(project.Start_date)}</p>
                                            </div>

                                            <div className="bg-white rounded-lg p-4">
                                                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <LucideIcons.Calendar className="w-4 h-4" />
                                                    Ngày kết thúc
                                                </p>
                                                <p className="text-gray-800 font-semibold">{formatDate(project.End_date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                {project.ProjectMembers && project.ProjectMembers.length > 0 && (
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <LucideIcons.Users className="w-5 h-5 text-blue-600" />
                                            Thành viên dự án ({project.ProjectMembers.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {project.ProjectMembers.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="bg-white rounded-lg p-4 hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                                            {member.FirstName.charAt(0)}{member.LastName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-800 truncate">
                                                                {member.FirstName} {member.LastName}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">{member.Email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Task Filters */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <LucideIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm task..."
                                            value={taskSearch}
                                            onChange={(e) => setTaskSearch(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                                        />
                                    </div>

                                    <div className="flex gap-3 ">
                                        <select
                                            value={taskFilter}
                                            onChange={(e) => setTaskFilter(e.target.value)}
                                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm min-w-[180px]"
                                        >
                                            <option value="all">Tất cả trạng thái</option>
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="doing">Đang thực hiện</option>
                                            <option value="initial">Khởi tạo</option>
                                            <option value="finish">Hoàn thành</option>
                                        </select>

                                        <button
                                            onClick={handleCreateTask}
                                            className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-blue-500  transition-all shadow-md hover:shadow-lg"
                                        >
                                            <LucideIcons.Plus className="w-4 h-4" />
                                            Tạo Task
                                        </button>
                                    </div>
                                </div>

                                {/* Tasks List */}
                                {filteredTasks.length === 0 ? (
                                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                            <LucideIcons.ListTodo className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium mb-2">
                                            {taskSearch || taskFilter !== 'all'
                                                ? 'Không tìm thấy task phù hợp'
                                                : 'Chưa có task nào'}
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            {taskSearch || taskFilter !== 'all'
                                                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                                : 'Bắt đầu bằng cách tạo task đầu tiên'}
                                        </p>
                                        {!taskSearch && taskFilter === 'all' && (
                                            <button
                                                onClick={handleCreateTask}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                                            >
                                                <LucideIcons.Plus className="w-4 h-4" />
                                                Tạo Task đầu tiên
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                onClick={() => handleTaskClick(task.id)}
                                                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                                                            {task.TaskName}
                                                        </h4>
                                                        {task.Description && (
                                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                                {task.Description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex flex-col items-end gap-2">
                                                        {getStatusBadge(task.Status)}
                                                        {task.Priority && getPriorityBadge(task.Priority)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        {task.End_date && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <LucideIcons.Calendar className="w-4 h-4" />
                                                                <span>Hạn: {formatDate(task.End_date)}</span>
                                                            </div>
                                                        )}
                                                        {task.TaskMembers && task.TaskMembers.length > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <LucideIcons.Users className="w-4 h-4 text-gray-600" />
                                                                <div className="flex -space-x-2">
                                                                    {task.TaskMembers.slice(0, 3).map((member) => (
                                                                        <div
                                                                            key={member.id}
                                                                            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                                                                            title={`${member.FirstName} ${member.LastName}`}
                                                                        >
                                                                            {member.FirstName.charAt(0)}{member.LastName.charAt(0)}
                                                                        </div>
                                                                    ))}
                                                                    {task.TaskMembers.length > 3 && (
                                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                                                                            +{task.TaskMembers.length - 3}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;