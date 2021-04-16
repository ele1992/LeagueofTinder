import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { dataBase } from "../firebase";
import { Table } from "react-bootstrap";

function PlayerPage() {
  const [player, setPlayer] = useState({});
  const param = useParams();
  const total = player.wins + player.losses;
  const winrate = parseInt((player.wins / total) * 1000) / 10;
  useEffect(() => {
    function fetchData() {
      //   if (dataBase) {
      //     const user = dataBase.collection("Users").doc(currentUser.uid);
      //     console.log(user);
      //   }
      dataBase
        .collection("Users")
        .doc(param.uid)
        .get()
        .then((player) => {
          setPlayer({ ...player.data() });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    fetchData();
  }, []);
  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        {player.summonerName} <small>({player.summonerLevel})</small>
      </h2>
      <Table>
        <tbody>
          <tr>
            <td>Rank</td>
            <td>
              {player.tier} {player.rank}
            </td>
          </tr>

          <tr>
            <td>Role</td>
            <td>{player.role}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {total}({winrate}%)
            </td>
          </tr>
          <tr>
            <td>Wins</td>
            <td>{player.wins}</td>
          </tr>
          <tr>
            <td>Losses</td>
            <td>{player.losses}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

export default PlayerPage;
