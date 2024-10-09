import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDgMtvpsFaG1mR3k0rZvNvEVRRWWMPOGI",
  authDomain: "solo-lavaling.firebaseapp.com",
  projectId: "solo-lavaling",
  storageBucket: "solo-lavaling.appspot.com",
  messagingSenderId: "163542156497",
  appId: "1:163542156497:web:05a7af8fecbb1c7daff1f0",
  measurementId: "G-K9ZTBZ643C"
};

let app = initializeApp(firebaseConfig);
export default app;