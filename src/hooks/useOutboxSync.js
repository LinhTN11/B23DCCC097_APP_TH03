import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { request } from '../api/client';
import { emitSyncComplete, getAll, remove, subscribe } from '../storage/outbox';
import useNetworkStatus from './useNetworkStatus';

function parseResource(url) {
  const match = String(url || '').match(/\/(students|assignments)\/(\d+)/);
  if (!match) {
    return null;
  }
  return { resource: match[1], id: match[2] };
}

function hasConflict(serverRecord, action) {
  if (!serverRecord || !serverRecord.updatedAt) {
    return false;
  }
  const serverTime = new Date(serverRecord.updatedAt).getTime();
  const baseValue = action.body && action.body.baseUpdatedAt;
  const baseTime = baseValue
    ? new Date(baseValue).getTime()
    : new Date(action.createdAt).getTime();
  if (Number.isNaN(serverTime) || Number.isNaN(baseTime)) {
    return false;
  }
  return serverTime > baseTime;
}

function pendingIdOf(action) {
  if (action.method === 'POST') {
    return action.localId || null;
  }
  const resource = parseResource(action.url);
  return resource ? resource.id : null;
}

export default function useOutboxSync() {
  const { isOnline } = useNetworkStatus();
  const [actions, setActions] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);
  const previousOnline = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let active = true;

    getAll().then((stored) => {
      if (active) {
        setActions(stored);
      }
    });

    const unsubscribe = subscribe((nextActions) => {
      if (active) {
        setActions(nextActions);
      }
    });

    return () => {
      active = false;
      mountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const syncNow = useCallback(async () => {
    if (syncingRef.current) {
      return;
    }

    const queue = await getAll();
    if (queue.length === 0) {
      return;
    }

    syncingRef.current = true;
    setSyncing(true);
    let syncedCount = 0;
    let conflictCount = 0;
    let failed = false;

    for (let index = 0; index < queue.length; index += 1) {
      const action = queue[index];
      try {
        if (action.method === 'PATCH') {
          const resource = parseResource(action.url);
          if (resource) {
            const serverRecord = await request(
              'GET',
              `/${resource.resource}/${resource.id}`,
            );
            if (hasConflict(serverRecord, action)) {
              await remove(action.id);
              conflictCount += 1;
              continue;
            }
          }
        }

        const body = { ...(action.body || {}) };
        delete body.baseUpdatedAt;
        if (action.method === 'PATCH') {
          body.updatedAt = new Date().toISOString();
        }

        await request(action.method, action.url, body);
        await remove(action.id);
        syncedCount += 1;
      } catch (error) {
        failed = true;
        break;
      }
    }

    syncingRef.current = false;
    if (mountedRef.current) {
      setSyncing(false);
    }

    if (syncedCount > 0) {
      Alert.alert(
        'Đồng bộ hoàn tất',
        `Đã đồng bộ ${syncedCount} thay đổi.`,
      );
      emitSyncComplete({ syncedCount, conflictCount });
    }

    if (conflictCount > 0) {
      Alert.alert(
        'Phát hiện xung đột dữ liệu',
        'Dữ liệu trên máy chủ mới hơn thay đổi offline. Ứng dụng ưu tiên dữ liệu máy chủ và đã bỏ thay đổi trên máy.',
      );
      emitSyncComplete({ syncedCount, conflictCount });
    }

    if (failed && syncedCount === 0 && conflictCount === 0) {
      Alert.alert(
        'Chưa thể đồng bộ',
        'Máy chủ chưa phản hồi. Các thay đổi vẫn được giữ lại để thử lại sau.',
      );
    }
  }, []);

  useEffect(() => {
    const wasOnline = previousOnline.current;
    previousOnline.current = isOnline;

    if (isOnline && (wasOnline === false || wasOnline === null)) {
      syncNow();
    }
  }, [isOnline, syncNow]);

  const pendingActionIds = actions
    .map((action) => pendingIdOf(action))
    .filter(Boolean)
    .map((id) => String(id));

  return {
    pendingCount: actions.length,
    pendingActionIds,
    pendingActions: actions,
    syncing,
    syncNow,
  };
}
