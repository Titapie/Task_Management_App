import { useState, useEffect } from 'react';
import taskService from '../services/taskService';

const useTasks = (initialParams = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchTasks = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(params);
      // FIX: Đảm bảo tasks luôn là array
      setTasks(Array.isArray(data.tasks) ? data.tasks : (Array.isArray(data) ? data : []));
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message);
      setTasks([]); // Set empty array khi lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(initialParams);
  }, []);

  const refetch = (params) => {
    fetchTasks(params);
  };

  return {
    tasks,
    loading,
    error,
    pagination,
    refetch
  };
};

export default useTasks;