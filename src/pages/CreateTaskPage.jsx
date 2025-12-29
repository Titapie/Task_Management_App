// src/pages/CreateTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/task/TaskForm';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import TASK_ROUTES from '../routes/taskRoutes';

const CreateTaskPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectService.getAllProjectsNoPagination();
                setProjects(response.projects || response.data || []);
            } catch (err) {
                console.error('Lỗi khi tải danh sách dự án:', err);
            }
        };
        fetchProjects();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            await taskService.createTask(formData);
            alert('Tạo task thành công!');
            navigate(TASK_ROUTES.LIST);
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 animate-fade-in">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo Task Mới</h1>
                </div>
            </div>

            <TaskForm
                projects={projects}
                onSubmit={handleSubmit}
                onCancel={() => navigate(TASK_ROUTES.LIST)}
            />
        </>
    );
};

export default CreateTaskPage;