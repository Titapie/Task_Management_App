// src/components/tasks/TaskForm.jsx
import React, { useState } from 'react';
import { TASK_STATUS, PRIORITY, TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';
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
            label: project.ProjectName
        }))
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content - Left Column (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Preview */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <div className="text-white text-9xl font-bold opacity-30">
                                        {formData.TaskName ? formData.TaskName.charAt(0).toUpperCase() : 'T'}
                                    </div>
                                </div>
                            </div>

                            {/* Task Information */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin cơ bản</h2>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên Task *
                                            </label>
                                            <Input
                                                type="text"
                                                value={formData.TaskName}
                                                onChange={(e) => handleChange('TaskName', e.target.value)}
                                                placeholder="Nhập tên task..."
                                            />
                                            {errors.TaskName && (
                                                <p className="text-red-500 text-sm mt-1">{errors.TaskName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mô tả
                                            </label>
                                            <Input
                                                value={formData.Description}
                                                onChange={(e) => handleChange('Description', e.target.value)}
                                                rows="4"
                                                placeholder="Mô tả chi tiết về task..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Time Range */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Thời gian thực hiện</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày bắt đầu
                                            </label>
                                            <DatePicker
                                                value={formData.Start_date}
                                                onChange={(e) => handleChange('Start_date', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày kết thúc
                                            </label>
                                            <DatePicker
                                                value={formData.End_date}
                                                onChange={(e) => handleChange('End_date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Right Column (1/3) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6 space-y-6">
                                <h3 className="text-lg font-bold text-gray-900">Phân loại</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái *
                                        </label>
                                        <Select
                                            value={formData.Status}
                                            onChange={(e) => handleChange('Status', e.target.value)}
                                            options={statusOptions}
                                        />
                                        {errors.Status && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Status}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ưu tiên *
                                        </label>
                                        <Select
                                            value={formData.Priority}
                                            onChange={(e) => handleChange('Priority', e.target.value)}
                                            options={priorityOptions}
                                        />
                                        {errors.Priority && (
                                            <p className="text-red-500 text-sm mt-1">{errors.Priority}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dự án
                                        </label>
                                        <Select
                                            value={formData.project_id}
                                            onChange={(e) => handleChange('project_id', e.target.value)}
                                            options={projectOptions}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 border-t space-y-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                    >
                                        {initialData?.id ? 'Cập nhật Task' : 'Tạo Task'}
                                    </Button>
                                    
                                    {onCancel && (
                                        <Button
                                            type="button"
                                            onClick={onCancel}
                                            variant="outline"
                                            className="w-full"
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