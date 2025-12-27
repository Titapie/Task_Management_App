// src/pages/TasksPageCard.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks, { useUpcomingTasks } from '../hooks/useTasks';
import TaskCard from '../components/task/TaskCard';
import TaskList from '../components/task/TaskList';
import TaskFilter from '../components/task/TaskFilter';
import TaskSearch from '../components/task/TaskSearch';
import ExportButton from '../components/common/ExportButton';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getTimeLeft } from '../utils/dateHelpers';

const TasksPage = () => {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        sortKey: 'End_date',
        sortValue: 'ASC'
    });
    const [showFilters, setShowFilters] = useState(false);
    
    const [tempFilters, setTempFilters] = useState({
        Status: '',
        Priority: '',
        deadline_from: '',
        deadline_to: ''
    });

    const [appliedFilters, setAppliedFilters] = useState({
        Status: '',
        Priority: '',
        deadline_from: '',
        deadline_to: ''
    });

    const [sortConfig, setSortConfig] = useState({
        sortKey: 'End_date',
        sortValue: 'ASC'
    });

    const { tasks, loading, error, refetch, pagination } = useTasks(params);
    const { upcomingTasks, loading: loadingUpcoming, refetch: refetchUpcoming } = useUpcomingTasks();
    const timeLimitRef = useRef(null);

    // Helper: Build params and cleanup
    const buildAndCleanParams = (overrides) => {
        const newParams = {
            page: params.page,
            limit: params.limit,
            ...overrides
        };

        Object.keys(newParams).forEach(key => {
            if (newParams[key] === undefined || newParams[key] === '') {
                delete newParams[key];
            }
        });

        return newParams;
    };

    // FUNCTION DUY NHẤT: Update params và refetch
    const updateParamsAndFetch = (overrides) => {
        const newParams = buildAndCleanParams({
            page: 1, // Reset về page 1
            Status: appliedFilters.Status || undefined,
            Priority: appliedFilters.Priority || undefined,
            deadline_from: appliedFilters.deadline_from || undefined,
            deadline_to: appliedFilters.deadline_to || undefined,
            ...sortConfig,
            ...overrides
        });
        setParams(newParams);
        refetch(newParams);
    };

    // Filter upcoming tasks with applied filters
    const filteredUpcomingTasks = upcomingTasks.filter(task => {
        if (appliedFilters.Status && task.Status !== appliedFilters.Status) return false;
        if (appliedFilters.Priority && task.Priority !== appliedFilters.Priority) return false;
        return true;
    });

    const handleSearch = (search) => {
        updateParamsAndFetch({ search: search || undefined });
    };

    const handleFilterChange = (field, value) => {
        setTempFilters({
            ...tempFilters,
            [field]: value
        });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        updateParamsAndFetch({
            Status: tempFilters.Status || undefined,
            Priority: tempFilters.Priority || undefined,
            deadline_from: tempFilters.deadline_from || undefined,
            deadline_to: tempFilters.deadline_to || undefined
        });
        refetchUpcoming();
    };

    const handleResetFilters = () => {
        const resetFilters = {
            Status: '',
            Priority: '',
            deadline_from: '',
            deadline_to: ''
        };
        
        setTempFilters(resetFilters);
        setAppliedFilters(resetFilters);
        updateParamsAndFetch({});
        refetchUpcoming();
    };

    const handleSortChange = (key, value) => {
        const newSortConfig = { sortKey: key, sortValue: value };
        setSortConfig(newSortConfig);
        updateParamsAndFetch({ sortKey: key, sortValue: value });
    };

    const handlePageChange = (newPage) => {
        const newParams = { ...params, page: newPage };
        setParams(newParams);
        refetch(newParams);
    };

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading && params.page === 1) {
        return <div className="p-6 text-center">Đang tải...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Lỗi: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Explore Task</h1>
            </div>

            {/* Search */}
            <TaskSearch onSearch={handleSearch} placeholder="Search Task" />

            {/* Filters and Sort */}
            <div className="mb-6 flex gap-4 items-center justify-between flex-wrap">
                <div className='flex gap-4 items-center'>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-100"
                    >
                        <Filter size={20} />
                        Filters
                    </button>

                    <select
                        value={`${sortConfig.sortKey}-${sortConfig.sortValue}`}
                        onChange={(e) => {
                            const [key, value] = e.target.value.split('-');
                            handleSortChange(key, value);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="End_date-ASC">Sort By: Deadline (Sớm nhất)</option>
                        <option value="End_date-DESC">Sort By: Deadline (Muộn nhất)</option>
                        <option value="created_at-DESC">Sort By: Mới nhất</option>
                        <option value="Priority-DESC">Sort By: Ưu tiên cao</option>
                    </select>
                </div>
                
                <div className='flex gap-2'>
                    <button
                        onClick={() => navigate('/tasks/create')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Tạo Task
                    </button>
                    <ExportButton filters={params} />
                </div>
            </div>

            {/* Filters Section */}
            {showFilters && (
                <div className="mb-6">
                    <TaskFilter
                        filters={tempFilters}
                        onFilterChange={handleFilterChange}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                        showDeadlineFilter={true}
                    />
                </div>
            )}

            {/* Upcoming Tasks Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Sắp đến hạn
                        <span className="text-sm font-normal text-gray-600 ml-2">
                            (3 ngày tới)
                        </span>
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll(timeLimitRef, 'left')}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll(timeLimitRef, 'right')}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div
                    ref={timeLimitRef}
                    className="flex gap-4 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loadingUpcoming ? (
                        <div className="text-gray-500">Đang tải...</div>
                    ) : filteredUpcomingTasks.length === 0 ? (
                        <div className="text-gray-500">Không có task sắp đến hạn</div>
                    ) : (
                        filteredUpcomingTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                timeLeft={getTimeLeft(task.End_date)}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* All Tasks Table */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tất cả công việc</h2>
                <TaskList 
                    tasks={tasks}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-600 mt-4">
                {pagination && (
                    <>
                        Tổng số tasks: {pagination.totalTask} | 
                        Sắp đến hạn: {filteredUpcomingTasks.length} | 
                        Hiển thị: {pagination.startIndex}-{pagination.endIndex}
                    </>
                )}
            </div>
        </div>
    );
};

export default TasksPage;