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
      setTasks(data.tasks || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message);
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