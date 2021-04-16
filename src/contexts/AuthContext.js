import React, { useContext, useState, useEffect } from "react";
import { auth, dataBase } from "../firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function logIn(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logOut() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      var docRef = dataBase.collection("Users").doc(user.uid);
      console.log(user.uid);
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setCurrentUser(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
      setCurrentUser({ uid: user.uid });
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, signUp, logIn, logOut };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
