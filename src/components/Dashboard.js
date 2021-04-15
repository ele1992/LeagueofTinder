import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { dataBase } from "../firebase";

export default function Dashboard() {
  const [error, setError] = useState("");
  const history = useHistory();
  const { currentUser, logOut } = useAuth();
  const [users, setUsers] = useState([]);

  async function handleLogOut() {
    setError("");
    try {
      await logOut();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }
  function print() {
    console.log(users);
  }

  useEffect(() => {
    function fetchData() {
      //   if (dataBase) {
      //     const user = dataBase.collection("Users").doc(currentUser.uid);
      //     console.log(user);
      //   }
      dataBase
        .collection("Users")
        .get()
        .then((querySnapshot) => {
          const collection = [];
          querySnapshot.forEach((player) => {
            collection.push(player.data());
          });
          setUsers([...users, ...collection]);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    fetchData();
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
        </Card.Body>
        {users.map((user) => (
          <Card.Body key={user.puuid}>
            <h2>{user.summonerName}</h2>
          </Card.Body>
        ))}
      </Card>

      <Button variant="link" onClick={print}>
        print to console
      </Button>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
    </>
  );
}
