// src/pages/EditTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/task/TaskForm';
import taskService from '../services/taskService';
import projectService from '../services/projectService';
import TASK_ROUTES from '../routes/taskRoutes';

const EditTaskPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [task, setTask] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await taskService.getTaskById(id);
                const taskData = data.task || data;
                setTask(taskData);
            } catch (err) {
                console.error('Lỗi khi tải task:', err);
            }
        };
        fetchTask();
    }, [id]);

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
            await taskService.updateTask(id, formData);
            alert('Cập nhật task thành công!');
            navigate(TASK_ROUTES.LIST);
        } catch (err) {
            alert('Lỗi: ' + err.message);
        }
    };

    if (!task) return null;

    return (
        <>
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Task</h1>
                </div>
            </div>

            <TaskForm
                initialData={task}
                projects={projects}
                onSubmit={handleSubmit}
                onCancel={() => navigate(TASK_ROUTES.LIST)}
            />
        </>
    );
};

export default EditTaskPage;