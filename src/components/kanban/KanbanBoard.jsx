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

const KanbanBoard = ({ filters }) => {
  const { tasks, loading, error, fetchTasks } = useTasks();
  const [activeTask, setActiveTask] = useState(null);
  const [localTasks, setLocalTasks] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Kéo 8px mới kích hoạt drag
      },
    })
  );

  // Cấu hình 5 cột theo status backend
  const columns = [
    { status: 'initial', title: 'Khởi tạo', colorClass: 'text-gray-600' },
    { status: 'doing', title: 'Đang làm', colorClass: 'text-blue-600' },
    { status: 'pending', title: 'Chờ duyệt', colorClass: 'text-yellow-600' },
    { status: 'finish', title: 'Hoàn thành', colorClass: 'text-green-600' },
    { status: 'notFinish', title: 'Thất bại', colorClass: 'text-red-600' },
  ];

  // Load tasks khi component mount hoặc filters thay đổi
  useEffect(() => {
    fetchTasks({ ...filters, limit: 1000 }); // Load nhiều tasks cho kanban
  }, [filters]);

  // Sync tasks từ hook vào local state
  useEffect(() => {
    if (tasks.length > 0) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  // Group tasks theo status
  const groupedTasks = columns.reduce((acc, col) => {
    acc[col.status] = localTasks.filter((task) => task.Status === col.status);
    return acc;
  }, {});

  // Handle khi bắt đầu kéo
  const handleDragStart = (event) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  // Handle khi thả task
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Tìm task đang kéo
    const task = localTasks.find((t) => t.id === taskId);
    if (!task || task.Status === newStatus) return;

    // Optimistic update (cập nhật UI trước)
    setLocalTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, Status: newStatus } : t))
    );

    try {
      // Gọi API cập nhật status
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Lỗi cập nhật status:', err);
      // Rollback nếu lỗi
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, Status: task.Status } : t))
      );
      alert('Không thể cập nhật trạng thái task!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
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
      <div className="flex gap-4 overflow-x-auto pb-4">
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

      {/* DragOverlay hiển thị card khi đang kéo */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <KanbanCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;