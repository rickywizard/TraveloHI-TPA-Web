// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj2fdFL2A9uaNN7y6CfuIJBHPXATOAMaw",
  authDomain: "travelohi-f39a6.firebaseapp.com",
  projectId: "travelohi-f39a6",
  storageBucket: "travelohi-f39a6.appspot.com",
  messagingSenderId: "200960979657",
  appId: "1:200960979657:web:55621b3485ddd34e9cd318"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);