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
    UserCheck,
    Mail,
    Calendar,
    ChevronDown,
    Filter
} from 'lucide-react';
import userService from '../../services/userService';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'user'

    // Modal state
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
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

    // Handle open role modal
    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.Role);
        setShowRoleModal(true);
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowRoleModal(false);
        setSelectedUser(null);
        setNewRole('');
    };

    // Handle save role
    const handleSaveRole = async () => {
        if (!selectedUser || !newRole) return;

        try {
            setSavingRole(true);
            const response = await userService.updateUserRole(selectedUser.id, newRole);

            if (response.success) {
                // Update local state
                setUsers(users.map(user =>
                    user.id === selectedUser.id ? { ...user, Role: newRole } : user
                ));
                handleCloseModal();
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
                <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                    <Crown className="w-4 h-4 mr-1" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                <User className="w-4 h-4 mr-1" />
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
                    className="w-12 h-12 rounded-full object-cover"
                />
            );
        }

        return (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {initials}
            </div>
        );
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('vi-VN');
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
        <div className="h-full bg-gray-50 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý Users</h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý thông tin và phân quyền người dùng
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
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tổng Users</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                                <Users className="w-12 h-12 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Admins</p>
                                    <p className="text-3xl font-bold text-gray-800">{stats.admins}</p>
                                </div>
                                <Crown className="w-12 h-12 text-purple-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
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
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                >
                                    <option value="all">Tất cả roles</option>
                                    <option value="admin">Chỉ Admin</option>
                                    <option value="user">Chỉ User</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                            </div>
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
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                {user.Email}
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(user.Role)}
                                        </td>

                                        {/* Created Date */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {formatDate(user.created_at)}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleOpenRoleModal(user)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Shield className="w-4 h-4 mr-2" />
                                                Đổi Role
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Role Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <Shield className="w-6 h-6 text-blue-600 mr-3" />
                                <h2 className="text-xl font-bold text-gray-900">Thay đổi Role</h2>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                disabled={savingRole}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* User Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center mb-3">
                                    {getUserAvatar(selectedUser)}
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">
                                            {userService.getFullName(selectedUser)}
                                        </p>
                                        <p className="text-sm text-gray-500">{selectedUser.Email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Role hiện tại:</span>
                                    {getRoleBadge(selectedUser.Role)}
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Chọn role mới
                                </label>
                                <div className="space-y-3">
                                    {/* User Option */}
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        newRole === 'user'
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="user"
                                            checked={newRole === 'user'}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                            disabled={savingRole}
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center">
                                                <User className="w-5 h-5 text-blue-600 mr-2" />
                                                <span className="font-medium text-gray-900">User</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quyền cơ bản, có thể quản lý tasks và projects được giao
                                            </p>
                                        </div>
                                    </label>

                                    {/* Admin Option */}
                                    <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        newRole === 'admin'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="admin"
                                            checked={newRole === 'admin'}
                                            onChange={(e) => setNewRole(e.target.value)}
                                            className="w-4 h-4 text-purple-600"
                                            disabled={savingRole}
                                        />
                                        <div className="ml-3 flex-1">
                                            <div className="flex items-center">
                                                <Crown className="w-5 h-5 text-purple-600 mr-2" />
                                                <span className="font-medium text-gray-900">Admin</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quyền quản trị, truy cập đầy đủ và quản lý hệ thống
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Warning */}
                            {newRole !== selectedUser.Role && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-yellow-800">
                                            <p className="font-medium mb-1">Lưu ý:</p>
                                            <p>
                                                Thay đổi role sẽ ảnh hưởng đến quyền truy cập của user.
                                                Vui lòng xác nhận trước khi lưu.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                            <button
                                onClick={handleCloseModal}
                                disabled={savingRole}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSaveRole}
                                disabled={savingRole || newRole === selectedUser.Role}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {savingRole ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;