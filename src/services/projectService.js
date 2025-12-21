import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

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
        const token = localStorage.getItem('token');
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

const projectService = {

    // Lấy danh sách projects (cho cả user thường và admin)
    getProjects: async (params = {}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            // Thêm các tham số mặc định cho admin view
            const defaultParams = {
                limit: params.limit || 20,     // Mặc định 20 items mỗi trang
                page: params.page || 1,        // Mặc định trang 1
                ...params                       // Ghi đè bằng params truyền vào
            };

            const response = await axiosInstance.get('/projects', {
                params: defaultParams
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tất cả projects KHÔNG phân trang (dành cho admin/dropdown)
    getAllProjectsNoPagination: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            // Gửi limit lớn để lấy tất cả
            const response = await axiosInstance.get('/projects', {
                params: { limit: 1000 }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy chi tiết một project
    getProject: async (id) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tạo project mới
    createProject: async (data) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.post('/projects/create', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin project
    updateProject: async (id, data) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.patch(`/projects/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Xóa project (soft delete)
    deleteProject: async (id) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.delete(`/projects/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Thêm thành viên vào project
    addMembers: async (id, members) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.patch(`/projects/${id}/add-members`, {
                members,
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy projects với filter nâng cao (cho admin dashboard)
    getProjectsWithFilters: async (filters = {}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const {
                page = 1,
                limit = 20,
                search = '',
                manager_id = '',
                start_from = '',
                end_to = '',
                sortKey = 'created_at',
                sortValue = 'DESC'
            } = filters;

            const params = {
                page,
                limit,
                ...(search && { search }),
                ...(manager_id && { manager_id }),
                ...(start_from && { start_from }),
                ...(end_to && { end_to }),
                ...(sortKey && { sortKey }),
                ...(sortValue && { sortValue })
            };

            const response = await axiosInstance.get('/projects', { params });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy thống kê nhanh cho admin (tùy chọn)
    getAdminStats: async () => {
        // eslint-disable-next-line no-useless-catch
        try {
            // Có thể gọi endpoint stats từ backend nếu có
            const response = await axiosInstance.get('/stats/project-summary');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default projectService;