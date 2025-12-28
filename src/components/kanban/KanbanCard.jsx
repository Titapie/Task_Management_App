import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants';
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
            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 cursor-move hover:shadow-md transition-shadow ${
                isDeadlineSoon(task.End_date) ? 'border-l-4 border-l-red-500' : ''
            }`}
        >
            {/* Task Name */}
            <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {task.TaskName}
            </h4>

            {/* Priority Badge */}
            <div className="flex items-center gap-2 mb-2">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        PRIORITY_COLORS[task.Priority] || 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {PRIORITY_LABELS[task.Priority]}
                </span>
            </div>

            {/* Deadline */}
            {task.End_date && (
                <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Deadline:</span>{' '}
                    <span className={isDeadlineSoon(task.End_date) ? 'text-red-600 font-semibold' : ''}>
                        {formatDate(task.End_date)}
                    </span>
                </div>
            )}

            {/* Project */}
            {task.ParentProject?.Name && (
                <div className="text-xs text-gray-500 mb-2">
                    {task.ParentProject.Name}
                </div>
            )}

            {/* Members */}
            {task.TaskMembers && task.TaskMembers.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-500">👥</span>
                    <div className="flex -space-x-2">
                        {task.TaskMembers.slice(0, 3).map((member, idx) => (
                            <div
                                key={member.id}
                                className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                                title={`${member.FirstName} ${member.LastName}`}
                            >
                                {member.FirstName.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {task.TaskMembers.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center border-2 border-white">
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