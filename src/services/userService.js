import axios from 'axios';

import { API_BASE_URL } from '../utils/constants';
import {tokenStore} from "../utils/api.js";

const API_URL = API_BASE_URL;

// Tạo axios instance với config mặc định
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = tokenStore.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và error
axiosInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

const userService = {
    /**
     * GET /api/users/
     * Lấy danh sách tất cả users (Admin only)
     */
    getAllUsers: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get('/users');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * GET /api/users/profile
     * Lấy thông tin profile của user hiện tại
     */
    getProfile: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get('/users/profile');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * PATCH /api/users/profile
     * Cập nhật thông tin profile của user hiện tại
     * @param {Object} data - { FirstName, LastName, avatar }
     */
    updateProfile: async (data) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.patch('/users/profile', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * GET /api/users/lookup
     * Lấy danh sách users để lookup (chỉ id, tên, avatar)
     */
    getUsersLookup: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get('/users/lookup');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * PATCH /api/users/:id/role
     * Admin thay đổi role của user khác
     * @param {number} userId - ID của user cần thay đổi role
     * @param {string} role - 'admin' hoặc 'user'
     */
    updateUserRole: async (userId, role) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.patch(`/users/${userId}/role`, {
                Role: role
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Helper: Kiểm tra user có phải admin không
     */
    isAdmin: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                return false;
            }

            // Decode JWT token
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token in isAdmin:', payload); // Debug log
            console.log('Role from token:', payload.Role); // Debug log

            return payload.Role === 'admin'; // Chú ý: 'Role' với R hoa
        } catch (error) {
            console.error('Error in isAdmin:', error);
            return false;
        }
    },

    /**
     * Helper: Format user name
     * @param {Object} user - User object với FirstName và LastName
     */
    getFullName: (user) => {
        if (!user) return '';
        return `${user.FirstName || ''} ${user.LastName || ''}`.trim();
    },

    /**
     * Helper: Get user initials for avatar
     * @param {Object} user - User object với FirstName và LastName
     */
    getUserInitials: (user) => {
        if (!user) return '';
        const firstInitial = user.FirstName?.charAt(0) || '';
        const lastInitial = user.LastName?.charAt(0) || '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    },
};

export default userService;