import React, { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import useTasks from '../../hooks/useTasks';
import { updateTaskStatus } from '../../services/taskService';
import { TASK_STATUS, TASK_STATUS_LABELS, DARK_MODE_COLORS } from '../../utils/constants';

const KanbanBoard = ({ filters }) => {
    // Hook tự động fetch với limit lớn cho Kanban
    const { tasks, loading, error } = useTasks({ ...filters, limit: 200 });
    const [activeTask, setActiveTask] = useState(null);
    const [localTasks, setLocalTasks] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Cấu hình 5 cột với màu đầy đủ
    const columns = [
        { status: TASK_STATUS.INITIAL, title: TASK_STATUS_LABELS[TASK_STATUS.INITIAL], colorClass: 'text-gray-600 dark:text-gray-400' },
        { status: TASK_STATUS.DOING, title: TASK_STATUS_LABELS[TASK_STATUS.DOING], colorClass: 'text-blue-600 dark:text-blue-400' },
        { status: TASK_STATUS.PENDING, title: TASK_STATUS_LABELS[TASK_STATUS.PENDING], colorClass: 'text-yellow-600 dark:text-yellow-400' },
        { status: TASK_STATUS.FINISH, title: TASK_STATUS_LABELS[TASK_STATUS.FINISH], colorClass: 'text-green-600 dark:text-green-400' },
        { status: TASK_STATUS.NOT_FINISH, title: TASK_STATUS_LABELS[TASK_STATUS.NOT_FINISH], colorClass: 'text-red-600 dark:text-red-400' },
    ];

    // Sync tasks từ hook
    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    // Group tasks theo status
    const groupedTasks = columns.reduce((acc, col) => {
        acc[col.status] = localTasks.filter((task) => task.Status === col.status);
        return acc;
    }, {});

    const handleDragStart = (event) => {
        const { active } = event;
        const task = localTasks.find((t) => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id;
        let newStatus = over.id;

        // Nếu thả lên task khác, lấy status của task đó
        if (typeof over.id === 'number' || !Object.values(TASK_STATUS).includes(over.id)) {
            const targetTask = localTasks.find((t) => t.id === over.id);
            if (targetTask) {
                newStatus = targetTask.Status;
            } else {
                return;
            }
        }

        const task = localTasks.find((t) => t.id === taskId);
        if (!task || task.Status === newStatus) return;

        // Optimistic update
        setLocalTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, Status: newStatus } : t))
        );

        try {
            await updateTaskStatus(taskId, newStatus);
        } catch (err) {
            console.error('Lỗi cập nhật status:', err);
            // Rollback
            setLocalTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, Status: task.Status } : t))
            );
            alert('Không thể cập nhật trạng thái task!');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className={DARK_MODE_COLORS.TEXT_TERTIARY}>Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${DARK_MODE_COLORS.NEAR_DEADLINE} text-red-600 dark:text-red-300 p-4 rounded`}>
                Lỗi: {error}
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.status}
                        status={col.status}
                        title={col.title}
                        colorClass={col.colorClass}
                        tasks={groupedTasks[col.status] || []}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="rotate-3 opacity-90 transition-transform duration-150">
                        <KanbanCard task={activeTask} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default KanbanBoard;