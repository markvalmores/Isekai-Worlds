import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: any;
let db: any;
let auth: any;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const dbId = (firebaseConfig as any)?.firestoreDatabaseId;
  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
  auth = getAuth(app);
} catch (err) {
  console.warn('[Firebase Resilience] Initialization notice:', err);
  // Fallback mock/proxy objects so imports never crash
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (innerErr) {
    console.warn('[Firebase Resilience] Fallback notice:', innerErr);
  }
}

export { app, db, auth };

