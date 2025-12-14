import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/task/TaskForm';
import taskService from '../services/taskService';

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    console.log('Data nhận được:', formData);
    setLoading(true);
    setError(null);
    try {
      await taskService.createTask(formData);
      alert('Tạo task thành công!');
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tạo Task Mới</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <p>Đang tạo task...</p>
      ) : (
        <TaskForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
        />
      )}
    </div>
  );
};

export default CreateTaskPage;