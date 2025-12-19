// src/pages/TaskDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskDetail from '../components/task/TaskDetail';
import taskService from '../services/taskService';

const TaskDetailPage = () => {
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
                setTask(data.task || data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleEdit = () => {
        navigate(`/tasks/edit/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa task này?')) {
            try {
                await taskService.deleteTask(id);
                alert('Xóa task thành công!');
                navigate('/tasks');
            } catch (err) {
                alert('Lỗi: ' + err.message);
            }
        }
    };

    if (loading) return <p className="p-6">Đang tải...</p>;
    if (error) return <p className="p-6 text-red-500">Lỗi: {error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <TaskDetail
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TaskDetailPage;