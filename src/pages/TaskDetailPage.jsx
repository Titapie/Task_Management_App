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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button 
                        onClick={() => navigate('/tasks')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách task
                    </button>
                </div>
            </div>
        );
    }

    return <TaskDetail task={task} onEdit={handleEdit} onDelete={handleDelete} />;
};

export default TaskDetailPage;