import { useCallback, useEffect, useRef, useState } from 'react';
import { getCache, setCache } from '../storage/cache';
import useNetworkStatus from './useNetworkStatus';

export default function useCachedQuery(key, fetcher, options = {}) {
  const { enabled = true } = options;
  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const fetcherRef = useRef(fetcher);
  const requestId = useRef(0);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    let active = true;
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    const load = async () => {
      setError(null);
      setLoading(true);

      const cached = await getCache(key);
      if (!active || requestId.current !== currentRequest) {
        return;
      }

      if (cached) {
        setData(cached.data);
        setLastUpdated(cached.savedAt);
        setLoading(false);
      }

      if (!enabled || !isOnline) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const result = await fetcherRef.current();
        if (!active || requestId.current !== currentRequest) {
          return;
        }
        const savedAt = await setCache(key, result);
        setData(result);
        setLastUpdated(savedAt);
        setError(null);
      } catch (fetchError) {
        if (active && requestId.current === currentRequest) {
          setError(fetchError);
        }
      } finally {
        if (active && requestId.current === currentRequest) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [key, isOnline, enabled]);

  const refresh = useCallback(async () => {
    if (!enabled) {
      return;
    }
    setRefreshing(true);
    try {
      const result = await fetcherRef.current();
      const savedAt = await setCache(key, result);
      setData(result);
      setLastUpdated(savedAt);
      setError(null);
    } catch (fetchError) {
      setError(fetchError);
    } finally {
      setRefreshing(false);
    }
  }, [key, enabled]);

  return { data, loading, error, refreshing, lastUpdated, refresh };
}
