import axios from "axios";

let process;
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

const statsService = {
    getOverview: async () => {
        try {
            const response = await axiosInstance.get(`/stat/overview`);
            return response.data;
        }catch (error) {
            throw error.response?.data||{
                success: false,
                message: 'error when getting overview',
            };
        }
    },
    getProgressChart: async (period = 'week') => {
        try{
            const periodValid = ['week', 'month', 'year'];
            if (!periodValid.includes(period)) {
                throw new Error('period must be week, month, year');
            }
            const response = await axiosInstance.get(`/stat/progress_chart`, {params: {period},});
            return response.data;
        }catch (error) {
            throw error.response?.data ||{
                success: false,
                error: 'error when getting progress chart',
            };
        }
    },
    getTaskStatus: async () => {
        try{
            const response = await axiosInstance.get(`/stat/task_status`);
            return response.data;
        }catch (error) {
            throw error.response?.data ||{
                success: false,
                message: 'error when getting task status',
            };
        }
    },
    getProjectSummary: async () => {
        try{
            const response = await axiosInstance.get(`/stat/project_summary`);
            return response.data;
        }catch (error) {
            throw error.response?.data ||{
                success: false,
                message: 'error when getting project summary',
            };
        }
    },
    getUserPerformance: async () => {
        try {
            const response = await axiosInstance.get(`/stat/user_performance`);
            return response.data;
        }catch (error) {
            if (error.response?.status === 403) {
                throw {
                    success: false,
                    message: 'error connection refuse',
                    statusCode: 403,
                }
            }
            throw error.response?.data ||{
                success: false,
                message: 'error when get user performance',
            };
        }
    },
};
export default statsService;