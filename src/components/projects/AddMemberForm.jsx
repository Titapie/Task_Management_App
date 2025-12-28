// AddMembersForm.jsx - Fixed Admin Filter
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import projectService from '../../services/projectService';
import userService from '../../services/userService';

const AddMembersForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // States
    const [project, setProject] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [currentMembers, setCurrentMembers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [roleAssignments, setRoleAssignments] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Available roles based on backend
    const availableRoles = [
        { value: 'member', label: 'Thành viên', description: 'Có thể tham gia và hoàn thành tasks' },
        { value: 'viewer', label: 'Người xem', description: 'Chỉ xem, không thể chỉnh sửa' }
    ];

    // Helper function to check if user is admin
    // Since Role field is not returned by getUsersLookup API,
    // we filter by FirstName containing "Admin"
    const isAdmin = (user) => {
        if (!user) return false;

        // Check if Role field exists (from getAllUsers API)
        if (user.Role) {
            const role = user.Role.toLowerCase();
            return role.includes('admin');
        }

        // Fallback: Check FirstName or LastName contains "Admin"
        const firstName = (user.FirstName || '').toLowerCase();
        const lastName = (user.LastName || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`;

        return fullName.includes('admin');
    };

    // Fetch project details and all users
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch project details
                const projectResponse = await projectService.getProject(id);
                if (projectResponse.success) {
                    const projectData = projectResponse.project || projectResponse.data;
                    setProject(projectData);

                    // Extract current members (excluding manager)
                    const members = projectData.ProjectMembers || [];
                    setCurrentMembers(members);

                    // Initialize role assignments for current members
                    const initialRoles = {};
                    members.forEach(member => {
                        if (member.id !== projectData.Manager_id) {
                            initialRoles[member.id] = member.role || 'member';
                        }
                    });
                    setRoleAssignments(initialRoles);
                }

                // Fetch all users for selection
                const usersResponse = await userService.getUsersLookup();
                let usersList = [];

                if (usersResponse.success) {
                    usersList = usersResponse.users || usersResponse.data || [];

                    // Fetch full details (Email, Role) for each user
                    console.log('Fetching full details for', usersList.length, 'users...');
                    const usersWithDetails = await Promise.all(
                        usersList.map(async (user) => {
                            try {
                                // Fetch full user details by ID
                                const detailResponse = await userService.getUser(user.id);
                                if (detailResponse.success) {
                                    const fullUser = detailResponse.user || detailResponse.data;
                                    return {
                                        ...user,
                                        Email: fullUser.Email,
                                        Role: fullUser.Role
                                    };
                                }
                                return user;
                            } catch (err) {
                                console.error(`Failed to fetch details for user ${user.id}:`, err);
                                return user;
                            }
                        })
                    );

                    usersList = usersWithDetails;
                    console.log('Users with full details:', usersList.length);
                } else {
                    // Fallback: get all users
                    const allUsersResp = await userService.getAllUsers();
                    if (allUsersResp.success) {
                        usersList = allUsersResp.users || allUsersResp.data || [];
                    }
                }

                // Lọc bỏ users có role là 'admin' (case-insensitive)
                const filteredUsers = usersList.filter(user => !isAdmin(user));

                console.log('All users:', usersList.length);
                console.log('Filtered users (non-admin):', filteredUsers.length);
                console.log('Admin users filtered out:', usersList.filter(user => isAdmin(user)).length);

                setAllUsers(filteredUsers);

            } catch (err) {
                setError(err.message || 'Không thể tải dữ liệu');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Filter users that are not currently members (excluding manager và admin)
    const getAvailableUsers = () => {
        if (!project || !allUsers.length) return [];

        const currentMemberIds = new Set(currentMembers.map(member => member.id));
        const managerId = project.Manager_id;

        const available = allUsers.filter(user => {
            // Exclude manager
            if (user.id === managerId) return false;

            // Exclude admin users (double-check with case-insensitive)
            if (isAdmin(user)) return false;

            // Exclude current members
            if (currentMemberIds.has(user.id)) return false;

            return true;
        });

        console.log('Available users to add:', available.length);
        return available;
    };

    // Filter users based on search term
    const getFilteredAvailableUsers = () => {
        const available = getAvailableUsers();
        if (!searchTerm.trim()) return available;

        const term = searchTerm.toLowerCase();
        return available.filter(user =>
            user.FirstName?.toLowerCase().includes(term) ||
            user.LastName?.toLowerCase().includes(term) ||
            user.Email?.toLowerCase().includes(term)
        );
    };

    // Add user to selection
    const handleAddUser = (userId) => {
        if (!selectedUsers.includes(userId)) {
            setSelectedUsers([...selectedUsers, userId]);
            // Set default role to 'member'
            setRoleAssignments({
                ...roleAssignments,
                [userId]: 'member'
            });
        }
    };

    // Remove user from selection
    const handleRemoveUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(id => id !== userId));

        // Remove role assignment
        const newRoles = { ...roleAssignments };
        delete newRoles[userId];
        setRoleAssignments(newRoles);
    };

    // Update role for a user
    const handleRoleChange = (userId, role) => {
        setRoleAssignments({
            ...roleAssignments,
            [userId]: role
        });
    };

    // Get user info by ID
    const getUserById = (userId) => {
        return allUsers.find(user => user.id === userId);
    };

    // Format user name
    const formatUserName = (user) => {
        if (!user) return '';
        return `${user.FirstName || ''} ${user.LastName || ''}`.trim();
    };

    // Get user initials for avatar
    const getUserInitials = (user) => {
        if (!user) return '';
        const firstInitial = user.FirstName?.charAt(0) || '';
        const lastInitial = user.LastName?.charAt(0) || '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    // Get user role badge
    const getUserRoleBadge = (user) => {
        if (!user) return null;

        const roleKey = user.Role?.toLowerCase() || 'user';
        const badges = {
            admin: { bg: 'bg-red-100', text: 'text-red-700', label: 'Admin' },
            user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'User' }
        };

        const badge = badges[roleKey] || { bg: 'bg-gray-100', text: 'text-gray-700', label: user.Role };

        return (
            <span className={`px-2 py-1 ${badge.bg} ${badge.text} text-xs font-medium rounded ml-2`}>
                {badge.label}
            </span>
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedUsers.length === 0) {
            alert('Vui lòng chọn ít nhất một thành viên để thêm');
            return;
        }

        // Prepare data according to backend format
        const members = selectedUsers.map(userId => ({
            member_id: userId,
            role: roleAssignments[userId] || 'member'
        }));

        try {
            setSubmitting(true);
            setError(null);

            const response = await projectService.addMembers(id, members);

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/projects/${id}`);
                }, 1500);
            } else {
                throw new Error(response.message || 'Không thể thêm thành viên');
            }
        } catch (err) {
            console.error('Error adding members:', err);
            setError(err.message || 'Đã xảy ra lỗi khi thêm thành viên');

            // Handle specific backend errors
            if (err.message.includes("lead")) {
                alert('Lỗi: Chỉ Manager mới có vai trò "lead". Vui lòng kiểm tra lại vai trò được gán.');
            } else if (err.message.includes("Member ID không tồn tại")) {
                alert('Lỗi: Một số thành viên không tồn tại trong hệ thống.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <LucideIcons.Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                        <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LucideIcons.AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate(`/projects/${id}`)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Quay lại dự án
                    </button>
                </div>
            </div>
        );
    }

    const availableUsers = getFilteredAvailableUsers();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Success Message */}
                {success && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 shadow-sm">
                        <div className="flex items-start gap-3">
                            <LucideIcons.CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-green-800">Thành công!</p>
                                <p className="text-sm text-green-600 mt-1">
                                    Đã thêm thành viên thành công. Đang chuyển hướng...
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Thêm thành viên vào dự án</h1>
                                    <p className="text-gray-600">
                                        {project?.Name || 'Đang tải...'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Manager/Lead: {project?.manager_name || 'Chưa có'}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(`/projects/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <LucideIcons.ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Selected Users Section */}
                    {selectedUsers.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <LucideIcons.Users className="w-5 h-5 text-blue-600" />
                                Thành viên đã chọn ({selectedUsers.length})
                            </h2>

                            <div className="space-y-4">
                                {selectedUsers.map(userId => {
                                    const user = getUserById(userId);
                                    if (!user) return null;

                                    return (
                                        <div key={userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {getUserInitials(user)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{formatUserName(user)}</p>
                                                    <p className="text-sm text-gray-500">{user.Email}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={roleAssignments[userId] || 'member'}
                                                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                                >
                                                    {availableRoles.map(role => (
                                                        <option key={role.value} value={role.value}>
                                                            {role.label}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveUser(userId)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <LucideIcons.X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Users Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <LucideIcons.Search className="w-5 h-5 text-blue-600" />
                            Chọn thành viên mới
                        </h2>

                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <LucideIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                            />
                        </div>

                        {/* Available Users List */}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {availableUsers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <LucideIcons.Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p>
                                        {searchTerm
                                            ? 'Không tìm thấy người dùng phù hợp'
                                            : 'Không có thành viên nào khả dụng để thêm'
                                        }
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        (Người dùng admin và thành viên hiện tại đã bị ẩn)
                                    </p>
                                </div>
                            ) : (
                                availableUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {getUserInitials(user)}
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <p className="font-medium text-gray-900">{formatUserName(user)}</p>
                                                </div>
                                                <p className="text-sm text-gray-500">{user.Email}</p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddUser(user.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                                        >
                                            <LucideIcons.Plus className="w-4 h-4" />
                                            Thêm
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Current Members Preview */}
                    {currentMembers.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <LucideIcons.Users className="w-5 h-5 text-green-600" />
                                Thành viên hiện tại ({currentMembers.length})
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {currentMembers.map(member => (
                                    <div key={member.id} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                            {getUserInitials(member)}
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-gray-900">{formatUserName(member)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {member.id === project?.Manager_id ? 'Lead' : member.role || 'member'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(`/projects/${id}`)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Hủy bỏ
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                                {selectedUsers.length} thành viên đã chọn
                            </span>
                            <button
                                type="submit"
                                disabled={submitting || selectedUsers.length === 0}
                                className={`px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl ${
                                    submitting || selectedUsers.length === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                                        Đang thêm...
                                    </span>
                                ) : (
                                    'Thêm thành viên'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMembersForm;