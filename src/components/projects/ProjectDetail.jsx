// ProjectDetail.jsx - Sửa hoàn chỉnh
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Users, CheckCircle,
    Clock, TrendingUp, Edit, Trash2, UserPlus,
    Loader2, AlertCircle, BarChart3, ListTodo,
    Target, AlertTriangle, Search, Plus, X
} from 'lucide-react';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';
import ProjectForm from './ProjectForm';
import { jwtDecode } from 'jwt-decode'; // Cần cài đặt: npm install jwt-decode

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

    // User state
    const [currentUser, setCurrentUser] = useState({
        id: null,
        Role: null,
        Email: ''
    });

    // States cho Edit Form
    const [showEditForm, setShowEditForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Decode token để lấy user info
    useEffect(() => {
        const getUserFromToken = () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Decode token để lấy thông tin user
                    const decoded = jwtDecode(token);
                    console.log('Decoded token:', decoded);

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

    // Fetch project details và tasks
    const fetchProjectDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Fetch project info
            const projectResponse = await projectService.getProject(id);
            console.log('🔍 Project Response:', projectResponse);

            if (projectResponse.success) {
                const projectData = projectResponse.project || projectResponse.data;
                console.log('📊 Project Data:', projectData);
                console.log('📊 Total Tasks:', projectData?.total_tasks);
                console.log('📊 Completed Tasks:', projectData?.completed_tasks);

                // Tìm role của current user trong project
                if (projectData.ProjectMembers && currentUser.id) {
                    const userMember = projectData.ProjectMembers.find(
                        member => member.id === currentUser.id
                    );
                    projectData.currentUserRole = userMember?.role || null;
                }

                setProject(projectData);
            }

            // 2. Fetch tasks
            try {
                const tasksResponse = await taskService.getTasks({
                    project_id: id,
                    limit: 100
                });

                console.log('✅ Tasks Response:', tasksResponse);

                if (tasksResponse.success) {
                    setTasks(tasksResponse.tasks || tasksResponse.data || []);
                } else if (tasksResponse.tasks) {
                    setTasks(tasksResponse.tasks);
                } else {
                    setTasks([]);
                }

                console.log('✅ Total tasks loaded:', (tasksResponse.tasks || []).length);
            } catch (taskError) {
                console.warn('⚠️ Cannot fetch tasks:', taskError);
                const fallbackTasks = projectResponse.projects?.Tasks ||
                    projectResponse.projects?.tasks ||
                    [];
                setTasks(fallbackTasks);
                console.log('📦 Using fallback tasks:', fallbackTasks.length);
            }

        } catch (err) {
            console.error('❌ Error fetching project:', err);
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

    // Lấy role của user hiện tại trong project
    const getCurrentUserRole = () => {
        if (!project) return null;

        // Nếu đã có currentUserRole từ backend
        if (project.currentUserRole) return project.currentUserRole;

        // Fallback: tìm trong ProjectMembers
        if (project.ProjectMembers && currentUser.id) {
            const userMember = project.ProjectMembers.find(
                member => member.id === currentUser.id
            );
            return userMember?.role || 'Không có vai trò';
        }

        return 'Không có vai trò';
    };

    // Format role name
    const formatRoleName = (role) => {
        const roleNames = {
            'lead': 'Quản lý',
            'member': 'Thành viên',
            'viewer': 'Xem chỉ đọc',
            'admin': 'Quản trị viên'
        };
        return roleNames[role] || role;
    };

    // Kiểm tra permission
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
            tasks.length ||
            0;

        const completed = parseInt(project.completed_tasks) ||
            parseInt(project.completedTasks) ||
            tasks.filter(t => t.Status === 'finish').length ||
            0;

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
                return true;
            });
        }

        if (taskSearch) {
            filtered = filtered.filter(task =>
                task.Name?.toLowerCase().includes(taskSearch.toLowerCase()) ||
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
    const handleEdit = () => {
        setShowEditForm(true);
    };

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

    const handleAddMembers = () => {
        navigate(`/projects/${id}/add-members`);
    };

    const handleCreateTask = () => {
        navigate(`/projects/${id}/tasks/create`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin dự án...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !project) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error || 'Không tìm thấy dự án'}</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const completionRate = getCompletionRate();
    const filteredTasks = getFilteredTasks();
    const currentUserRole = getCurrentUserRole();

    // Render Edit Form Modal
    if (showEditForm) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/projects')}
                                className="p-2 bg-gray-200  border rounded-lg hover:bg-blue-500  transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-blue-500 hover:text-white" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{project.Name}</h1>
                                <p className="text-sm text-gray-500 mt-1">Quản lý: {getManagerName()}</p>
                                <span className="text-gray-400">•</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    currentUserRole === 'lead' || currentUser.Role === 'admin'
                                        ? 'bg-purple-100 text-purple-700'
                                        : currentUserRole === 'member'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                }`}>
                                        {formatRoleName(currentUserRole)}
                                    </span>
                                {currentUser.Role === 'admin' && (
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                            Admin
                                        </span>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Status Alert */}
                {isOverdue() && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                        <div>
                            <p className="font-semibold text-red-800">Dự án đã quá hạn!</p>
                            <p className="text-sm text-red-600">
                                Hạn chót: {formatDate(project.End_date)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className=" bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`m-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                                    activeTab === 'overview'
                                        ? ' bg-blue-500 text-white'
                                        : ' bg-gray-200 text-blue-500 hover:text-white hover:bg-blue-500'
                                }`}
                            >
                                <div className="flex items-center">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Tổng quan
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('tasks')}
                                className={` m-2 py-4 px-2 border-b-2 font-medium transition-colors ${
                                    activeTab === 'tasks'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-blue-500 hover:text-white hover:bg-blue-500'
                                }`}
                            >
                                <div className="flex items-center">
                                    <ListTodo className="w-4 h-4 mr-2" />
                                    Danh sách Tasks ({tasks.length})
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">

                        {activeTab === 'overview' ? (
                            <div className="space-y-6">
                                <div className="mb-5 flex items-end justify-end space-x-3">
                                    {permissions.canAddMembers && (
                                        <button
                                            onClick={handleAddMembers}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Thêm thành viên
                                        </button>
                                    )}

                                    {permissions.canEdit && (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            disabled={isSubmitting}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Chỉnh sửa
                                        </button>
                                    )}

                                    {permissions.canDelete && (
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={deletingId === id}
                                        >
                                            {deletingId === id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Đang xóa...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Xóa
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {/* Progress Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                                            <h3 className="text-lg font-semibold text-gray-800">Tiến độ hoàn thành</h3>
                                        </div>
                                        <span className="text-3xl font-bold text-blue-600">{completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(completionRate)}`}
                                            style={{ width: `${completionRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <Clock className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {project.total_tasks || project.totalTasks || tasks.length || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">Tổng tasks</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {project.completed_tasks ||
                                                project.completedTasks ||
                                                tasks.filter(t => t.Status === 'finish').length ||
                                                0}
                                        </p>
                                        <p className="text-sm text-gray-600">Hoàn thành</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <Target className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {project.in_progress_tasks ||
                                                project.inProgressTasks ||
                                                tasks.filter(t => t.Status === 'doing').length ||
                                                0}
                                        </p>
                                        <p className="text-sm text-gray-600">Đang thực hiện</p>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <p className="text-2xl font-bold text-gray-800">
                                            {project.not_finish_tasks ||
                                                project.notFinishTasks ||
                                                tasks.filter(t => t.Status === 'initial').length ||
                                                0}
                                        </p>
                                        <p className="text-sm text-gray-600">Chưa hoàn thành</p>
                                    </div>
                                </div>

                                {/* Project Information */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin dự án</h3>
                                    <div className="space-y-4">
                                        {project.Description && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">Mô tả</p>
                                                <p className="text-gray-800">{project.Description}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">Ngày bắt đầu</p>
                                                <div className="flex items-center text-gray-800">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                    {formatDate(project.Start_date)}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1">Ngày kết thúc</p>
                                                <div className="flex items-center text-gray-800">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                                    {formatDate(project.End_date)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                {project.ProjectMembers && project.ProjectMembers.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <Users className="w-5 h-5 mr-2" />
                                            Thành viên dự án ({project.ProjectMembers.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {project.ProjectMembers.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium mr-3">
                                                        {member.FirstName.charAt(0)}{member.LastName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {member.FirstName} {member.LastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{member.Email}</p>

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
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm task..."
                                            value={taskSearch}
                                            onChange={(e) => setTaskSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <select
                                            value={taskFilter}
                                            onChange={(e) => setTaskFilter(e.target.value)}
                                            className="px-4 py-2 border bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">Tất cả trạng thái</option>
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="doing">Đang thực hiện</option>
                                            <option value="initial">khởi tạo</option>
                                            <option value="finish">Hoàn thành</option>
                                        </select>

                                        <button
                                            onClick={handleCreateTask}
                                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Tạo Task
                                        </button>
                                    </div>
                                </div>

                                {/* Tasks List */}
                                {filteredTasks.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">
                                            {taskSearch || taskFilter !== 'all'
                                                ? 'Không tìm thấy task phù hợp'
                                                : 'Chưa có task nào'}
                                        </p>
                                        {!taskSearch && taskFilter === 'all' && (
                                            <button
                                                onClick={handleCreateTask}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Tạo Task đầu tiên
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-800 mb-1">{task.TaskName}</h4>
                                                        {task.Description && (
                                                            <p className="text-sm text-gray-600 line-clamp-2">{task.Description}</p>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex flex-col items-end gap-2">
                                                        {getStatusBadge(task.Status)}
                                                        {task.Priority && getPriorityBadge(task.Priority)}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center space-x-4">
                                                        {task.End_date && (
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                <span>Hạn: {formatDate(task.End_date)}</span>
                                                            </div>
                                                        )}
                                                        {task.TaskMembers.map((member) => (
                                                            <div key={member.id} className="bg-gray-300 px-3 py-1 rounded">
                                                                {member.FirstName} {member.LastName}
                                                            </div>
                                                        ))}
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