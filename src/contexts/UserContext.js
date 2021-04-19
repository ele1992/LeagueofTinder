import React, { useContext, useState, useEffect } from "react";
import { dataBase } from "../firebase";

const UserContext = React.createContext();

export function useUsers() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    function fetchData() {
      if (dataBase) {
        dataBase
          .collection("Users")
          .get()
          .then((querySnapshot) => {
            const collection = [];
            querySnapshot.forEach((player) => {
              collection.push({ ...player.data(), id: player.id });
            });
            setUsers((users) => [...users, ...collection]);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    }
    fetchData();
  }, []);

  const value = { users };
  return (
    <UserContext.Provider value={value}>
      {/* {!loading && children} */ children}
    </UserContext.Provider>
  );
}
