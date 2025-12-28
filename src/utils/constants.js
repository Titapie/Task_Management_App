export const TASK_STATUS = {
    INITIAL: 'initial',
    DOING: 'doing',
    PENDING: 'pending',
    FINISH: 'finish',
    NOT_FINISH: 'notFinish',
};

export const TASK_STATUS_LABELS = {
    [TASK_STATUS.INITIAL]: 'Khởi tạo',
    [TASK_STATUS.DOING]: 'Đang làm',
    [TASK_STATUS.PENDING]: 'Chờ xử lý',
    [TASK_STATUS.FINISH]: 'Hoàn thành',
    [TASK_STATUS.NOT_FINISH]: 'Hỏng',
};

export const PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
};

export const PRIORITY_LABELS = {
    [PRIORITY.LOW]: 'Thấp',
    [PRIORITY.MEDIUM]: 'Trung bình',
    [PRIORITY.HIGH]: 'Cao'
};

export const CHART_COLORS = {
    PRIMARY: 'bg-blue-500',
    SUCCESS: 'bg-green-500',
    WARNING: 'bg-yellow-500',
    DANGER: 'bg-red-500',
    INFO: 'bg-purple-500',
    GRAY: 'bg-gray-400'
};

// Priority colors - badge styles
export const PRIORITY_COLORS = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
};

export const STATUS_COLORS = {
    initial: 'bg-gray-300 text-gray-800',
    doing: 'bg-blue-300 text-blue-800',
    pending: 'bg-yellow-300 text-yellow-800',
    finish: 'bg-green-300 text-green-800',
    notFinish: 'bg-red-300 text-red-800',
};

// export const API_BASE_URL = 'http://localhost:5000/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const DEFAULT_PAGE_SIZE = 10;