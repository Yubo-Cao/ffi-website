import { clientConfig } from "@/lib/config";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
} from "@firebase/firestore";
import { initializeApp } from "firebase/app";

export const app = initializeApp(clientConfig);
initializeFirestore(app, {
  localCache: memoryLocalCache(),
});
export const db = getFirestore(app);
