// src/components/tasks/TaskCard.jsx
import React from 'react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskCard = ({ task, onEdit, onDelete, showActions = true }) => {
  return (
    <div className="border p-4 rounded mb-2 bg-white">
      <h3 className="font-bold text-lg">{task.TaskName}</h3>
      <p className="text-gray-600 text-sm mt-1">{task.Description}</p>
      
      <div className="mt-2 flex gap-2">
        <span className="px-2 py-1 bg-blue-100 rounded text-xs">
          {TASK_STATUS_LABELS[task.Status]}
        </span>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
          {PRIORITY_LABELS[task.Priority]}
        </span>
      </div>

      {task.project_name && (
        <p className="text-sm text-gray-500 mt-2">Dự án: {task.project_name}</p>
      )}

      {task.End_date && (
        <p className="text-sm text-gray-500 mt-2">
          Deadline: {new Date(task.End_date).toLocaleDateString('vi-VN')}
        </p>
      )}

      {showActions && (
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => onEdit(task.id)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Sửa
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;