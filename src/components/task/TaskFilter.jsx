// src/components/tasks/TaskFilter.jsx
import React from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS, PRIORITY, PRIORITY_LABELS } from '../../utils/constants';

const TaskFilter = ({ 
    filters, 
    onFilterChange, 
    onApply, 
    onReset,
    showDeadlineFilter = false 
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {/* Filter Row */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                    </label>
                    <select
                        value={filters.Status}
                        onChange={(e) => onFilterChange('Status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        {Object.entries(TASK_STATUS).map(([key, value]) => (
                            <option key={value} value={value}>
                                {TASK_STATUS_LABELS[value]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ưu tiên
                    </label>
                    <select
                        value={filters.Priority}
                        onChange={(e) => onFilterChange('Priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả</option>
                        {Object.entries(PRIORITY).map(([key, value]) => (
                            <option key={value} value={value}>
                                {PRIORITY_LABELS[value]}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Deadline From */}
                {showDeadlineFilter && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline từ
                        </label>
                        <input
                            type="date"
                            value={filters.deadline_from}
                            onChange={(e) => onFilterChange('deadline_from', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Deadline To */}
                {showDeadlineFilter && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline đến
                        </label>
                        <input
                            type="date"
                            value={filters.deadline_to}
                            onChange={(e) => onFilterChange('deadline_to', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={onApply}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Áp dụng
                </button>
                <button
                    onClick={onReset}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                    🔄 Reset
                </button>
            </div>

            {/* Filter Info */}
            {showDeadlineFilter && (
                <div className="mt-4 text-sm text-gray-600">
                    <p>• <strong>Status & Priority:</strong> áp dụng cho Time Limit và All Tasks</p>
                    <p>• <strong>Deadline:</strong> chỉ áp dụng cho All Tasks</p>
                </div>
            )}
        </div>
    );
};

export default TaskFilter;