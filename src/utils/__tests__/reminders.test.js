import {
  formatReminderMessage,
  getDueSoonAssignments,
  isDueWithin24Hours,
} from '../reminders';

describe('utils/reminders (24h due reminder engine)', () => {
  const now = new Date('2026-11-02T15:00:00Z');

  it('detects assignments due within 24 hours and overdue assignments', () => {
    const assignments = [
      {
        id: 1,
        title: 'Báo cáo TH4',
        dueDate: '2026-11-03T06:00:00Z', // +15h
        status: 'todo',
        course: { name: 'Phát triển ứng dụng di động' },
      },
      {
        id: 2,
        title: 'Bài tập đã xong',
        dueDate: '2026-11-03T02:00:00Z',
        status: 'done',
      },
      {
        id: 3,
        title: 'Bài tập quá hạn',
        dueDate: '2026-11-01T10:00:00Z', // overdue
        status: 'todo',
      },
      {
        id: 4,
        title: 'Bài tập tuần sau',
        dueDate: '2026-11-09T23:59:00Z',
        status: 'todo',
      },
    ];

    const list = getDueSoonAssignments(assignments, now, 24);
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe(1);
    expect(list[0].isDueWithin24h).toBe(true);
    expect(list[1].id).toBe(3);
    expect(list[1].isOverdue).toBe(true);
    expect(formatReminderMessage(list[0])).toContain('Báo cáo TH4');
  });

  it('checks isDueWithin24Hours accurately', () => {
    expect(isDueWithin24Hours('2026-11-03T10:00:00Z', now, 24)).toBe(true);
    expect(isDueWithin24Hours('2026-11-05T10:00:00Z', now, 24)).toBe(false);
  });
});
