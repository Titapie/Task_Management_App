import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_LABELS, PRIORITY_COLORS, DARK_MODE_COLORS } from '../../utils/constants';
import { formatDate, isDeadlineSoon } from '../../utils/dateHelpers';

const KanbanCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${DARK_MODE_COLORS.BG_CARD} p-4 rounded-lg border ${DARK_MODE_COLORS.BORDER_PRIMARY} mb-3 cursor-move ${DARK_MODE_COLORS.CARD_SHADOW} transition-all duration-200 ${
                isDeadlineSoon(task.End_date) ? 'border-l-4 border-l-red-500 dark:border-l-red-400' : ''
            }`}
        >
            {/* Task Name */}
            <h4 className={`font-semibold ${DARK_MODE_COLORS.TEXT_PRIMARY} mb-2 line-clamp-2`}>
                {task.TaskName}
            </h4>

            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        PRIORITY_COLORS[task.Priority] || DARK_MODE_COLORS.BADGE_GRAY
                    }`}
                >
                    {PRIORITY_LABELS[task.Priority]}
                </span>
            </div>

            {/* Deadline */}
            {task.End_date && (
                <div className={`text-sm ${DARK_MODE_COLORS.TEXT_SECONDARY} mb-2`}>
                    <span className="font-medium">Deadline:</span>{' '}
                    <span className={isDeadlineSoon(task.End_date) ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                        {formatDate(task.End_date)}
                    </span>
                </div>
            )}

            {/* Project */}
            {task.ParentProject?.Name && (
                <div className={`text-xs ${DARK_MODE_COLORS.TEXT_TERTIARY} mb-2`}>
                    {task.ParentProject.Name}
                </div>
            )}

            {/* Members */}
            {task.TaskMembers && task.TaskMembers.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-500 dark:text-slate-400">👥</span>
                    <div className="flex -space-x-2">
                        {task.TaskMembers.slice(0, 3).map((member, idx) => (
                            <div
                                key={member.id}
                                className={`w-6 h-6 rounded-full ${DARK_MODE_COLORS.AVATAR_MEMBER} text-xs flex items-center justify-center ${DARK_MODE_COLORS.AVATAR_BORDER}`}
                                title={`${member.FirstName} ${member.LastName}`}
                            >
                                {member.FirstName.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {task.TaskMembers.length > 3 && (
                            <div className={`w-6 h-6 rounded-full ${DARK_MODE_COLORS.AVATAR_MORE} text-xs flex items-center justify-center ${DARK_MODE_COLORS.AVATAR_BORDER}`}>
                                +{task.TaskMembers.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KanbanCard;