export const CACHE_PREFIX = 'cache:';
export const OUTBOX_KEY = 'outbox';

export const CACHE_KEYS = {
  student: 'student',
  courses: 'courses',
  assignments: 'assignments',
  grades: 'grades',
  sessions: 'sessions',
};

export function cacheKey(name) {
  return `${CACHE_PREFIX}${name}`;
}
