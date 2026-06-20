import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";

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

console.log("Firebase ist mit GameNet verbunden.");
