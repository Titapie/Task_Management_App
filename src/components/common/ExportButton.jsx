import React, { useState } from 'react';
import { Download } from 'lucide-react';
import taskService from '../../services/taskService';

const ExportButton = ({ filters = {} }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const blob = await taskService.exportTasks(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasks_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert('Lỗi xuất file: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold
            bg-green-500 dark:bg-green-600 
            text-white 
            hover:bg-green-600 dark:hover:bg-green-700
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-sm hover:shadow-md
            transition-all duration-200
            active:scale-95
            flex items-center gap-2"
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xuất...
                </>
            ) : (
                <>
                    <Download size={16} />
                    Xuất Excel
                </>
            )}
        </button>
    );
};

export default ExportButton;