import React, { useState } from "react";
import { Card, Form, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { dataBase } from "../firebase";

export default function Profile() {
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState({
    summonerName: "",
    role: "Top",
    bio: "",
    server: "BR1",
  });
  const history = useHistory();
  const { currentUser, logOut } = useAuth();

  function HandleSubmit(e) {
    e.preventDefault();

    if (dataBase) {
      dataBase.collection("Users").doc(currentUser.uid).set({
        email: currentUser.email,
        summonerName: userProfile.summonerName,
        server: userProfile.server,
        role: userProfile.role,
        bio: userProfile.bio,
      });
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
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">LoL Info</h2>
            <h4 className="text-center mb-4">{currentUser.email}</h4>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={HandleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" />
              </Form.Group>

              <Form.Group id="summoner_name">
                <Form.Label>LoL Summoner Name</Form.Label>
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
              <Form.Group id="bio">
                <Form.Label>About Self</Form.Label>
                <Form.Control
                  type="text"
                  value={userProfile.bio}
                  onChange={(e) => {
                    setUserProfile({
                      ...userProfile,
                      bio: e.target.value,
                    });
                  }}
                />
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
                Update Profile
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <Button variant="link" onClick={handleLogOut}>
          Log Out
        </Button>
      </div>
    </Container>
  );
}
