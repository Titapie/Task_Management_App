// src/pages/TasksPageCard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks, { useUpcomingTasks } from '../hooks/useTasks';
import TaskList from '../components/task/TaskList';
import TaskFilter from '../components/task/TaskFilter';
import TaskSearch from '../components/task/TaskSearch';
import TaskSort from '../components/task/TaskSort';
import TaskUpcoming from '../components/task/TaskUpcoming';
import ExportButton from '../components/common/ExportButton';
import { Filter } from 'lucide-react';
import { getProjectNameById } from '../utils/helpers';
import projectService from '../services/projectService';
import { TASK_ROUTES } from '../routes/taskRoutes';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const TasksPage = () => {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        sortKey: 'End_date',
        sortValue: 'DESC'
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
        sortValue: 'DESC'
    });

    const [projects, setProjects] = useState([]);

    const { tasks, loading, error, refetch, pagination } = useTasks(params);
    const { upcomingTasks, loading: loadingUpcoming, refetch: refetchUpcoming } = useUpcomingTasks();

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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectService.getAllProjectsNoPagination();
                setProjects(response.projects || response.data || []);
            } catch (err) {
                console.error('Lỗi khi tải danh sách dự án:', err);
            }
        };
        fetchProjects();
    }, []);

    if (loading && params.page === 1) {
        return <Loading />;
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
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <>
                            <Filter size={20} />
                            Filters
                        </>
                    </Button>

                    <TaskSort 
                        sortConfig={sortConfig}
                        onSortChange={handleSortChange}
                    />
                </div>
                
                <div className='flex gap-2'>
                    <Button
                        onClick={() => navigate(TASK_ROUTES.CREATE)}
                    >
                        Tạo Task
                    </Button>
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
            <TaskUpcoming
                tasks={filteredUpcomingTasks}
                loading={loadingUpcoming}
                projects={projects}
                onNavigate={(taskId) => navigate(TASK_ROUTES.DETAIL(taskId))}
            />

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
                        Tổng số tasks: {pagination.totalTask || 0} | 
                        Sắp đến hạn: {filteredUpcomingTasks.length} | 
                        Hiển thị: {pagination.startIndex}-{pagination.endIndex}
                    </>
                )}
            </div>
        </div>
    );
};

export default TasksPage;