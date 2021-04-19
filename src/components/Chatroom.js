import React, { useState, useEffect, useCallback } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { dataBase } from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Chatroom.css";
export default function Chatroom() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState();
  const [matchedUser, setMatchedUser] = useState();
  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);
  const param = useParams();

  const { currentUser, currentPlayerInfo } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    if (dataBase) {
      dataBase
        .collection("Chatrooms")
        .doc(param.room)
        .collection("messages")
        .add({
          text: message,
          userId: currentUser.uid,
          name: currentPlayerInfo.summonerName,
          createdAt: new Date(),
        });

      dataBase
        .collection("Chatrooms")
        .doc(param.room)
        .update({ lastMessage: message, updatedAt: new Date() });
    }
    console.log(matchedUser);
    setMessage("");
  }

  useEffect(() => {
    if (dataBase) {
      const unsubscribe = dataBase
        .collection("Chatrooms")
        .doc(param.room)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setReceivedMessages(data);
        });
      return unsubscribe;
    }
  }, [param.room]);

  useEffect(() => {
    async function getData() {
      if (dataBase) {
        const data = await dataBase
          .collection("Chatrooms")
          .doc(param.room)
          .get();
        setMatchedUser(
          data.data().users.filter((user) => user.id !== currentUser.uid)
        );
      }
    }
    getData();
  }, [currentUser.uid, param.room]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        paddingLeft: "1vw",
        width: "80vw",
        maxWidth: "80vw,",
      }}
    >
      <Card className="mb-2">
        <Card.Body>
          {matchedUser ? (
            <h2 style={{ textAlign: "center" }}>
              Chat with {matchedUser[0].name}
            </h2>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
      <Card
        style={{ padding: "5px", paddingInline: "10px", paddingBottom: "15vh" }}
      >
        <div>
          {receivedMessages ? (
            receivedMessages.map((msg, index) => {
              const lastMessage = receivedMessages.length - 1 === index;
              return msg.userId === currentUser.uid ? (
                <div
                  key={index}
                  className="userMessages"
                  ref={lastMessage ? setRef : null}
                >
                  <p>{msg.text}</p>
                </div>
              ) : (
                <div
                  key={index}
                  className="receiverContainer"
                  ref={lastMessage ? setRef : null}
                >
                  <p className="receiverUsername">
                    <strong>{msg.name} :</strong>
                  </p>
                  <p className="receiverMessages">
                    <span>{msg.text}</span>
                  </p>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
        <Container>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="chatInputs">
              <Form.Control
                style={{ height: "100px" }}
                type="text"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button style={{ width: "80px" }} type="Submit">
                Send
              </Button>
            </Form.Group>
          </Form>
        </Container>
      </Card>
    </div>
  );
}
