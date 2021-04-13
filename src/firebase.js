import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
  apiKey: "AIzaSyD4tBcWu6Q8bBl6tTKnph3YeAc0IrkiOU0",
  authDomain: "league-of-tinder.firebaseapp.com",
  projectId: "league-of-tinder",
  storageBucket: "league-of-tinder.appspot.com",
  messagingSenderId: "84017871631",
  appId: "1:84017871631:web:a2eef3f97acab7ae669c7a",
  measurementId: "G-W988HVMDMF",
});
export const auth = app.auth();
export default app;
