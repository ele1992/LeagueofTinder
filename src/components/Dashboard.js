import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { dataBase } from "../firebase";
import { useUsers } from "../contexts/UserContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const history = useHistory();
  const { users } = useUsers();
  const { currentUser, logOut } = useAuth();

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
    console.log("Contexts: ", users);
    console.log(users);
  }

  function chat(id) {
    const ChatroomName = [currentUser.uid, id].sort().join("_");
    if (dataBase) {
      dataBase
        .collection("Chatrooms")
        .doc(ChatroomName)
        .set({ createdAt: new Date() });
    }
    history.push(`/chat/${ChatroomName}`);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Dash</h2>
        </Card.Body>
      </Card>
      <div className="d-flex flex-wrap ">
        {users.map((user) => (
          <Card
            key={user.puuid}
            className="w-25 align-items-center justify-content-center"
          >
            <Card.Body>
              <Link to={`/players/${user.id}`}>
                <h2>{user.summonerName}</h2>
              </Link>
              <Button className="mr-2" onClick={() => chat(user.id)}>
                Chat
              </Button>
              <Button>Like</Button>
            </Card.Body>
          </Card>
        ))}
      </div>

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
