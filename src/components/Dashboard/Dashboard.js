import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Table } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { dataBase } from "../../firebase";
import { useUsers } from "../../contexts/UserContext";
import { HandThumbsUpFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [modal, setOpenModal] = useState();
  const [likesArray, setLikesArray] = useState([]);

  const { users } = useUsers();
  const { currentUser, currentPlayerInfo } = useAuth();

  function openModal(index) {
    setOpenModal(index);
  }

  function closeModal() {
    setOpenModal(null);
  }
  function like(id, name, profileIconId) {
    if (dataBase) {
      setLikesInDatabase(id);
      compareUserLikes(id, name, profileIconId);
    }
  }

  function setLikesInDatabase(id) {
    dataBase
      .collection("Users")
      .doc(currentUser.uid)
      .collection("Likes")
      .doc(id)
      .set({ liked: true });
  }
  function compareUserLikes(id, name, profileIconId) {
    dataBase
      .collection("Users")
      .doc(id)
      .collection("Likes")
      .doc(currentUser.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          createChatRoom(id, name, profileIconId);
          console.log(doc.data());
        } else {
          console.log("no such document");
        }
      });
  }

  useEffect(() => {
    async function getLikesForCurrentUser() {
      try {
        if (dataBase) {
          dataBase
            .collection("Users")
            .doc(currentUser.uid)
            .collection("Likes")
            .onSnapshot((querySnapshot) => {
              const collection = [];
              querySnapshot.docs.map((doc) => collection.push(doc.id));

              setLikesArray(collection);
            });
        }
      } catch (e) {
        setError(e.message);
      }
    }
    getLikesForCurrentUser();
  }, [currentUser]);

  function createChatRoom(id, name, profileIconId) {
    const ChatroomName = [currentUser.uid, id].sort().join("_");
    if (dataBase) {
      dataBase
        .collection("Chatrooms")
        .doc(ChatroomName)
        .set({
          users: [
            {
              id: currentUser.uid,
              name: currentPlayerInfo.summonerName,
              profileIconId: currentPlayerInfo.profileIconId,
            },
            { id, name, profileIconId },
          ],
          userIds: [currentUser.uid, id],
          lastMessage: "New chat",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }
  }
  console.log(error);
  return (
    <>
      <div className="Dashboard_Container">
        {users.map((user, index) => {
          if (currentUser.uid !== user.id) {
            return (
              <Card
                key={user.puuid}
                className="Dashboard_UserCard"
                border={likesArray.includes(user.id) ? "primary" : "white"}
              >
                <Card.Body
                  className="Dashboard_UserCard_Body"
                  style={{
                    backgroundColor: likesArray.includes(user.id)
                      ? "#037bfe"
                      : "white",
                  }}
                >
                  <img
                    className="Dashboard_UserCard_Image"
                    src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${user.profileIconId}.jpg`}
                    alt={user.profileIconId}
                    onClick={() => {
                      openModal(index);
                    }}
                  />
                  <Button
                    variant="link"
                    style={{
                      color: likesArray.includes(user.id) ? "white" : "black",
                    }}
                    onClick={() => {
                      openModal(index);
                    }}
                  >
                    {user.summonerName}
                  </Button>
                  <Modal show={modal === index} onHide={closeModal} centered>
                    <Modal.Header>
                      <h2>{user.summonerName + `  (${user.summonerLevel})`}</h2>
                    </Modal.Header>
                    <Modal.Body>
                      <Table>
                        <tbody>
                          <tr>
                            <td>Rank</td>
                            <td>
                              {user.tier} {user.rank}
                            </td>
                          </tr>

                          <tr>
                            <td>Role</td>
                            <td>{user.role}</td>
                          </tr>
                          <tr>
                            <td>Total</td>
                            <td>
                              {user.losses + user.wins}(
                              {user.wins + user.losses === 0
                                ? "0"
                                : parseInt(
                                    (user.wins / (user.losses + user.wins)) *
                                      100
                                  )}
                              %)
                            </td>
                          </tr>
                          <tr>
                            <td>Wins</td>
                            <td>{user.wins}</td>
                          </tr>
                          <tr>
                            <td>Losses</td>
                            <td>{user.losses}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Modal.Body>
                    <Modal.Footer>
                      <div>
                        {likesArray.includes(user.id) ? (
                          <HandThumbsUpFill
                            size={30}
                            className="Modal_Like_Icon"
                          />
                        ) : (
                          <Button
                            onClick={() =>
                              like(
                                user.id,
                                user.summonerName,
                                user.profileIconId
                              )
                            }
                            className="Modal_Like_Button"
                          >
                            Like
                          </Button>
                        )}
                      </div>
                    </Modal.Footer>
                  </Modal>
                </Card.Body>
              </Card>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    </>
  );
}
