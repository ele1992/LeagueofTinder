import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import CollectionsIcon from "@material-ui/icons/Collections";
import { IconButton } from "@material-ui/core";

function ChatBarPlayerInfo() {
  const { currentPlayerInfo } = useAuth();

  return currentPlayerInfo ? (
    <Card style={{ textAlign: "center" }}>
      <Card.Body>
        <div style={{ position: "fixed", top: "10%", left: "2%" }}>
          <Link to="/">
            <IconButton>
              <CollectionsIcon />
            </IconButton>
          </Link>
        </div>
        <Card.Title>{currentPlayerInfo.summonerName}</Card.Title>
        <Card.Text>
          {currentPlayerInfo.tier} {currentPlayerInfo.rank}
        </Card.Text>
      </Card.Body>
    </Card>
  ) : (
    <></>
  );
}

export default ChatBarPlayerInfo;
