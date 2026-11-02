import { useCallback, useEffect, useMemo, useState } from 'react';
import { getCache, setCache } from '../storage/cache';
import {
  formatReminderMessage,
  getDueSoonAssignments,
} from '../utils/reminders';

const DISMISSED_CACHE_KEY = 'dismissed_reminders';
const REFRESH_INTERVAL_MS = 60 * 1000;

let memoryDismissedIds = [];

export function useAssignmentReminders(input = [], options = {}) {
  const isObjectInput =
    input && !Array.isArray(input) && typeof input === 'object';
  const assignments = useMemo(() => {
    if (isObjectInput) {
      return Array.isArray(input.assignments) ? input.assignments : [];
    }
    return Array.isArray(input) ? input : [];
  }, [input, isObjectInput]);
  const mergedOptions = isObjectInput ? { ...input, ...options } : options;
  const { windowHours = 24, now: customNow } = mergedOptions;

  const [tickNow, setTickNow] = useState(() =>
    customNow ? new Date(customNow) : new Date(),
  );
  const [dismissedIds, setDismissedIds] = useState(memoryDismissedIds);

  useEffect(() => {
    let mounted = true;
    getCache(DISMISSED_CACHE_KEY)
      .then((cached) => {
        if (mounted && cached && Array.isArray(cached.data)) {
          memoryDismissedIds = cached.data;
          setDismissedIds(cached.data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (customNow) {
      setTickNow(new Date(customNow));
      return undefined;
    }
    const timer = setInterval(() => {
      setTickNow(new Date());
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [customNow]);

  const allUrgent = useMemo(
    () => getDueSoonAssignments(assignments, tickNow, windowHours),
    [assignments, tickNow, windowHours],
  );

  const dismissedSet = useMemo(
    () => new Set((dismissedIds || []).map((id) => String(id))),
    [dismissedIds],
  );

  const urgentReminders = useMemo(
    () => allUrgent.filter((item) => !dismissedSet.has(String(item.id))),
    [allUrgent, dismissedSet],
  );

  const dueWithin24h = useMemo(
    () => urgentReminders.filter((item) => !item.isOverdue),
    [urgentReminders],
  );

  const overdueList = useMemo(
    () => urgentReminders.filter((item) => item.isOverdue),
    [urgentReminders],
  );

  const dismissReminder = useCallback(async (id) => {
    if (id === undefined || id === null) {
      return;
    }
    const strId = String(id);
    setDismissedIds((prev) => {
      const next = prev.some((item) => String(item) === strId)
        ? prev
        : [...prev, id];
      memoryDismissedIds = next;
      setCache(DISMISSED_CACHE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const resetDismissed = useCallback(async () => {
    memoryDismissedIds = [];
    setDismissedIds([]);
    await setCache(DISMISSED_CACHE_KEY, []).catch(() => {});
  }, []);

  return {
    dueWithin24h,
    overdueList,
    urgentReminders,
    allUrgent,
    unreadCount: urgentReminders.length,
    dismissedIds,
    dismissReminder,
    resetDismissed,
    formatReminderMessage,
  };
}

export default useAssignmentReminders;
