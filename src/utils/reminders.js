import { parseDate } from './date';

const HOUR_MS = 60 * 60 * 1000;

export function getHoursLeft(dueDate, now = new Date()) {
  const target = parseDate(dueDate);
  const current = parseDate(now) || new Date();
  if (!target) {
    return null;
  }
  const diffMs = target.getTime() - current.getTime();
  return Math.round((diffMs / HOUR_MS) * 10) / 10;
}

export function isDueWithin24Hours(dueDate, now = new Date(), windowHours = 24) {
  const hoursLeft = getHoursLeft(dueDate, now);
  if (hoursLeft === null) {
    return false;
  }
  return hoursLeft > 0 && hoursLeft <= windowHours;
}

export function buildUrgencyLabel(hoursLeft) {
  if (hoursLeft === null || Number.isNaN(hoursLeft)) {
    return 'Chưa rõ hạn nộp';
  }
  if (hoursLeft <= 0) {
    const overdueHours = Math.max(1, Math.round(Math.abs(hoursLeft)));
    if (overdueHours < 24) {
      return `Quá hạn ${overdueHours} giờ`;
    }
    const overdueDays = Math.max(1, Math.round(overdueHours / 24));
    return `Quá hạn ${overdueDays} ngày`;
  }
  if (hoursLeft < 1) {
    const minutesLeft = Math.max(1, Math.round(hoursLeft * 60));
    return `Còn ${minutesLeft} phút`;
  }
  const roundedHours = Math.max(1, Math.ceil(hoursLeft));
  return `Còn ${roundedHours} giờ`;
}

export function formatReminderMessage(item) {
  if (!item) {
    return '';
  }
  const label = item.urgencyLabel || buildUrgencyLabel(item.hoursLeft);
  const coursePrefix = item.courseName ? ` (${item.courseName})` : '';
  return `${label}: ${item.title || 'Bài tập'}${coursePrefix}`;
}

export function getDueSoonAssignments(
  assignments = [],
  now = new Date(),
  windowHours = 24,
) {
  if (!Array.isArray(assignments)) {
    return [];
  }

  const current = parseDate(now) || new Date();

  return assignments
    .filter((item) => item && item.status !== 'done' && item.dueDate)
    .map((item) => {
      const hoursLeft = getHoursLeft(item.dueDate, current);
      if (hoursLeft === null || hoursLeft > windowHours) {
        return null;
      }
      const overdue = hoursLeft <= 0;
      const courseName =
        item.courseName ||
        (item.course && item.course.name) ||
        (item.courseId ? `Môn #${item.courseId}` : 'Học phần PTIT');
      const urgencyLabel = buildUrgencyLabel(hoursLeft);
      const enriched = {
        ...item,
        id: item.id,
        title: item.title || 'Bài tập chưa đặt tên',
        courseName,
        dueDate: item.dueDate,
        hoursLeft,
        isOverdue: overdue,
        isDueWithin24h: !overdue && hoursLeft <= windowHours,
        urgencyLabel,
      };
      return {
        ...enriched,
        message: formatReminderMessage(enriched),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.isOverdue !== b.isOverdue) {
        return a.isOverdue ? 1 : -1;
      }
      if (!a.isOverdue) {
        return a.hoursLeft - b.hoursLeft;
      }
      return b.hoursLeft - a.hoursLeft;
    });
}

export default {
  getHoursLeft,
  isDueWithin24Hours,
  buildUrgencyLabel,
  formatReminderMessage,
  getDueSoonAssignments,
};
