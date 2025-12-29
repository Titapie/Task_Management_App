import React from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { DARK_MODE_COLORS } from '../utils/constants';

const KanbanPage = () => {
    return (
        <div className={`min-h-screen ${DARK_MODE_COLORS.BG_SECONDARY} p-6`}>
            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Kanban Board</h1>
            </div>

            {/* Kanban Board - FULL WIDTH */}
            <div className="w-full">
                <KanbanBoard filters={{}} />
            </div>
        </div>
    );
};

export default KanbanPage;