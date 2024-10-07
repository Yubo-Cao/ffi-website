import { initializeApp } from "firebase/app";
import { clientConfig } from "@/lib/config";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from "@firebase/firestore";

export const app = initializeApp(clientConfig);
initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
export const db = getFirestore(app);
