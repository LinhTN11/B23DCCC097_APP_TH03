import {
  daysLeft,
  formatDate,
  formatDateTime,
  formatTime,
  getDayName,
  getTodayDayOfWeek,
  isOverdue,
  parseDate,
} from '../date';

describe('date utils', () => {
  it('parses valid dates and returns null for invalid', () => {
    expect(parseDate('2026-11-09T23:59:00Z')).toBeInstanceOf(Date);
    expect(parseDate(null)).toBeNull();
    expect(parseDate('invalid-date')).toBeNull();
  });

  it('formats dates and times correctly', () => {
    const iso = '2026-11-09T08:30:00.000Z';
    const date = new Date(iso);
    expect(formatDate(date)).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(formatTime(date)).toMatch(/\d{2}:\d{2}/);
    expect(formatDateTime(date)).toContain(',');
  });

  it('identifies overdue dates correctly', () => {
    const past = new Date('2026-10-01T00:00:00Z');
    const future = new Date('2026-12-01T00:00:00Z');
    const now = new Date('2026-11-01T00:00:00Z');

    expect(isOverdue(past, now)).toBe(true);
    expect(isOverdue(future, now)).toBe(false);
  });

  it('calculates days left', () => {
    const now = new Date('2026-11-01T00:00:00Z');
    const target = new Date('2026-11-05T00:00:00Z');
    expect(daysLeft(target, now)).toBe(4);
  });

  it('maps dayOfWeek correctly (2=T2 ... 8=CN)', () => {
    expect(getDayName(2)).toBe('Thứ Hai');
    expect(getDayName(3)).toBe('Thứ Ba');
    expect(getDayName(7)).toBe('Thứ Bảy');
    expect(getDayName(8)).toBe('Chủ Nhật');
  });

  it('converts JS getDay to project dayOfWeek (2..8)', () => {
    // Sunday in JS is 0 -> should be 8
    const sunday = new Date('2026-11-08T10:00:00Z'); // Sunday
    expect(getTodayDayOfWeek(sunday)).toBe(8);

    // Monday in JS is 1 -> should be 2
    const monday = new Date('2026-11-09T10:00:00Z'); // Monday
    expect(getTodayDayOfWeek(monday)).toBe(2);
  });
});

