import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dataBase } from "../firebase";

function ChatroomNavigation() {
  const [chatrooms, setChatrooms] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (dataBase) {
      const unsubscribe = dataBase
        .collection("Chatrooms")
        .where("userIds", "array-contains", currentUser.uid)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setChatrooms(data);
        });
      return unsubscribe;
    }
  }, [currentUser.uid]);
  return (
    <Card>
      <ListGroup>
        <ListGroup.Item>
          <h3 style={{ textAlign: "center" }}>Chats</h3>
        </ListGroup.Item>
        {chatrooms ? (
          chatrooms.map((chatroom, index) => {
            return (
              <NavLink to={`/chat/${chatroom.id}`}>
                <ListGroup.Item key={index}>
                  {chatroom.users.map((user) => {
                    if (user.id !== currentUser.uid) {
                      return <h4>{user.name}</h4>;
                    } else {
                      return null;
                    }
                  })}
                  <p>{chatroom.lastMessage}</p>
                </ListGroup.Item>
              </NavLink>
            );
          })
        ) : (
          <></>
        )}
      </ListGroup>
    </Card>
  );
}

export default ChatroomNavigation;
