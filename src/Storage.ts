import { useState } from 'react';
import { IStorage } from 'cross-platform-util-types';
/**
 * Implementation of IStorage that uses localStorage.
 */
export const LOCAL_STORAGE: IStorage = {
  storageGet<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      console.warn(`Can't access localStorage. Not in a browser environment.`);
      return null;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  storageSet<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      console.warn(`Can't access localStorage. Not in a browser environment.`);
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  storageDelete(key: string): void {
    if (typeof window === 'undefined') {
      console.warn(`Can't access localStorage. Not in a browser environment.`);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting localStorage key "${key}":`, error);
    }
  }
};

/**
 * Implementation of IStorage that uses sessionStorage.
 */
export const SESSION_STORAGE: IStorage = {
  storageGet<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      console.warn(`Can't access sessionStorage. Not in a browser environment.`);
      return null;
    }
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return null;
    }
  },

  storageSet<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      console.warn(`Can't access sessionStorage. Not in a browser environment.`);
      return;
    }
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  },

  storageDelete(key: string): void {
    if (typeof window === 'undefined') {
      console.warn(`Can't access sessionStorage. Not in a browser environment.`);
      return;
    }
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting sessionStorage key "${key}":`, error);
    }
  }
};

/**
 * Custom hook that provides a stateful value backed by any storage mechanism implementing IStorage.
 * This hook behaves like useState but reads the value from the specified storage and persists changes.
 *
 * @param storage An implementation of IStorage (e.g. LOCAL_STORAGE, SESSION_STORAGE, or a custom one).
 * @param key The storage key.
 * @param initialValue The initial value to use if no value is stored.
 * @returns A tuple containing the stored value and a setter function.
 */
export function useStorage<T>(storage: IStorage,key: string, initialValue: T ): 
        readonly [T, (value: T | ((prevValue: T) => T)) => void] {
  // Lazily initialize state from the specified storage.
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.storageGet<T>(key);
    console.log(`Initial value: ${(item !== null ? JSON.stringify(item) : 'null')}`);
    return item !== null ? item : initialValue;
  });

  /**
   * Update both the local state and the storage mechanism.
   * Similar to useState's functional updates.
   */
  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.storageSet(key, valueToStore);
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
