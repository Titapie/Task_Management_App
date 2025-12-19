// services/statsService.js
import { API_BASE_URL } from '../utils/constants';

class StatsService {
    constructor() {
        this.baseURL = API_BASE_URL || 'http://localhost:5000/api';
    }

    // Helper method để thêm authorization header
    getHeaders() {
        const token = localStorage.getItem('token');
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
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                throw new Error('Authentication failed. Please login again.');
            }
            if (response.status === 403) {
                throw new Error('Access denied. Admin permission required.');
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

    // 1. GET /api/stats/overview
    async getOverview() {
        try {
            const response = await fetch(`${this.baseURL}/stats/overview`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching overview stats:', error);
            throw error;
        }
    }

    // 2. GET /api/stats/progress-chart
    async getProgressChart(period = 'month') {
        try {
            const validPeriods = ['week', 'month', 'year'];
            if (!validPeriods.includes(period)) {
                throw new Error('Invalid period. Must be "week", "month", or "year"');
            }

            const response = await fetch(
                `${this.baseURL}/stats/progress-chart?period=${period}`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching progress chart data:', error);
            throw error;
        }
    }

    // 3. GET /api/stats/task-status
    async getTaskStatusStats() {
        try {
            const response = await fetch(`${this.baseURL}/stats/task-status`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching task status stats:', error);
            throw error;
        }
    }

    // 4. GET /api/stats/project-summary
    async getProjectSummary() {
        try {
            const response = await fetch(`${this.baseURL}/stats/project-summary`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching project summary:', error);
            throw error;
        }
    }

    // 5. GET /api/stats/user-performance (Admin only)
    async getUserPerformance() {
        try {
            const response = await fetch(`${this.baseURL}/stats/user-performance`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching user performance stats:', error);
            throw error;
        }
    }

    // 6. Lấy tất cả thống kê cùng lúc
    async getAllStats(period = 'month') {
        try {
            const [overview, progressChart, taskStatus, projectSummary] = await Promise.all([
                this.getOverview(),
                this.getProgressChart(period),
                this.getTaskStatusStats(),
                this.getProjectSummary()
            ]);

            return {
                overview,
                progressChart,
                taskStatus,
                projectSummary
            };
        } catch (error) {
            console.error('Error fetching all stats:', error);
            throw error;
        }
    }
}

// Export singleton instance
export default new StatsService();