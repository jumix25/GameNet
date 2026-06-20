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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const postsFirebaseConfig = {
  apiKey: "AIzaSyDS-UpTUZsdqFSNUxwtxf3Ep9-n9ueGG4E",
  authDomain: "gamenet-e3b1c.firebaseapp.com",
  projectId: "gamenet-e3b1c",
  storageBucket: "gamenet-e3b1c.firebasestorage.app",
  messagingSenderId: "610463710215",
  appId: "1:610463710215:web:f3a12ca62a18530f527ea2",
  measurementId: "G-VC0HTWW3TF"
};

const accountsFirebaseConfig = {
  apiKey: "AIzaSyCrb99DJuHo5noNQ7AnnUdugjR9YpWEGfU",
  authDomain: "jugroup-kundenportal.firebaseapp.com",
  projectId: "jugroup-kundenportal",
  storageBucket: "jugroup-kundenportal.firebasestorage.app",
  messagingSenderId: "39867975617",
  appId: "1:39867975617:web:1dbb32a17827aeeb9a1140",
  measurementId: "G-K4QBB89QNV"
};

export const postsApp = initializeApp(postsFirebaseConfig, "gamenet-posts");
export const accountsApp = initializeApp(accountsFirebaseConfig, "gamenet-accounts");

export const db = getFirestore(postsApp);
export const auth = getAuth(accountsApp);

const postsCollection = collection(db, "posts");

export async function createAccount({ email, password }) {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function loginAccount({ email, password }) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function logoutAccount() {
  return signOut(auth);
}

export function listenToAccount(callback) {
  return onAuthStateChanged(auth, callback);
}

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
      getAnalytics(postsApp);
      getAnalytics(accountsApp);
      console.log("Firebase Analytics ist aktiv.");
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics konnte nicht gestartet werden:", error);
  });

console.log("GameNet Firebase ist verbunden: Posts und Accounts getrennt.");
