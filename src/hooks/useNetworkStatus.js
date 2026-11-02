import { useEffect, useState } from 'react';
import { NativeModules, TurboModuleRegistry } from 'react-native';

function getNetInfo() {
  try {
    const hasNative = Boolean(
      (NativeModules && NativeModules.RNCNetInfo) ||
        (TurboModuleRegistry &&
          typeof TurboModuleRegistry.get === 'function' &&
          TurboModuleRegistry.get('RNCNetInfo')),
    );
    if (hasNative) {
      const mod = require('@react-native-community/netinfo');
      return mod.default || mod;
    }
  } catch (error) {
    // Native module chưa sẵn sàng hoặc APK cũ chưa link module native.
  }
  return null;
}

function readState(state) {
  if (!state) {
    return true;
  }
  return state.isConnected !== false && state.isInternetReachable !== false;
}

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let active = true;
    const NetInfo = getNetInfo();

    if (!NetInfo) {
      setIsOnline(true);
      return () => {
        active = false;
      };
    }

    let unsubscribe = null;
    try {
      unsubscribe = NetInfo.addEventListener((state) => {
        if (active) {
          setIsOnline(readState(state));
        }
      });
    } catch (err) {
      // Fallback an toàn
    }

    if (typeof NetInfo.fetch === 'function') {
      NetInfo.fetch()
        .then((state) => {
          if (active) {
            setIsOnline(readState(state));
          }
        })
        .catch(() => {});
    }

    return () => {
      active = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return { isOnline };
}
