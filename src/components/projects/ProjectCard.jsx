import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import {DARK_MODE_COLORS} from "../../utils/constants.js";

const ProjectCard = ({ project}) => {
    const navigate = useNavigate();

    // Tính toán completion rate
    const totalTasks = parseInt(project.total_tasks) || 0;
    const completedTasks = parseInt(project.completed_tasks) || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tính toán progress bar color
    const getProgressColor = (rate) => {
        if (rate >= 80) return 'bg-green-500';
        if (rate >= 50) return 'bg-blue-500';
        if (rate >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Check if project is overdue
    const isOverdue = () => {
        if (!project.End_date) return false;
        const endDate = new Date(project.End_date);
        const today = new Date();
        return endDate < today && completionRate < 100;
    };

    // Lấy tên manager
    const managerName = project.ProjectManager
        ? `${project.ProjectManager.FirstName} ${project.ProjectManager.LastName}`
        : project.manager_name || 'Chưa có';

    const handleCardClick = () => {
        navigate(`/projects/${project.id}`);
    };
    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 overflow-hidden"
        >
            {/* Header */}
            <div className={`p-6 border-b border-gray-100 ${DARK_MODE_COLORS.BG_CARD}`}>
                <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-xl font-semibold line-clamp-2 flex-1 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                        {project.Name}
                    </h3>
                    {isOverdue() && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full whitespace-nowrap">
                            Quá hạn
                        </span>
                    )}
                </div>

                {project.Description && (
                    <p className={`text-gray-600 text-sm line-clamp-2 mb-4 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                        {project.Description}
                    </p>
                )}

                {/* Manager Info */}
                <div className="flex items-center text-sm ">
                    <Users className={`w-4 h-4 mr-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`} />
                    <span className="dark:text-white">Quản lý: <span className={`font-medium text-gray-700 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>{managerName}</span></span>
                </div>
            </div>

            {/* Stats Section */}
            <div className={`p-6 ${DARK_MODE_COLORS.BG_CARD}`}>
                {/* Completion Rate */}
                <div className="mb-4 ">
                    <div className="flex items-center justify-between mb-2">
                        <div className={`flex items-center text-sm font-medium  ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                            Tiến độ hoàn thành
                        </div>
                        <span className={`text-sm font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>{completionRate}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(completionRate)}`}
                            style={{ width: `${completionRate}%` }}
                        ></div>
                    </div>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className={`text-xs ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Tổng tasks</p>
                            <p className={`text-lg font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>{totalTasks}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                                <p className={`text-xs text-gray-500 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Hoàn thành</p>
                            <p className={`text-lg font-bold text-gray-800 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>{completedTasks}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                        <p className={`text-xs mb-1 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Đang thực hiện</p>
                        <p className={`text-sm font-semibold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                            {project.in_progress_tasks || 0}
                        </p>
                    </div>
                    <div>
                        <p className={`text-xs mb-1 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Chưa hoàn thành</p>
                        <p className={`text-sm font-semibold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>
                            {project.not_finish_tasks || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer - Date Info */}
            <div className={`px-6 py-4 bg-white border-t border-gray-100 ${DARK_MODE_COLORS.BG_CARD}`}>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-1 ${DARK_MODE_COLORS.TEXT_PRIMARY}`} />
                        <span className={`${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Bắt đầu: {formatDate(project.Start_date)}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className={`w-4 h-4 mr-1 ${DARK_MODE_COLORS.TEXT_PRIMARY}`} />
                        <span className={`${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Kết thúc: {formatDate(project.End_date)}</span>
                    </div>
                </div>
            </div>

            {/* Team Members Preview */}
            {project.ProjectMembers && project.ProjectMembers.length > 0 && (
                <div className={`px-6 py-3 bg-gray-50 border-t border-gray-100 ${DARK_MODE_COLORS.BG_CARD}`}>
                    <div className="flex items-center">
                        <Users className={`w-4 h-4 mr-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`} />
                        <span className={`text-xs text-gray-600 mr-2 ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Thành viên:</span>
                        <div className="flex -space-x-2">
                            {project.ProjectMembers.slice(0, 5).map((member) => (
                                <div
                                    key={member.id}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                    title={`${member.FirstName} ${member.LastName}`}
                                >
                                    {member.FirstName.charAt(0)}{member.LastName.charAt(0)}
                                </div>
                            ))}
                            {project.ProjectMembers.length > 5 && (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-medium border-2 border-white">
                                    +{project.ProjectMembers.length - 5}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;