
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { collection } from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOj8VViNLRpvkgqyD8dRZMGdknx23-dew",
  authDomain: "todo-list-42c41.firebaseapp.com",
  projectId: "todo-list-42c41",
  storageBucket: "todo-list-42c41.appspot.com",
  messagingSenderId: "657488385774",
  appId: "1:657488385774:web:150043bd5b63c7f26485ff"
};


 export const app = initializeApp(firebaseConfig);

export const tasksDb = getFirestore(app)

export const dbRef= collection(tasksDb,"tasks")

export const auth = getAuth(app)

 export const userInfoDbRef= collection(tasksDb, "user-info")
