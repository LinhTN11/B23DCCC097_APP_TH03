import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_TTL } from '../config';
import { cacheKey } from './keys';

export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(key));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.data === undefined || !parsed.savedAt) {
      return null;
    }
    return {
      data: parsed.data,
      savedAt: parsed.savedAt,
      expired: Date.now() - new Date(parsed.savedAt).getTime() > CACHE_TTL,
    };
  } catch (error) {
    return null;
  }
}

export async function setCache(key, data) {
  const savedAt = new Date().toISOString();
  try {
    await AsyncStorage.setItem(cacheKey(key), JSON.stringify({ data, savedAt }));
  } catch (error) {
    return savedAt;
  }
  return savedAt;
}

export async function clearCache(key) {
  await AsyncStorage.removeItem(cacheKey(key));
}
