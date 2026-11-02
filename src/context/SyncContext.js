import React, { createContext, useContext } from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext(undefined);

export function SyncProvider({ children }) {
  const { isOnline } = useNetworkStatus();
  const {
    pendingCount,
    pendingActionIds,
    pendingActions,
    syncing,
    syncNow,
  } = useOutboxSync();

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        pendingActionIds,
        pendingActions,
        syncing,
        syncNow,
      }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được dùng bên trong SyncProvider');
  }
  return context;
}

export default SyncContext;
