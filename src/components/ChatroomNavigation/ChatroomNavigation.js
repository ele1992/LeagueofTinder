import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { dataBase } from "../../firebase";
import "./ChatroomNavigation.css";

function ChatroomNavigation() {
  const [chatrooms, setChatrooms] = useState();
  const { currentUser } = useAuth();

  useEffect(() => {
    function getListOfChatrooms() {
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
    }
    getListOfChatrooms();
  }, [currentUser.uid]);
  return (
    <div>
      <Card>
        <h3 className="ChatNavigation_Title">Chats</h3>
      </Card>
      <Card className="ChatNavigation_Container">
        <ListGroup>
          {chatrooms ? (
            chatrooms.map((chatroom, index) => {
              return (
                <NavLink
                  key={index}
                  to={`/chat/${chatroom.id}`}
                  activeClassName="activeLink"
                >
                  <ListGroup.Item className="ChatNavigation_ListItem">
                    {chatroom.users.map((user) => {
                      if (user.id !== currentUser.uid) {
                        return (
                          <div className="ChatNavigation_Chatbox">
                            <div className="ChatNavigation_InnerChatbox_Left">
                              <img
                                className="ChatNavigation_ProfileIcon"
                                src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${user.profileIconId}.jpg`}
                                alt="profile icon"
                              />
                            </div>
                            <div className="ChatNavigation_InnerChatbox_Right">
                              <h4
                                className="ChatNavigation_Username"
                                key={user.id}
                              >
                                {user.name}
                              </h4>
                              <p className="ChatNavigation_LastMessage"
            
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
