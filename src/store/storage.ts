// src/store/storage.ts
// Safe async storage wrapper that falls back to a no-op storage if the native module is unavailable.
// This prevents the app from crashing when AsyncStorage cannot be linked (e.g., during web builds).

let storage: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  storage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  console.warn('AsyncStorage not available, using fallback storage');
  // Minimal in‑memory storage implementing the required methods.
  const memoryStore: { [key: string]: string } = {};
  storage = {
    async setItem(key: string, value: string) {
      memoryStore[key] = value;
    },
    async getItem(key: string) {
      return memoryStore[key] ?? null;
    },
    async removeItem(key: string) {
      delete memoryStore[key];
    },
    async mergeItem(key: string, value: string) {
      const existing = memoryStore[key] ?? '';
      memoryStore[key] = existing + value;
    },
    async clear() {
      Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
    },
  };
}

export default storage;
