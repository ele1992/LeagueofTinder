import React, { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { dataBase } from "../firebase";
import axios from "axios";

export default function LoLInfoPage() {
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState({
    summonerName: "",
    role: "Top",
    bio: "",
    server: "BR1",
  });
  const history = useHistory();
  const { currentUser, logOut } = useAuth();

  async function HandleSubmit(e) {
    e.preventDefault();
    try {
      const playerInfo = await axios.get(
        `/lol/summoner/v4/summoners/by-name/${userProfile.summonerName}?api_key=RGAPI-a83957f5-f87e-44ea-81d5-64845f4ec4d4`
      );
      console.log(playerInfo.data);

      const playerRankings = await axios.get(
        `/lol/league/v4/entries/by-summoner/${playerInfo.data.id}?api_key=RGAPI-a83957f5-f87e-44ea-81d5-64845f4ec4d4`
      );

      console.log(playerRankings);

      let rankStats = { rank: "unranked", tier: "", wins: 0, losses: 0 };
      if (playerRankings.data.length) {
        rankStats = {
          rank: playerRankings.data[0].rank,
          tier: playerRankings.data[0].tier,
          wins: playerRankings.data[0].wins,
          losses: playerRankings.data[0].losses,
        };
      }
      if (dataBase) {
        dataBase
          .collection("Users")
          .doc(currentUser.uid)
          .set({
            email: currentUser.email,
            summonerName: userProfile.summonerName,
            server: userProfile.server,
            role: userProfile.role,
            bio: userProfile.bio,
            summonerId: playerInfo.data.id,
            puuid: playerInfo.data.puuid,
            summonerLevel: playerInfo.data.summonerLevel,
            profileIconId: playerInfo.data.profileIconId,
            ...rankStats,

            // rank: playerRankings.data.length
            //   ? playerRankings.data[0].rank
            //   : "unranked",
            // tier: playerRankings.data ? playerRankings.data[0].tier : "",
            // wins: playerRankings ? playerRankings.data[0].wins : 0,
            // losses: playerRankings ? playerRankings.data[0].losses : 0,
          });
      }
    } catch (e) {
      console.log(e.message);
    }

    history.push("/");
  }

  async function handleLogOut() {
    setError("");
    try {
      await logOut();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "768px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Summoner Information</h2>
            <h4 className="text-center mb-4">{currentUser.email}</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={HandleSubmit}>
              <Form.Group id="summoner_name">
                <Form.Label>Summoner Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={userProfile.summonerName}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      summonerName: e.target.value,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group id="role">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  required
                  selected={userProfile.role}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      role: e.target.value,
                    });
                  }}
                >
                  <option>Top</option>
                  <option>Mid</option>
                  <option>Jungle</option>
                  <option>Bot</option>
                  <option>Support</option>
                  <option>Flex</option>
                </Form.Control>
              </Form.Group>

              <Form.Group id="server">
                <Form.Label>Server</Form.Label>
                <Form.Control
                  as="select"
                  required
                  selected={userProfile.server}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      server: e.target.value,
                    });
                  }}
                >
                  <option value="BR1">Brazil</option>
                  <option value="EUW1">Europe-West</option>
                  <option value="EUN1">Europe Nordic & East</option>
                  <option value="JP1">Japan</option>
                  <option value="LA1">Latin America North</option>
                  <option value="LA2">Latin America South</option>
                  <option value="NA1">North America</option>
                  <option value="OC1">Oceania</option>
                  <option value="RU">Russia</option>
                  <option value="KR">Republic of Korea</option>
                  <option value="TK1">Turkey</option>
                </Form.Control>
              </Form.Group>
              <Button type="Submit" className="w-100">
                Confirm
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogOut}>
            Log Out
          </Button>
        </div>
      </div>
    </Container>
  );
}