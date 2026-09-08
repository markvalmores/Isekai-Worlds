// Bulletproof Safe Storage Polyfill & Guard
// Protects against iframe security restrictions, blocked third-party storage, and corrupted JSON

class SafeMemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) ?? null) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

let nativeLocalStorage: Storage | null = null;
let isLocalStorageUsable = false;

try {
  if (typeof window !== "undefined" && window.localStorage) {
    const testKey = "__isekai_test_storage__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    nativeLocalStorage = window.localStorage;
    isLocalStorageUsable = true;
  }
} catch {
  isLocalStorageUsable = false;
  nativeLocalStorage = null;
}

const memoryStore = new SafeMemoryStorage();
const sessionMemoryStore = new SafeMemoryStorage();

// Auto-patch window.localStorage and window.sessionStorage if restricted or throwing
if (typeof window !== "undefined") {
  // Wrap Storage.prototype if available so existing instances never throw
  try {
    if (typeof Storage !== "undefined" && Storage.prototype) {
      const origSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, value: string) {
        try {
          origSetItem.call(this, key, value);
        } catch {
          memoryStore.setItem(key, value);
        }
      };

      const origGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = function (key: string): string | null {
        try {
          const val = origGetItem.call(this, key);
          return val !== null ? val : memoryStore.getItem(key);
        } catch {
          return memoryStore.getItem(key);
        }
      };

      const origRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = function (key: string) {
        try {
          origRemoveItem.call(this, key);
        } catch {}
        memoryStore.removeItem(key);
      };
    }
  } catch {}

  // Override window.localStorage and Window.prototype.localStorage
  if (!isLocalStorageUsable) {
    try {
      Object.defineProperty(window, "localStorage", {
        value: memoryStore,
        configurable: true,
        writable: true,
      });
    } catch {}
    try {
      if ((window as any).Window && (window as any).Window.prototype) {
        Object.defineProperty((window as any).Window.prototype, "localStorage", {
          get() {
            return memoryStore;
          },
          configurable: true,
          enumerable: true,
        });
      }
    } catch {}
  }

  // Override window.sessionStorage and Window.prototype.sessionStorage
  try {
    const testSessionKey = "__isekai_test_session__";
    window.sessionStorage.setItem(testSessionKey, "1");
    window.sessionStorage.removeItem(testSessionKey);
  } catch {
    try {
      Object.defineProperty(window, "sessionStorage", {
        value: sessionMemoryStore,
        configurable: true,
        writable: true,
      });
    } catch {}
    try {
      if ((window as any).Window && (window as any).Window.prototype) {
        Object.defineProperty((window as any).Window.prototype, "sessionStorage", {
          get() {
            return sessionMemoryStore;
          },
          configurable: true,
          enumerable: true,
        });
      }
    } catch {}
  }
}

export function getSafeItem(key: string, fallback: string | null = null): string | null {
  try {
    if (isLocalStorageUsable && nativeLocalStorage) {
      const val = nativeLocalStorage.getItem(key);
      return val !== null ? val : fallback;
    }
    const memVal = memoryStore.getItem(key);
    return memVal !== null ? memVal : fallback;
  } catch {
    return fallback;
  }
}

export function setSafeItem(key: string, value: string): void {
  try {
    if (isLocalStorageUsable && nativeLocalStorage) {
      nativeLocalStorage.setItem(key, value);
    } else {
      memoryStore.setItem(key, value);
    }
  } catch {
    try {
      memoryStore.setItem(key, value);
    } catch {}
  }
}

export function removeSafeItem(key: string): void {
  try {
    if (isLocalStorageUsable && nativeLocalStorage) {
      nativeLocalStorage.removeItem(key);
    }
    memoryStore.removeItem(key);
  } catch {}
}

export function getSafeJson<T>(key: string, fallback: T): T {
  try {
    const raw = getSafeItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
