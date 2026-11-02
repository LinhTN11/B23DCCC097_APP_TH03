import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';

const changeListeners = new Set();
const syncListeners = new Set();
let counter = 0;

function notifyChange(actions) {
  changeListeners.forEach((listener) => {
    try {
      listener(actions);
    } catch (error) {
      // Listener lỗi không được làm hỏng luồng outbox.
    }
  });
}

function notifySyncComplete(payload) {
  syncListeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (error) {
      // Bỏ qua lỗi của listener.
    }
  });
}

export function subscribe(listener) {
  changeListeners.add(listener);
  return () => changeListeners.delete(listener);
}

export function onSyncComplete(listener) {
  syncListeners.add(listener);
  return () => syncListeners.delete(listener);
}

export function emitSyncComplete(payload) {
  notifySyncComplete(payload);
}

async function persist(actions) {
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions));
  notifyChange(actions);
  return actions;
}

export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export async function enqueue(action) {
  const actions = await getAll();
  counter += 1;
  const id = `${Date.now()}-${counter}`;
  const entry = {
    id,
    method: action.method,
    url: action.url,
    body: action.body || {},
    createdAt: action.createdAt || new Date().toISOString(),
    localId: action.localId,
  };
  const next = [...actions, entry];
  await persist(next);
  return entry;
}

export async function remove(id) {
  const actions = await getAll();
  const next = actions.filter((action) => action.id !== id);
  await persist(next);
  return next;
}

export async function update(id, patch) {
  const actions = await getAll();
  const next = actions.map((action) =>
    action.id === id
      ? {
          ...action,
          ...patch,
          body: { ...action.body, ...(patch.body || {}) },
        }
      : action,
  );
  await persist(next);
  return next;
}

export async function clear() {
  await AsyncStorage.removeItem(OUTBOX_KEY);
  notifyChange([]);
}
