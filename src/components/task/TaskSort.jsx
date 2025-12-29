// src/components/task/TaskSort.jsx
import React from 'react';
import Select from '../common/Select';

const TaskSort = ({ sortConfig, onSortChange }) => {
    return (
        <div className="animate-fade-in-fast">
            <Select
                value={`${sortConfig.sortKey}-${sortConfig.sortValue}`}
                onChange={(e) => {
                    const [key, value] = e.target.value.split('-');
                    onSortChange(key, value);
                }}
                options={[
                    { value: 'End_date-ASC', label: 'Sort By: Deadline (Sớm nhất)' },
                    { value: 'End_date-DESC', label: 'Sort By: Deadline (Muộn nhất)' },
                    { value: 'created_at-DESC', label: 'Sort By: Mới nhất' },
                    { value: 'Priority-DESC', label: 'Sort By: Ưu tiên cao' }
                ]}
                className="transition-all duration-200"
            />
        </div>
    );
};

export default TaskSort;