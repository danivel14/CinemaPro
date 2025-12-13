import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const savePreferences = async (email: string, preferences: string[]) => {
  await setDoc(doc(db, "users", email), { preferences }, { merge: true });
};

export const loadPreferences = async (email: string) => {
  const snap = await getDoc(doc(db, "users", email));
  return snap.exists() ? snap.data().preferences || [] : [];
};
