import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { dataBase } from "../../firebase";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronBarRight } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chatroom.css";

export default function Chatroom() {
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState();
  const [matchedUser, setMatchedUser] = useState();
  const { currentUser, currentPlayerInfo } = useAuth();
  const param = useParams();

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (dataBase) {
      sendMessage();
      setLastMessage();
    }

    setMessage("");
  }

  function sendMessage() {
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
  }
  function setLastMessage() {
    dataBase
      .collection("Chatrooms")
      .doc(param.room)
      .update({ lastMessage: message, updatedAt: new Date() });
  }

  useEffect(() => {
    function getChatroomMessages() {
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
    }
    getChatroomMessages();
  }, [param.room]);

  useEffect(() => {
    async function getCurrentChatPartner() {
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
    getCurrentChatPartner();
  }, [currentUser.uid, param.room]);

  return (
    <div className="Chatroom_Container">
      {matchedUser ? (
        <div className="Chatroom_Container_div">
          <img
            className="Chatroom_Icon"
            src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${matchedUser[0].profileIconId}.jpg`}
            alt="profile icon"
          />
          <h2 className="Chatroom_Title">{matchedUser[0].name}</h2>
          <div></div>
        </div>
      ) : (
        <></>
      )}

      <div className="Chatroom_Chatbox_Container">
        <Card className="Chatroom_Chatbox_Card">
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
              className="Chatroom_Textinput"
              type="text"
              required
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <Button className="Chatroom_Button" type="Submit">
              Send <ChevronBarRight />
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
