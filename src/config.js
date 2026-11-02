// Android emulator dùng 10.0.2.2 để trỏ tới máy tính đang chạy json-server.
// Máy thật: đổi sang http://<IP-LAN>:3000 (ví dụ http://192.168.1.10:3000).
export const BASE_URL = 'http://10.0.2.2:3000';
export const TIMEOUT = 10000;
export const CACHE_TTL = 24 * 60 * 60 * 1000;

export const SEMESTER_OPTIONS = [
  'Tất cả',
  'HK1 2026-2027',
  'HK2 2025-2026',
  'HK1 2025-2026',
];

export const STUDENT_ID = 1;
