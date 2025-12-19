// src/services/taskService.js
import { API_BASE_URL } from '../utils/constants';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const taskService = {
    // GET all tasks với filters, search, sort, pagination
    getTasks: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/tasks${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    // GET single task
    getTaskById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    // CREATE task
    createTask: async (taskData) => {
        const response = await fetch(`${API_BASE_URL}/tasks/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    // UPDATE task
    updateTask: async (id, taskData) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    // DELETE task
    deleteTask: async (id) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete task');
        return response.json();
    },

    // EXPORT tasks
    exportTasks: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/tasks/export${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to export tasks');
        return response.blob();
    },
    getUpcomingTasks: async () => {
        const response = await fetch(`${API_BASE_URL}/tasks/deadline-soon`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch upcoming tasks');
        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [];
    },

    // GET overdue tasks (quá hạn)
    getOverdueTasks: async () => {
        const response = await fetch(`${API_BASE_URL}/tasks/overdue`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch overdue tasks');
        const result = await response.json();
        return Array.isArray(result.data) ? result.data : [];
    },

    // GET recent tasks (công việc gần đây - sắp xếp theo updated_at)
    getRecentTasks: async (limit = 5) => {
        const params = {
            sortKey: 'updated_at',
            sortValue: 'DESC',
            limit: limit
        };

        const response = await fetch(`${API_BASE_URL}/tasks?${new URLSearchParams(params)}`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch recent tasks');

        const data = await response.json();
        return Array.isArray(data.tasks) ? data.tasks : [];
    }
};

export const updateTaskStatus = async (taskId, newStatus) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: newStatus }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Không thể cập nhật trạng thái');
    }

    return await response.json();
};

export default taskService;