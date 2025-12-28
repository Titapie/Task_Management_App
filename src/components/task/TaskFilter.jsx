// src/components/tasks/TaskFilter.jsx
import React from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS, PRIORITY, PRIORITY_LABELS } from '../../utils/constants';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';
import { RefreshCcw } from 'lucide-react';

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
                    <Select
                        value={filters.Status}
                        onChange={(e) => onFilterChange('Status', e.target.value)}
                        options={[
                            { value: '', label: 'Tất cả' },
                            ...Object.entries(TASK_STATUS).map(([key, value]) => ({
                                value: value,
                                label: TASK_STATUS_LABELS[value]
                            }))
                        ]}
                    />
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ưu tiên
                    </label>
                    <Select
                        value={filters.Priority}
                        onChange={(e) => onFilterChange('Priority', e.target.value)}
                        options={[
                            { value: '', label: 'Tất cả' },
                            ...Object.entries(PRIORITY).map(([key, value]) => ({
                                value: value,
                                label: PRIORITY_LABELS[value]
                            }))
                        ]}
                    />
                </div>

                {/* Deadline From */}
                {showDeadlineFilter && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline từ
                        </label>
                        <DatePicker
                            value={filters.deadline_from}
                            onChange={(e) => onFilterChange('deadline_from', e.target.value)}
                        />
                    </div>
                )}

                {/* Deadline To */}
                {showDeadlineFilter && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline đến
                        </label>
                        <DatePicker
                            value={filters.deadline_to}
                            onChange={(e) => onFilterChange('deadline_to', e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={onApply}
                >
                    Áp dụng
                </Button>
                <Button
                    onClick={onReset}
                >
                    <RefreshCcw />
                </Button>
            </div>

        </div>
    );
};

export default TaskFilter;