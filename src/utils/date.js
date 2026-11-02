const DAY_MS = 24 * 60 * 60 * 1000;

const DAY_NAMES = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
  7: 'Thứ Bảy',
  8: 'Chủ Nhật',
};

const pad = (value) => String(value).padStart(2, '0');

export function parseDate(value) {
  if (!value) {
    return null;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = parseDate(value);
  if (!date) {
    return '--/--/----';
  }
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTime(value) {
  const date = parseDate(value);
  if (!date) {
    return '--:--';
  }
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDateTime(value) {
  const date = parseDate(value);
  if (!date) {
    return '';
  }
  return `${formatTime(date)}, ${formatDate(date)}`;
}

export function isOverdue(dueDate, now = new Date()) {
  const date = parseDate(dueDate);
  if (!date) {
    return false;
  }
  return date.getTime() < now.getTime();
}

export function daysLeft(dueDate, now = new Date()) {
  const date = parseDate(dueDate);
  if (!date) {
    return 0;
  }
  return Math.ceil((date.getTime() - now.getTime()) / DAY_MS);
}

export function getDayName(dayOfWeek) {
  return DAY_NAMES[dayOfWeek] || `Thứ ${dayOfWeek}`;
}

export function getTodayDayOfWeek(date = new Date()) {
  const day = date.getDay();
  return day === 0 ? 8 : day + 1;
}

export function toDateTimeInput(date = new Date()) {
  const safeDate = parseDate(date) || new Date();
  return `${safeDate.getFullYear()}-${pad(safeDate.getMonth() + 1)}-${pad(
    safeDate.getDate(),
  )}T${pad(safeDate.getHours())}:${pad(safeDate.getMinutes())}`;
}
