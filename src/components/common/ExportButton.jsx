import React, { useState } from 'react';
import taskService from '../../services/taskService';

const ExportButton = ({ filters = {} }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const blob = await taskService.exportTasks(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Lỗi xuất file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
    >
      {loading ? 'Đang xuất...' : 'Xuất Excel'}
    </button>
  );
};

export default ExportButton;