"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny persisted store on top of localStorage + useSyncExternalStore.
 * - SSR renders the fallback; the client switches to the stored value after hydration.
 * - Syncs between browser tabs via the `storage` event.
 */
export interface LocalStore<T> {
  subscribe(listener: () => void): () => void;
  getSnapshot(): T;
  getServerSnapshot(): T;
  set(next: T | ((prev: T) => T)): void;
}

export function createLocalStore<T>(key: string, fallback: T): LocalStore<T> {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (value === undefined) {
      try {
        const raw = window.localStorage.getItem(key);
        value = raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        value = fallback;
      }
    }
    return value;
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;
    value = undefined;
    listeners.forEach((l) => l());
  };

  return {
    subscribe(listener) {
      if (listeners.size === 0) window.addEventListener("storage", onStorage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => fallback,
    set(next) {
      value = typeof next === "function" ? (next as (p: T) => T)(read()) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage full or disabled – keep in memory */
      }
      listeners.forEach((l) => l());
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>) {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

/** True after hydration – lets UI avoid flashing empty states before localStorage loads. */
const noopSubscribe = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
