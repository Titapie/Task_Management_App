// src/components/tasks/TaskForm.jsx
import React, { useState } from 'react';
import { TASK_STATUS, PRIORITY, TASK_STATUS_LABELS, PRIORITY_LABELS, DARK_MODE_COLORS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';

const TaskForm = ({ initialData = {}, projects = [], onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        TaskName: initialData.TaskName || '',
        Description: initialData.Description || '',
        Status: initialData.Status || TASK_STATUS.INITIAL,
        Priority: initialData.Priority || PRIORITY.MEDIUM,
        Start_date: initialData.Start_date || '',
        End_date: initialData.End_date || '',
        project_id: initialData.project_id || ''
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
            onSubmit(formData);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const statusOptions = Object.values(TASK_STATUS).map(status => ({
        value: status,
        label: TASK_STATUS_LABELS[status]
    }));

    const priorityOptions = Object.values(PRIORITY).map(priority => ({
        value: priority,
        label: PRIORITY_LABELS[priority] || priority
    }));

    const projectOptions = [
        { value: '', label: 'Không thuộc dự án nào' },
        ...projects.map(project => ({
            value: project.id,
            label: project.Name
        }))
    ];

    return (
        <div className={`min-h-screen ${DARK_MODE_COLORS.BG_SECONDARY} animate-fade-in`}>
            {/* Header cố định */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {initialData?.id ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
                    </h1>
                </div>
            </div>
            <div className="max-w-7xl mx-auto p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Preview */}
                            <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl overflow-hidden shadow-sm animate-scale-in`}>
                                <div className={`aspect-video ${DARK_MODE_COLORS.BG_GRADIENT} flex items-center justify-center`}>
                                    <div className="text-white text-9xl font-bold opacity-30">
                                        {formData.TaskName ? formData.TaskName.charAt(0).toUpperCase() : 'T'}
                                    </div>
                                </div>
                            </div>

                            {/* Task Information */}
                            <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl shadow-sm p-6 space-y-6`}>
                                <div>
                                    <h2 className={`text-xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-4`}>Thông tin cơ bản</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                                Tên việc *
                                            </label>
                                            <Input
                                                value={formData.TaskName}
                                                onChange={(e) => handleChange('TaskName', e.target.value)}
                                                placeholder="Nhập tên việc..."
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                            {errors.TaskName && (
                                                <p className="text-red-500 dark:text-red-400 text-sm mt-1 animate-slide-down">{errors.TaskName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                                Mô tả
                                            </label>
                                            <Input
                                                multiline={true}
                                                rows={4}
                                                value={formData.Description}
                                                onChange={(e) => handleChange('Description', e.target.value)}
                                                placeholder="Mô tả công việc..."
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Time Range */}
                                <div>
                                    <h2 className={`text-xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-4`}>Thời gian thực hiện</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                                Ngày bắt đầu
                                            </label>
                                            <DatePicker
                                                value={formData.Start_date}
                                                onChange={(e) => handleChange('Start_date', e.target.value)}
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                                Ngày kết thúc
                                            </label>
                                            <DatePicker
                                                value={formData.End_date}
                                                onChange={(e) => handleChange('End_date', e.target.value)}
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right Column (1/3) */}
                        <div className="lg:col-span-1">
                            <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl shadow-sm p-6 sticky top-6 space-y-6`}>
                                <h3 className={`text-lg font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Phân loại</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                            Trạng thái *
                                        </label>
                                        <Select
                                            value={formData.Status}
                                            onChange={(e) => handleChange('Status', e.target.value)}
                                            options={statusOptions}
                                            className="transition-all duration-200 focus:scale-[1.01]"
                                        />
                                        {errors.Status && (
                                            <p className="text-red-500 dark:text-red-400 text-sm mt-1 animate-slide-down">{errors.Status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                            Ưu tiên *
                                        </label>
                                        <Select
                                            value={formData.Priority}
                                            onChange={(e) => handleChange('Priority', e.target.value)}
                                            options={priorityOptions}
                                            className="transition-all duration-200 focus:scale-[1.01]"
                                        />
                                        {errors.Priority && (
                                            <p className="text-red-500 dark:text-red-400 text-sm mt-1 animate-slide-down">{errors.Priority}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                                            Dự án
                                        </label>
                                        {initialData.id ? (
                                            <div className={`px-3 py-2 ${DARK_MODE_COLORS.BG_INPUT} border ${DARK_MODE_COLORS.BORDER_INPUT} rounded-lg ${DARK_MODE_COLORS.TEXT_LABEL}`}>
                                                {initialData.project_name || 'Không thuộc dự án nào'}
                                            </div>
                                        ) : (
                                            <Select
                                                value={formData.project_id}
                                                onChange={(e) => handleChange('project_id', e.target.value)}
                                                options={projectOptions}
                                                className="transition-all duration-200 focus:scale-[1.01]"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full transition-transform hover:scale-105 active:scale-95"
                                    >
                                        {initialData?.id ? 'Cập nhật việc' : 'Tạo công việc'}
                                    </Button>
                                    
                                    {onCancel && (
                                        <Button
                                            type="button"
                                            onClick={onCancel}
                                            variant="outline"
                                            className="w-full transition-transform hover:scale-105 active:scale-95"
                                        >
                                            Hủy
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;