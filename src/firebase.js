import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKY4KkPdXngag7PN784Me0dNTMyNCCdA8",
  authDomain: "file-uploader-d6e48.firebaseapp.com",
  databaseURL: "https://file-uploader-d6e48.firebaseio.com",
  projectId: "file-uploader-d6e48",
  storageBucket: "file-uploader-d6e48.appspot.com",
  messagingSenderId: "665334874422",
  appId: "1:665334874422:web:b2e23bbe035b3274a73397"
};

export const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();

export const storage = getStorage(app);