import { app, db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export interface User {
  /**
   * The id of the user.
   */
  id: string;
  /**
   * The email of the user.
   */
  email: string;
  /**
   * The name of the user.
   */
  name: string;
  /**
   * The role of the user.
   */
  role?: string;
}

export const USER_COL = collection(db, "users");

export const createUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const user = await createUserWithEmailAndPassword(
    getAuth(app),
    email,
    password,
  );
  const userRef = await setDoc(doc(USER_COL, user.user.uid), {
    email: user.user.email,
    badges: [],
    lastLogin: new Date(),
    name: user.user.displayName,
  });
  return {
    id: user.user.uid,
    email: user.user.email,
    name: user.user.displayName,
  };
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = await getDoc(doc(USER_COL, userId));
  if (!userRef.exists()) {
    return null;
  }
  const user = userRef.data();
  return {
    id: userRef.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
  };
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) {
    return false;
  }
  const userRef = await getDoc(doc(USER_COL, userId));
  if (!userRef.exists()) {
    return false;
  }
  const user = userRef.data();
  return user?.role === "admin";
};
