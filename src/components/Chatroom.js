import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { dataBase } from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function Chatroom() {
  const [message, setMessage] = useState("");
  const param = useParams();
  // const messageRef = dataBase
  //   .collection("Chatrooms")
  //   .doc(param.rooms)
  //   .collection("messages");
  // const query = messageRef.orderBy("createdAt");
  // const [messages] = useCollectionData(query);

  const { currentUser, currentPlayerInfo } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    if (dataBase) {
      dataBase
        .collection("Chatrooms")
        .doc(param.room)
        .collection("messages")
        .add({
          message: message,
          id: currentUser.uid,
          name: currentPlayerInfo.summonerName,
          createdAt: new Date(),
        });
    }
    setMessage("");
  }

  useEffect(() => {});

  return (
    <div>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex align-items-center justify-content-center">
            <Form.Control
              type="text"
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button type="Submit">Send</Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}
