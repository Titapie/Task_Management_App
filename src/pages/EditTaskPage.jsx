// src/pages/EditTaskPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskForm from '../components/task/TaskForm';
import taskService from '../services/taskService';

const EditTaskPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await taskService.getTaskById(id);
                // Backend trả về {success, message, task}
                const taskData = data.task || data;
                console.log('Task data nhận được:', taskData); // Debug log
                setTask(taskData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            await taskService.updateTask(id, formData);
            alert('Cập nhật task thành công!');
            navigate('/tasks');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="p-6">Đang tải...</p>;
    if (error) return <p className="p-6 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Chỉnh sửa Task</h1>

            <TaskForm
                initialData={task}
                onSubmit={handleSubmit}
                onCancel={() => navigate('/tasks')}
            />
        </div>
    );
};

export default EditTaskPage;