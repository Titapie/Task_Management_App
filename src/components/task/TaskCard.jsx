// src/components/tasks/TaskCard.jsx
import React from 'react';
import { Clock } from 'lucide-react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS, STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import { getProjectNameById } from '../../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, showActions = false, timeLeft, onClick, projects = [] }) => {
console.log('Task data in TaskCard:', task); // Thêm dòng này
    return (
        <div
            onClick={onClick}
            className="min-w-[320px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
            {/* Image Thumbnail */}
            <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-20">
                    {task.TaskName.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                    {task.TaskName}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                    {getProjectNameById(task.project_id, projects)}
                </p>

                {/* Status & Priority Badges */}
                <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[task.Status] || 'bg-gray-100'}`}>
                        {TASK_STATUS_LABELS[task.Status]}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITY_COLORS[task.Priority] || 'bg-gray-100'}`}>
                        {PRIORITY_LABELS[task.Priority]}
                    </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    {/* Time Left */}
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>{timeLeft || 'No deadline'}</span>
                    </div>

                    {/* Members */}
                    {task.TaskMembers && task.TaskMembers.length > 0 && (
                        <div className="flex -space-x-2">
                            {task.TaskMembers.slice(0, 3).map((member, idx) => (
                                <div
                                    key={member.id}
                                    className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                                    title={`${member.FirstName} ${member.LastName}`}
                                >
                                    {member.FirstName.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {task.TaskMembers.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center border-2 border-white">
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