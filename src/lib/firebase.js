import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBC3Vifk2BqueUVYFOuNdtC3nuyBIhTg_4",
  authDomain: "rouver2.firebaseapp.com",
  projectId: "rouver2",
  storageBucket: "rouver2.appspot.com",
  messagingSenderId: "2754655045",
  appId: "1:2754655045:web:e44523b9dd34b45284442c",
  measurementId: "G-7H782J65TH"
};

// تأكد من عدم تهيئة التطبيق أكثر من مرة
let app;
if (!initializeApp.apps?.length) {
  app = initializeApp(firebaseConfig);
} else {
  app = initializeApp.apps[0];
}

const auth = getAuth(app);

export { app, auth };