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
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

export const STATUS_COLORS = {
    initial: 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    doing: 'bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-300',
    pending: 'bg-yellow-300 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-300',
    finish: 'bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-300',
    notFinish: 'bg-red-300 text-red-800 dark:bg-red-700 dark:text-red-300',
};

// Dark Mode Colors - Reusable classes
export const DARK_MODE_COLORS = {
    // Backgrounds
    BG_PRIMARY: 'bg-white dark:bg-slate-800',
    BG_SECONDARY: 'bg-gray-50 dark:bg-slate-900',
    BG_CARD: 'bg-white dark:bg-slate-700',
    BG_HOVER: 'hover:bg-gray-50 dark:hover:bg-slate-700',
    BG_INPUT: 'bg-white dark:bg-slate-700',
    BG_GRADIENT: 'bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700',
    
    // Text Colors
    TEXT_PRIMARY: 'text-gray-900 dark:text-white',
    TEXT_SECONDARY: 'text-gray-600 dark:text-slate-400',
    TEXT_TERTIARY: 'text-gray-500 dark:text-slate-500',
    TEXT_LABEL: 'text-gray-700 dark:text-slate-300',
    
    // Borders
    BORDER_PRIMARY: 'border-gray-200 dark:border-slate-700',
    BORDER_SECONDARY: 'border-gray-100 dark:border-slate-600',
    BORDER_INPUT: 'border-gray-200 dark:border-slate-600',
    
    // Buttons
    BTN_PRIMARY: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700',
    BTN_SECONDARY: 'bg-gray-500 hover:bg-gray-600 dark:bg-slate-600 dark:hover:bg-slate-700',
    BTN_DANGER: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    BTN_OUTLINE: 'border hover:bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600',
    
    // Tables
    TABLE_HEADER: 'bg-gray-100 dark:bg-slate-700',
    TABLE_ROW: 'hover:bg-gray-50 dark:hover:bg-slate-700/50',
    TABLE_BORDER: 'border dark:border-slate-700',
    
    // Cards
    CARD_SHADOW: 'shadow-sm hover:shadow-md dark:hover:shadow-slate-900/30',
    
    // Badges
    BADGE_GRAY: 'bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-slate-300',
    BADGE_PROJECT: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    
    // Avatar & Members
    AVATAR_MEMBER: 'bg-blue-500 dark:bg-blue-600 text-white',
    AVATAR_MORE: 'bg-gray-400 dark:bg-slate-600 text-white',
    AVATAR_BORDER: 'border-2 border-white dark:border-slate-700',
    
    // Icons
    ICON_CHECK_BG: 'bg-blue-600 dark:bg-blue-700',
    
    // Special States
    NEAR_DEADLINE: 'bg-red-100 dark:bg-red-900/30',
    
    // Placeholders
    PLACEHOLDER: 'placeholder-gray-400 dark:placeholder-slate-400',
};

// export const API_BASE_URL = 'http://localhost:5000/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const DEFAULT_PAGE_SIZE = 10;