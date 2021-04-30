import React, { useContext, useState, useEffect } from "react";
import { auth, dataBase } from "../firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [currentPlayerInfo, setCurrentPlayerInfo] = useState();
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function logIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logOut() {
    setCurrentPlayerInfo(null);
    setCurrentUser(null);
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        var docRef = dataBase.collection("Users").doc(user.uid);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              setCurrentPlayerInfo(doc.data());
            } else {
              console.log("No player!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
        docRef.onSnapshot((doc) => {
          setCurrentPlayerInfo(doc.data());
        });
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, currentPlayerInfo, signUp, logIn, logOut };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
