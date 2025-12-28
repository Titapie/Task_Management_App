import React from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';

const KanbanPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">📋 Kanban Board</h1>
            </div>

            {/* Kanban Board - FULL WIDTH */}
            <div className="w-full">
                <KanbanBoard filters={{}} />
            </div>
        </div>
    );
};

export default KanbanPage;