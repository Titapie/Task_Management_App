import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    RefreshCw,
    Shield,
    User,
    Loader2,
    AlertCircle,
    Edit,
    X,
    Save,
    Crown,
    UserCheck
} from 'lucide-react';
import userService from '../../services/userService';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'user'
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState('');
    const [savingRole, setSavingRole] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getAllUsers();

            if (response.success) {
                setUsers(response.data || []);
            }
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users
    const getFilteredUsers = () => {
        let filtered = users;

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.Role === roleFilter);
        }

        // Filter by search
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.FirstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.LastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.Email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    // Handle edit role
    const handleEditRole = (user) => {
        setEditingUserId(user.id);
        setEditingRole(user.Role);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditingRole('');
    };

    const handleSaveRole = async (userId) => {
        if (!editingRole) return;

        try {
            setSavingRole(true);
            const response = await userService.updateUserRole(userId, editingRole);

            if (response.success) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, Role: editingRole } : user
                ));
                setEditingUserId(null);
                setEditingRole('');
                alert('Cập nhật role thành công!');
            }
        } catch (err) {
            alert(err.message || 'Không thể cập nhật role');
        } finally {
            setSavingRole(false);
        }
    };

    // Calculate stats
    const stats = {
        total: users.length,
        admins: users.filter(u => u.Role === 'admin').length,
        regularUsers: users.filter(u => u.Role === 'user').length
    };

    const filteredUsers = getFilteredUsers();

    // Get role badge
    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                <User className="w-3 h-3 mr-1" />
                User
            </span>
        );
    };

    // Get user avatar/initials
    const getUserAvatar = (user) => {
        const initials = userService.getUserInitials(user);

        if (user.avatar) {
            return (
                <img
                    src={user.avatar}
                    alt={userService.getFullName(user)}
                    className="w-10 h-10 rounded-full object-cover"
                />
            );
        }

        return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                {initials}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải danh sách users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Có lỗi xảy ra</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Users</h1>
                            <p className="text-gray-600 mt-1">
                                Tổng số: {stats.total} users
                            </p>
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng Users</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Admins</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.admins}</p>
                                </div>
                                <Crown className="w-12 h-12 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Regular Users</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.regularUsers}</p>
                                </div>
                                <UserCheck className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Role Filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tất cả roles</option>
                                <option value="admin">Chỉ Admin</option>
                                <option value="user">Chỉ User</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Không tìm thấy user
                        </h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        {/* User Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getUserAvatar(user)}
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {userService.getFullName(user)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.Email}</div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingUserId === user.id ? (
                                                <select
                                                    value={editingRole}
                                                    onChange={(e) => setEditingRole(e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                    disabled={savingRole}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                getRoleBadge(user.Role)
                                            )}
                                        </td>

                                        {/* Created Date */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '-'}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {editingUserId === user.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleSaveRole(user.id)}
                                                        disabled={savingRole}
                                                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    >
                                                        {savingRole ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4 mr-1" />
                                                                Lưu
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        disabled={savingRole}
                                                        className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditRole(user)}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Sửa Role
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;