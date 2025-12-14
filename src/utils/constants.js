export const TASK_STATUS = {
  INITIAL: 'initial',
  DOING: 'doing',
  FINISH: 'finish',
  PENDING: 'pending',
  NOT_FINISH: 'notFinish'
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.INITIAL]: 'Khởi tạo',
  [TASK_STATUS.DOING]: 'Đang làm',
  [TASK_STATUS.FINISH]: 'Hoàn thành',
  [TASK_STATUS.PENDING]: 'Chờ xử lý',
  [TASK_STATUS.NOT_FINISH]: 'Chưa hoàn thành'
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

// export const API_BASE_URL = 'http://localhost:5000/api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const DEFAULT_PAGE_SIZE = 10;