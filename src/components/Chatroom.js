import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { dataBase } from "../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Chatroom.css";
import { ChevronBarRight } from "react-bootstrap-icons";
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
      try {
        if (dataBase) {
          const data = await dataBase
            .collection("Chatrooms")
            .doc(param.room)
            .get();

          setMatchedUser(
            data.data().users.filter((user) => user.id !== currentUser.uid)
          );
        }
      } catch (e) {
        console.log(e.message);
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
        alignItems: "center",
      }}
    >
      <Card className="mb-2 d-flex" style={{ width: "300px" }}>
        <Card.Body>
          {matchedUser ? (
            <div
              className="d-flex"
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                style={{ maxWidth: "70px", borderRadius: "5%" }}
                src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${matchedUser[0].profileIconId}.jpg`}
                alt="profile icon"
              />
              <h2 style={{ textAlign: "center", paddingLeft: "20px" }}>
                {matchedUser[0].name}
              </h2>
              <div></div>
            </div>
          ) : (
            <></>
          )}
        </Card.Body>
      </Card>
      <div style={{ width: "60vw" }}>
        <Card
          style={{
            padding: "20px",

            height: "60vh",
            overflow: "auto",
            borderRadius: "15px 15px 0 0",
          }}
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
                      {matchedUser ? (
                        <img
                          className="chatProfileIcon"
                          src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${matchedUser[0].profileIconId}.jpg`}
                          alt={msg.name}
                        />
                      ) : null}
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
        </Card>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="chatInputs">
            <Form.Control
              style={{ height: "100px", borderRadius: "0 0 0 15px" }}
              type="text"
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button
              style={{ width: 100, height: 100, borderRadius: "0 0 15px 0" }}
              type="Submit"
            >
              Send <ChevronBarRight />
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
