import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { dataBase } from "../firebase";
import "./ChatroomNavigation.css";

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
    <div>
      <Card>
        <h3 style={{ textAlign: "center" }}>Chats</h3>
      </Card>
      <Card
        style={{
          maxHeight: "72vh",
          overflow: "auto",
          minHeight: "72vh",
          backgroundColor: "#a9a9a9",
          opacity: 0.9,
        }}
      >
        <ListGroup>
          {chatrooms ? (
            chatrooms.map((chatroom, index) => {
              return (
                <NavLink
                  key={index}
                  to={`/chat/${chatroom.id}`}
                  activeClassName="activeLink"
                >
                  <ListGroup.Item
                    className="d-flex"
                    style={{ flexDirection: "column" }}
                  >
                    {chatroom.users.map((user) => {
                      if (user.id !== currentUser.uid) {
                        return (
                          <div className="d-flex">
                            <div
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                flex: "1",
                              }}
                            >
                              <img
                                style={{
                                  maxWidth: "50px",
                                  borderRadius: "100%",
                                  border: "solid 1px black",
                                }}
                                src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${user.profileIconId}.jpg`}
                                alt="profile icon"
                              />
                            </div>
                            <div style={{ flex: "2" }}>
                              <h4 style={{ textAlign: "center" }} key={user.id}>
                                {user.name}
                              </h4>
                              <p
                                style={{
                                  textAlign: "center",
                                  maxWidth: 134,
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {chatroom.lastMessage}
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ListGroup.Item>
                </NavLink>
              );
            })
          ) : (
            <></>
          )}
        </ListGroup>
      </Card>
    </div>
  );
}

export default ChatroomNavigation;
