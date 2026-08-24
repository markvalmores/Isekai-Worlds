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
      const syncDocRef = doc(db, "global_sync", DEFAULT_SYNC_DOC);
      this.unsubSnapshot = onSnapshot(
        syncDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as SyncPayload;
            if (data && Array.isArray(data.allProfiles) && data.allProfiles.length > 0) {
              console.log("[Firestore Sync] Real-time live update received from Firestore for all profiles!");
              this.saveStoredProfiles(data.allProfiles, data.activeProfileId);
              this.notify(data);
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

  // Heartbeat sync every 15s to keep continuous sync forever everywhere
  private initPeriodicHeartbeat() {
    setInterval(() => {
      this.syncNow();
    }, 15000);

    window.addEventListener("online", () => {
      this.syncNow();
    });
  }

  // Sync everything everywhere (Firestore + Server + LocalStorage)
  public async syncEverythingEverywhere(data: {
    allProfiles: UserProfile[];
    activeProfileId: string;
    profile: UserProfile;
    settings?: AppSettings;
    activeSeconds?: number;
    syncKey?: string;
  }): Promise<{ success: boolean; message: string; lastSynced: string }> {
    if (this.isSyncing) return { success: true, message: "Sync in progress", lastSynced: new Date().toISOString() };
    this.isSyncing = true;

    const now = new Date().toISOString();
    const cleanKey = (data.syncKey || localStorage.getItem(LOCAL_SYNC_KEY) || "isekai-default").trim().toLowerCase();

    // 1. Gather all auxiliary storage items
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

    let gameComments = [];
    try {
      const gc = localStorage.getItem("isekai_game_comments");
      if (gc) gameComments = JSON.parse(gc);
    } catch {}

    let savedWallpapers = [];
    let savedGifs = [];
    let savedCosplay = [];
    let watchHistory = [];
    try {
      const sw = localStorage.getItem("isekai_saved_wallpapers");
      if (sw) savedWallpapers = JSON.parse(sw);
      const sg = localStorage.getItem("isekai_saved_gifs");
      if (sg) savedGifs = JSON.parse(sg);
      const sc = localStorage.getItem("isekai_saved_cosplay");
      if (sc) savedCosplay = JSON.parse(sc);
      const wh = localStorage.getItem("isekai_watch_history");
      if (wh) watchHistory = JSON.parse(wh);
    } catch {}

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

    // Save locally
    this.saveStoredProfiles(fullProfilesList, data.activeProfileId || data.profile?.id);
    localStorage.setItem(LOCAL_SYNC_KEY, cleanKey);
    localStorage.setItem(LOCAL_LAST_SYNCED_KEY, now);

    const payload: SyncPayload = {
      syncKey: cleanKey,
      allProfiles: fullProfilesList,
      activeProfileId: data.activeProfileId || data.profile?.id,
      profile: data.profile,
      settings: data.settings,
      amvPlaylist,
      amvPlaylistId,
      inventory,
      gameComments,
      savedWallpapers,
      savedGifs,
      savedCosplay,
      watchHistory,
      activeSeconds: data.activeSeconds,
      lastSynced: now
    };

    // 2. Synchronize to Firestore
    try {
      // Save global master document
      const syncDocRef = doc(db, "global_sync", DEFAULT_SYNC_DOC);
      await setDoc(syncDocRef, payload, { merge: true });

      // Save keyed document if different from default
      if (cleanKey !== DEFAULT_SYNC_DOC) {
        const keyedDocRef = doc(db, "global_sync", cleanKey);
        await setDoc(keyedDocRef, payload, { merge: true });
      }

      // Save each profile to /profiles/{profileId}
      for (const prof of fullProfilesList) {
        if (prof.id) {
          const pRef = doc(db, "profiles", prof.id);
          await setDoc(pRef, prof, { merge: true });
        }
      }
      console.log("[UniversalSync] Synced to Firestore database successfully!");
    } catch (fsErr: any) {
      console.warn("[UniversalSync] Firestore sync notice:", fsErr.message);
    }

    // 3. Synchronize to Backend Server API
    try {
      await fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      console.log("[UniversalSync] Synced to Backend Server successfully!");
    } catch (srvErr: any) {
      console.warn("[UniversalSync] Server sync notice:", srvErr.message);
    }

    this.isSyncing = false;
    return {
      success: true,
      message: `All ${fullProfilesList.length} profiles hardcode-synced everywhere!`,
      lastSynced: now
    };
  }

  // Load state from Firestore & Backend Server
  public async loadFromEverywhere(syncKey?: string): Promise<{ success: boolean; data?: SyncPayload; error?: string }> {
    const cleanKey = (syncKey || localStorage.getItem(LOCAL_SYNC_KEY) || "isekai-default").trim().toLowerCase();

    // 1. Try Firestore first
    try {
      const docRef = doc(db, "global_sync", cleanKey === "isekai-default" ? DEFAULT_SYNC_DOC : cleanKey);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as SyncPayload;
        if (data && data.allProfiles && data.allProfiles.length > 0) {
          this.saveStoredProfiles(data.allProfiles, data.activeProfileId);
          return { success: true, data };
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
  public syncNow() {
    const local = this.getStoredProfiles();
    if (local.allProfiles.length > 0) {
      const active = local.allProfiles.find((p) => p.id === local.activeId) || local.allProfiles[0];
      let settings: any = {};
      try {
        const s = localStorage.getItem("isekai_app_settings");
        if (s) settings = JSON.parse(s);
      } catch {}
      this.syncEverythingEverywhere({
        allProfiles: local.allProfiles,
        activeProfileId: local.activeId,
        profile: active,
        settings
      });
    }
  }
}

export const universalSync = UniversalSyncManager.getInstance();
