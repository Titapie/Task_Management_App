// src/components/tasks/TaskDetail.jsx
import React from 'react';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants';

const TaskDetail = ({ task, onEdit, onDelete }) => {
    if (!task) return null;

    return (
        <div className="bg-blue-400 p-6 rounded border">
            <h2 className="text-2xl text-gray-700 font-bold mb-4">{task.TaskName}</h2>

            <div className="space-y-3">
                <div>
                    <span className="font-semibold text-gray-700">Mô tả: </span>
                    <p className="text-gray-700">{task.Description || 'Không có mô tả'}</p>
                </div>

                <div>
                    <span className="font-semibold text-gray-700">Trạng thái: </span>
                    <span className="px-3 py-1 bg-blue-300 rounded">
            {TASK_STATUS_LABELS[task.Status]}
          </span>
                </div>

                <div>
                    <span className="font-semibold text-gray-700">Ưu tiên: </span>
                    <span className="px-3 py-1 bg-gray-300 rounded">
            {PRIORITY_LABELS[task.Priority]}
          </span>
                </div>

                {task.project_name && (
                    <div>
                        <span className="font-semibold text-gray-700">Dự án: </span>
                        {task.project_name}
                    </div>
                )}

                {task.creator_name && (
                    <div >
                        <span className="font-semibold text-gray-700">Người tạo: </span>
                        {task.creator_name}
                    </div>
                )}

                {task.Start_date && (
                    <div>
                        <span className="font-semibold text-gray-700">Ngày bắt đầu: </span>
                        {new Date(task.Start_date).toLocaleDateString('vi-VN')}
                    </div>
                )}

                {task.End_date && (
                    <div>
                        <span className="font-semibold text-gray-700">Deadline: </span>
                        {new Date(task.End_date).toLocaleDateString('vi-VN')}
                    </div>
                )}

                {task.TaskMembers && task.TaskMembers.length > 0 && (
                    <div>
                        <span className="font-semibold">Thành viên: </span>
                        <div className="flex gap-2 mt-2">
                            {task.TaskMembers.map((member) => (
                                <div key={member.id} className="bg-gray-300 px-3 py-1 rounded">
                                    {member.FirstName} {member.LastName}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2 mt-6">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Chỉnh sửa
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Xóa
                </button>
            </div>
        </div>
    );
};

export default TaskDetail;