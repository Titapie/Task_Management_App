// services/statsService.js
import { API_BASE_URL } from '../utils/constants';
import { tokenStore } from '../utils/api';
class StatsService {
    constructor() {
        this.baseURL = API_BASE_URL || 'http://localhost:5000/api';
    }

    // Helper method để thêm authorization header
    getHeaders() {
        const token = tokenStore.getAccessToken();
        if (!token) {
            console.warn('No token found in localStorage');
            throw new Error('No authentication token found');
        }

        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Helper method xử lý response
    async handleResponse(response) {
        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('token');
                throw new Error('Authentication failed. Please login again.');
            }
            if (response.status === 403) {
                throw new Error('Access denied. Admin permission required.');
            }
            if (response.status === 404) {
                // API không tồn tại, trả về null để dùng fallback
                return null;
            }

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Kiểm tra cấu trúc response từ backend của bạn
        if (data.success !== undefined && !data.success) {
            throw new Error(data.message || 'Request failed');
        }

        // Trả về dữ liệu thực tế
        return data.data || data.overview || data.stats || data;
    }


    //GET /api/stats/overview - Giữ lại cho user thường (nếu cần)
    async getOverview() {
        try {
            const response = await fetch(`${this.baseURL}/stats/overview`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.warn('No overview API, using fallback:', error.message);
            // Fallback đơn giản cho user
            return {
                myTasks: 0,
                completedTasks: 0,
                myProjects: 0
            };
        }
    }

    //  GET /api/stats/progress-chart (giữ nguyên)
    async getProgressChart(period = 'month') {
        try {
            console.log(`Fetching progress chart for period: ${period}`);

            const response = await fetch(
                `${this.baseURL}/stats/progress-chart?period=${period}`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            if (!response.ok) {
                console.warn(`API returned status ${response.status}, using mock data`);
            }

            const result = await response.json();

            // Xử lý response structure
            let data = null;

            // Trường hợp 1: {success: true, data: {labels, created, completed}}
            if (result.success && result.data) {
                data = result.data;
            }
            // Trường hợp 2: {data: {labels, created, completed}}
            else if (result.data && result.data.labels) {
                data = result.data;
            }
            // Trường hợp 3: {labels, created, completed}
            else if (result.labels) {
                data = result;
            }

            // Kiểm tra data hợp lệ
            if (data && data.labels && data.created && data.completed) {
                return data;
            }

        } catch (error) {
            console.error('Error in getProgressChart:', error);
        }
    }

    // GET /api/stats/task-status (giữ nguyên + fallback)
    async getTaskStatusStats() {
        try {
            const response = await fetch(`${this.baseURL}/stats/task-status`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);
            return data || {

                inProgress: 0,
                pending: 0,
            };

        } catch (error) {
            console.warn('Using mock data for task status:', error.message);
            return {
                completed: 25,
                inProgress: 15,
                pending: 5
            };
        }
    }

    // GET /api/stats/project-summary (giữ nguyên + fallback)
    async getProjectSummary() {
        try {
            const response = await fetch(`${this.baseURL}/stats/project-summary`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await this.handleResponse(response);

            // Nếu API tồn tại, thêm totalProjects nếu chưa có
            if (data) {
                return {
                    total: data.total || data.totalProjects || 0,
                    active: data.active || 0,
                    completed: data.completed || 0,
                    onHold: data.onHold || 0,
                    overdue: data.overdue || 0,
                    ...data
                };
            }

            // Nếu API không tồn tại, tính toán từ getAllProjects
            const allProjects = await this.getAllProjects();
            const today = new Date();

            const projectSummary = {
                total: allProjects.length,
                active: 0,
                completed: 0,
                onHold: 0,
                overdue: 0
            };

            allProjects.forEach(project => {
                if (project.status === 'completed' || project.Status === 'finish') {
                    projectSummary.completed++;
                } else if (project.status === 'onHold' || project.Status === 'pending') {
                    projectSummary.onHold++;
                } else if (project.End_date && new Date(project.End_date) < today) {
                    projectSummary.overdue++;
                } else {
                    projectSummary.active++;
                }
            });

            return projectSummary;

        } catch (error) {
            console.warn('Using mock data for project summary:', error.message);
            return {
                total: 18,
                active: 10,
                completed: 5,
                onHold: 2,
                overdue: 1
            };
        }
    }

    //GET /api/stats/user-performance (Admin only)
    async getUserPerformance() {
        try {
            const response = await fetch(`${this.baseURL}/stats/user-performance`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            // Xử lý response từ API
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch user performance');
            }

            const users = data.stats || data.data || [];

            // Format data theo cấu trúc AdminDashboard cần
            return users.map(user => ({
                userId: user.id,
                userName: `${user.FirstName || ''} ${user.LastName || ''}`.trim() || 'Unknown',
                userEmail: user.Email,
                completedTasks: user.tasks_completed || 0,
                inProgressTasks: Math.max(0, (user.tasks_created || 0) - (user.tasks_completed || 0)),
                totalTasks: (user.tasks_created || 0) + (user.task_assigned || 0),
            })).sort((a, b) => b.completedTasks - a.completedTasks); // Sort by completed tasks descending
        } catch (error) {
            console.error('Error fetching user performance stats:', error);
        }
    }

    async getAllProjects() {
        try {
            const response = await fetch(`${this.baseURL}/api/projects`, {
                method: 'GET',
                headers: this.getHeaders()
            });
            const data = await response.json();
            return data.data || data.projects || [];
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        }
    }

}
export default new StatsService();