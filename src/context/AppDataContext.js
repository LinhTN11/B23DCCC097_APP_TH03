import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import assignmentService from '../api/assignmentService';
import courseService from '../api/courseService';
import gradeService from '../api/gradeService';
import studentService from '../api/studentService';
import { STUDENT_ID } from '../config';
import { getCache, setCache } from '../storage/cache';
import {
  enqueue,
  getAll as getOutboxActions,
  onSyncComplete,
  subscribe,
  update as updateOutboxAction,
} from '../storage/outbox';
import useNetworkStatus from '../hooks/useNetworkStatus';

const AppDataContext = createContext(undefined);

function localAssignmentFromAction(action) {
  if (action.method !== 'POST' || !action.localId) {
    return null;
  }
  return {
    ...(action.body || {}),
    id: action.localId,
    _pending: true,
  };
}

function isLocalId(id) {
  return String(id).startsWith('local-');
}

export function AppDataProvider({ children }) {
  const { isOnline } = useNetworkStatus();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [serverAssignments, setServerAssignments] = useState([]);
  const [localAssignments, setLocalAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const studentRef = useRef(null);
  const coursesRef = useRef([]);
  const serverAssignmentsRef = useRef([]);
  const localAssignmentsRef = useRef([]);
  const gradesRef = useRef([]);
  const isOnlineRef = useRef(isOnline);
  const previousOnline = useRef(null);
  const refreshAllRef = useRef(null);

  useEffect(() => {
    studentRef.current = student;
  }, [student]);

  useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  useEffect(() => {
    serverAssignmentsRef.current = serverAssignments;
  }, [serverAssignments]);

  useEffect(() => {
    localAssignmentsRef.current = localAssignments;
  }, [localAssignments]);

  useEffect(() => {
    gradesRef.current = grades;
  }, [grades]);

  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  const hasAnyData = useCallback(() => {
    return Boolean(
      studentRef.current ||
        coursesRef.current.length > 0 ||
        serverAssignmentsRef.current.length > 0 ||
        gradesRef.current.length > 0,
    );
  }, []);

  const persistCache = useCallback(async (name, data) => {
    const savedAt = await setCache(name, data);
    setLastUpdated((current) => (!current || savedAt > current ? savedAt : current));
    return savedAt;
  }, []);

  const refreshAll = useCallback(
    async (options = {}) => {
      const { silent = false } = options;

      if (!isOnlineRef.current) {
        setRefreshing(false);
        setLoading(false);
        return;
      }

      if (!silent) {
        setRefreshing(true);
      }
      if (!hasAnyData()) {
        setLoading(true);
      }

      const results = await Promise.allSettled([
        studentService.getById(STUDENT_ID),
        courseService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      const [studentResult, coursesResult, assignmentsResult, gradesResult] =
        results;
      let successCount = 0;

      if (studentResult.status === 'fulfilled') {
        studentRef.current = studentResult.value;
        setStudent(studentResult.value);
        await persistCache('student', studentResult.value);
        successCount += 1;
      }

      if (coursesResult.status === 'fulfilled') {
        coursesRef.current = coursesResult.value;
        setCourses(coursesResult.value);
        await persistCache('courses', coursesResult.value);
        successCount += 1;
      }

      if (assignmentsResult.status === 'fulfilled') {
        serverAssignmentsRef.current = assignmentsResult.value;
        setServerAssignments(assignmentsResult.value);
        await persistCache('assignments', assignmentsResult.value);
        successCount += 1;
      }

      if (gradesResult.status === 'fulfilled') {
        gradesRef.current = gradesResult.value;
        setGrades(gradesResult.value);
        await persistCache('grades', gradesResult.value);
        successCount += 1;
      }

      if (successCount > 0) {
        setError(null);
      } else {
        const firstError = results.find((item) => item.status === 'rejected');
        setError(
          firstError && firstError.reason
            ? firstError.reason
            : { message: 'Không tải được dữ liệu. Vui lòng thử lại.' },
        );
      }

      setLoading(false);
      if (!silent) {
        setRefreshing(false);
      }
    },
    [hasAnyData, persistCache],
  );

  refreshAllRef.current = refreshAll;

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const [studentCache, coursesCache, assignmentsCache, gradesCache, actions] =
        await Promise.all([
          getCache('student'),
          getCache('courses'),
          getCache('assignments'),
          getCache('grades'),
          getOutboxActions(),
        ]);

      if (!active) {
        return;
      }

      const cachedTimes = [];
      if (studentCache) {
        cachedTimes.push(studentCache.savedAt);
        setStudent((current) => current || studentCache.data);
        if (!studentRef.current) {
          studentRef.current = studentCache.data;
        }
      }
      if (coursesCache) {
        cachedTimes.push(coursesCache.savedAt);
        setCourses((current) => (current.length ? current : coursesCache.data));
        if (!coursesRef.current.length) {
          coursesRef.current = coursesCache.data;
        }
      }
      if (assignmentsCache) {
        cachedTimes.push(assignmentsCache.savedAt);
        setServerAssignments((current) =>
          current.length ? current : assignmentsCache.data,
        );
        if (!serverAssignmentsRef.current.length) {
          serverAssignmentsRef.current = assignmentsCache.data;
        }
      }
      if (gradesCache) {
        cachedTimes.push(gradesCache.savedAt);
        setGrades((current) => (current.length ? current : gradesCache.data));
        if (!gradesRef.current.length) {
          gradesRef.current = gradesCache.data;
        }
      }

      const pendingLocal = actions
        .map(localAssignmentFromAction)
        .filter(Boolean);
      localAssignmentsRef.current = pendingLocal;
      setLocalAssignments(pendingLocal);

      if (cachedTimes.length > 0) {
        const latest = cachedTimes.sort().reverse()[0];
        setLastUpdated((current) => (!current || latest > current ? latest : current));
        setLoading(false);
      }
    };

    hydrate();

    const unsubscribe = subscribe((nextActions) => {
      if (!active) {
        return;
      }
      const pendingLocal = nextActions
        .map(localAssignmentFromAction)
        .filter(Boolean);
      localAssignmentsRef.current = pendingLocal;
      setLocalAssignments(pendingLocal);
    });

    const unsubscribeSync = onSyncComplete(() => {
      if (active) {
        refreshAllRef.current({ silent: true });
      }
    });

    return () => {
      active = false;
      unsubscribe();
      unsubscribeSync();
    };
  }, []);

  useEffect(() => {
    const wasOnline = previousOnline.current;
    previousOnline.current = isOnline;

    if (!isOnline) {
      setError(null);
      setLoading(false);
      return;
    }

    if (wasOnline === null || wasOnline === false) {
      refreshAllRef.current({ silent: true });
    }
  }, [isOnline]);

  const updateProfile = useCallback(
    async (fields) => {
      const previous = studentRef.current;
      const now = new Date().toISOString();
      const optimistic = { ...(previous || {}), ...fields, updatedAt: now };
      const baseUpdatedAt = previous ? previous.updatedAt : undefined;

      studentRef.current = optimistic;
      setStudent(optimistic);
      await persistCache('student', optimistic);

      const queueChange = async () => {
        await enqueue({
          method: 'PATCH',
          url: `/students/${STUDENT_ID}`,
          body: { ...fields, baseUpdatedAt, updatedAt: now },
        });
      };

      if (!isOnlineRef.current) {
        await queueChange();
        return { queued: true, student: optimistic };
      }

      try {
        const updated = await studentService.update(STUDENT_ID, {
          ...fields,
          updatedAt: now,
        });
        studentRef.current = updated;
        setStudent(updated);
        await persistCache('student', updated);
        return { queued: false, student: updated };
      } catch (updateError) {
        if (
          updateError &&
          (updateError.type === 'network' || updateError.type === 'timeout')
        ) {
          await queueChange();
          return { queued: true, student: optimistic };
        }
        studentRef.current = previous;
        setStudent(previous);
        if (previous) {
          await persistCache('student', previous);
        }
        throw updateError;
      }
    },
    [persistCache],
  );

  const toggleAssignment = useCallback(
    async (id) => {
      const target = [...serverAssignmentsRef.current, ...localAssignmentsRef.current].find(
        (item) => String(item.id) === String(id),
      );
      if (!target) {
        return { queued: false };
      }

      const previousStatus = target.status || 'todo';
      const nextStatus = previousStatus === 'done' ? 'todo' : 'done';
      const now = new Date().toISOString();
      const baseUpdatedAt = target.updatedAt;

      if (isLocalId(id)) {
        const nextLocal = localAssignmentsRef.current.map((item) =>
          String(item.id) === String(id)
            ? { ...item, status: nextStatus, updatedAt: now }
            : item,
        );
        localAssignmentsRef.current = nextLocal;
        setLocalAssignments(nextLocal);

        const pendingActions = await getOutboxActions();
        const pending = pendingActions.find(
          (action) => String(action.localId) === String(id),
        );
        if (pending) {
          await updateOutboxAction(pending.id, {
            body: { status: nextStatus, updatedAt: now },
          });
        }
        return { queued: true };
      }

      const previousList = serverAssignmentsRef.current;
      const optimisticList = previousList.map((item) =>
        String(item.id) === String(id)
          ? { ...item, status: nextStatus, updatedAt: now }
          : item,
      );
      serverAssignmentsRef.current = optimisticList;
      setServerAssignments(optimisticList);
      await persistCache('assignments', optimisticList);

      const queueChange = async () => {
        await enqueue({
          method: 'PATCH',
          url: `/assignments/${id}`,
          body: { status: nextStatus, baseUpdatedAt, updatedAt: now },
        });
      };

      if (!isOnlineRef.current) {
        await queueChange();
        return { queued: true };
      }

      try {
        const updated = await assignmentService.update(id, {
          status: nextStatus,
          updatedAt: now,
        });
        const nextList = serverAssignmentsRef.current.map((item) =>
          String(item.id) === String(id) ? updated : item,
        );
        serverAssignmentsRef.current = nextList;
        setServerAssignments(nextList);
        await persistCache('assignments', nextList);
        return { queued: false };
      } catch (updateError) {
        if (
          updateError &&
          (updateError.type === 'network' || updateError.type === 'timeout')
        ) {
          await queueChange();
          return { queued: true };
        }
        serverAssignmentsRef.current = previousList;
        setServerAssignments(previousList);
        await persistCache('assignments', previousList);
        throw updateError;
      }
    },
    [persistCache],
  );

  const addAssignment = useCallback(
    async (input) => {
      const now = new Date().toISOString();
      const localId = `local-${Date.now()}`;
      const payload = {
        courseId: input.courseId,
        title: String(input.title || '').trim(),
        description: String(input.description || '').trim(),
        dueDate: input.dueDate,
        status: 'todo',
        updatedAt: now,
      };
      const localItem = {
        ...payload,
        id: localId,
        _pending: true,
      };

      if (!isOnlineRef.current) {
        await enqueue({
          method: 'POST',
          url: '/assignments',
          body: payload,
          localId,
        });
        return { queued: true, item: localItem };
      }

      const optimistic = [...localAssignmentsRef.current, localItem];
      localAssignmentsRef.current = optimistic;
      setLocalAssignments(optimistic);

      try {
        const created = await assignmentService.create(payload);
        const withoutLocal = localAssignmentsRef.current.filter(
          (item) => item.id !== localId,
        );
        localAssignmentsRef.current = withoutLocal;
        setLocalAssignments(withoutLocal);

        const nextList = [...serverAssignmentsRef.current, created];
        serverAssignmentsRef.current = nextList;
        setServerAssignments(nextList);
        await persistCache('assignments', nextList);
        return { queued: false, item: created };
      } catch (createError) {
        if (
          createError &&
          (createError.type === 'network' || createError.type === 'timeout')
        ) {
          await enqueue({
            method: 'POST',
            url: '/assignments',
            body: payload,
            localId,
          });
          return { queued: true, item: localItem };
        }
        const withoutLocal = localAssignmentsRef.current.filter(
          (item) => item.id !== localId,
        );
        localAssignmentsRef.current = withoutLocal;
        setLocalAssignments(withoutLocal);
        throw createError;
      }
    },
    [persistCache],
  );

  const assignments = useMemo(() => {
    const courseMap = new Map(
      courses.map((course) => [String(course.id), course]),
    );
    const localItems = localAssignments.map((item) => ({
      ...item,
      course:
        item.course || courseMap.get(String(item.courseId)) || null,
    }));
    return [...localItems, ...serverAssignments];
  }, [localAssignments, serverAssignments, courses]);

  const value = useMemo(
    () => ({
      student,
      courses,
      assignments,
      grades,
      loading,
      refreshing,
      error,
      lastUpdated,
      refreshAll,
      updateProfile,
      toggleAssignment,
      addAssignment,
    }),
    [
      student,
      courses,
      assignments,
      grades,
      loading,
      refreshing,
      error,
      lastUpdated,
      refreshAll,
      updateProfile,
      toggleAssignment,
      addAssignment,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được dùng bên trong AppDataProvider');
  }
  return context;
}

export default AppDataContext;
