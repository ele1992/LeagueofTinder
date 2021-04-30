import React, { useState } from "react";
import { Card, Button, Modal, Table } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { dataBase } from "../firebase";
import { useUsers } from "../contexts/UserContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [modal, setOpenModal] = useState();
  const history = useHistory();
  const { users } = useUsers();
  const { currentUser, currentPlayerInfo } = useAuth();

  function openModal(index) {
    setOpenModal(index);
  }

  function closeModal() {
    setOpenModal(null);
  }

  function chat(id, name) {
    const ChatroomName = [currentUser.uid, id].sort().join("_");
    if (dataBase) {
      dataBase
        .collection("Chatrooms")
        .doc(ChatroomName)
        .set({
          users: [
            { id: currentUser.uid, name: currentPlayerInfo.summonerName },
            { id, name },
          ],
          userIds: [currentUser.uid, id],
          lastMessage: "New chat",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    }
    history.push(`/chat/${ChatroomName}`);
  }
  console.log(error);
  return (
    <>
      <div className="d-flex flex-wrap ">
        {users.map((user, index) => {
          if (currentUser.uid !== user.id) {
            return (
              <Card
                key={user.puuid}
                className="w-25 align-items-center justify-content-center m-3"
              >
                <Card.Body>
                  <img
                    src={`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${user.profileIconId}.jpg`}
                    alt={user.profileIconId}
                    onClick={() => {
                      openModal(index);
                    }}
                  />

                  <Button
                    variant="link"
                    onClick={() => {
                      openModal(index);
                    }}
                  >
                    {user.summonerName}
                  </Button>

                  <Modal show={modal === index} onHide={closeModal}>
                    <Modal.Header>{user.summonerName}</Modal.Header>
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
                  </Modal>
                  <Button
                    className="mr-2"
                    onClick={() => chat(user.id, user.summonerName)}
                  >
                    Chat
                  </Button>
                  <Button>Like</Button>
                </Card.Body>
              </Card>
            );
          } else {
            <></>;
          }
        })}
        )
      </div>
    </>
  );
}
