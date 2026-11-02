import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCache, getCache, setCache } from '../cache';

describe('cache storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns null when cache does not exist', async () => {
    const cached = await getCache('courses');
    expect(cached).toBeNull();
  });

  it('sets and retrieves cache with savedAt timestamp', async () => {
    const sampleData = [{ id: 1, name: 'Lập trình di động' }];
    const savedAt = await setCache('courses', sampleData);

    expect(savedAt).toBeDefined();

    const cached = await getCache('courses');
    expect(cached).not.toBeNull();
    expect(cached.data).toEqual(sampleData);
    expect(cached.savedAt).toBe(savedAt);
    expect(cached.expired).toBe(false);
  });

  it('clears cache successfully', async () => {
    await setCache('courses', [{ id: 1 }]);
    await clearCache('courses');
    const cached = await getCache('courses');
    expect(cached).toBeNull();
  });
});

