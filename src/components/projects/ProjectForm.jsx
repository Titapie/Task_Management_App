import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar, User, FileText, Briefcase } from 'lucide-react';
import {DARK_MODE_COLORS} from "../../utils/constants.js";

const ProjectForm = ({
                         project = null,
                         onSubmit,
                         onCancel,
                         isLoading = false,
                         mode = 'create' // 'create' or 'edit'
                     }) => {
    const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Start_date: '',
        End_date: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Load dữ liệu project khi edit
    useEffect(() => {
        if (project && mode === 'edit') {
            setFormData({
                Name: project.Name || '',
                Description: project.Description || '',
                Start_date: project.Start_date ? formatDateForInput(project.Start_date) : '',
                End_date: project.End_date ? formatDateForInput(project.End_date) : ''
            });
        }
    }, [project, mode]);

    // Format date từ ISO string sang YYYY-MM-DD cho input[type="date"]
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    // Validation rules
    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'Name':
                if (!value || value.trim() === '') {
                    error = 'Tên dự án không được để trống';
                } else if (value.trim().length < 3) {
                    error = 'Tên dự án phải có ít nhất 3 ký tự';
                } else if (value.trim().length > 255) {
                    error = 'Tên dự án không được vượt quá 255 ký tự';
                }
                break;

            case 'Description':
                if (value && value.length > 5000) {
                    error = 'Mô tả không được vượt quá 5000 ký tự';
                }
                break;

            case 'Start_date':
                if (value && isNaN(Date.parse(value))) {
                    error = 'Ngày bắt đầu không hợp lệ';
                }
                // Check nếu có End_date và Start_date > End_date
                if (value && formData.End_date && new Date(value) > new Date(formData.End_date)) {
                    error = 'Ngày bắt đầu không được sau ngày kết thúc';
                }
                break;

            case 'End_date':
                if (value && isNaN(Date.parse(value))) {
                    error = 'Ngày kết thúc không hợp lệ';
                }
                // Check nếu có Start_date và End_date < Start_date
                if (value && formData.Start_date && new Date(value) < new Date(formData.Start_date)) {
                    error = 'Ngày kết thúc không được trước ngày bắt đầu';
                }
                break;

            default:
                break;
        }

        return error;
    };

    // Validate toàn bộ form
    const validateForm = () => {
        const newErrors = {};

        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate field khi user đang nhập (nếu đã touch)
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    // Handle blur - đánh dấu field đã được touch
    const handleBlur = (e) => {
        const { name } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate field khi blur
        const error = validateField(name, formData[name]);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Đánh dấu tất cả fields đã touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validate toàn bộ form
        if (!validateForm()) {
            return;
        }

        // Chuẩn bị data để submit (loại bỏ các trường rỗng)
        const submitData = { ...formData };

        // Convert empty strings to null cho dates
        if (!submitData.Start_date) submitData.Start_date = null;
        if (!submitData.End_date) submitData.End_date = null;

        // Gọi callback onSubmit
        await onSubmit(submitData);
    };

    return (
        <div className={`${DARK_MODE_COLORS.BG_CARD} rounded-lg shadow-lg max-w-2xl mx-auto`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                    <Briefcase className={`w-6 h-6 ${DARK_MODE_COLORS.TEXT_PRIMARY} mr-3`} />
                    <h2 className={`text-2xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                        {mode === 'create' ? 'Tạo dự án mới' : 'Chỉnh sửa dự án'}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="p-2 bg-white border-blue-400 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Tên dự án */}
                <div>
                    <label htmlFor="Name" className={`flex items-center text-sm font-medium ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2`}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Tên dự án <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="Name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Nhập tên dự án..."
                        className={`w-full px-4 py-2 ${DARK_MODE_COLORS.BG_INPUT} ${DARK_MODE_COLORS.TEXT_PRIMARY} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            errors.Name && touched.Name
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                    />
                    {errors.Name && touched.Name && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.Name}
                        </p>
                    )}
                </div>

                {/* Mô tả */}
                <div>
                    <label htmlFor="Description" className={`flex items-center text-sm font-medium ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Mô tả dự án
                    </label>
                    <textarea
                        id="Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Nhập mô tả chi tiết về dự án..."
                        rows="4"
                            className={`w-full px-4 py-2 ${DARK_MODE_COLORS.BG_INPUT} ${DARK_MODE_COLORS.TEXT_PRIMARY} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                            errors.Description && touched.Description
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                    />
                    {errors.Description && touched.Description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠</span>
                            {errors.Description}
                        </p>
                    )}
                    <p className={`mt-1 text-xs ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                        {formData.Description.length} / 5000 ký tự
                    </p>
                </div>

                {/* Ngày bắt đầu và kết thúc */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ngày bắt đầu */}
                    <div>
                        <label htmlFor="Start_date" className={`flex items-center text-sm font-medium ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2`}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            id="Start_date"
                            name="Start_date"
                            value={formData.Start_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 ${DARK_MODE_COLORS.BG_INPUT} ${DARK_MODE_COLORS.TEXT_PRIMARY} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                errors.Start_date && touched.Start_date
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.Start_date && touched.Start_date && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <span className="mr-1">⚠</span>
                                {errors.Start_date}
                            </p>
                        )}
                    </div>

                    {/* Ngày kết thúc */}
                    <div>
                        <label htmlFor="End_date" className={`flex items-center text-sm font-medium ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2`}>
                            <Calendar className="w-4 h-4 mr-2 " />
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            id="End_date"
                            name="End_date"
                            value={formData.End_date}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 ${DARK_MODE_COLORS.BG_INPUT} ${DARK_MODE_COLORS.TEXT_PRIMARY} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                errors.End_date && touched.End_date
                                    ? 'border-red-500 bg-red-50'
                                    : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {errors.End_date && touched.End_date && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                <span className="mr-1">⚠</span>
                                {errors.End_date}
                            </p>
                        )}
                    </div>
                </div>

                {/* Manager Info - chỉ hiển thị khi edit */}
                {mode === 'edit' && project && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center text-sm text-gray-700">
                            <User className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="font-medium">Quản lý dự án:</span>
                            <span className="ml-2">
                {project.manager_name ||
                    (project.ProjectManager
                        ? `${project.ProjectManager.FirstName} ${project.ProjectManager.LastName}`
                        : 'Chưa có')}
              </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * Manager được tự động gán khi tạo dự án và không thể thay đổi trực tiếp
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-100 text-gray-400 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white hover:border-white transition-colors font-medium"
                        disabled={isLoading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {mode === 'create' ? 'Tạo dự án' : 'Lưu thay đổi'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;