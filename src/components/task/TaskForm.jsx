import React, { useState } from 'react';
import { TASK_STATUS, PRIORITY } from '../../utils/constants';

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    TaskName: initialData.Task_name || initialData.Task_name || '',
    Description: initialData.Description || '',
    Status: initialData.Status || TASK_STATUS.INITIAL,
    Priority: initialData.Priority || PRIORITY.MEDIUM,
    Start_date: initialData.Start_date || '',
    End_date: initialData.End_date || '',
    project_id: initialData.project_id || null
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.TaskName.trim()) {
      newErrors.TaskName = 'Tên task không được để trống';
    }
    if (!formData.Status) {
      newErrors.Status = 'Trạng thái không được để trống';
    }
    if (!formData.Priority) {
      newErrors.Priority = 'Ưu tiên không được để trống';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
        console.log('Data gửi đi:', formData);
      onSubmit(formData);
      
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tên Task *</label>
        <input
          type="text"
          value={formData.TaskName}
          onChange={(e) => handleChange('TaskName', e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {errors.TaskName && <p className="text-red-500 text-sm mt-1">{errors.TaskName}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        <textarea
          value={formData.Description}
          onChange={(e) => handleChange('Description', e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Trạng thái *</label>
          <select
            value={formData.Status}
            onChange={(e) => handleChange('Status', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {Object.values(TASK_STATUS).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.Status && <p className="text-red-500 text-sm mt-1">{errors.Status}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ưu tiên *</label>
          <select
            value={formData.Priority}
            onChange={(e) => handleChange('Priority', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {Object.values(PRIORITY).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          {errors.Priority && <p className="text-red-500 text-sm mt-1">{errors.Priority}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            value={formData.Start_date}
            onChange={(e) => handleChange('Start_date', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
          <input
            type="date"
            value={formData.End_date}
            onChange={(e) => handleChange('End_date', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {initialData.id ? 'Cập nhật' : 'Tạo mới'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;