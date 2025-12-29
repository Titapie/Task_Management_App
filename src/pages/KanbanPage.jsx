import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ProjectFilter from '../components/kanban/ProjectFilter';
import { DARK_MODE_COLORS } from '../utils/constants';
import projectService from '../services/projectService';

const KanbanPage = () => {
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch danh sách projects khi component mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectService.getAllProjectsNoPagination();
                setProjects(response.projects || []);
            } catch (error) {
                console.error('Lỗi khi tải danh sách dự án:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectChange = (e) => {
        setProjectId(e.target.value);
    };

    return (
        <div className={`min-h-screen ${DARK_MODE_COLORS.BG_SECONDARY} p-6`}>
            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${DARK_MODE_COLORS.TEXT_PRIMARY}`}>Kanban Board</h1>
            </div>

            {/* Project Filter */}
            {!loading && (
                <ProjectFilter
                    value={projectId}
                    onChange={handleProjectChange}
                    projects={projects}
                />
            )}

            {/* Kanban Board - FULL WIDTH */}
            <div className="w-full">
                <KanbanBoard filters={{ project_id: projectId }} />
            </div>
        </div>
    );
};

export default KanbanPage;