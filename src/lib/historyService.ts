import { db, auth } from './firebase';
import { collection, addDoc, query, orderBy, getDocs, limit } from "firebase/firestore";

export type HistoryType = 'watch' | 'browse';

export interface HistoryEntry {
  type: HistoryType;
  url: string;
  title: string;
  timestamp: number;
}

export const trackHistory = async (type: HistoryType, url: string, title: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const collectionPath = type === 'watch' ? 'watchHistory' : 'browsingHistory';
  const colRef = collection(db, 'users', user.uid, collectionPath);
  
  await addDoc(colRef, {
    type,
    url,
    title,
    timestamp: Date.now()
  });
};

export const getHistory = async (type: HistoryType, limitCount: number = 20): Promise<HistoryEntry[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const collectionPath = type === 'watch' ? 'watchHistory' : 'browsingHistory';
  const colRef = collection(db, 'users', user.uid, collectionPath);
  const q = query(colRef, orderBy('timestamp', 'desc'), limit(limitCount));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as HistoryEntry);
};
