import React from 'react';
import { DARK_MODE_COLORS } from '../../utils/constants';
import Select from '../common/Select';

const ProjectFilter = ({ value, onChange, projects }) => {
    return (
        <div className={`${DARK_MODE_COLORS.BG_PRIMARY} p-6 rounded-xl shadow-lg border ${DARK_MODE_COLORS.BORDER_PRIMARY} transition-all duration-300 mb-6`}>
            <div className="animate-fade-in-fast">
                <label className={`block text-sm font-medium ${DARK_MODE_COLORS.TEXT_LABEL} mb-2`}>
                    Lọc theo dự án
                </label>
                <Select
                    value={value}
                    onChange={onChange}
                    options={[
                        { value: '', label: 'Tất cả dự án' },
                        ...projects.map((project) => ({
                            value: project.id,
                            label: project.Name
                        }))
                    ]}
                    className="transition-all duration-200 focus:scale-[1.01]"
                />
            </div>
        </div>
    );
};

export default ProjectFilter;