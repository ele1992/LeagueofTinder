import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { dataBase } from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function Chatroom() {
  const [message, setMessage] = useState("");
  const param = useParams();
  const { currentUser } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    if (dataBase) {
      console.log(param.room);
      console.log("currentuser:", currentUser);
      dataBase.collection("Chatrooms").doc(param.room).set({
        message: message,
      });
    }
    setMessage("");
  }

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
