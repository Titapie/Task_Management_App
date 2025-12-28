import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskSearch from '../components/task/TaskSearch';
import TaskFilter from '../components/task/TaskFilter';
import TaskDeadlineFilter from '../components/task/TaskDeadlineFilter';

const KanbanPage = () => {
    // Temp filters (chưa apply)
    const [tempFilters, setTempFilters] = useState({
        Status: '',
        Priority: '',
        search: '',
        deadline_from: '',
        deadline_to: ''
    });

    // Applied filters (đã apply, truyền xuống KanbanBoard)
    const [appliedFilters, setAppliedFilters] = useState({});

    // Helper: Xóa keys có giá trị rỗng
    const cleanFilters = (obj) => {
        const cleaned = {};
        Object.keys(obj).forEach(key => {
            if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
                cleaned[key] = obj[key];
            }
        });
        return cleaned;
    };

    // Handle single filter change (chỉ update temp)
    const handleFilterChange = (field, value) => {
        setTempFilters({
            ...tempFilters,
            [field]: value
        });
    };

    // Handle search (apply ngay)
    const handleSearch = (search) => {
        const newFilters = { ...tempFilters, search };
        setTempFilters(newFilters);
        setAppliedFilters(cleanFilters(newFilters));
    };

    // Apply filters
    const handleApplyFilters = () => {
        setAppliedFilters(cleanFilters(tempFilters));
    };

    // Reset all filters
    const handleResetAll = () => {
        const resetFilters = {
            Status: '',
            Priority: '',
            search: '',
            deadline_from: '',
            deadline_to: ''
        };
        setTempFilters(resetFilters);
        setAppliedFilters({});
    };

    return (
        <div className="px-4 py-6">
            {/* Header */}
            <div className="mb-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">📋 Kanban Board</h1>
                    <Link
                        to="/tasks"
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                        ← Về danh sách
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm
                    </label>
                    <TaskSearch
                        onSearch={handleSearch}
                        placeholder="Tìm theo tên task..."
                    />
                </div>

                {/* Task Filter */}
                <TaskFilter
                    filters={tempFilters}
                    onFilterChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    onReset={handleResetAll}
                    showDeadlineFilter={false}
                />

                {/* Deadline Filter */}
                <div className="mt-4">
                    <TaskDeadlineFilter
                        onFilterChange={(newFilters) => {
                            const updated = { ...tempFilters, ...newFilters };
                            setTempFilters(updated);
                        }}
                    />
                </div>

                {/* Apply/Reset Buttons */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={handleApplyFilters}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Áp dụng bộ lọc
                    </button>
                    <button
                        onClick={handleResetAll}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                        🔄 Reset tất cả
                    </button>
                </div>
            </div>

            {/* Kanban Board - FULL WIDTH */}
            <div className="w-full">
                <KanbanBoard filters={appliedFilters} />
            </div>
        </div>
    );
};

export default KanbanPage;