// src/components/tasks/TaskCard.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS, DARK_MODE_COLORS } from '../../utils/constants';
import { getProjectNameById } from '../../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, showActions = false, timeLeft, onClick, projects = [] }) => {
console.log('Task data in TaskCard:', task); // Thêm dòng này
    return (
        <div
            onClick={onClick}
            className={`min-w-[320px] ${DARK_MODE_COLORS.BG_CARD} rounded-lg shadow-sm border ${DARK_MODE_COLORS.BORDER_PRIMARY} overflow-hidden cursor-pointer ${DARK_MODE_COLORS.CARD_SHADOW} transition-shadow`}
        >
            {/* Image Thumbnail */}
            <div className={`h-40 ${DARK_MODE_COLORS.BG_GRADIENT} flex items-center justify-center`}>
                <div className="text-white text-6xl font-bold opacity-20">
                    {task.TaskName.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className={`font-bold text-lg ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2 line-clamp-2`}>
                    {task.TaskName}
                </h3>

                <p className={`text-sm ${DARK_MODE_COLORS.TEXT_SECONDARY} mb-3`}>
                    {getProjectNameById(task.project_id, projects)}
                </p>

                {/* Status & Priority Badges */}
                <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[task.Status] || DARK_MODE_COLORS.BADGE_GRAY}`}>
                        {TASK_STATUS_LABELS[task.Status]}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.Priority] || DARK_MODE_COLORS.BADGE_GRAY}`}>
                        {PRIORITY_LABELS[task.Priority]}
                    </span>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-3 border-t ${DARK_MODE_COLORS.BORDER_SECONDARY}`}>
                    {/* Time Left */}
                    <div className={`flex items-center gap-1 text-sm ${DARK_MODE_COLORS.TEXT_SECONDARY}`}>
                        <Clock size={16} />
                        <span>{timeLeft || 'No deadline'}</span>
                    </div>

                    {/* Members */}
                    {task.TaskMembers && task.TaskMembers.length > 0 && (
                        <div className="flex -space-x-2">
                            {task.TaskMembers.slice(0, 3).map((member, idx) => (
                                <div
                                    key={member.id}
                                    className={`w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 text-white text-xs flex items-center justify-center border-2 ${DARK_MODE_COLORS.BG_CARD}`}
                                    style={{ borderColor: 'inherit' }}
                                    title={`${member.FirstName} ${member.LastName}`}
                                >
                                    {member.FirstName.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {task.TaskMembers.length > 3 && (
                                <div className={`w-8 h-8 rounded-full bg-gray-400 dark:bg-slate-600 text-white text-xs flex items-center justify-center border-2 ${DARK_MODE_COLORS.BG_CARD}`}
                                    style={{ borderColor: 'inherit' }}
                                >
                                    +{task.TaskMembers.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskCard;