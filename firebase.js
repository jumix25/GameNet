import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDS-UpTUZsdqFSNUxwtxf3Ep9-n9ueGG4E",
  authDomain: "gamenet-e3b1c.firebaseapp.com",
  projectId: "gamenet-e3b1c",
  storageBucket: "gamenet-e3b1c.firebasestorage.app",
  messagingSenderId: "610463710215",
  appId: "1:610463710215:web:f3a12ca62a18530f527ea2",
  measurementId: "G-VC0HTWW3TF"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const postsCollection = collection(db, "posts");

export async function createPost({ username, text }) {
  const cleanUsername = username.trim().replace(/^@+/, "").slice(0, 24) || "gamenet_user";
  const cleanText = text.trim().slice(0, 280);

  if (!cleanText) {
    throw new Error("Post darf nicht leer sein.");
  }

  return addDoc(postsCollection, {
    username: cleanUsername,
    text: cleanText,
    likes: 0,
    createdAt: serverTimestamp()
  });
}

export function listenToPosts(callback) {
  const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));

  return onSnapshot(postsQuery, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    callback(posts);
  });
}

isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
      console.log("Firebase Analytics ist aktiv.");
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics konnte nicht gestartet werden:", error);
  });

console.log("Firebase Firestore ist für GameNet Posts verbunden.");
