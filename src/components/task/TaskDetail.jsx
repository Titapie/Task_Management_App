// src/components/tasks/TaskDetail.jsx
import React from 'react';
import { Clock, Users, CheckCircle2 } from 'lucide-react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS, DARK_MODE_COLORS } from '../../utils/constants';

const TaskDetail = ({ task, onEdit, onDelete }) => {
    if (!task) return null;

    // Tính số ngày từ Start_date đến End_date
    const calculateDuration = () => {
        if (task.Start_date && task.End_date) {
            const days = Math.ceil((new Date(task.End_date) - new Date(task.Start_date)) / (1000 * 60 * 60 * 24));
            return `${days} ngày`;
        }
        return 'Chưa xác định';
    };

    const member = task.TaskMembers?.length || 0;
    const duration = calculateDuration();

    // Assessment items - có thể mở rộng sau
    const assessmentItems = [
        "Hiểu rõ yêu cầu của task",
        "Nắm vững các công cụ cần thiết",
        "Thực hiện đúng quy trình",
        "Hoàn thành đúng tiến độ"
    ];

    return (
        <div className={`min-h-screen ${DARK_MODE_COLORS.BG_SECONDARY} animate-fade-in`}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Media Preview */}
                        <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl overflow-hidden shadow-sm animate-scale-in`}>
                            <div className={`aspect-video ${DARK_MODE_COLORS.BG_GRADIENT} flex items-center justify-center`}>
                                <div className="text-white text-9xl font-bold opacity-30">
                                    {task.TaskName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        {/* Task Info Section */}
                        <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl shadow-sm p-6`}>
                            <h1 className={`text-3xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-3`}>{task.TaskName}</h1>
                            
                            <div className={`flex items-center gap-4 text-sm ${DARK_MODE_COLORS.TEXT_SECONDARY} mb-4`}>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium transition-all hover:scale-105">
                                    {task.project_name || 'Không thuộc dự án nào'}
                                </span>
                            </div>

                            <div className={`flex items-center gap-6 text-sm ${DARK_MODE_COLORS.TEXT_SECONDARY} mb-6 pb-6`}>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{member} Thành viên tham gia</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{duration}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className={`text-xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-3`}>Mô tả công việc</h2>
                                <p className={`${DARK_MODE_COLORS.TEXT_SECONDARY} leading-relaxed`}>
                                    {task.Description || 'Không có mô tả'}
                                </p>
                            </div>

                            {/* Essence of Assessment */}
                            <div>
                                <h2 className={`text-xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-4`}>Essence of Assessment</h2>
                                <div className="space-y-3">
                                    {assessmentItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                            <span className={DARK_MODE_COLORS.TEXT_LABEL}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-8 pt-6">
                                <button
                                    onClick={onEdit}
                                    className={`px-6 py-2.5 ${DARK_MODE_COLORS.BTN_PRIMARY} text-white rounded-lg font-medium transition-transform hover:scale-105 active:scale-95`}
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={onDelete}
                                    className={`px-6 py-2.5 ${DARK_MODE_COLORS.BTN_DANGER} text-white rounded-lg font-medium transition-transform hover:scale-105 active:scale-95`}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column (1/3) */}
                    <div className="lg:col-span-1">
                        <div className={`${DARK_MODE_COLORS.BG_PRIMARY} rounded-2xl shadow-sm p-6 sticky top-6`}>
                            <h3 className={`text-lg font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-4`}>Thông tin chi tiết</h3>
                            
                            <div className="space-y-4 text-sm">
                                <div>
                                    <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-1`}>Trạng thái</span>
                                    <span className={`inline-block px-3 py-1 rounded-lg font-medium ${STATUS_COLORS[task.Status]} transition-all hover:scale-105`}>
                                        {TASK_STATUS_LABELS[task.Status]}
                                    </span>
                                </div>

                                <div>
                                    <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-1`}>Ưu tiên</span>
                                    <span className={`inline-block px-3 py-1 rounded-lg font-medium ${PRIORITY_COLORS[task.Priority]} transition-all hover:scale-105`}>
                                        {PRIORITY_LABELS[task.Priority]}
                                    </span>
                                </div>

                                {task.project_name && (
                                    <div>
                                        <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-1`}>Dự án</span>
                                        <span className={`${DARK_MODE_COLORS.TEXT_PRIMARY} font-medium`}>{task.project_name}</span>
                                    </div>
                                )}

                                {task.creator_name && (
                                    <div>
                                        <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-1`}>Người tạo</span>
                                        <span className={`${DARK_MODE_COLORS.TEXT_PRIMARY} font-medium`}>{task.creator_name}</span>
                                    </div>
                                )}

                                {(task.Start_date || task.End_date) && (
                                    <div>
                                        <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-1`}>Thời gian</span>
                                        <div className={`flex items-center gap-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                                            {task.Start_date && (
                                                <span>{new Date(task.Start_date).toLocaleDateString('vi-VN')}</span>
                                            )}
                                            {task.Start_date && task.End_date && (
                                                <span className={DARK_MODE_COLORS.TEXT_TERTIARY}>-</span>
                                            )}
                                            {task.End_date && (
                                                <span>{new Date(task.End_date).toLocaleDateString('vi-VN')}</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {task.TaskMembers && task.TaskMembers.length > 0 && (
                                    <div>
                                        <span className={`${DARK_MODE_COLORS.TEXT_SECONDARY} block mb-2`}>Thành viên</span>
                                        <div className="flex flex-wrap gap-2">
                                            {task.TaskMembers.map((member) => (
                                                <span key={member.id} className={`px-3 py-1 ${DARK_MODE_COLORS.BADGE_GRAY} rounded-lg text-sm transition-all hover:scale-105`}>
                                                    {member.FirstName} {member.LastName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;