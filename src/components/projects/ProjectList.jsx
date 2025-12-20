import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    RefreshCw,
    Loader2,
    AlertCircle,
    Grid3x3,
    List as ListIcon
} from 'lucide-react';
import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import projectService from '../../services/projectService';

const ProjectList = () => {
    // States
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProjects: 0,
        limit: 12
    });

    // Filters
    const [filters, setFilters] = useState({
        start_from: '',
        end_to: '',
        manager_id: '',
        sortKey: 'created_at',
        sortValue: 'DESC'
    });

    const [showFilters, setShowFilters] = useState(false);

    // Fetch projects
    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pagination.currentPage,
                limit: pagination.limit,
                search: searchTerm,
                ...filters
            };

            const response = await projectService.getProjects(params);

            if (response.success) {
                setProjects(response.projects || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.pagination?.totalPage || 1,
                    totalProjects: response.pagination?.totalProjects || 0
                }));
            }
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách dự án');
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchProjects();
    }, [pagination.currentPage, filters, searchTerm]);

    // Handlers
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleCreateNew = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);

            if (editingProject) {
                const response = await projectService.updateProject(editingProject.id, data);
                if (response.success) {
                    alert('Cập nhật dự án thành công!');
                }
            } else {
                const response = await projectService.createProject(data);
                if (response.success) {
                    alert('Tạo dự án thành công!');
                }
            }

            setShowForm(false);
            setEditingProject(null);
            await fetchProjects();
        } catch (err) {
            alert(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRefresh = () => {
        fetchProjects();
    };

    const clearFilters = () => {
        setFilters({
            start_from: '',
            end_to: '',
            manager_id: '',
            sortKey: 'created_at',
            sortValue: 'DESC'
        });
        setSearchTerm('');
    };

    // Render pagination
    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Trước
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-lg ${
                            page === pagination.currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < pagination.totalPages && (
                    <>
                        {endPage < pagination.totalPages - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {pagination.totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sau
                </button>
            </div>
        );
    };

    // Modal Form
    if (showForm) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="max-w-2xl w-full">
                    <ProjectForm
                        project={editingProject}
                        mode={editingProject ? 'edit' : 'create'}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProject(null);
                        }}
                        isLoading={loading}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý dự án</h1>
                            <p className="text-gray-600 mt-1">
                                Tổng số: {pagination.totalProjects} dự án
                            </p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tạo dự án mới
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute bg-gray-200 left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên dự án..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full pl-10 pr-4 py-2 border bg-gray-200 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center px-4 py-2 text-blue-500  bg-gray-200  rounded-lg transition-colors ${
                                        showFilters ? 'bg-blue-300  text-blue-500' : ' hover:bg-blue-500 hover:text-white'
                                    }`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Lọc
                                </button>

                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center px-4 py-2 bg-gray-200  border  rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    <RefreshCw className={`w-4 h-4  text-blue-500 hover:text-white  ${loading ? 'animate-spin' : ''}`} />
                                </button>

                                <div className="flex border border-gray-400 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-3 py-2 bg-blue-200 text-blue-500 ${viewMode === 'grid' ? 'bg-white text-blue-600' : 'hover:bg-gray-50'}`}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-2 border-l bg-blue-200 text-blue-500 ${viewMode === 'list' ? 'bg-white text-blue-600' : 'hover:bg-gray-50 ' }`}
                                    >
                                        <ListIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters Panel */}
                        {showFilters && (
                            <div className="border-t pt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Từ ngày
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.start_from}
                                            onChange={(e) => handleFilterChange('start_from', e.target.value)}
                                            className="w-full px-3 py-2 border bg-gray-200 text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đến ngày
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.end_to}
                                            onChange={(e) => handleFilterChange('end_to', e.target.value)}
                                            className="w-full px-3 py-2 border bg-gray-200 text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sắp xếp theo
                                        </label>
                                        <select
                                            value={`${filters.sortKey}-${filters.sortValue}`}
                                            onChange={(e) => {
                                                const [key, value] = e.target.value.split('-');
                                                setFilters(prev => ({ ...prev, sortKey: key, sortValue: value }));
                                            }}
                                            className="w-full px-3 py-2 border bg-gray-200 text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="created_at-DESC">Mới nhất</option>
                                            <option value="created_at-ASC">Cũ nhất</option>
                                            <option value="Name-ASC">Tên A-Z</option>
                                            <option value="Name-DESC">Tên Z-A</option>
                                            <option value="End_date-ASC">Deadline gần nhất</option>
                                            <option value="End_date-DESC">Deadline xa nhất</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={clearFilters}
                                    className="text-sm  bg-gray-200 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading && projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Không tìm thấy dự án
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || filters.start_from || filters.end_to
                                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                                : 'Bắt đầu bằng cách tạo dự án đầu tiên của bạn'}
                        </p>
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tạo dự án mới
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Projects Grid */}
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }>
                            {projects.map((project) => (
                                <div key={project.id} className="relative group">
                                    <ProjectCard project={project} viewMode={viewMode}/>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectList;