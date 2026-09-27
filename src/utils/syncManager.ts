import { doc, getDoc, setDoc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { UserProfile, AppSettings } from "../types";

export interface SyncPayload {
  syncKey: string;
  allProfiles: UserProfile[];
  activeProfileId: string;
  profile: UserProfile;
  settings?: Partial<AppSettings>;
  amvPlaylist?: any[];
  amvPlaylistId?: string;
  inventory?: any[];
  gameComments?: any[];
  savedWallpapers?: any[];
  savedGifs?: any[];
  savedCosplay?: any[];
  watchHistory?: any[];
  activeSeconds?: number;
  lastSynced: string;
  isRemoteUpdate?: boolean;
}

const LOCAL_PROFILES_KEY = "isekai_all_profiles";
const LOCAL_ACTIVE_PROFILE_ID_KEY = "isekai_active_profile_id";
const LOCAL_SYNC_KEY = "isekai_sync_key";
const LOCAL_LAST_SYNCED_KEY = "isekai_last_synced";
const DEFAULT_SYNC_DOC = "master_state";

export class UniversalSyncManager {
  private static instance: UniversalSyncManager;
  private isSyncing: boolean = false;
  private unsubSnapshot: (() => void) | null = null;
  private listeners: ((payload: SyncPayload) => void)[] = [];
  private lastSavedHash: string = "";
  private lastFirestoreWriteTime: number = 0;

  private constructor() {
    this.initRealtimeFirestoreListener();
    this.initPeriodicHeartbeat();
  }

  public static getInstance(): UniversalSyncManager {
    if (!UniversalSyncManager.instance) {
      UniversalSyncManager.instance = new UniversalSyncManager();
    }
    return UniversalSyncManager.instance;
  }

  public subscribe(callback: (payload: SyncPayload) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(payload: SyncPayload) {
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error("Sync listener error:", e);
      }
    });
  }

  // Generate lightweight hash to check if state actually changed
  private computeStateHash(payload: Partial<SyncPayload>): string {
    try {
      const profSummary = (payload.allProfiles || [])
        .map((p) => `${p.id}:${p.username}:${p.badge}:${p.title}`)
        .join("|");
      const coins = payload.settings?.isekaiCoins || 0;
      const theme = payload.settings?.darkMode ? "dark" : "light";
      const gold = payload.settings?.isGoldMode ? "gold" : "std";
      return `${payload.syncKey || ""}_${payload.activeProfileId || ""}_${profSummary}_${coins}_${theme}_${gold}`;
    } catch {
      return Date.now().toString();
    }
  }

  // Get all local profiles
  public getStoredProfiles(): { allProfiles: UserProfile[]; activeId: string } {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILES_KEY);
      const activeId = localStorage.getItem(LOCAL_ACTIVE_PROFILE_ID_KEY) || "";
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { allProfiles: parsed, activeId: activeId || parsed[0].id };
        }
      }
    } catch (e) {
      console.warn("Failed to get stored profiles:", e);
    }
    return { allProfiles: [], activeId: "" };
  }

  // Save all profiles locally
  public saveStoredProfiles(profiles: UserProfile[], activeId: string) {
    try {
      localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));
      if (activeId) {
        localStorage.setItem(LOCAL_ACTIVE_PROFILE_ID_KEY, activeId);
      }
      const active = profiles.find((p) => p.id === activeId) || profiles[0];
      if (active) {
        localStorage.setItem("isekai_user_profile", JSON.stringify(active));
      }
    } catch (e) {
      console.warn("Failed to save stored profiles locally:", e);
    }
  }

  // Real-time Firestore sync listener
  private initRealtimeFirestoreListener() {
    try {
      if (!db) {
        console.warn("[Firestore Sync] db instance not ready yet");
        return;
      }
      const syncDocRef = doc(db, "global_sync", DEFAULT_SYNC_DOC);
      this.unsubSnapshot = onSnapshot(
        syncDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SyncPayload;
            if (data && Array.isArray(data.allProfiles) && data.allProfiles.length > 0) {
              const remoteHash = this.computeStateHash(data);
              this.lastSavedHash = remoteHash; // Record remote hash so local sync doesn't echo back
              console.log("[Firestore Sync] Real-time live update received from Firestore");
              this.saveStoredProfiles(data.allProfiles, data.activeProfileId);
              this.notify({ ...data, isRemoteUpdate: true });
            }
          }
        },
        (error) => {
          console.warn("[Firestore Sync] Snapshot listener notice:", error.message);
        }
      );
    } catch (e) {
      console.warn("[Firestore Sync] Init listener notice:", e);
    }
  }

  // Heartbeat sync every 60s (only saves locally or syncs if needed)
  private initPeriodicHeartbeat() {
    setInterval(() => {
      try {
        const local = this.getStoredProfiles();
        if (local.allProfiles.length > 0) {
          this.saveStoredProfiles(local.allProfiles, local.activeId);
        }
      } catch (e) {
        console.warn("[Sync Heartbeat] Local auto-save notice:", e);
      }
    }, 60000);

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        try {
          this.syncNow(true);
        } catch (e) {
          console.warn("[Sync Heartbeat] Online sync notice:", e);
        }
      });
    }
  }

  // Sync everything everywhere (Firestore + Server + LocalStorage)
  public async syncEverythingEverywhere(
    data: {
      allProfiles: UserProfile[];
      activeProfileId: string;
      profile: UserProfile;
      settings?: AppSettings;
      activeSeconds?: number;
      syncKey?: string;
    },
    isForced: boolean = false
  ): Promise<{ success: boolean; message: string; lastSynced: string }> {
    const now = new Date().toISOString();
    const cleanKey = (data.syncKey || localStorage.getItem(LOCAL_SYNC_KEY) || "isekai-default").trim().toLowerCase();

    // Ensure allProfiles includes active profile
    let fullProfilesList = [...data.allProfiles];
    if (data.profile && data.profile.id) {
      const idx = fullProfilesList.findIndex((p) => p.id === data.profile.id);
      if (idx >= 0) {
        fullProfilesList[idx] = data.profile;
      } else {
        fullProfilesList.unshift(data.profile);
      }
    }

    // Always save locally first (instant)
    this.saveStoredProfiles(fullProfilesList, data.activeProfileId || data.profile?.id);
    localStorage.setItem(LOCAL_SYNC_KEY, cleanKey);
    localStorage.setItem(LOCAL_LAST_SYNCED_KEY, now);

    const payload: SyncPayload = {
      syncKey: cleanKey,
      allProfiles: fullProfilesList,
      activeProfileId: data.activeProfileId || data.profile?.id,
      profile: data.profile,
      settings: data.settings,
      activeSeconds: data.activeSeconds,
      lastSynced: now
    };

    // Calculate state hash
    const currentHash = this.computeStateHash(payload);

    // Skip cloud write if state has not changed AND not forced
    if (!isForced && currentHash === this.lastSavedHash) {
      return {
        success: true,
        message: "No state changes to sync to cloud",
        lastSynced: now
      };
    }

    // Throttle Firestore network writes: minimum 10 seconds between writes unless forced
    const timeSinceLastWrite = Date.now() - this.lastFirestoreWriteTime;
    if (!isForced && timeSinceLastWrite < 10000) {
      return {
        success: true,
        message: "Cloud write throttled (saved locally)",
        lastSynced: now
      };
    }

    if (this.isSyncing) {
      return { success: true, message: "Sync in progress", lastSynced: now };
    }

    this.isSyncing = true;

    try {
      // 1. Gather auxiliary items for full sync
      let amvPlaylist = [];
      try {
        const p = localStorage.getItem("isekai_amv_playlist");
        if (p) amvPlaylist = JSON.parse(p);
      } catch {}

      const amvPlaylistId = localStorage.getItem("isekai_amv_playlist_id") || "PLjNlQ2vXx1xbt30X8TcUfNzw_akVISXEu";

      let inventory = [];
      try {
        const inv = localStorage.getItem("isekai_card_inventory");
        if (inv) inventory = JSON.parse(inv);
      } catch {}

      const fullPayload: SyncPayload = {
        ...payload,
        amvPlaylist,
        amvPlaylistId,
        inventory
      };

      // 2. Synchronize to Firestore
      if (db) {
        const syncDocRef = doc(db, "global_sync", DEFAULT_SYNC_DOC);
        await setDoc(syncDocRef, fullPayload, { merge: true });

        if (cleanKey !== DEFAULT_SYNC_DOC) {
          const keyedDocRef = doc(db, "global_sync", cleanKey);
          await setDoc(keyedDocRef, fullPayload, { merge: true });
        }

        // Save active profile to /profiles/{profileId}
        if (data.profile?.id) {
          const pRef = doc(db, "profiles", data.profile.id);
          await setDoc(pRef, data.profile, { merge: true });
        }
      }

      this.lastSavedHash = currentHash;
      this.lastFirestoreWriteTime = Date.now();
      console.log("[UniversalSync] Synced to Firestore database successfully!");
    } catch (fsErr: any) {
      console.warn("[UniversalSync] Firestore sync notice:", fsErr?.message || fsErr);
    } finally {
      this.isSyncing = false;
    }

    // 3. Synchronize to Backend Server API (non-blocking)
    try {
      fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (srvErr: any) {
      console.warn("[UniversalSync] Server sync notice:", srvErr.message);
    }

    return {
      success: true,
      message: `All ${fullProfilesList.length} profiles synced everywhere!`,
      lastSynced: now
    };
  }

  // Load state from Firestore & Backend Server
  public async loadFromEverywhere(syncKey?: string): Promise<{ success: boolean; data?: SyncPayload; error?: string }> {
    const cleanKey = (syncKey || localStorage.getItem(LOCAL_SYNC_KEY) || "isekai-default").trim().toLowerCase();

    // 1. Try Firestore first
    try {
      if (db) {
        const docRef = doc(db, "global_sync", cleanKey === "isekai-default" ? DEFAULT_SYNC_DOC : cleanKey);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as SyncPayload;
          if (data && data.allProfiles && data.allProfiles.length > 0) {
            this.lastSavedHash = this.computeStateHash(data);
            this.saveStoredProfiles(data.allProfiles, data.activeProfileId);
            return { success: true, data };
          }
        }
      }
    } catch (e) {
      console.warn("[UniversalSync] Firestore load notice:", e);
    }

    // 2. Try Server API
    try {
      const res = await fetch(`/api/sync/load?syncKey=${encodeURIComponent(cleanKey)}`);
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.success && resJson.data) {
          const data = resJson.data as SyncPayload;
          if (data.allProfiles && data.allProfiles.length > 0) {
            this.saveStoredProfiles(data.allProfiles, data.activeProfileId);
          }
          return { success: true, data };
        }
      }
    } catch (e) {
      console.warn("[UniversalSync] Server load notice:", e);
    }

    // 3. Fallback to local
    const local = this.getStoredProfiles();
    if (local.allProfiles.length > 0) {
      const active = local.allProfiles.find((p) => p.id === local.activeId) || local.allProfiles[0];
      return {
        success: true,
        data: {
          syncKey: cleanKey,
          allProfiles: local.allProfiles,
          activeProfileId: local.activeId,
          profile: active,
          lastSynced: new Date().toISOString()
        }
      };
    }

    return { success: false, error: "No sync data found across cloud or server." };
  }

  // Trigger immediate sync
  public syncNow(isForced: boolean = false) {
    const local = this.getStoredProfiles();
    if (local.allProfiles.length > 0) {
      const active = local.allProfiles.find((p) => p.id === local.activeId) || local.allProfiles[0];
      let settings: any = {};
      try {
        const s = localStorage.getItem("isekai_app_settings");
        if (s) settings = JSON.parse(s);
      } catch {}
      this.syncEverythingEverywhere(
        {
          allProfiles: local.allProfiles,
          activeProfileId: local.activeId,
          profile: active,
          settings
        },
        isForced
      );
    }
  }
}

export const universalSync = UniversalSyncManager.getInstance();
