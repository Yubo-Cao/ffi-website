import { clientConfig } from "@/lib/config";
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
} from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

export const app = initializeApp(clientConfig);
initializeFirestore(app, {
  localCache: memoryLocalCache(),
});
export const db = getFirestore(app);
if (typeof window !== "undefined") {
  getAnalytics(app);
}
