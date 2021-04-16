import React, { useContext, useState, useEffect } from "react";
import { dataBase } from "../firebase";

const UserContext = React.createContext();

export function useUsers() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchData() {
      if (dataBase) {
        dataBase
          .collection("Users")
          .get()
          .then((querySnapshot) => {
            const collection = [];
            querySnapshot.forEach((player) => {
              console.log(player.id);
              collection.push({ ...player.data(), id: player.id });
            });
            setUsers([...users, ...collection]);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    }
    fetchData();
    setLoading(false);
  }, []);

  const value = { users };
  return (
    <UserContext.Provider value={value}>
      {/* {!loading && children} */ children}
    </UserContext.Provider>
  );
}