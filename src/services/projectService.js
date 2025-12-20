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

    //Lấy danh sách tất cả projects
    getProjects: async (params = {}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get('/projects', { params });
            return response;
        } catch (error) {
            throw error;
        }
    },


    //Lấy chi tiết một project
    getProject: async (id) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    //Tạo project mới
    createProject: async (data) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.post('/projects/create', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    //Cập nhật thông tin project
    updateProject: async (id, data) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.patch(`/projects/${id}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    //Xóa project (soft delete)
    deleteProject: async (id) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await axiosInstance.delete(`/projects/${id}`);
            return response;
        } catch (error) {
            throw error;
        }
    },


    //Thêm thành viên vào project

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

    //Lấy danh sách projects với filter và sort nâng cao
    getFilteredProjects: async (options = {}) => {
        const {
            search = '',
            startFrom = '',
            endTo = '',
            managerId = '',
            sortBy = '',
            sortOrder = 'ASC',
            page = 1,
            limit = 10,
        } = options;

        const params = {};

        if (search) params.search = search;
        if (startFrom) params.start_from = startFrom;
        if (endTo) params.end_to = endTo;
        if (managerId) params.manager_id = managerId;
        if (sortBy) {
            params.sortKey = sortBy;
            params.sortValue = sortOrder;
        }
        params.page = page;
        params.limit = limit;

        return await projectService.getProjects(params);
    },

    //Lấy statistics của project
    getProjectStats: async (id) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await projectService.getProject(id);
            const project = response.project;

            // Tính toán thêm statistics nếu cần
            const stats = {
                totalMembers: project.ProjectMembers?.length || 0,
                managerName: project.manager_name || 'Không có',
                projectInfo: {
                    name: project.Name,
                    description: project.Description,
                    startDate: project.Start_date,
                    endDate: project.End_date,
                },
            };

            return { ...response, stats };
        } catch (error) {
            throw error;
        }
    },

};

export default projectService;